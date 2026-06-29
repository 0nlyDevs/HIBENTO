# AI Features — Code Review

Review de la branche `feat/ai-embeddings`.

---

## Must-Fix (avant merge)

### 🔴 Critical

| # | Problème | Fichier | Sévérité | Fix |
|---|----------|---------|----------|-----|
| C1 | `generateBatchEmbeddings` fait N appels pipeline au lieu d'1 batch — `Promise.all(texts.map(t => pipe(t)))` | `src/ai/embeddings.ts:47` | Performance | Remplacer par `pipe(texts)` (1 seul forward pass). L'API `@xenova/transformers` supporte les tableaux. |
| C2 | Recommendations + Q&A génèrent les embeddings **individuellement** (pas de batch) → 100 events = 100 appels (~5-15s) | `recommendations/route.ts:51`, `questions/check/route.ts:54` | Performance | Après fix C1, utiliser la version batch. Sinon 50 questions = 50 appels modèle. |
| C3 | Cache recommendations = `Map` sans éviction → fuite mémoire (chaque eventId = entrée permanente) | `recommendations/route.ts:6` | Mémoire | Remplacer par `lru-cache` avec `max: 100` + `ttl: 10 * 60 * 1000`. |
| C4 | `warmup()` n'est jamais appelé → 2-5s de cold start sur chaque première requête IA | `embeddings.ts:33` | UX/Perf | Ajouter `await warmup()` dans `src/instrumentation.ts` ou un layout serveur. |
| C5 | Pas d'invalidation du cache search → events supprimés apparaissent encore 5 min | `search/route.ts:25` | Exactitude | Ajouter un `version` counter en DB, incrémenter sur mutation event, vérifier sur read. |

### 🟠 High

| # | Problème | Fichier | Sévérité | Fix |
|---|----------|---------|----------|-----|
| H1 | Seuil de similarité à **0.15** — vecteurs quasi-orthogonaux considérés comme match | `search/route.ts:91`, `recommendations/route.ts:55` | Qualité | Monter à **0.3** pour search, **0.4** pour recommendations. |
| H2 | Aucun rate limiting sur les endpoints IA (coûteux : ~50-200ms par inférence) | Tous les AI routes | Sécurité | Ajouter `@upstash/ratelimit` ou sliding window in-process. |
| H3 | Pas de validation longueur input — modèle limité à 256 tokens | Tous les AI routes | Robustesse | Limiter à 500 chars + tronquer avant envoi au modèle. Retourner 400 si trop long. |
| H4 | Filtres (status, date, city) ignorés pendant la recherche sémantique | `events/page.tsx:94-112` | Exactitude | Envoyer les filtres à `/api/ai/search` en query params OU les appliquer tous côté client. |
| H5 | `eventSessionCount: 0` en dur dans les résultats search → "0 sessions" affiché | `events/page.tsx:103` | UX | Inclure `eventSessionCount` dans `SearchResultDto` ou cacher le compteur pour les résultats AI. |

---

## Should-Fix (cette PR ou immédiatement après)

### 🟡 Medium

| # | Problème | Fichier | Fix |
|---|----------|---------|-----|
| M1 | Si le chargement du modèle échoue, `modelLoadPromise` ne retente jamais | `embeddings.ts:16` | Reset `modelLoadPromise = null` dans le `.catch()` pour permettre un retry. |
| M2 | `bestIndex >= 0` est du code mort (déjà garanti par `bestScore >= 0.85`) | `questions/check/route.ts:69` | Supprimer la condition redondante. |
| M3 | Logique de soumission dupliquée dans `handleSubmit` (lignes 99-107 et 125-131) | `qa-panel.tsx:93` | Extraire un helper `submitQuestion()` pour DRY. |
| M4 | `enabled: !!eventId` tautologique sur une route `[eventId]` | `events/[eventId]/page.tsx:38` | Supprimer la condition (toujours true). |
| M5 | Aucun état loading/error pour la section "You might also like" | `events/[eventId]/page.tsx:264` | Ajouter squelette `motion-safe:animate-pulse` pendant le chargement + fallback silencieux si erreur. |
| M6 | UX du check doublon minimal (`...`) → l'utilisateur ne sait pas ce qui se passe | `qa-panel.tsx:244` | Afficher "Checking…" ou désactiver le champ avec un tooltip. |

### 🟢 Low / Suggestions

| # | Suggestion | Détail |
|---|------------|--------|
| L1 | `SearchResultDto.match` typé `\| null` mais jamais null | Le type est mensonger — soit le rendre toujours non-null, soit nullable si `type !== "event"`. |
| L2 | `natural` et `compromise` installés mais jamais importés | ~1-2MB chacun, dead weight. Les retirer si pas de plan d'utilisation. |
| L3 | Aucun logging de latence / cache hit rate | Impossible de monitorer la perf en production. Ajouter des métriques simples (console.time, counters). |
| L4 | Aucun test pour l'IA | `cosineSimilarity`, `findMostSimilar`, et les API routes méritent des tests unitaires. |

---

## PGVector change-t-il la DB ?

### Rappel : la DB est partagée avec un backend Spring Boot Admin

**PGVector** est une extension PostgreSQL qui ajoute :
- Un type `vector(n)` pour stocker des vecteurs (ex: `vector(384)` pour all-MiniLM-L6-v2)
- Des opérateurs de similarité (`<->` pour distance cosinus, `<=>` pour distance L2)
- Des index IVFFlat ou HNSW pour la recherche ANN (Approximate Nearest Neighbor)

### Ce qui change dans la DB

| Aspect | Impact |
|--------|--------|
| **Extension** | `CREATE EXTENSION vector;` — nécessite **superuser** PostgreSQL. Installation unique. |
| **Nouvelles colonnes** | Ajout de `embedding vector(384)` aux tables `event`, `event_session`, `question`. Colonnes NULLables. |
| **Nouveaux index** | Index IVFFlat ou HNSW sur les colonnes embedding pour la recherche rapide. |
| **Tables existantes** | **Inchangées** — les colonnes embedding sont optionnelles. |
| **Spring Boot** | **Aucun impact** si le backend ne lit/écrit pas ces colonnes. Les `SELECT *` existants continuent de fonctionner (les nouvelles colonnes sont juste ignorées). |

### Risques potentiels

| Risque | Mitigation |
|--------|------------|
| `SELECT *` dans Spring Boot qui retourne la colonne `embedding` (binaire) → plantage potentiel si le driver JDBC ne la gère pas | Ne pas utiliser `SELECT *`, ou utiliser `@Column(insertable=false, updatable=false)` sur l'entité JPA, ou ignorer la colonne avec `@Transient` |
| Extension non disponible sur le serveur PostgreSQL (pas de superuser, hébergé) | Fallback : stocker l'embedding comme `TEXT` (JSON float array) et faire le calcul en JS côté serveur |
| Migration Prisma vers PGVector nécessite `CREATE EXTENSION` dans la migration | Ajouter `CREATE EXTENSION IF NOT EXISTS vector` dans une migration Prisma raw SQL |

### Recommandation

**Pour l'instant : garder les embeddings en JSON texte + calcul en JS.**

Avantages :
- ✅ Compatible Spring Boot sans modification
- ✅ Pas besoin de superuser PostgreSQL
- ✅ Pas de nouvelle dépendance (PGVector driver)
- ✅ Assez rapide pour le volume actuel (< 1000 events/sessions)

**PGVector plus tard** si :
- Le volume dépasse 10 000+ entités
- La latence des calculs JS devient un problème
- Le backend Spring Boot peut être mis à jour pour ignorer les colonnes vector
