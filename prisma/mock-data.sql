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
('aa0e8400-e29b-41d4-a716-446655440004'::uuid, '880e8400-e29b-41d4-a716-446655440005'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440005'::uuid, '880e8400-e29b-41d4-a716-446655440003'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440006'::uuid, '880e8400-e29b-41d4-a716-446655440004'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440006'::uuid, '880e8400-e29b-41d4-a716-446655440005'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440007'::uuid, '880e8400-e29b-41d4-a716-446655440004'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440008'::uuid, '880e8400-e29b-41d4-a716-446655440003'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440009'::uuid, '880e8400-e29b-41d4-a716-446655440005'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440010'::uuid, '880e8400-e29b-41d4-a716-446655440002'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440011'::uuid, '880e8400-e29b-41d4-a716-446655440004'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440012'::uuid, '880e8400-e29b-41d4-a716-446655440010'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440013'::uuid, '880e8400-e29b-41d4-a716-446655440004'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440014'::uuid, '880e8400-e29b-41d4-a716-446655440004'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440015'::uuid, '880e8400-e29b-41d4-a716-446655440013'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440016'::uuid, '880e8400-e29b-41d4-a716-446655440004'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440017'::uuid, '880e8400-e29b-41d4-a716-446655440013'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440018'::uuid, '880e8400-e29b-41d4-a716-446655440003'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440019'::uuid, '880e8400-e29b-41d4-a716-446655440003'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440020'::uuid, '880e8400-e29b-41d4-a716-446655440014'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440021'::uuid, '880e8400-e29b-41d4-a716-446655440009'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440022'::uuid, '880e8400-e29b-41d4-a716-446655440011'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440023'::uuid, '880e8400-e29b-41d4-a716-446655440015'::uuid, NOW()),
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

