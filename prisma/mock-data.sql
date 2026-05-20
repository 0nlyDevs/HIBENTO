-- ==================== CLEAN EXISTING DATA ====================
TRUNCATE TABLE question CASCADE;
TRUNCATE TABLE event_session_speaker CASCADE;
TRUNCATE TABLE event_session CASCADE;
TRUNCATE TABLE speaker_external_link CASCADE;
TRUNCATE TABLE speaker CASCADE;
TRUNCATE TABLE room CASCADE;
TRUNCATE TABLE event CASCADE;
TRUNCATE TABLE venue CASCADE;

-- ==================== VENUES ====================
INSERT INTO venue (id, name, city, neighborhood, total_rooms, created_at, updated_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'HEI', 'Antananarivo', 'Ivandry', 0, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Anjanahary Convention Center', 'Antananarivo', 'Anjanahary', 0, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Digital Lab', 'Antananarivo', 'Analakely', 0, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'CC Esca', 'Antananarivo', 'Antanimena', 0, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'Iavoloha Palace', 'Antananarivo', 'Iavoloha', 0, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'University of Fianarantsoa', 'Fianarantsoa', 'Tanambao', 0, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7', 'Nosy Be Conference Hall', 'Nosy Be', 'Hell-Ville', 0, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa8', 'Colbert Hotel', 'Antsiranana', 'Antsiranana Urban', 0, NOW(), NOW());

-- ==================== EVENTS ====================
INSERT INTO event (id, title, description, venueId, start_date, end_date, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'DevConf Madagascar 2025', 'La plus grande conférence des développeurs à Madagascar. Découvrez les dernières technologies web, cloud et IA.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '2025-09-15 09:00:00+00', '2025-09-17 18:00:00+00', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'Tech Summit Antananarivo', 'Rassemblement des innovateurs tech malgaches pour façonner l''avenir numérique du pays.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '2025-10-05 10:00:00+00', '2025-10-06 17:00:00+00', NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'Atelier IA Madagascar', 'Plongée approfondie dans l''intelligence artificielle et le machine learning avec des experts locaux.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '2025-11-20 09:00:00+00', '2025-11-20 18:00:00+00', NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'Startup Weekend Fianar', 'Weekend de création d''entreprises innovantes dans la région de Fianarantsoa.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', '2025-12-10 08:00:00+00', '2025-12-12 20:00:00+00', NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', 'Nosy Be Tech Forum', 'Forum technologique sur l''innovation numérique et le tourisme à Nosy Be.', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7', '2026-01-20 09:00:00+00', '2026-01-22 18:00:00+00', NOW(), NOW());

-- ==================== ROOMS FOR HEI (Ivandry) ====================
INSERT INTO room (id, venueId, name, capacity, created_at, updated_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaab01', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Grand Amphithéâtre', 300, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaab02', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Salle A', 80, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaab03', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Salle B', 80, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaab04', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Labo Informatique 1', 40, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaab05', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Labo Informatique 2', 40, NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaab06', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Salle de Conférence', 50, NOW(), NOW());

-- ==================== ROOMS FOR ANJANAHARY CONVENTION CENTER ====================
INSERT INTO room (id, venueId, name, capacity, created_at, updated_at) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Grand Hall Anjanahary', 800, NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Salle Ravinala', 200, NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb03', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Salle Orchidée', 150, NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb04', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Espace Workshop', 100, NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb05', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Salle de Réunion A', 50, NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb06', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Salle de Réunion B', 50, NOW(), NOW());

-- ==================== ROOMS FOR DIGITAL LAB (Analakely) ====================
INSERT INTO room (id, venueId, name, capacity, created_at, updated_at) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccc01', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Main Lab', 60, NOW(), NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccc02', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Salle de Formation', 35, NOW(), NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccc03', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Espace Coworking', 45, NOW(), NOW());

-- ==================== ROOMS FOR CC ESCA (Antanimena) ====================
INSERT INTO room (id, venueId, name, capacity, created_at, updated_at) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddd01', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'Grande Salle', 400, NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddd02', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'Salle Moyenne', 120, NOW(), NOW());

