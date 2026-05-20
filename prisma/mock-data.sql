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
('550e8400-e29b-41d4-a716-446655440001'::uuid, 'HEI', 'Antananarivo', 'Ivandry', 4, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002'::uuid, 'Convention Center', 'Antananarivo', 'Anjanahary', 3, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003'::uuid, 'Digital Lab', 'Antsirabe', 'Centre', 2, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004'::uuid, 'University Center', 'Fianarantsoa', 'Tanambao', 3, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005'::uuid, 'Tech Hub', 'Toamasina', 'Port', 2, NOW(), NOW());

-- ==================== EVENTS ====================
INSERT INTO event (id, title, description, "venueId", is_online, start_date, end_date, created_at, updated_at) VALUES
('660e8400-e29b-41d4-a716-446655440001'::uuid, 'DevFest Antananarivo 2024', 'Annual developer festival with workshops and talks about web, mobile, and cloud technologies.', '550e8400-e29b-41d4-a716-446655440001'::uuid, false, '2024-11-15 08:00:00+00', '2024-11-16 18:00:00+00', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440002'::uuid, 'Tech Innovation Summit 2026', 'Ongoing summit about AI, blockchain, and digital transformation in Madagascar.', '550e8400-e29b-41d4-a716-446655440002'::uuid, false, '2026-05-19 09:00:00+00', '2026-05-22 17:00:00+00', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440003'::uuid, 'Startup Weekend Antsirabe', '54-hour weekend event to pitch ideas, form teams, and launch startups.', '550e8400-e29b-41d4-a716-446655440003'::uuid, false, '2026-07-10 18:00:00+00', '2026-07-12 20:00:00+00', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440004'::uuid, 'AI Conference Fianarantsoa', 'Exploring artificial intelligence applications in education and healthcare.', '550e8400-e29b-41d4-a716-446655440004'::uuid, false, '2026-08-20 09:00:00+00', '2026-08-21 18:00:00+00', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440005'::uuid, 'Mobile Dev Workshop Toamasina', 'Hands-on workshop for Flutter and React Native development.', '550e8400-e29b-41d4-a716-446655440005'::uuid, false, '2026-09-05 10:00:00+00', '2026-09-05 17:00:00+00', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440006'::uuid, 'Cloud & DevOps Day', 'Full day dedicated to cloud infrastructure and DevOps practices.', '550e8400-e29b-41d4-a716-446655440001'::uuid, false, '2026-10-15 09:00:00+00', '2026-10-15 18:00:00+00', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440007'::uuid, 'Global Web Development Summit', 'International online summit covering the latest in web technologies.', NULL, true, '2026-05-20 08:00:00+00', '2026-05-22 18:00:00+00', NOW(), NOW());

