import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ──────────────────────────────────────────────
  // 1. Clean existing data (reverse FK order)
  // ──────────────────────────────────────────────
  console.log("  Cleaning existing data...");
  await prisma.question.deleteMany();
  await prisma.sessionRegistration.deleteMany();
  await prisma.eventSessionSpeaker.deleteMany();
  await prisma.eventSession.deleteMany();
  await prisma.speakerExternalLink.deleteMany();
  await prisma.speaker.deleteMany();
  await prisma.room.deleteMany();
  await prisma.event.deleteMany();
  await prisma.venue.deleteMany();

  // ──────────────────────────────────────────────
  // 2. Venues
  // ──────────────────────────────────────────────
  console.log("  Creating venues...");
  const venues = await Promise.all([
    prisma.venue.create({
      data: {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "HEI",
        city: "Antananarivo",
        neighborhood: "Ivandry",
        totalRooms: 4,
      },
    }),
    prisma.venue.create({
      data: {
        id: "550e8400-e29b-41d4-a716-446655440002",
        name: "Convention Center",
        city: "Antananarivo",
        neighborhood: "Anjanahary",
        totalRooms: 3,
      },
    }),
    prisma.venue.create({
      data: {
        id: "550e8400-e29b-41d4-a716-446655440003",
        name: "Digital Lab",
        city: "Antsirabe",
        neighborhood: "Centre",
        totalRooms: 2,
      },
    }),
    prisma.venue.create({
      data: {
        id: "550e8400-e29b-41d4-a716-446655440004",
        name: "University Center",
        city: "Fianarantsoa",
        neighborhood: "Tanambao",
        totalRooms: 3,
      },
    }),
    prisma.venue.create({
      data: {
        id: "550e8400-e29b-41d4-a716-446655440005",
        name: "Tech Hub",
        city: "Toamasina",
        neighborhood: "Port",
        totalRooms: 2,
      },
    }),
  ]);
  console.log(`    Created ${venues.length} venues`);

  // ──────────────────────────────────────────────
  // 3. Events
  // ──────────────────────────────────────────────
  console.log("  Creating events...");
  const events = await Promise.all([
    prisma.event.create({
      data: {
        id: "660e8400-e29b-41d4-a716-446655440001",
        title: "DevFest Antananarivo 2024",
        description:
          "Annual developer festival with workshops and talks about web, mobile, and cloud technologies.",
        venueId: "550e8400-e29b-41d4-a716-446655440001",
        isOnline: false,
        startDate: new Date("2024-11-15T08:00:00Z"),
        endDate: new Date("2024-11-16T18:00:00Z"),
      },
    }),
    prisma.event.create({
      data: {
        id: "660e8400-e29b-41d4-a716-446655440002",
        title: "Tech Innovation Summit 2026",
        description:
          "Ongoing summit about AI, blockchain, and digital transformation in Madagascar.",
        venueId: "550e8400-e29b-41d4-a716-446655440002",
        isOnline: false,
        startDate: new Date("2026-05-19T09:00:00Z"),
        endDate: new Date("2026-05-22T17:00:00Z"),
      },
    }),
    prisma.event.create({
      data: {
        id: "660e8400-e29b-41d4-a716-446655440003",
        title: "Startup Weekend Antsirabe",
        description:
          "54-hour weekend event to pitch ideas, form teams, and launch startups.",
        venueId: "550e8400-e29b-41d4-a716-446655440003",
        isOnline: false,
        startDate: new Date("2026-07-10T18:00:00Z"),
        endDate: new Date("2026-07-12T20:00:00Z"),
      },
    }),
    prisma.event.create({
      data: {
        id: "660e8400-e29b-41d4-a716-446655440004",
        title: "AI Conference Fianarantsoa",
        description:
          "Exploring artificial intelligence applications in education and healthcare.",
        venueId: "550e8400-e29b-41d4-a716-446655440004",
        isOnline: false,
        startDate: new Date("2026-08-20T09:00:00Z"),
        endDate: new Date("2026-08-21T18:00:00Z"),
      },
    }),
    prisma.event.create({
      data: {
        id: "660e8400-e29b-41d4-a716-446655440005",
        title: "Mobile Dev Workshop Toamasina",
        description:
          "Hands-on workshop for Flutter and React Native development.",
        venueId: "550e8400-e29b-41d4-a716-446655440005",
        isOnline: false,
        startDate: new Date("2026-09-05T10:00:00Z"),
        endDate: new Date("2026-09-05T17:00:00Z"),
      },
    }),
    prisma.event.create({
      data: {
        id: "660e8400-e29b-41d4-a716-446655440006",
        title: "Cloud & DevOps Day",
        description:
          "Full day dedicated to cloud infrastructure and DevOps practices.",
        venueId: "550e8400-e29b-41d4-a716-446655440001",
        isOnline: false,
        startDate: new Date("2026-10-15T09:00:00Z"),
        endDate: new Date("2026-10-15T18:00:00Z"),
      },
    }),
    prisma.event.create({
      data: {
        id: "660e8400-e29b-41d4-a716-446655440007",
        title: "Global Web Development Summit",
        description:
          "International online summit covering the latest in web technologies.",
        venueId: null,
        isOnline: true,
        startDate: new Date("2026-05-20T08:00:00Z"),
        endDate: new Date("2026-05-22T18:00:00Z"),
      },
    }),
  ]);
  console.log(`    Created ${events.length} events`);

  // ──────────────────────────────────────────────
  // 4. Rooms
  // ──────────────────────────────────────────────
  console.log("  Creating rooms...");
  const rooms = await Promise.all([
    prisma.room.create({
      data: {
        id: "770e8400-e29b-41d4-a716-446655440001",
        venueId: "550e8400-e29b-41d4-a716-446655440001",
        name: "Grand Amphithéâtre",
        capacity: 300,
      },
    }),
    prisma.room.create({
      data: {
        id: "770e8400-e29b-41d4-a716-446655440002",
        venueId: "550e8400-e29b-41d4-a716-446655440001",
        name: "Salle NP",
        capacity: 80,
      },
    }),
    prisma.room.create({
      data: {
        id: "770e8400-e29b-41d4-a716-446655440003",
        venueId: "550e8400-e29b-41d4-a716-446655440001",
        name: "Labo Informatique",
        capacity: 40,
      },
    }),
    prisma.room.create({
      data: {
        id: "770e8400-e29b-41d4-a716-446655440004",
        venueId: "550e8400-e29b-41d4-a716-446655440001",
        name: "Salle Pi",
        capacity: 50,
      },
    }),
    prisma.room.create({
      data: {
        id: "770e8400-e29b-41d4-a716-446655440005",
        venueId: "550e8400-e29b-41d4-a716-446655440002",
        name: "Grand Hall",
        capacity: 500,
      },
    }),
    prisma.room.create({
      data: {
        id: "770e8400-e29b-41d4-a716-446655440006",
        venueId: "550e8400-e29b-41d4-a716-446655440002",
        name: "Salle Ravinala",
        capacity: 150,
      },
    }),
    prisma.room.create({
      data: {
        id: "770e8400-e29b-41d4-a716-446655440007",
        venueId: "550e8400-e29b-41d4-a716-446655440002",
        name: "Espace Workshop",
        capacity: 60,
      },
    }),
    prisma.room.create({
      data: {
        id: "770e8400-e29b-41d4-a716-446655440008",
        venueId: "550e8400-e29b-41d4-a716-446655440003",
        name: "Main Room",
        capacity: 100,
      },
    }),
    prisma.room.create({
      data: {
        id: "770e8400-e29b-41d4-a716-446655440009",
        venueId: "550e8400-e29b-41d4-a716-446655440003",
        name: "Training Room",
        capacity: 30,
      },
    }),
    prisma.room.create({
      data: {
        id: "770e8400-e29b-41d4-a716-446655440010",
        venueId: "550e8400-e29b-41d4-a716-446655440004",
        name: "Amphi Principal",
        capacity: 250,
      },
    }),
    prisma.room.create({
      data: {
        id: "770e8400-e29b-41d4-a716-446655440011",
        venueId: "550e8400-e29b-41d4-a716-446655440004",
        name: "Salle 101",
        capacity: 60,
      },
    }),
    prisma.room.create({
      data: {
        id: "770e8400-e29b-41d4-a716-446655440012",
        venueId: "550e8400-e29b-41d4-a716-446655440004",
        name: "Salle 102",
        capacity: 60,
      },
    }),
    prisma.room.create({
      data: {
        id: "770e8400-e29b-41d4-a716-446655440013",
        venueId: "550e8400-e29b-41d4-a716-446655440005",
        name: "Salle Principale",
        capacity: 120,
      },
    }),
    prisma.room.create({
      data: {
        id: "770e8400-e29b-41d4-a716-446655440014",
        venueId: "550e8400-e29b-41d4-a716-446655440005",
        name: "Co-working Space",
        capacity: 40,
      },
    }),
  ]);
  console.log(`    Created ${rooms.length} rooms`);

  // ──────────────────────────────────────────────
  // 5. Speakers
  // ──────────────────────────────────────────────
  console.log("  Creating speakers...");
  const speakers = await Promise.all([
    prisma.speaker.create({
      data: {
        id: "880e8400-e29b-41d4-a716-446655440001",
        name: "Rija Rakoto",
        avatarUrl: "https://i.pravatar.cc/300?u=rija",
        bio: "Full-stack developer with 12 years experience.",
      },
    }),
    prisma.speaker.create({
      data: {
        id: "880e8400-e29b-41d4-a716-446655440002",
        name: "Miora Rasoanaivo",
        avatarUrl: "https://i.pravatar.cc/300?u=miora",
        bio: "Cloud architect at NovaTech.",
      },
    }),
    prisma.speaker.create({
      data: {
        id: "880e8400-e29b-41d4-a716-446655440003",
        name: "Lova Andrian",
        avatarUrl: "https://i.pravatar.cc/300?u=lova",
        bio: "AI researcher specializing in agricultural applications.",
      },
    }),
    prisma.speaker.create({
      data: {
        id: "880e8400-e29b-41d4-a716-446655440004",
        name: "Tiana Randria",
        avatarUrl: "https://i.pravatar.cc/300?u=tiana",
        bio: "Serial entrepreneur and product management expert.",
      },
    }),
    prisma.speaker.create({
      data: {
        id: "880e8400-e29b-41d4-a716-446655440005",
        name: "Haja Rasolofo",
        avatarUrl: "https://i.pravatar.cc/300?u=haja",
        bio: "Tech lead and content creator.",
      },
    }),
  ]);
  console.log(`    Created ${speakers.length} speakers`);

  // ──────────────────────────────────────────────
  // 6. Speaker External Links
  // ──────────────────────────────────────────────
  console.log("  Creating speaker external links...");
  const speakerLinks = await Promise.all([
    prisma.speakerExternalLink.create({
      data: {
        id: "990e8400-e29b-41d4-a716-446655440001",
        speakerId: "880e8400-e29b-41d4-a716-446655440001",
        linkType: "TWITTER",
        url: "https://twitter.com/rijarakoto",
      },
    }),
    prisma.speakerExternalLink.create({
      data: {
        id: "990e8400-e29b-41d4-a716-446655440002",
        speakerId: "880e8400-e29b-41d4-a716-446655440001",
        linkType: "GITHUB",
        url: "https://github.com/rijarakoto",
      },
    }),
    prisma.speakerExternalLink.create({
      data: {
        id: "990e8400-e29b-41d4-a716-446655440003",
        speakerId: "880e8400-e29b-41d4-a716-446655440002",
        linkType: "LINKEDIN",
        url: "https://linkedin.com/in/miora",
      },
    }),
    prisma.speakerExternalLink.create({
      data: {
        id: "990e8400-e29b-41d4-a716-446655440004",
        speakerId: "880e8400-e29b-41d4-a716-446655440003",
        linkType: "TWITTER",
        url: "https://twitter.com/lovaai",
      },
    }),
    prisma.speakerExternalLink.create({
      data: {
        id: "990e8400-e29b-41d4-a716-446655440005",
        speakerId: "880e8400-e29b-41d4-a716-446655440004",
        linkType: "LINKEDIN",
        url: "https://linkedin.com/in/tiana",
      },
    }),
    prisma.speakerExternalLink.create({
      data: {
        id: "990e8400-e29b-41d4-a716-446655440006",
        speakerId: "880e8400-e29b-41d4-a716-446655440005",
        linkType: "OTHER",
        url: "https://youtube.com/@hajatech",
      },
    }),
  ]);
  console.log(`    Created ${speakerLinks.length} speaker links`);

  // ──────────────────────────────────────────────
  // 7. Event Sessions
  // ──────────────────────────────────────────────
  console.log("  Creating event sessions...");
  const sessionData = [
    {
      id: "aa0e8400-e29b-41d4-a716-446655440001",
      eventId: "660e8400-e29b-41d4-a716-446655440001",
      roomId: "770e8400-e29b-41d4-a716-446655440001",
      title: "Keynote: Web Development Trends",
      description: "Overview of the latest trends in web development for 2024.",
      startTime: new Date("2024-11-15T09:00:00Z"),
      endTime: new Date("2024-11-15T10:30:00Z"),
      capacity: 300,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440002",
      eventId: "660e8400-e29b-41d4-a716-446655440001",
      roomId: "770e8400-e29b-41d4-a716-446655440003",
      title: "Workshop: React Hooks Deep Dive",
      description: "Advanced React patterns with hooks.",
      startTime: new Date("2024-11-15T11:00:00Z"),
      endTime: new Date("2024-11-15T13:00:00Z"),
      capacity: 40,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440003",
      eventId: "660e8400-e29b-41d4-a716-446655440001",
      roomId: "770e8400-e29b-41d4-a716-446655440002",
      title: "Cloud Migration Strategies",
      description: "How to migrate legacy apps to the cloud.",
      startTime: new Date("2024-11-15T14:00:00Z"),
      endTime: new Date("2024-11-15T15:30:00Z"),
      capacity: 80,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440004",
      eventId: "660e8400-e29b-41d4-a716-446655440001",
      roomId: "770e8400-e29b-41d4-a716-446655440004",
      title: "Networking Session",
      description: "Meet fellow developers and share experiences.",
      startTime: new Date("2024-11-15T16:00:00Z"),
      endTime: new Date("2024-11-15T18:00:00Z"),
      capacity: 50,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440005",
      eventId: "660e8400-e29b-41d4-a716-446655440001",
      roomId: "770e8400-e29b-41d4-a716-446655440001",
      title: "AI for Beginners",
      description: "Introduction to AI concepts and tools.",
      startTime: new Date("2024-11-16T09:00:00Z"),
      endTime: new Date("2024-11-16T12:00:00Z"),
      capacity: 300,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440006",
      eventId: "660e8400-e29b-41d4-a716-446655440001",
      roomId: "770e8400-e29b-41d4-a716-446655440001",
      title: "Closing Panel",
      description: "Discussion on the future of tech in Madagascar.",
      startTime: new Date("2024-11-16T14:00:00Z"),
      endTime: new Date("2024-11-16T17:00:00Z"),
      capacity: 300,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440007",
      eventId: "660e8400-e29b-41d4-a716-446655440002",
      roomId: "770e8400-e29b-41d4-a716-446655440005",
      title: "Opening Ceremony",
      description: "Welcome and introduction to the summit.",
      startTime: new Date("2026-05-19T09:00:00Z"),
      endTime: new Date("2026-05-19T10:00:00Z"),
      capacity: 500,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440008",
      eventId: "660e8400-e29b-41d4-a716-446655440002",
      roomId: "770e8400-e29b-41d4-a716-446655440005",
      title: "AI in Healthcare",
      description: "How AI is transforming healthcare in Africa.",
      startTime: new Date("2026-05-19T10:30:00Z"),
      endTime: new Date("2026-05-19T12:00:00Z"),
      capacity: 500,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440009",
      eventId: "660e8400-e29b-41d4-a716-446655440002",
      roomId: "770e8400-e29b-41d4-a716-446655440007",
      title: "Blockchain Workshop",
      description: "Hands-on blockchain development.",
      startTime: new Date("2026-05-19T14:00:00Z"),
      endTime: new Date("2026-05-19T17:00:00Z"),
      capacity: 60,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440010",
      eventId: "660e8400-e29b-41d4-a716-446655440002",
      roomId: "770e8400-e29b-41d4-a716-446655440005",
      title: "Digital Transformation Panel",
      description: "Panel discussion on digital transformation strategies.",
      startTime: new Date("2026-05-20T09:00:00Z"),
      endTime: new Date("2026-05-20T11:00:00Z"),
      capacity: 500,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440011",
      eventId: "660e8400-e29b-41d4-a716-446655440002",
      roomId: "770e8400-e29b-41d4-a716-446655440006",
      title: "Startup Pitch Competition",
      description: "Local startups pitch their ideas.",
      startTime: new Date("2026-05-20T11:30:00Z"),
      endTime: new Date("2026-05-20T13:30:00Z"),
      capacity: 150,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440012",
      eventId: "660e8400-e29b-41d4-a716-446655440002",
      roomId: "770e8400-e29b-41d4-a716-446655440005",
      title: "Cybersecurity Essentials",
      description: "Protecting your digital assets.",
      startTime: new Date("2026-05-21T09:00:00Z"),
      endTime: new Date("2026-05-21T11:00:00Z"),
      capacity: 500,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440013",
      eventId: "660e8400-e29b-41d4-a716-446655440002",
      roomId: "770e8400-e29b-41d4-a716-446655440005",
      title: "Closing & Awards",
      description: "Summit closing ceremony and awards.",
      startTime: new Date("2026-05-22T15:00:00Z"),
      endTime: new Date("2026-05-22T17:00:00Z"),
      capacity: 500,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440014",
      eventId: "660e8400-e29b-41d4-a716-446655440003",
      roomId: "770e8400-e29b-41d4-a716-446655440008",
      title: "Pitch Workshop",
      description: "Learn how to pitch your startup idea.",
      startTime: new Date("2026-07-10T18:00:00Z"),
      endTime: new Date("2026-07-10T20:00:00Z"),
      capacity: 100,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440015",
      eventId: "660e8400-e29b-41d4-a716-446655440003",
      roomId: "770e8400-e29b-41d4-a716-446655440008",
      title: "Team Formation",
      description: "Form teams and start brainstorming.",
      startTime: new Date("2026-07-10T20:00:00Z"),
      endTime: new Date("2026-07-10T22:00:00Z"),
      capacity: 100,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440016",
      eventId: "660e8400-e29b-41d4-a716-446655440003",
      roomId: "770e8400-e29b-41d4-a716-446655440009",
      title: "Mentoring Sessions",
      description: "Get advice from experienced mentors.",
      startTime: new Date("2026-07-11T09:00:00Z"),
      endTime: new Date("2026-07-11T18:00:00Z"),
      capacity: 30,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440017",
      eventId: "660e8400-e29b-41d4-a716-446655440003",
      roomId: "770e8400-e29b-41d4-a716-446655440008",
      title: "Final Presentations",
      description: "Teams present their projects.",
      startTime: new Date("2026-07-12T14:00:00Z"),
      endTime: new Date("2026-07-12T18:00:00Z"),
      capacity: 100,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440018",
      eventId: "660e8400-e29b-41d4-a716-446655440004",
      roomId: "770e8400-e29b-41d4-a716-446655440010",
      title: "Machine Learning Fundamentals",
      description: "Introduction to ML algorithms and tools.",
      startTime: new Date("2026-08-20T09:00:00Z"),
      endTime: new Date("2026-08-20T12:00:00Z"),
      capacity: 250,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440019",
      eventId: "660e8400-e29b-41d4-a716-446655440004",
      roomId: "770e8400-e29b-41d4-a716-446655440011",
      title: "Deep Learning Workshop",
      description: "Practical deep learning with TensorFlow.",
      startTime: new Date("2026-08-20T14:00:00Z"),
      endTime: new Date("2026-08-20T17:00:00Z"),
      capacity: 60,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440020",
      eventId: "660e8400-e29b-41d4-a716-446655440004",
      roomId: "770e8400-e29b-41d4-a716-446655440010",
      title: "AI Ethics Panel",
      description: "Discussion on ethical AI development.",
      startTime: new Date("2026-08-21T09:00:00Z"),
      endTime: new Date("2026-08-21T11:00:00Z"),
      capacity: 250,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440021",
      eventId: "660e8400-e29b-41d4-a716-446655440004",
      roomId: "770e8400-e29b-41d4-a716-446655440012",
      title: "NLP Applications",
      description: "Natural Language Processing use cases.",
      startTime: new Date("2026-08-21T14:00:00Z"),
      endTime: new Date("2026-08-21T17:00:00Z"),
      capacity: 60,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440022",
      eventId: "660e8400-e29b-41d4-a716-446655440005",
      roomId: "770e8400-e29b-41d4-a716-446655440013",
      title: "Flutter Basics",
      description: "Getting started with Flutter development.",
      startTime: new Date("2026-09-05T10:00:00Z"),
      endTime: new Date("2026-09-05T13:00:00Z"),
      capacity: 120,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440023",
      eventId: "660e8400-e29b-41d4-a716-446655440005",
      roomId: "770e8400-e29b-41d4-a716-446655440014",
      title: "React Native Advanced",
      description: "Advanced patterns in React Native.",
      startTime: new Date("2026-09-05T14:00:00Z"),
      endTime: new Date("2026-09-05T17:00:00Z"),
      capacity: 40,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440024",
      eventId: "660e8400-e29b-41d4-a716-446655440006",
      roomId: "770e8400-e29b-41d4-a716-446655440003",
      title: "Docker & Kubernetes 101",
      description: "Container orchestration fundamentals.",
      startTime: new Date("2026-10-15T09:00:00Z"),
      endTime: new Date("2026-10-15T12:00:00Z"),
      capacity: 40,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440025",
      eventId: "660e8400-e29b-41d4-a716-446655440006",
      roomId: "770e8400-e29b-41d4-a716-446655440003",
      title: "CI/CD Pipeline Workshop",
      description: "Build automated deployment pipelines.",
      startTime: new Date("2026-10-15T14:00:00Z"),
      endTime: new Date("2026-10-15T17:00:00Z"),
      capacity: 40,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440026",
      eventId: "660e8400-e29b-41d4-a716-446655440006",
      roomId: "770e8400-e29b-41d4-a716-446655440001",
      title: "AWS Best Practices",
      description: "Optimize your cloud infrastructure.",
      startTime: new Date("2026-10-15T14:00:00Z"),
      endTime: new Date("2026-10-15T16:00:00Z"),
      capacity: 300,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440027",
      eventId: "660e8400-e29b-41d4-a716-446655440007",
      roomId: null,
      title: "Keynote: The State of Web 2026",
      description: "Live stream keynote covering the latest web platform features.",
      startTime: new Date("2026-05-20T09:00:00Z"),
      endTime: new Date("2026-05-20T10:30:00Z"),
      capacity: null,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440028",
      eventId: "660e8400-e29b-41d4-a716-446655440007",
      roomId: null,
      title: "Workshop: Web Components in Production",
      description: "Build reusable components with the native web platform.",
      startTime: new Date("2026-05-20T11:00:00Z"),
      endTime: new Date("2026-05-20T13:00:00Z"),
      capacity: null,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440029",
      eventId: "660e8400-e29b-41d4-a716-446655440007",
      roomId: null,
      title: "Panel: The Future of JavaScript",
      description: "Experts discuss where JavaScript is heading.",
      startTime: new Date("2026-05-21T09:00:00Z"),
      endTime: new Date("2026-05-21T10:30:00Z"),
      capacity: null,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440030",
      eventId: "660e8400-e29b-41d4-a716-446655440007",
      roomId: null,
      title: "Building Accessible Web Apps",
      description: "Practical guide to web accessibility.",
      startTime: new Date("2026-05-21T14:00:00Z"),
      endTime: new Date("2026-05-21T16:00:00Z"),
      capacity: null,
    },
    {
      id: "aa0e8400-e29b-41d4-a716-446655440031",
      eventId: "660e8400-e29b-41d4-a716-446655440007",
      roomId: null,
      title: "Closing: What is Next for the Web",
      description: "Closing keynote and community announcements.",
      startTime: new Date("2026-05-22T16:00:00Z"),
      endTime: new Date("2026-05-22T18:00:00Z"),
      capacity: null,
    },
  ];
  const sessions = await Promise.all(
    sessionData.map((s) => prisma.eventSession.create({ data: s }))
  );
  console.log(`    Created ${sessions.length} event sessions`);

  // ──────────────────────────────────────────────
  // 8. Event Session Speakers (many-to-many)
  // ──────────────────────────────────────────────
  console.log("  Creating event-session-speaker relations...");
  const sessionSpeakerPairs = [
    { eventSessionId: "aa0e8400-e29b-41d4-a716-446655440001", speakerId: "880e8400-e29b-41d4-a716-446655440001" },
    { eventSessionId: "aa0e8400-e29b-41d4-a716-446655440002", speakerId: "880e8400-e29b-41d4-a716-446655440001" },
    { eventSessionId: "aa0e8400-e29b-41d4-a716-446655440003", speakerId: "880e8400-e29b-41d4-a716-446655440002" },
    { eventSessionId: "aa0e8400-e29b-41d4-a716-446655440005", speakerId: "880e8400-e29b-41d4-a716-446655440003" },
    { eventSessionId: "aa0e8400-e29b-41d4-a716-446655440006", speakerId: "880e8400-e29b-41d4-a716-446655440004" },
    { eventSessionId: "aa0e8400-e29b-41d4-a716-446655440006", speakerId: "880e8400-e29b-41d4-a716-446655440005" },
    { eventSessionId: "aa0e8400-e29b-41d4-a716-446655440007", speakerId: "880e8400-e29b-41d4-a716-446655440004" },
    { eventSessionId: "aa0e8400-e29b-41d4-a716-446655440008", speakerId: "880e8400-e29b-41d4-a716-446655440003" },
    { eventSessionId: "aa0e8400-e29b-41d4-a716-446655440009", speakerId: "880e8400-e29b-41d4-a716-446655440005" },
    { eventSessionId: "aa0e8400-e29b-41d4-a716-446655440010", speakerId: "880e8400-e29b-41d4-a716-446655440002" },
    { eventSessionId: "aa0e8400-e29b-41d4-a716-446655440011", speakerId: "880e8400-e29b-41d4-a716-446655440004" },
    { eventSessionId: "aa0e8400-e29b-41d4-a716-446655440014", speakerId: "880e8400-e29b-41d4-a716-446655440004" },
    { eventSessionId: "aa0e8400-e29b-41d4-a716-446655440018", speakerId: "880e8400-e29b-41d4-a716-446655440003" },
    { eventSessionId: "aa0e8400-e29b-41d4-a716-446655440019", speakerId: "880e8400-e29b-41d4-a716-446655440003" },
    { eventSessionId: "aa0e8400-e29b-41d4-a716-446655440024", speakerId: "880e8400-e29b-41d4-a716-446655440002" },
    { eventSessionId: "aa0e8400-e29b-41d4-a716-446655440025", speakerId: "880e8400-e29b-41d4-a716-446655440002" },
    { eventSessionId: "aa0e8400-e29b-41d4-a716-446655440026", speakerId: "880e8400-e29b-41d4-a716-446655440002" },
    { eventSessionId: "aa0e8400-e29b-41d4-a716-446655440027", speakerId: "880e8400-e29b-41d4-a716-446655440001" },
    { eventSessionId: "aa0e8400-e29b-41d4-a716-446655440028", speakerId: "880e8400-e29b-41d4-a716-446655440001" },
    { eventSessionId: "aa0e8400-e29b-41d4-a716-446655440029", speakerId: "880e8400-e29b-41d4-a716-446655440004" },
    { eventSessionId: "aa0e8400-e29b-41d4-a716-446655440029", speakerId: "880e8400-e29b-41d4-a716-446655440005" },
    { eventSessionId: "aa0e8400-e29b-41d4-a716-446655440030", speakerId: "880e8400-e29b-41d4-a716-446655440005" },
    { eventSessionId: "aa0e8400-e29b-41d4-a716-446655440031", speakerId: "880e8400-e29b-41d4-a716-446655440001" },
  ];
  const ess = await Promise.all(
    sessionSpeakerPairs.map((pair) =>
      prisma.eventSessionSpeaker.create({ data: pair })
    )
  );
  console.log(`    Created ${ess.length} session-speaker relations`);

  // ──────────────────────────────────────────────
  // 9. Questions
  // ──────────────────────────────────────────────
  console.log("  Creating questions...");
  const questions = await Promise.all([
    prisma.question.create({
      data: {
        id: "bb0e8400-e29b-41d4-a716-446655440001",
        eventSessionId: "aa0e8400-e29b-41d4-a716-446655440002",
        content: "What are the prerequisites for the React workshop?",
        authorName: "Alice",
        upvotes: 12,
      },
    }),
    prisma.question.create({
      data: {
        id: "bb0e8400-e29b-41d4-a716-446655440002",
        eventSessionId: "aa0e8400-e29b-41d4-a716-446655440001",
        content: "Will the slides be available after the keynote?",
        authorName: "Bob",
        upvotes: 8,
      },
    }),
    prisma.question.create({
      data: {
        id: "bb0e8400-e29b-41d4-a716-446655440003",
        eventSessionId: "aa0e8400-e29b-41d4-a716-446655440005",
        content: "Can you recommend resources for learning AI?",
        authorName: "Charlie",
        upvotes: 15,
      },
    }),
    prisma.question.create({
      data: {
        id: "bb0e8400-e29b-41d4-a716-446655440004",
        eventSessionId: "aa0e8400-e29b-41d4-a716-446655440009",
        content: "How does blockchain apply to Madagascar?",
        authorName: "Diana",
        upvotes: 5,
      },
    }),
    prisma.question.create({
      data: {
        id: "bb0e8400-e29b-41d4-a716-446655440005",
        eventSessionId: "aa0e8400-e29b-41d4-a716-446655440010",
        content: "What tools do you use for digital transformation?",
        authorName: "Anonymous",
        upvotes: 3,
      },
    }),
    prisma.question.create({
      data: {
        id: "bb0e8400-e29b-41d4-a716-446655440006",
        eventSessionId: "aa0e8400-e29b-41d4-a716-446655440011",
        content: "Is there funding available for startups?",
        authorName: "Eric",
        upvotes: 10,
      },
    }),
    prisma.question.create({
      data: {
        id: "bb0e8400-e29b-41d4-a716-446655440007",
        eventSessionId: "aa0e8400-e29b-41d4-a716-446655440024",
        content: "Can we access the workshop materials online?",
        authorName: "Faly",
        upvotes: 7,
      },
    }),
  ]);
  console.log(`    Created ${questions.length} questions`);

  // ──────────────────────────────────────────────
  // 10. Update venue total_rooms to match actual room counts
  // ──────────────────────────────────────────────
  console.log("  Updating venue total_rooms...");
  const venuesWithCounts = await Promise.all(
    venues.map(async (venue) => {
      const count = await prisma.room.count({
        where: { venueId: venue.id },
      });
      await prisma.venue.update({
        where: { id: venue.id },
        data: { totalRooms: count },
      });
      return { name: venue.name, totalRooms: count };
    })
  );
  venuesWithCounts.forEach((v) =>
    console.log(`    ${v.name}: ${v.totalRooms} rooms`)
  );

  console.log("✅ Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
