-- Clean existing data
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
('550e8400-e29b-41d4-a716-446655440001', 'HEI', 'Antananarivo', 'Ivandry', 4, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Convention Center', 'Antananarivo', 'Anjanahary', 3, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Digital Lab', 'Antsirabe', 'Centre', 2, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'University Center', 'Fianarantsoa', 'Tanambao', 3, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Tech Hub', 'Toamasina', 'Port', 2, NOW(), NOW());

-- ==================== EVENTS ====================
-- Past event (ended)
INSERT INTO event (id, title, description, "venueId", start_date, end_date, created_at, updated_at) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'DevFest Antananarivo 2024', 'Annual developer festival with workshops and talks about web, mobile, and cloud technologies.', '550e8400-e29b-41d4-a716-446655440001', '2024-11-15 08:00:00+00', '2024-11-16 18:00:00+00', NOW(), NOW()),

-- Currently live event
('660e8400-e29b-41d4-a716-446655440002', 'Tech Innovation Summit 2026', 'Ongoing summit about AI, blockchain, and digital transformation in Madagascar.', '550e8400-e29b-41d4-a716-446655440002', '2026-05-19 09:00:00+00', '2026-05-22 17:00:00+00', NOW(), NOW()),

-- Upcoming events
('660e8400-e29b-41d4-a716-446655440003', 'Startup Weekend Antsirabe', '54-hour weekend event to pitch ideas, form teams, and launch startups.', '550e8400-e29b-41d4-a716-446655440003', '2026-07-10 18:00:00+00', '2026-07-12 20:00:00+00', NOW(), NOW()),

('660e8400-e29b-41d4-a716-446655440004', 'AI Conference Fianarantsoa', 'Exploring artificial intelligence applications in education and healthcare.', '550e8400-e29b-41d4-a716-446655440004', '2026-08-20 09:00:00+00', '2026-08-21 18:00:00+00', NOW(), NOW()),

('660e8400-e29b-41d4-a716-446655440005', 'Mobile Dev Workshop Toamasina', 'Hands-on workshop for Flutter and React Native development.', '550e8400-e29b-41d4-a716-446655440005', '2026-09-05 10:00:00+00', '2026-09-05 17:00:00+00', NOW(), NOW()),

('660e8400-e29b-41d4-a716-446655440006', 'Cloud & DevOps Day', 'Full day dedicated to cloud infrastructure and DevOps practices.', '550e8400-e29b-41d4-a716-446655440001', '2026-10-15 09:00:00+00', '2026-10-15 18:00:00+00', NOW(), NOW());

-- ==================== ROOMS ====================
INSERT INTO room (id, "venueId", name, capacity, created_at, updated_at) VALUES
-- HEI (v001)
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Grand Amphithéâtre', 300, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Salle NP', 80, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Labo Informatique', 40, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Salle Pi', 50, NOW(), NOW()),

-- Convention Center (v002)
('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Grand Hall', 500, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'Salle Ravinala', 150, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 'Espace Workshop', 60, NOW(), NOW()),