-- ==================== ROOMS FOR IAVOLOHA PALACE ====================
INSERT INTO room (id, venueId, name, capacity, created_at, updated_at) VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'Salle d''Honneur', 500, NOW(), NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'Salle des Conférences', 200, NOW(), NOW());

-- ==================== ROOMS FOR UNIVERSITY OF FIANARANTSOA ====================
INSERT INTO room (id, venueId, name, capacity, created_at, updated_at) VALUES
('ffffffff-ffff-ffff-ffff-ffffffffff01', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'Grand Amphithéâtre', 250, NOW(), NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffff02', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'Salle 101', 60, NOW(), NOW()),
('ffffffff-ffff-ffff-ffff-ffffffffff03', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'Salle 102', 60, NOW(), NOW());

-- ==================== ROOMS FOR NOSY BE CONFERENCE HALL ====================
INSERT INTO room (id, venueId, name, capacity, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111101', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7', 'Palais des Congrès', 600, NOW(), NOW()),
('11111111-1111-1111-1111-111111111102', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7', 'Salle Vanille', 100, NOW(), NOW()),
('11111111-1111-1111-1111-111111111103', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7', 'Salle Ylang', 100, NOW(), NOW());

-- ==================== SPEAKERS (Malagasy and International) ====================
INSERT INTO speaker (id, name, avatar_url, bio, created_at, updated_at) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Rija Rakoto', 'https://randomuser.me/api/portraits/men/1.jpg', 'Rija est un développeur full-stack malgache avec 12 ans d''expérience. Spécialiste en React et Next.js, il a fondé la communauté des devs à Madagascar.', NOW(), NOW()),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Miora Rasoanaivo', 'https://randomuser.me/api/portraits/women/2.jpg', 'Architecte cloud chez NovaTech, Miora aide les entreprises malgaches à migrer vers le cloud. Passionnée par le DevOps et Kubernetes.', NOW(), NOW()),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Lova Andrian', 'https://randomuser.me/api/portraits/men/3.jpg', 'Chercheur en IA et data scientist. Lova travaille sur des solutions d''IA appliquées à l''agriculture malgache.', NOW(), NOW()),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Nantenaina Razafy', 'https://randomuser.me/api/portraits/women/4.jpg', 'Expert en cybersécurité et fondateur de SecureMG. Nantenaina forme les entreprises malgaches aux bonnes pratiques de sécurité.', NOW(), NOW()),
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Haja Rasolofo', 'https://randomuser.me/api/portraits/men/5.jpg', 'Tech lead chez DigitalLab et créateur de contenu tech. Haja est une figure importante de la communauté dev Malagasy.', NOW(), NOW()),
('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'Tiana Randria', 'https://randomuser.me/api/portraits/women/6.jpg', 'Product manager et entrepreneur. Tiana a lancé plusieurs startups technologiques à Madagascar.', NOW(), NOW());

-- ==================== SPEAKER EXTERNAL LINKS ====================
INSERT INTO speaker_external_link (id, "speakerId", link_type, url, created_at) VALUES
('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'TWITTER', 'https://twitter.com/rijarakoto', NOW()),
('f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'GITHUB', 'https://github.com/rijarakoto', NOW()),
('f7eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'WEBSITE', 'https://rijarakoto.dev', NOW()),
('f8eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'LINKEDIN', 'https://linkedin.com/in/miorarasoanaivo', NOW()),
('f9eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'TWITTER', 'https://twitter.com/lovaai', NOW());

-- ==================== EVENT SESSIONS ====================
-- DevConf Madagascar 2025 Sessions
INSERT INTO event_session (id, title, description, start_time, end_time, "roomId", capacity, "eventId", created_at, updated_at) VALUES
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Keynote: L''Avenir du Web à Madagascar', 'Découvrez les perspectives du développement web à Madagascar et les opportunités pour les jeunes devs.', '2025-09-15 09:00:00+00', '2025-09-15 10:30:00+00', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaab01', 300, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Workshop: Rust pour Débutants', 'Apprenez les bases de Rust avec John. Atelier pratique avec des exercices concrets.', '2025-09-15 11:00:00+00', '2025-09-15 13:00:00+00', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaab04', 40, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Live Coding: Application Temps Réel', 'Regardez Alice construire une application temps réel avec Next.js et WebSockets.', '2025-09-15 14:00:00+00', '2025-09-15 15:30:00+00', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaab02', 80, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'Cloud Computing avec Miora', 'Introduction au cloud computing et déploiement d''applications sur AWS.', '2025-09-16 10:00:00+00', '2025-09-16 12:00:00+00', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaab02', 80, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'Sécurité Web avec Nantenaina', 'Les bonnes pratiques de sécurité pour les applications web modernes.', '2025-09-16 14:00:00+00', '2025-09-16 16:00:00+00', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaab06', 50, '11111111-1111-1111-1111-111111111111', NOW(), NOW());

-- Tech Summit Antananarivo Sessions
INSERT INTO event_session (id, title, description, start_time, end_time, "roomId", capacity, "eventId", created_at, updated_at) VALUES
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Opening: Innovation Made in Madagascar', 'Cérémonie d''ouverture avec les leaders tech malgaches.', '2025-10-05 10:00:00+00', '2025-10-05 11:30:00+00', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02', 200, '22222222-2222-2222-2222-222222222222', NOW(), NOW()),
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Panel: IA et Agriculture', 'Comment l''IA peut aider l''agriculture malgache.', '2025-10-05 13:00:00+00', '2025-10-05 15:00:00+00', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb03', 150, '22222222-2222-2222-2222-222222222222', NOW(), NOW()),
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Fintech et Inclusion Financière', 'Solutions fintech pour les populations non bancarisées.', '2025-10-06 10:00:00+00', '2025-10-06 12:00:00+00', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb04', 100, '22222222-2222-2222-2222-222222222222', NOW(), NOW());

-- Atelier IA Madagascar Sessions
INSERT INTO event_session (id, title, description, start_time, end_time, "roomId", capacity, "eventId", created_at, updated_at) VALUES
('f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Introduction au Machine Learning', 'Les bases du ML avec des exemples pratiques.', '2025-11-20 09:00:00+00', '2025-11-20 12:00:00+00', 'cccccccc-cccc-cccc-cccc-cccccccccc01', 60, '33333333-3333-3333-3333-333333333333', NOW(), NOW()),
('f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Deep Learning pour la Vision', 'Réseaux de neurones convolutifs et applications.', '2025-11-20 13:00:00+00', '2025-11-20 16:00:00+00', 'cccccccc-cccc-cccc-cccc-cccccccccc01', 60, '33333333-3333-3333-3333-333333333333', NOW(), NOW());

-- ==================== EVENT SESSION SPEAKERS ====================
INSERT INTO event_session_speaker ("eventSessionId", "speakerId", created_at) VALUES
-- Keynote speakers
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', NOW()),

-- Rust Workshop
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', NOW()),

-- Live Coding
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', NOW()),

-- Cloud Computing
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', NOW()),

-- Security
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', NOW()),

-- Tech Summit sessions
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', NOW()),
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', NOW()),
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', NOW()),
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', NOW()),

-- AI Workshop sessions
('f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', NOW()),
('f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', NOW());

-- ==================== QUESTIONS ====================
INSERT INTO question (id, content, author_name, upvotes, "eventSessionId", created_at) VALUES
('f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Est-ce que la keynote sera disponible en replay ?', 'Développeur Web', 25, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', NOW()),
('f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Faut-il avoir une expérience préalable en Rust ?', 'Étudiant', 12, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', NOW()),
('f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Le workshop est-il gratuit ?', 'Débutant', 8, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', NOW()),
('f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'Quels sont les prérequis techniques ?', 'Dev Fullstack', 18, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', NOW()),
('f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'Y aura-t-il des certifications ?', 'Architecte Cloud', 7, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', NOW()),
('f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'Comment l''IA peut aider l''agriculture à Madagascar ?', 'Étudiant en IA', 32, 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', NOW()),
('f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 'Est-ce que les sessions sont enregistrées ?', 'Participant', 5, 'f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', NOW());

-- ==================== UPDATE TOTAL ROOMS COUNT FOR VENUES ====================
UPDATE venue SET total_rooms = (SELECT COUNT(*) FROM room WHERE room."venueId" = venue.id);