-- ==================== ROOMS ====================
INSERT INTO room (id, "venueId", name, capacity, created_at, updated_at) VALUES
('770e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'Grand Amphithéâtre', 300, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'Salle NP', 80, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440003'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'Labo Informatique', 40, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440004'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'Salle Pi', 50, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440005'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, 'Grand Hall', 500, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440006'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, 'Salle Ravinala', 150, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440007'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, 'Espace Workshop', 60, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440008'::uuid, '550e8400-e29b-41d4-a716-446655440003'::uuid, 'Main Room', 100, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440009'::uuid, '550e8400-e29b-41d4-a716-446655440003'::uuid, 'Training Room', 30, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440010'::uuid, '550e8400-e29b-41d4-a716-446655440004'::uuid, 'Amphi Principal', 250, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440011'::uuid, '550e8400-e29b-41d4-a716-446655440004'::uuid, 'Salle 101', 60, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440012'::uuid, '550e8400-e29b-41d4-a716-446655440004'::uuid, 'Salle 102', 60, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440013'::uuid, '550e8400-e29b-41d4-a716-446655440005'::uuid, 'Salle Principale', 120, NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440014'::uuid, '550e8400-e29b-41d4-a716-446655440005'::uuid, 'Co-working Space', 40, NOW(), NOW());

-- ==================== SPEAKERS ====================
INSERT INTO speaker (id, name, avatar_url, bio, created_at, updated_at) VALUES
('880e8400-e29b-41d4-a716-446655440001'::uuid, 'Rija Rakoto', 'https://i.pravatar.cc/300?u=rija', 'Full-stack developer with 12 years experience.', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440002'::uuid, 'Miora Rasoanaivo', 'https://i.pravatar.cc/300?u=miora', 'Cloud architect at NovaTech.', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440003'::uuid, 'Lova Andrian', 'https://i.pravatar.cc/300?u=lova', 'AI researcher specializing in agricultural applications.', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440004'::uuid, 'Tiana Randria', 'https://i.pravatar.cc/300?u=tiana', 'Serial entrepreneur and product management expert.', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440005'::uuid, 'Haja Rasolofo', 'https://i.pravatar.cc/300?u=haja', 'Tech lead and content creator.', NOW(), NOW());

-- ==================== SPEAKER LINKS ====================
INSERT INTO speaker_external_link (id, "speakerId", link_type, url, created_at) VALUES
('990e8400-e29b-41d4-a716-446655440001'::uuid, '880e8400-e29b-41d4-a716-446655440001'::uuid, 'TWITTER', 'https://twitter.com/rijarakoto', NOW()),
('990e8400-e29b-41d4-a716-446655440002'::uuid, '880e8400-e29b-41d4-a716-446655440001'::uuid, 'GITHUB', 'https://github.com/rijarakoto', NOW()),
('990e8400-e29b-41d4-a716-446655440003'::uuid, '880e8400-e29b-41d4-a716-446655440002'::uuid, 'LINKEDIN', 'https://linkedin.com/in/miora', NOW()),
('990e8400-e29b-41d4-a716-446655440004'::uuid, '880e8400-e29b-41d4-a716-446655440003'::uuid, 'TWITTER', 'https://twitter.com/lovaai', NOW()),
('990e8400-e29b-41d4-a716-446655440005'::uuid, '880e8400-e29b-41d4-a716-446655440004'::uuid, 'LINKEDIN', 'https://linkedin.com/in/tiana', NOW()),
('990e8400-e29b-41d4-a716-446655440006'::uuid, '880e8400-e29b-41d4-a716-446655440005'::uuid, 'OTHER', 'https://youtube.com/@hajatech', NOW());

-- ==================== SESSIONS ====================
-- DevFest Antananarivo 2024
INSERT INTO event_session (id, title, description, start_time, end_time, "roomId", capacity, "eventId", created_at, updated_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440001'::uuid, 'Keynote: Web Development Trends', 'Overview of the latest trends in web development for 2024.', '2024-11-15 09:00:00+00', '2024-11-15 10:30:00+00', '770e8400-e29b-41d4-a716-446655440001'::uuid, 300, '660e8400-e29b-41d4-a716-446655440001'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440002'::uuid, 'Workshop: React Hooks Deep Dive', 'Advanced React patterns with hooks.', '2024-11-15 11:00:00+00', '2024-11-15 13:00:00+00', '770e8400-e29b-41d4-a716-446655440003'::uuid, 40, '660e8400-e29b-41d4-a716-446655440001'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440003'::uuid, 'Cloud Migration Strategies', 'How to migrate legacy apps to the cloud.', '2024-11-15 14:00:00+00', '2024-11-15 15:30:00+00', '770e8400-e29b-41d4-a716-446655440002'::uuid, 80, '660e8400-e29b-41d4-a716-446655440001'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440004'::uuid, 'Networking Session', 'Meet fellow developers and share experiences.', '2024-11-15 16:00:00+00', '2024-11-15 18:00:00+00', '770e8400-e29b-41d4-a716-446655440004'::uuid, 50, '660e8400-e29b-41d4-a716-446655440001'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440005'::uuid, 'AI for Beginners', 'Introduction to AI concepts and tools.', '2024-11-16 09:00:00+00', '2024-11-16 12:00:00+00', '770e8400-e29b-41d4-a716-446655440001'::uuid, 300, '660e8400-e29b-41d4-a716-446655440001'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440006'::uuid, 'Closing Panel', 'Discussion on the future of tech in Madagascar.', '2024-11-16 14:00:00+00', '2024-11-16 17:00:00+00', '770e8400-e29b-41d4-a716-446655440001'::uuid, 300, '660e8400-e29b-41d4-a716-446655440001'::uuid, NOW(), NOW());

-- Tech Innovation Summit 2026
INSERT INTO event_session (id, title, description, start_time, end_time, "roomId", capacity, "eventId", created_at, updated_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440007'::uuid, 'Opening Ceremony', 'Welcome and introduction to the summit.', '2026-05-19 09:00:00+00', '2026-05-19 10:00:00+00', '770e8400-e29b-41d4-a716-446655440005'::uuid, 500, '660e8400-e29b-41d4-a716-446655440002'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440008'::uuid, 'AI in Healthcare', 'How AI is transforming healthcare in Africa.', '2026-05-19 10:30:00+00', '2026-05-19 12:00:00+00', '770e8400-e29b-41d4-a716-446655440005'::uuid, 500, '660e8400-e29b-41d4-a716-446655440002'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440009'::uuid, 'Blockchain Workshop', 'Hands-on blockchain development.', '2026-05-19 14:00:00+00', '2026-05-19 17:00:00+00', '770e8400-e29b-41d4-a716-446655440007'::uuid, 60, '660e8400-e29b-41d4-a716-446655440002'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440010'::uuid, 'Digital Transformation Panel', 'Panel discussion on digital transformation strategies.', '2026-05-20 09:00:00+00', '2026-05-20 11:00:00+00', '770e8400-e29b-41d4-a716-446655440005'::uuid, 500, '660e8400-e29b-41d4-a716-446655440002'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440011'::uuid, 'Startup Pitch Competition', 'Local startups pitch their ideas.', '2026-05-20 11:30:00+00', '2026-05-20 13:30:00+00', '770e8400-e29b-41d4-a716-446655440006'::uuid, 150, '660e8400-e29b-41d4-a716-446655440002'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440012'::uuid, 'Cybersecurity Essentials', 'Protecting your digital assets.', '2026-05-21 09:00:00+00', '2026-05-21 11:00:00+00', '770e8400-e29b-41d4-a716-446655440005'::uuid, 500, '660e8400-e29b-41d4-a716-446655440002'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440013'::uuid, 'Closing & Awards', 'Summit closing ceremony and awards.', '2026-05-22 15:00:00+00', '2026-05-22 17:00:00+00', '770e8400-e29b-41d4-a716-446655440005'::uuid, 500, '660e8400-e29b-41d4-a716-446655440002'::uuid, NOW(), NOW());

-- Startup Weekend Antsirabe
INSERT INTO event_session (id, title, description, start_time, end_time, "roomId", capacity, "eventId", created_at, updated_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440014'::uuid, 'Pitch Workshop', 'Learn how to pitch your startup idea.', '2026-07-10 18:00:00+00', '2026-07-10 20:00:00+00', '770e8400-e29b-41d4-a716-446655440008'::uuid, 100, '660e8400-e29b-41d4-a716-446655440003'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440015'::uuid, 'Team Formation', 'Form teams and start brainstorming.', '2026-07-10 20:00:00+00', '2026-07-10 22:00:00+00', '770e8400-e29b-41d4-a716-446655440008'::uuid, 100, '660e8400-e29b-41d4-a716-446655440003'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440016'::uuid, 'Mentoring Sessions', 'Get advice from experienced mentors.', '2026-07-11 09:00:00+00', '2026-07-11 18:00:00+00', '770e8400-e29b-41d4-a716-446655440009'::uuid, 30, '660e8400-e29b-41d4-a716-446655440003'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440017'::uuid, 'Final Presentations', 'Teams present their projects.', '2026-07-12 14:00:00+00', '2026-07-12 18:00:00+00', '770e8400-e29b-41d4-a716-446655440008'::uuid, 100, '660e8400-e29b-41d4-a716-446655440003'::uuid, NOW(), NOW());

-- AI Conference Fianarantsoa
INSERT INTO event_session (id, title, description, start_time, end_time, "roomId", capacity, "eventId", created_at, updated_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440018'::uuid, 'Machine Learning Fundamentals', 'Introduction to ML algorithms and tools.', '2026-08-20 09:00:00+00', '2026-08-20 12:00:00+00', '770e8400-e29b-41d4-a716-446655440010'::uuid, 250, '660e8400-e29b-41d4-a716-446655440004'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440019'::uuid, 'Deep Learning Workshop', 'Practical deep learning with TensorFlow.', '2026-08-20 14:00:00+00', '2026-08-20 17:00:00+00', '770e8400-e29b-41d4-a716-446655440011'::uuid, 60, '660e8400-e29b-41d4-a716-446655440004'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440020'::uuid, 'AI Ethics Panel', 'Discussion on ethical AI development.', '2026-08-21 09:00:00+00', '2026-08-21 11:00:00+00', '770e8400-e29b-41d4-a716-446655440010'::uuid, 250, '660e8400-e29b-41d4-a716-446655440004'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440021'::uuid, 'NLP Applications', 'Natural Language Processing use cases.', '2026-08-21 14:00:00+00', '2026-08-21 17:00:00+00', '770e8400-e29b-41d4-a716-446655440012'::uuid, 60, '660e8400-e29b-41d4-a716-446655440004'::uuid, NOW(), NOW());

-- Mobile Dev Workshop Toamasina
INSERT INTO event_session (id, title, description, start_time, end_time, "roomId", capacity, "eventId", created_at, updated_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440022'::uuid, 'Flutter Basics', 'Getting started with Flutter development.', '2026-09-05 10:00:00+00', '2026-09-05 13:00:00+00', '770e8400-e29b-41d4-a716-446655440013'::uuid, 120, '660e8400-e29b-41d4-a716-446655440005'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440023'::uuid, 'React Native Advanced', 'Advanced patterns in React Native.', '2026-09-05 14:00:00+00', '2026-09-05 17:00:00+00', '770e8400-e29b-41d4-a716-446655440014'::uuid, 40, '660e8400-e29b-41d4-a716-446655440005'::uuid, NOW(), NOW());

-- Cloud & DevOps Day
INSERT INTO event_session (id, title, description, start_time, end_time, "roomId", capacity, "eventId", created_at, updated_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440024'::uuid, 'Docker & Kubernetes 101', 'Container orchestration fundamentals.', '2026-10-15 09:00:00+00', '2026-10-15 12:00:00+00', '770e8400-e29b-41d4-a716-446655440003'::uuid, 40, '660e8400-e29b-41d4-a716-446655440006'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440025'::uuid, 'CI/CD Pipeline Workshop', 'Build automated deployment pipelines.', '2026-10-15 14:00:00+00', '2026-10-15 17:00:00+00', '770e8400-e29b-41d4-a716-446655440003'::uuid, 40, '660e8400-e29b-41d4-a716-446655440006'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440026'::uuid, 'AWS Best Practices', 'Optimize your cloud infrastructure.', '2026-10-15 14:00:00+00', '2026-10-15 16:00:00+00', '770e8400-e29b-41d4-a716-446655440001'::uuid, 300, '660e8400-e29b-41d4-a716-446655440006'::uuid, NOW(), NOW()),

-- Global Web Development Summit (Online — no room)
('aa0e8400-e29b-41d4-a716-446655440027'::uuid, 'Keynote: The State of Web 2026', 'Live stream keynote covering the latest web platform features.', '2026-05-20 09:00:00+00', '2026-05-20 10:30:00+00', NULL, NULL, '660e8400-e29b-41d4-a716-446655440007'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440028'::uuid, 'Workshop: Web Components in Production', 'Build reusable components with the native web platform.', '2026-05-20 11:00:00+00', '2026-05-20 13:00:00+00', NULL, NULL, '660e8400-e29b-41d4-a716-446655440007'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440029'::uuid, 'Panel: The Future of JavaScript', 'Experts discuss where JavaScript is heading.', '2026-05-21 09:00:00+00', '2026-05-21 10:30:00+00', NULL, NULL, '660e8400-e29b-41d4-a716-446655440007'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440030'::uuid, 'Building Accessible Web Apps', 'Practical guide to web accessibility.', '2026-05-21 14:00:00+00', '2026-05-21 16:00:00+00', NULL, NULL, '660e8400-e29b-41d4-a716-446655440007'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440031'::uuid, 'Closing: What is Next for the Web', 'Closing keynote and community announcements.', '2026-05-22 16:00:00+00', '2026-05-22 18:00:00+00', NULL, NULL, '660e8400-e29b-41d4-a716-446655440007'::uuid, NOW(), NOW());

-- ==================== SESSION SPEAKERS ====================
INSERT INTO event_session_speaker ("eventSessionId", "speakerId", created_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440001'::uuid, '880e8400-e29b-41d4-a716-446655440001'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440002'::uuid, '880e8400-e29b-41d4-a716-446655440001'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440003'::uuid, '880e8400-e29b-41d4-a716-446655440002'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440005'::uuid, '880e8400-e29b-41d4-a716-446655440003'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440006'::uuid, '880e8400-e29b-41d4-a716-446655440004'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440006'::uuid, '880e8400-e29b-41d4-a716-446655440005'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440007'::uuid, '880e8400-e29b-41d4-a716-446655440004'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440008'::uuid, '880e8400-e29b-41d4-a716-446655440003'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440009'::uuid, '880e8400-e29b-41d4-a716-446655440005'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440010'::uuid, '880e8400-e29b-41d4-a716-446655440002'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440011'::uuid, '880e8400-e29b-41d4-a716-446655440004'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440014'::uuid, '880e8400-e29b-41d4-a716-446655440004'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440018'::uuid, '880e8400-e29b-41d4-a716-446655440003'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440019'::uuid, '880e8400-e29b-41d4-a716-446655440003'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440024'::uuid, '880e8400-e29b-41d4-a716-446655440002'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440025'::uuid, '880e8400-e29b-41d4-a716-446655440002'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440026'::uuid, '880e8400-e29b-41d4-a716-446655440002'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440027'::uuid, '880e8400-e29b-41d4-a716-446655440001'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440028'::uuid, '880e8400-e29b-41d4-a716-446655440001'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440029'::uuid, '880e8400-e29b-41d4-a716-446655440004'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440029'::uuid, '880e8400-e29b-41d4-a716-446655440005'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440030'::uuid, '880e8400-e29b-41d4-a716-446655440005'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440031'::uuid, '880e8400-e29b-41d4-a716-446655440001'::uuid, NOW());

-- ==================== QUESTIONS ====================
INSERT INTO question (id, content, author_name, upvotes, "eventSessionId", created_at) VALUES
('bb0e8400-e29b-41d4-a716-446655440001'::uuid, 'What are the prerequisites for the React workshop?', 'Alice', 12, 'aa0e8400-e29b-41d4-a716-446655440002'::uuid, NOW()),
('bb0e8400-e29b-41d4-a716-446655440002'::uuid, 'Will the slides be available after the keynote?', 'Bob', 8, 'aa0e8400-e29b-41d4-a716-446655440001'::uuid, NOW()),
('bb0e8400-e29b-41d4-a716-446655440003'::uuid, 'Can you recommend resources for learning AI?', 'Charlie', 15, 'aa0e8400-e29b-41d4-a716-446655440005'::uuid, NOW()),
('bb0e8400-e29b-41d4-a716-446655440004'::uuid, 'How does blockchain apply to Madagascar?', 'Diana', 5, 'aa0e8400-e29b-41d4-a716-446655440009'::uuid, NOW()),
('bb0e8400-e29b-41d4-a716-446655440005'::uuid, 'What tools do you use for digital transformation?', 'Anonymous', 3, 'aa0e8400-e29b-41d4-a716-446655440010'::uuid, NOW()),
('bb0e8400-e29b-41d4-a716-446655440006'::uuid, 'Is there funding available for startups?', 'Eric', 10, 'aa0e8400-e29b-41d4-a716-446655440011'::uuid, NOW()),
('bb0e8400-e29b-41d4-a716-446655440007'::uuid, 'Can we access the workshop materials online?', 'Faly', 7, 'aa0e8400-e29b-41d4-a716-446655440024'::uuid, NOW());

-- Update venue room counts
UPDATE venue SET total_rooms = (SELECT COUNT(*) FROM room WHERE room."venueId" = venue.id);