
-- ==================== CLEAN EXISTING DATA (OPTIONAL) ====================
TRUNCATE TABLE question CASCADE;
TRUNCATE TABLE session_speaker CASCADE;
TRUNCATE TABLE session CASCADE;
TRUNCATE TABLE speaker_external_link CASCADE;
TRUNCATE TABLE speaker CASCADE;
TRUNCATE TABLE room CASCADE;
TRUNCATE TABLE event CASCADE;

-- ==================== EVENTS ====================
INSERT INTO event (id, title, description, start_date, end_date, location, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'DevConf 2025', 'The annual developer conference featuring the latest in web, cloud, and AI technologies.', '2025-09-15 09:00:00+00', '2025-09-17 18:00:00+00', 'Anjanahary Convention Center', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'Tech Summit 2025', 'A gathering of tech leaders and innovators shaping the future.', '2025-10-05 10:00:00+00', '2025-10-06 17:00:00+00', 'Ivato International Conference Center', NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'AI Workshop Day', 'Deep dive into artificial intelligence and machine learning.', '2025-11-20 09:00:00+00', '2025-11-20 18:00:00+00', 'Digital Hub Antananarivo', NOW(), NOW());

-- ==================== ROOMS ====================
INSERT INTO room (id, name, "eventId", created_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Grand Hall', '11111111-1111-1111-1111-111111111111', NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Room A', '11111111-1111-1111-1111-111111111111', NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Room B', '11111111-1111-1111-1111-111111111111', NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Workshop Studio', '11111111-1111-1111-1111-111111111111', NOW());

-- ==================== SPEAKERS ====================
INSERT INTO speaker (id, name, avatar_url, bio, created_at, updated_at) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Jane Doe', 'https://randomuser.me/api/portraits/women/1.jpg', 'Jane is a tech lead at WebCorp with 10+ years of experience in web technologies. She specializes in React, Next.js, and modern frontend architecture.', NOW(), NOW()),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'John Smith', 'https://randomuser.me/api/portraits/men/2.jpg', 'Rust core contributor and systems programmer. John has been working with Rust for 8 years and loves teaching others about memory safety.', NOW(), NOW()),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Alice Johnson', 'https://randomuser.me/api/portraits/women/3.jpg', 'AI researcher focused on practical applications of machine learning. Alice leads the ML team at TechInnovate.', NOW(), NOW()),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Emily Brown', 'https://randomuser.me/api/portraits/women/4.jpg', 'Cloud architect and DevOps expert. Emily helps companies migrate to cloud-native architectures.', NOW(), NOW()),
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Michael Chen', 'https://randomuser.me/api/portraits/men/5.jpg', 'Full-stack developer and open source contributor. Michael maintains several popular npm packages.', NOW(), NOW());

-- ==================== SPEAKER EXTERNAL LINKS ====================
-- Note: LinkType enum accepts: 'TWITTER', 'GITHUB', 'WEBSITE', 'LINKEDIN', 'FACEBOOK', 'INSTAGRAM', 'OTHER'
INSERT INTO speaker_external_link (id, "speakerId", link_type, url, created_at) VALUES
('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'TWITTER', 'https://twitter.com/janedoe', NOW()),
('f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'GITHUB', 'https://github.com/janedoe', NOW()),
('f7eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'WEBSITE', 'https://janedoe.dev', NOW()),
('f8eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'GITHUB', 'https://github.com/johnsmith', NOW()),
('f9eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'TWITTER', 'https://twitter.com/alicejohnson', NOW());

-- ==================== SESSIONS ====================
INSERT INTO session (id, title, description, start_time, end_time, "roomId", capacity, "eventId", created_at, updated_at) VALUES
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'Keynote: The Future of Web', 'Join us for an inspiring keynote about the future of web technologies, including WebAssembly, Edge Computing, and AI integration.', '2025-09-15 09:00:00+00', '2025-09-15 10:30:00+00', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 500, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Workshop: Rust for Beginners', 'Learn the fundamentals of Rust programming language. Perfect for developers new to systems programming.', '2025-09-15 11:00:00+00', '2025-09-15 13:00:00+00', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 50, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
('f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'Live Coding Session', 'Watch Alice build a real-time application from scratch using Next.js and WebSockets.', '2025-09-15 14:00:00+00', '2025-09-15 15:30:00+00', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 100, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
('f3eebc99-9c0b-4ef8-bb6d-6bb9bd380a24', 'Panel: Cloud Native', 'Experts discuss the state of cloud-native development, Kubernetes, and serverless architectures.', '2025-09-16 10:00:00+00', '2025-09-16 11:30:00+00', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 150, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
('f4eebc99-9c0b-4ef8-bb6d-6bb9bd380a25', 'AI in Production', 'Real-world case studies of AI/ML models in production environments.', '2025-09-16 13:00:00+00', '2025-09-16 14:30:00+00', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 75, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a26', 'Building Design Systems', 'Learn how to create and maintain scalable design systems for large applications.', '2025-09-17 09:00:00+00', '2025-09-17 10:30:00+00', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 80, '11111111-1111-1111-1111-111111111111', NOW(), NOW());

-- ==================== SESSION SPEAKERS (Junction Table) ====================
INSERT INTO session_speaker ("sessionId", "speakerId", created_at) VALUES
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', NOW()),
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', NOW()),
('f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', NOW()),
('f3eebc99-9c0b-4ef8-bb6d-6bb9bd380a24', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', NOW()),
('f3eebc99-9c0b-4ef8-bb6d-6bb9bd380a24', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', NOW()),
('f4eebc99-9c0b-4ef8-bb6d-6bb9bd380a25', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', NOW()),
('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a26', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW());

-- ==================== QUESTIONS ====================
INSERT INTO question (id, content, author_name, upvotes, "sessionId", created_at) VALUES
('f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a27', 'Will the keynote be recorded for later viewing?', 'Tech Enthusiast', 15, 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', '2025-09-14 10:00:00+00'),
('f7eebc99-9c0b-4ef8-bb6d-6bb9bd380a28', 'Do we need prior Rust experience for the workshop?', 'Curious Dev', 8, 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-09-14 11:30:00+00'),
('f8eebc99-9c0b-4ef8-bb6d-6bb9bd380a29', 'Will there be hands-on exercises in the AI session?', 'ML Learner', 12, 'f4eebc99-9c0b-4ef8-bb6d-6bb9bd380a25', '2025-09-14 14:00:00+00'),
('f9eebc99-9c0b-4ef8-bb6d-6bb9bd380a30', 'What tools do we need to bring?', 'Workshop Attendee', 5, 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-09-14 15:30:00+00'),
('faaebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'Is there a limit to how many questions we can ask?', 'Audience Member', 3, 'f3eebc99-9c0b-4ef8-bb6d-6bb9bd380a24', '2025-09-15 09:00:00+00');