-- Digital Lab (v003)
('770e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', 'Main Room', 100, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', 'Training Room', 30, NOW(), NOW()),

-- University Center (v004)
('770e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440004', 'Amphi Principal', 250, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440004', 'Salle 101', 60, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440004', 'Salle 102', 60, NOW(), NOW()),

-- Tech Hub (v005)
('770e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440005', 'Salle Principale', 120, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440005', 'Co-working Space', 40, NOW(), NOW());

-- ==================== SPEAKERS ====================
INSERT INTO speaker (id, name, avatar_url, bio, created_at, updated_at) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'Rija Rakoto', 'https://i.pravatar.cc/300?u=rija', 'Full-stack developer with 12 years experience. React and Node.js expert. Founder of MadaJS community.', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440002', 'Miora Rasoanaivo', 'https://i.pravatar.cc/300?u=miora', 'Cloud architect at NovaTech. AWS certified. Passionate about DevOps and Kubernetes.', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440003', 'Lova Andrian', 'https://i.pravatar.cc/300?u=lova', 'AI researcher focusing on agricultural applications. PhD in Machine Learning.', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440004', 'Tiana Randria', 'https://i.pravatar.cc/300?u=tiana', 'Serial entrepreneur. Launched 3 tech startups. Product management expert.', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440005', 'Haja Rasolofo', 'https://i.pravatar.cc/300?u=haja', 'Tech lead and content creator. YouTube channel with 50K+ subscribers.', NOW(), NOW());

-- ==================== SPEAKER LINKS ====================
INSERT INTO speaker_external_link (id, "speakerId", link_type, url, created_at) VALUES
('990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'TWITTER', 'https://twitter.com/rijarakoto', NOW()),
('990e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', 'GITHUB', 'https://github.com/rijarakoto', NOW()),
('990e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440002', 'LINKEDIN', 'https://linkedin.com/in/miora', NOW()),
('990e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440003', 'TWITTER', 'https://twitter.com/lovaai', NOW()),
('990e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440004', 'LINKEDIN', 'https://linkedin.com/in/tiana', NOW()),
('990e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440005', 'OTHER', 'https://youtube.com/@hajatech', NOW());

-- ==================== SESSIONS ====================

-- DevFest Antananarivo 2024 (Past - Ended)
INSERT INTO event_session (id, title, description, start_time, end_time, "roomId", capacity, "eventId", created_at, updated_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', 'Keynote: Web Development Trends', 'Overview of the latest trends in web development for 2024.', '2024-11-15 09:00:00+00', '2024-11-15 10:30:00+00', '770e8400-e29b-41d4-a716-446655440001', 300, '660e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440002', 'Workshop: React Hooks Deep Dive', 'Advanced React patterns with hooks.', '2024-11-15 11:00:00+00', '2024-11-15 13:00:00+00', '770e8400-e29b-41d4-a716-446655440003', 40, '660e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440003', 'Cloud Migration Strategies', 'How to migrate legacy apps to the cloud.', '2024-11-15 14:00:00+00', '2024-11-15 15:30:00+00', '770e8400-e29b-41d4-a716-446655440002', 80, '660e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440004', 'Networking Session', 'Meet fellow developers and share experiences.', '2024-11-15 16:00:00+00', '2024-11-15 18:00:00+00', '770e8400-e29b-41d4-a716-446655440004', 50, '660e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440005', 'AI for Beginners', 'Introduction to AI concepts and tools.', '2024-11-16 09:00:00+00', '2024-11-16 12:00:00+00', '770e8400-e29b-41d4-a716-446655440001', 300, '660e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440006', 'Closing Panel', 'Discussion on the future of tech in Madagascar.', '2024-11-16 14:00:00+00', '2024-11-16 17:00:00+00', '770e8400-e29b-41d4-a716-446655440001', 300, '660e8400-e29b-41d4-a716-446655440001', NOW(), NOW());

-- Tech Innovation Summit 2026 (Live - some sessions ongoing)
INSERT INTO event_session (id, title, description, start_time, end_time, "roomId", capacity, "eventId", created_at, updated_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440007', 'Opening Ceremony', 'Welcome and introduction to the summit.', '2026-05-19 09:00:00+00', '2026-05-19 10:00:00+00', '770e8400-e29b-41d4-a716-446655440005', 500, '660e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440008', 'AI in Healthcare', 'How AI is transforming healthcare in Africa.', '2026-05-19 10:30:00+00', '2026-05-19 12:00:00+00', '770e8400-e29b-41d4-a716-446655440005', 500, '660e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440009', 'Blockchain Workshop', 'Hands-on blockchain development.', '2026-05-19 14:00:00+00', '2026-05-19 17:00:00+00', '770e8400-e29b-41d4-a716-446655440007', 60, '660e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
-- Current live session (happening now)
('aa0e8400-e29b-41d4-a716-446655440010', 'Digital Transformation Panel', 'Panel discussion on digital transformation strategies.', '2026-05-20 09:00:00+00', '2026-05-20 11:00:00+00', '770e8400-e29b-41d4-a716-446655440005', 500, '660e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440011', 'Startup Pitch Competition', 'Local startups pitch their ideas.', '2026-05-20 11:30:00+00', '2026-05-20 13:30:00+00', '770e8400-e29b-41d4-a716-446655440006', 150, '660e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
-- Upcoming sessions for the summit
('aa0e8400-e29b-41d4-a716-446655440012', 'Cybersecurity Essentials', 'Protecting your digital assets.', '2026-05-21 09:00:00+00', '2026-05-21 11:00:00+00', '770e8400-e29b-41d4-a716-446655440005', 500, '660e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440013', 'Closing & Awards', 'Summit closing ceremony and awards.', '2026-05-22 15:00:00+00', '2026-05-22 17:00:00+00', '770e8400-e29b-41d4-a716-446655440005', 500, '660e8400-e29b-41d4-a716-446655440002', NOW(), NOW());

-- Startup Weekend Antsirabe (Upcoming)
INSERT INTO event_session (id, title, description, start_time, end_time, "roomId", capacity, "eventId", created_at, updated_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440014', 'Pitch Workshop', 'Learn how to pitch your startup idea.', '2026-07-10 18:00:00+00', '2026-07-10 20:00:00+00', '770e8400-e29b-41d4-a716-446655440008', 100, '660e8400-e29b-41d4-a716-446655440003', NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440015', 'Team Formation', 'Form teams and start brainstorming.', '2026-07-10 20:00:00+00', '2026-07-10 22:00:00+00', '770e8400-e29b-41d4-a716-446655440008', 100, '660e8400-e29b-41d4-a716-446655440003', NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440016', 'Mentoring Sessions', 'Get advice from experienced mentors.', '2026-07-11 09:00:00+00', '2026-07-11 18:00:00+00', '770e8400-e29b-41d4-a716-446655440009', 30, '660e8400-e29b-41d4-a716-446655440003', NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440017', 'Final Presentations', 'Teams present their projects.', '2026-07-12 14:00:00+00', '2026-07-12 18:00:00+00', '770e8400-e29b-41d4-a716-446655440008', 100, '660e8400-e29b-41d4-a716-446655440003', NOW(), NOW());

-- AI Conference Fianarantsoa (Upcoming)
INSERT INTO event_session (id, title, description, start_time, end_time, "roomId", capacity, "eventId", created_at, updated_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440018', 'Machine Learning Fundamentals', 'Introduction to ML algorithms and tools.', '2026-08-20 09:00:00+00', '2026-08-20 12:00:00+00', '770e8400-e29b-41d4-a716-446655440010', 250, '660e8400-e29b-41d4-a716-446655440004', NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440019', 'Deep Learning Workshop', 'Practical deep learning with TensorFlow.', '2026-08-20 14:00:00+00', '2026-08-20 17:00:00+00', '770e8400-e29b-41d4-a716-446655440011', 60, '660e8400-e29b-41d4-a716-446655440004', NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440020', 'AI Ethics Panel', 'Discussion on ethical AI development.', '2026-08-21 09:00:00+00', '2026-08-21 11:00:00+00', '770e8400-e29b-41d4-a716-446655440010', 250, '660e8400-e29b-41d4-a716-446655440004', NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440021', 'NLP Applications', 'Natural Language Processing use cases.', '2026-08-21 14:00:00+00', '2026-08-21 17:00:00+00', '770e8400-e29b-41d4-a716-446655440012', 60, '660e8400-e29b-41d4-a716-446655440004', NOW(), NOW());

-- Mobile Dev Workshop Toamasina (Upcoming)
INSERT INTO event_session (id, title, description, start_time, end_time, "roomId", capacity, "eventId", created_at, updated_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440022', 'Flutter Basics', 'Getting started with Flutter development.', '2026-09-05 10:00:00+00', '2026-09-05 13:00:00+00', '770e8400-e29b-41d4-a716-446655440013', 120, '660e8400-e29b-41d4-a716-446655440005', NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440023', 'React Native Advanced', 'Advanced patterns in React Native.', '2026-09-05 14:00:00+00', '2026-09-05 17:00:00+00', '770e8400-e29b-41d4-a716-446655440014', 40, '660e8400-e29b-41d4-a716-446655440005', NOW(), NOW());

-- Cloud & DevOps Day (Upcoming)
INSERT INTO event_session (id, title, description, start_time, end_time, "roomId", capacity, "eventId", created_at, updated_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440024', 'Docker & Kubernetes 101', 'Container orchestration fundamentals.', '2026-10-15 09:00:00+00', '2026-10-15 12:00:00+00', '770e8400-e29b-41d4-a716-446655440003', 40, '660e8400-e29b-41d4-a716-446655440006', NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440025', 'CI/CD Pipeline Workshop', 'Build automated deployment pipelines.', '2026-10-15 14:00:00+00', '2026-10-15 17:00:00+00', '770e8400-e29b-41d4-a716-446655440003', 40, '660e8400-e29b-41d4-a716-446655440006', NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440026', 'AWS Best Practices', 'Optimize your cloud infrastructure.', '2026-10-15 14:00:00+00', '2026-10-15 16:00:00+00', '770e8400-e29b-41d4-a716-446655440001', 300, '660e8400-e29b-41d4-a716-446655440006', NOW(), NOW());

-- ==================== SESSION SPEAKERS ====================
INSERT INTO event_session_speaker ("eventSessionId", "speakerId", created_at) VALUES
-- DevFest
('aa0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', NOW()),
('aa0e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', NOW()),
('aa0e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440002', NOW()),
('aa0e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440003', NOW()),
('aa0e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440004', NOW()),
('aa0e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440005', NOW()),
-- Tech Summit
('aa0e8400-e29b-41d4-a716-446655440007', '880e8400-e29b-41d4-a716-446655440004', NOW()),
('aa0e8400-e29b-41d4-a716-446655440008', '880e8400-e29b-41d4-a716-446655440003', NOW()),
('aa0e8400-e29b-41d4-a716-446655440009', '880e8400-e29b-41d4-a716-446655440005', NOW()),
('aa0e8400-e29b-41d4-a716-446655440010', '880e8400-e29b-41d4-a716-446655440002', NOW()),
('aa0e8400-e29b-41d4-a716-446655440011', '880e8400-e29b-41d4-a716-446655440004', NOW()),
-- Startup Weekend
('aa0e8400-e29b-41d4-a716-446655440014', '880e8400-e29b-41d4-a716-446655440004', NOW()),
-- AI Conference
('aa0e8400-e29b-41d4-a716-446655440018', '880e8400-e29b-41d4-a716-446655440003', NOW()),
('aa0e8400-e29b-41d4-a716-446655440019', '880e8400-e29b-41d4-a716-446655440003', NOW()),
-- Cloud Day
('aa0e8400-e29b-41d4-a716-446655440024', '880e8400-e29b-41d4-a716-446655440002', NOW()),
('aa0e8400-e29b-41d4-a716-446655440025', '880e8400-e29b-41d4-a716-446655440002', NOW()),
('aa0e8400-e29b-41d4-a716-446655440026', '880e8400-e29b-41d4-a716-446655440002', NOW());

-- ==================== QUESTIONS ====================
INSERT INTO question (id, content, author_name, upvotes, "eventSessionId", created_at) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', 'What are the prerequisites for the React workshop?', 'Alice', 12, 'aa0e8400-e29b-41d4-a716-446655440002', NOW()),
('bb0e8400-e29b-41d4-a716-446655440002', 'Will the slides be available after the keynote?', 'Bob', 8, 'aa0e8400-e29b-41d4-a716-446655440001', NOW()),
('bb0e8400-e29b-41d4-a716-446655440003', 'Can you recommend resources for learning AI?', 'Charlie', 15, 'aa0e8400-e29b-41d4-a716-446655440005', NOW()),
('bb0e8400-e29b-41d4-a716-446655440004', 'How does blockchain apply to Madagascar?', 'Diana', 5, 'aa0e8400-e29b-41d4-a716-446655440009', NOW()),
('bb0e8400-e29b-41d4-a716-446655440005', 'What tools do you use for digital transformation?', 'Anonymous', 3, 'aa0e8400-e29b-41d4-a716-446655440010', NOW()),
('bb0e8400-e29b-41d4-a716-446655440006', 'Is there funding available for startups?', 'Eric', 10, 'aa0e8400-e29b-41d4-a716-446655440011', NOW()),
('bb0e8400-e29b-41d4-a716-446655440007', 'Can we access the workshop materials online?', 'Faly', 7, 'aa0e8400-e29b-41d4-a716-446655440024', NOW());

-- Update venue room counts
UPDATE venue SET total_rooms = (SELECT COUNT(*) FROM room WHERE room."venueId" = venue.id);