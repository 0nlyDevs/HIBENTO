<div align="center">

<div style="display: flex; flex-direction: row; align-items: center; gap: 1rem; margin-bottom: 1rem;">
  <img src="https://raw.githubusercontent.com/0nlyDevs/HIBENTO/main/public/images/brand/logo.svg" alt="HiBento Logo" width="80" height="80"/>
  <div>
    <h1 style="margin: 0;">HiBento</h1>
  </div>
</div>

<p>A modern event experience platform with real-time sessions, speaker profiles, and interactive Q&A</p>

<div align="center" style="margin-bottom: 1rem; margin-top: 1rem;">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white">
  <img src="https://img.shields.io/badge/Prisma-0C344B?style=for-the-badge&logo=prisma&logoColor=white">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white">
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white">
  <img src="https://img.shields.io/badge/shadcn/UI-000000?style=for-the-badge&logo=react&logoColor=white">
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">
</div>

</div>

## What is HiBento?

HiBento is a modern event platform that brings schedules, speakers, and Q&A into one seamless experience. Like a Japanese bento box, it helps you organize your day with a variety of sessions.

## Features

| Feature              | Description                                                                 | Technology               |
| :------------------- | :-------------------------------------------------------------------------- | :----------------------- |
| **Event Management** | Browse and discover live and upcoming events with rich detail pages         | Next.js App Router       |
| **Session Schedule** | Multi-track session listings with speaker info, time slots, and live status | Prisma + PostgreSQL      |
| **Speaker Profiles** | Dedicated speaker pages with bios, external links, and session lists        | Server Components        |
| **Live Q&A**         | Real-time question submission and upvoting during sessions                  | API Routes               |
| **Favorites**        | Bookmark events and sessions for quick access                               | LocalStorage             |
| **Video Streaming**  | Embedded video player with live indicator and fullscreen controls           | Tailwind + Framer Motion |
| **Responsive Nav**   | Adaptive navigation with glassmorphism and mobile burger menu               | Framer Motion + Tailwind |

## Quick Start

### Installation

1. **Clone with love**

   ```bash
   git clone https://github.com/yourusername/hibento.git
   cd hibento
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env.local
   # Fill in your environment variables
   ```

4. **Generate Prisma client & push schema**

   ```bash
   npx prisma generate && npx prisma db push
   ```

5. **Start creating magic**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) and watch the magic unfold!

## Scripts Guide

| Script Command  | Purpose                                   | When to Use                       |
| :-------------- | :---------------------------------------- | :-------------------------------- |
| `npm run dev`   | Development server with Prisma generation | Daily development with hot reload |
| `npm run build` | Production build with Prisma generation   | Before deployment to Vercel       |
| `npm run start` | Start production server                   | After build to run optimized app  |

## App Preview

<div align="center">

![App Preview](https://i.ibb.co/PZ9Lp5Cp/Screenshot-From-2026-06-27-11-27-56.png)

</div>