-- ==================== MORE SPEAKERS ====================
INSERT INTO speaker (id, name, avatar_url, bio, created_at, updated_at) VALUES
('880e8400-e29b-41d4-a716-446655440006'::uuid, 'Fetra Ramiandrisoa', 'https://i.pravatar.cc/300?u=fetra', 'Open source contributor and full-stack developer.', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440007'::uuid, 'Nomena Andriatsiferana', 'https://i.pravatar.cc/300?u=nomena', 'UX designer specializing in fintech products.', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440008'::uuid, 'Tolotra Randriamihaja', 'https://i.pravatar.cc/300?u=tolotra', 'DevOps engineer and cloud infrastructure expert.', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440009'::uuid, 'Mamisoa Rakotomalala', 'https://i.pravatar.cc/300?u=mamisoa', 'Data scientist passionate about NLP and computer vision.', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440010'::uuid, 'Soa Rabearivelo', 'https://i.pravatar.cc/300?u=soa', 'Cybersecurity researcher and ethical hacking educator.', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440011'::uuid, 'Hery Randrianarisoa', 'https://i.pravatar.cc/300?u=hery', 'Mobile developer and Flutter community lead.', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440012'::uuid, 'Tahiriniaina Ravelo', 'https://i.pravatar.cc/300?u=tahiri', 'Backend engineer and distributed systems enthusiast.', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440013'::uuid, 'Mendrika Razafy', 'https://i.pravatar.cc/300?u=mendrika', 'Startup founder and product management coach.', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440014'::uuid, 'Voahangy Rakoto', 'https://i.pravatar.cc/300?u=voahangy', 'AI/ML researcher focused on African language models.', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440015'::uuid, 'Sitraka Andrianoely', 'https://i.pravatar.cc/300?u=sitraka', 'Senior frontend engineer and web performance advocate.', NOW(), NOW());

INSERT INTO speaker_external_link (id, "speakerId", link_type, url, created_at) VALUES
('990e8400-e29b-41d4-a716-446655440007'::uuid, '880e8400-e29b-41d4-a716-446655440006'::uuid, 'GITHUB', 'https://github.com/fetrar', NOW()),
('990e8400-e29b-41d4-a716-446655440008'::uuid, '880e8400-e29b-41d4-a716-446655440006'::uuid, 'TWITTER', 'https://twitter.com/fetrar', NOW()),
('990e8400-e29b-41d4-a716-446655440009'::uuid, '880e8400-e29b-41d4-a716-446655440007'::uuid, 'LINKEDIN', 'https://linkedin.com/in/nomena', NOW()),
('990e8400-e29b-41d4-a716-446655440010'::uuid, '880e8400-e29b-41d4-a716-446655440008'::uuid, 'GITHUB', 'https://github.com/tolotra', NOW()),
('990e8400-e29b-41d4-a716-446655440011'::uuid, '880e8400-e29b-41d4-a716-446655440008'::uuid, 'TWITTER', 'https://twitter.com/tolotra', NOW()),
('990e8400-e29b-41d4-a716-446655440012'::uuid, '880e8400-e29b-41d4-a716-446655440009'::uuid, 'TWITTER', 'https://twitter.com/mamisoa', NOW()),
('990e8400-e29b-41d4-a716-446655440013'::uuid, '880e8400-e29b-41d4-a716-446655440010'::uuid, 'OTHER', 'https://soa.sec/blog', NOW()),
('990e8400-e29b-41d4-a716-446655440014'::uuid, '880e8400-e29b-41d4-a716-446655440010'::uuid, 'GITHUB', 'https://github.com/soarab', NOW()),
('990e8400-e29b-41d4-a716-446655440015'::uuid, '880e8400-e29b-41d4-a716-446655440011'::uuid, 'TWITTER', 'https://twitter.com/heryflut', NOW()),
('990e8400-e29b-41d4-a716-446655440016'::uuid, '880e8400-e29b-41d4-a716-446655440012'::uuid, 'GITHUB', 'https://github.com/tahiri', NOW()),
('990e8400-e29b-41d4-a716-446655440017'::uuid, '880e8400-e29b-41d4-a716-446655440013'::uuid, 'LINKEDIN', 'https://linkedin.com/in/mendrika', NOW()),
('990e8400-e29b-41d4-a716-446655440018'::uuid, '880e8400-e29b-41d4-a716-446655440014'::uuid, 'TWITTER', 'https://twitter.com/voahangy_ml', NOW()),
('990e8400-e29b-41d4-a716-446655440019'::uuid, '880e8400-e29b-41d4-a716-446655440015'::uuid, 'GITHUB', 'https://github.com/sitraka', NOW());

-- ==================== NEW EVENT: HIBENTO LIVE DAY ====================
INSERT INTO event (id, title, description, "venueId", is_online, start_date, end_date, created_at, updated_at) VALUES
('660e8400-e29b-41d4-a716-446655440008'::uuid, 'HiBento Live Day 2026', 'A full day of live-streamed tech talks, workshops, and panels broadcast from HEI campus in Antananarivo. Featuring 14 sessions across 4 tracks with local and international speakers.', '550e8400-e29b-41d4-a716-446655440001'::uuid, true, '2026-05-29 08:00:00+00', '2026-05-29 18:00:00+00', NOW(), NOW());

-- ==================== LIVE SESSIONS (14 sessions across 4 rooms, all happening May 29) ====================

-- Grand Amphithéâtre (room 001) — 4 sessions
INSERT INTO event_session (id, title, description, start_time, end_time, "roomId", capacity, "eventId", created_at, updated_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440032'::uuid, 'Keynote: The Future of Web Development in Africa', 'Live keynote exploring emerging trends, the rise of AI-assisted development, and opportunities for African developers in the global web ecosystem.', '2026-05-29 08:00:00+00', '2026-05-29 10:00:00+00', '770e8400-e29b-41d4-a716-446655440001'::uuid, 300, '660e8400-e29b-41d4-a716-446655440008'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440033'::uuid, 'Building Scalable APIs with Node.js & Fastify', 'Live coding session on designing and deploying high-throughput APIs using Fastify, Redis caching, and PostgreSQL partitioning.', '2026-05-29 10:30:00+00', '2026-05-29 12:30:00+00', '770e8400-e29b-41d4-a716-446655440001'::uuid, 300, '660e8400-e29b-41d4-a716-446655440008'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440034'::uuid, 'Panel: Open Source in Madagascar', 'Community leaders discuss the state of open source in Madagascar — successes, challenges, and how to get involved.', '2026-05-29 14:00:00+00', '2026-05-29 15:30:00+00', '770e8400-e29b-41d4-a716-446655440001'::uuid, 300, '660e8400-e29b-41d4-a716-446655440008'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440035'::uuid, 'Lightning Talks: Community Showcase', 'Five rapid-fire 10-minute talks from community members on WebAssembly, Edge Computing, PWAs, Web3, and Green Software.', '2026-05-29 16:00:00+00', '2026-05-29 17:30:00+00', '770e8400-e29b-41d4-a716-446655440001'::uuid, 300, '660e8400-e29b-41d4-a716-446655440008'::uuid, NOW(), NOW());

-- Salle NP (room 002) — 4 sessions
INSERT INTO event_session (id, title, description, start_time, end_time, "roomId", capacity, "eventId", created_at, updated_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440036'::uuid, 'React Server Components Deep Dive', 'Live walkthrough of the RSC mental model: streaming, data fetching, server actions, and when to use client vs server components in Next.js.', '2026-05-29 09:00:00+00', '2026-05-29 11:00:00+00', '770e8400-e29b-41d4-a716-446655440002'::uuid, 80, '660e8400-e29b-41d4-a716-446655440008'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440037'::uuid, 'TypeScript Advanced Patterns Workshop', 'Master conditional types, template literal types, mapped types, and branded types in TypeScript 5 — with real-world examples.', '2026-05-29 11:30:00+00', '2026-05-29 13:30:00+00', '770e8400-e29b-41d4-a716-446655440002'::uuid, 80, '660e8400-e29b-41d4-a716-446655440008'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440038'::uuid, 'UI/UX Design Principles for Developers', 'Practical design fundamentals: color theory, typography, layout systems, and accessibility — no design background required.', '2026-05-29 14:00:00+00', '2026-05-29 16:00:00+00', '770e8400-e29b-41d4-a716-446655440002'::uuid, 80, '660e8400-e29b-41d4-a716-446655440008'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440045'::uuid, 'State Management in 2026: Signals, Stores, and Beyond', 'Comparing modern state management approaches: signals, Zustand, Jotai, and the rise of URL-as-state.', '2026-05-29 16:30:00+00', '2026-05-29 18:00:00+00', '770e8400-e29b-41d4-a716-446655440002'::uuid, 80, '660e8400-e29b-41d4-a716-446655440008'::uuid, NOW(), NOW());

-- Labo Informatique (room 003) — 3 sessions
INSERT INTO event_session (id, title, description, start_time, end_time, "roomId", capacity, "eventId", created_at, updated_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440039'::uuid, 'Hands-on Docker & Kubernetes', 'Interactive workshop: containerize a full-stack app, deploy to a local K8s cluster, configure auto-scaling and rolling updates.', '2026-05-29 09:00:00+00', '2026-05-29 12:00:00+00', '770e8400-e29b-41d4-a716-446655440003'::uuid, 40, '660e8400-e29b-41d4-a716-446655440008'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440040'::uuid, 'Testing Strategies for Modern Web Apps', 'From Vitest unit tests to Playwright e2e: build a comprehensive testing pyramid and integrate it into your CI/CD pipeline.', '2026-05-29 13:00:00+00', '2026-05-29 15:00:00+00', '770e8400-e29b-41d4-a716-446655440003'::uuid, 40, '660e8400-e29b-41d4-a716-446655440008'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440041'::uuid, 'Workshop: Real-time Chat with WebSockets', 'Build a real-time chat application from scratch using WebSockets, Redis Pub/Sub, and React. Covers reconnection, presence, and scaling.', '2026-05-29 15:30:00+00', '2026-05-29 17:30:00+00', '770e8400-e29b-41d4-a716-446655440003'::uuid, 40, '660e8400-e29b-41d4-a716-446655440008'::uuid, NOW(), NOW());

-- Salle Pi (room 004) — 3 sessions
INSERT INTO event_session (id, title, description, start_time, end_time, "roomId", capacity, "eventId", created_at, updated_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440042'::uuid, 'Introduction to Machine Learning with Python', 'Beginner-friendly workshop covering regression, classification, and model evaluation using scikit-learn and Jupyter notebooks.', '2026-05-29 10:00:00+00', '2026-05-29 12:00:00+00', '770e8400-e29b-41d4-a716-446655440004'::uuid, 50, '660e8400-e29b-41d4-a716-446655440008'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440043'::uuid, 'Cybersecurity for Web Developers', 'Essential security practices: OWASP Top 10, input validation, CSRF, XSS prevention, and secure authentication patterns.', '2026-05-29 12:30:00+00', '2026-05-29 14:30:00+00', '770e8400-e29b-41d4-a716-446655440004'::uuid, 50, '660e8400-e29b-41d4-a716-446655440008'::uuid, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440044'::uuid, 'Building Cross-Platform Apps with Flutter', 'Live coding session: build a cross-platform mobile app with Flutter 4, covering state management, platform channels, and deployment.', '2026-05-29 15:00:00+00', '2026-05-29 17:00:00+00', '770e8400-e29b-41d4-a716-446655440004'::uuid, 50, '660e8400-e29b-41d4-a716-446655440008'::uuid, NOW(), NOW());

-- ==================== SESSION-SPEAKER ASSIGNMENTS ====================
INSERT INTO event_session_speaker ("eventSessionId", "speakerId", created_at) VALUES
-- Grand Amphithéâtre
('aa0e8400-e29b-41d4-a716-446655440032'::uuid, '880e8400-e29b-41d4-a716-446655440001'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440032'::uuid, '880e8400-e29b-41d4-a716-446655440013'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440033'::uuid, '880e8400-e29b-41d4-a716-446655440006'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440033'::uuid, '880e8400-e29b-41d4-a716-446655440012'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440034'::uuid, '880e8400-e29b-41d4-a716-446655440004'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440034'::uuid, '880e8400-e29b-41d4-a716-446655440006'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440034'::uuid, '880e8400-e29b-41d4-a716-446655440005'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440034'::uuid, '880e8400-e29b-41d4-a716-446655440013'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440035'::uuid, '880e8400-e29b-41d4-a716-446655440008'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440035'::uuid, '880e8400-e29b-41d4-a716-446655440009'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440035'::uuid, '880e8400-e29b-41d4-a716-446655440010'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440035'::uuid, '880e8400-e29b-41d4-a716-446655440015'::uuid, NOW()),
-- Salle NP
('aa0e8400-e29b-41d4-a716-446655440036'::uuid, '880e8400-e29b-41d4-a716-446655440015'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440037'::uuid, '880e8400-e29b-41d4-a716-446655440005'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440038'::uuid, '880e8400-e29b-41d4-a716-446655440007'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440045'::uuid, '880e8400-e29b-41d4-a716-446655440015'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440045'::uuid, '880e8400-e29b-41d4-a716-446655440013'::uuid, NOW()),
-- Labo Informatique
('aa0e8400-e29b-41d4-a716-446655440039'::uuid, '880e8400-e29b-41d4-a716-446655440008'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440039'::uuid, '880e8400-e29b-41d4-a716-446655440012'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440040'::uuid, '880e8400-e29b-41d4-a716-446655440008'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440041'::uuid, '880e8400-e29b-41d4-a716-446655440006'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440041'::uuid, '880e8400-e29b-41d4-a716-446655440012'::uuid, NOW()),
-- Salle Pi
('aa0e8400-e29b-41d4-a716-446655440042'::uuid, '880e8400-e29b-41d4-a716-446655440009'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440043'::uuid, '880e8400-e29b-41d4-a716-446655440010'::uuid, NOW()),
('aa0e8400-e29b-41d4-a716-446655440044'::uuid, '880e8400-e29b-41d4-a716-446655440011'::uuid, NOW());

-- ==================== QUESTIONS FOR LIVE SESSIONS ====================
INSERT INTO question (id, content, author_name, upvotes, "eventSessionId", created_at) VALUES
-- Keynote questions
('bb0e8400-e29b-41d4-a716-446655440008'::uuid, 'Will the recording be available after the event?', 'Miora', 23, 'aa0e8400-e29b-41d4-a716-446655440032'::uuid, NOW()),
('bb0e8400-e29b-41d4-a716-446655440009'::uuid, 'What AI tools do you recommend for frontend devs?', 'Rado', 18, 'aa0e8400-e29b-41d4-a716-446655440032'::uuid, NOW()),
('bb0e8400-e29b-41d4-a716-446655440010'::uuid, 'How can Malagasy devs get remote jobs?', 'Fara', 45, 'aa0e8400-e29b-41d4-a716-446655440032'::uuid, NOW()),
-- Scalable APIs
('bb0e8400-e29b-41d4-a716-446655440011'::uuid, 'How does Fastify compare to Express in 2026?', 'Kanto', 12, 'aa0e8400-e29b-41d4-a716-446655440033'::uuid, NOW()),
('bb0e8400-e29b-41d4-a716-446655440012'::uuid, 'What is the best approach for API versioning?', 'Tsanta', 9, 'aa0e8400-e29b-41d4-a716-446655440033'::uuid, NOW()),
-- Open Source Panel
('bb0e8400-e29b-41d4-a716-446655440013'::uuid, 'How do I make my first open source contribution?', 'Njaka', 31, 'aa0e8400-e29b-41d4-a716-446655440034'::uuid, NOW()),
('bb0e8400-e29b-41d4-a716-446655440014'::uuid, 'Are there Madagascar-specific OSS projects?', 'Mamy', 14, 'aa0e8400-e29b-41d4-a716-446655440034'::uuid, NOW()),
('bb0e8400-e29b-41d4-a716-446655440015'::uuid, 'How do you sustain an open source project long-term?', 'Lalaina', 7, 'aa0e8400-e29b-41d4-a716-446655440034'::uuid, NOW()),
-- Lightning Talks
('bb0e8400-e29b-41d4-a716-446655440016'::uuid, 'Will slides be shared after the talks?', 'Tafita', 5, 'aa0e8400-e29b-41d4-a716-446655440035'::uuid, NOW()),
-- RSC Deep Dive
('bb0e8400-e29b-41d4-a716-446655440017'::uuid, 'Can RSC be used outside of Next.js?', 'Mendrika', 16, 'aa0e8400-e29b-41d4-a716-446655440036'::uuid, NOW()),
('bb0e8400-e29b-41d4-a716-446655440018'::uuid, 'When should I use server actions vs API routes?', 'Safidy', 11, 'aa0e8400-e29b-41d4-a716-446655440036'::uuid, NOW()),
-- TypeScript workshop
('bb0e8400-e29b-41d4-a716-446655440019'::uuid, 'Is there a performance cost to complex generic types?', 'Tantely', 8, 'aa0e8400-e29b-41d4-a716-446655440037'::uuid, NOW()),
-- UI/UX Design
('bb0e8400-e29b-41d4-a716-446655440020'::uuid, 'What tools do you use for prototyping?', 'Hasina', 6, 'aa0e8400-e29b-41d4-a716-446655440038'::uuid, NOW()),
-- Docker & K8s
('bb0e8400-e29b-41d4-a716-446655440021'::uuid, 'What is the learning curve like for Kubernetes?', 'Tina', 10, 'aa0e8400-e29b-41d4-a716-446655440039'::uuid, NOW()),
-- Testing
('bb0e8400-e29b-41d4-a716-446655440022'::uuid, 'Do you recommend TDD for all projects?', 'Fy', 19, 'aa0e8400-e29b-41d4-a716-446655440040'::uuid, NOW()),
('bb0e8400-e29b-41d4-a716-446655440023'::uuid, 'How do you test WebSocket connections?', 'Andy', 4, 'aa0e8400-e29b-41d4-a716-446655440040'::uuid, NOW()),
-- ML workshop
('bb0e8400-e29b-41d4-a716-446655440024'::uuid, 'What hardware specs do you recommend for ML?', 'Faniry', 13, 'aa0e8400-e29b-41d4-a716-446655440042'::uuid, NOW()),
('bb0e8400-e29b-41d4-a716-446655440025'::uuid, 'Is scikit-learn still relevant with all the new libraries?', 'Rindra', 7, 'aa0e8400-e29b-41d4-a716-446655440042'::uuid, NOW()),
-- Cybersecurity
('bb0e8400-e29b-41d4-a716-446655440026'::uuid, 'What passwordless auth do you recommend?', 'Zo', 21, 'aa0e8400-e29b-41d4-a716-446655440043'::uuid, NOW()),
('bb0e8400-e29b-41d4-a716-446655440027'::uuid, 'How often should we do security audits?', 'Mihaja', 5, 'aa0e8400-e29b-41d4-a716-446655440043'::uuid, NOW()),
-- Flutter
('bb0e8400-e29b-41d4-a716-446655440028'::uuid, 'Is Flutter good for production apps in 2026?', 'Hary', 15, 'aa0e8400-e29b-41d4-a716-446655440044'::uuid, NOW()),
('bb0e8400-e29b-41d4-a716-446655440029'::uuid, 'How does Flutter compare to React Native today?', 'Nivo', 9, 'aa0e8400-e29b-41d4-a716-446655440044'::uuid, NOW()),
('bb0e8400-e29b-41d4-a716-446655440030'::uuid, 'Can I use Flutter for web and desktop too?', 'Taf', 6, 'aa0e8400-e29b-41d4-a716-446655440044'::uuid, NOW()),
-- State Management
('bb0e8400-e29b-41d4-a716-446655440031'::uuid, 'Are signals really faster than Redux?', 'Mano', 11, 'aa0e8400-e29b-41d4-a716-446655440045'::uuid, NOW()),
('bb0e8400-e29b-41d4-a716-446655440032'::uuid, 'Do you still recommend Zustand in 2026?', 'Tsiory', 8, 'aa0e8400-e29b-41d4-a716-446655440045'::uuid, NOW());

-- Update venue room counts
UPDATE venue SET total_rooms = (SELECT COUNT(*) FROM room WHERE room."venueId" = venue.id);