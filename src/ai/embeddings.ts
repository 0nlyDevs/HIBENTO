import { env, pipeline } from "@xenova/transformers";

env.localModelPath = "";
env.allowRemoteModels = true;

type EmbeddingFn = (
  texts: string,
  options?: { pooling?: string; normalize?: boolean },
) => Promise<{ data: Float32Array }>;

let embeddingModel: EmbeddingFn | null = null;
let modelLoadPromise: Promise<EmbeddingFn> | null = null;

export const EMBEDDING_DIMENSION = 384;

async function getModel(): Promise<EmbeddingFn> {
  if (embeddingModel) return embeddingModel;

  if (!modelLoadPromise) {
    modelLoadPromise = pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
    ).then((p) => {
      const fn = p as unknown as EmbeddingFn;
      embeddingModel = fn;
      return fn;
    });
  }

  return modelLoadPromise;
}

export async function warmup(): Promise<void> {
  await getModel();
}

export async function generateEmbedding(text: string): Promise<Float32Array> {
  const pipe = await getModel();
  const result = await pipe(text, { pooling: "mean", normalize: true });
  return result.data as Float32Array;
}

export async function generateBatchEmbeddings(
  texts: string[],
): Promise<Float32Array[]> {
  const pipe = await getModel();
  const results = await Promise.all(
    texts.map((t) => pipe(t, { pooling: "mean", normalize: true })),
  );
  return results.map((r) => r.data as Float32Array);
}

export function cosineSimilarity(
  a: Float32Array | number[],
  b: Float32Array | number[],
): number {
  if (a.length !== b.length) return 0;

  let dot = 0;
  let na = 0;
  let nb = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }

  const mag = Math.sqrt(na) * Math.sqrt(nb);
  return mag === 0 ? 0 : dot / mag;
}

export function findMostSimilar(
  queryVec: Float32Array,
  candidates: Float32Array[],
  minScore = 0,
): Array<{ index: number; score: number }> {
  const scored: Array<{ index: number; score: number }> = [];

  for (let i = 0; i < candidates.length; i++) {
    const score = cosineSimilarity(queryVec, candidates[i]);
    if (score >= minScore) scored.push({ index: i, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored;
}
