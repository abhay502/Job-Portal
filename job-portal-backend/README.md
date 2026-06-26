# Job Portal - Backend API

RESTful API for the Job Portal Management System built with Node.js, Express, Prisma, and PostgreSQL.

## Tech Stack
- Node.js + Express.js
- Prisma ORM (v5)
- PostgreSQL
- JWT (Access + Refresh tokens)
- bcryptjs

## Setup Instructions

### 1. Install dependencies
npm install

### 2. Create environment file
Create a `.env` file:
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/jobportal"
JWT_ACCESS_SECRET=your_super_secret_access_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173

### 3. Run database migrations
npx prisma migrate dev --name init

### 4. Seed the database
npm run seed

### 5. Start development server
npm run dev

API runs on: http://localhost:5000

## Seed Credentials
- Admin: admin@jobportal.com / admin123
- User:  user@jobportal.com / user123

## API Endpoints

### Auth
POST /api/auth/user/register
POST /api/auth/user/login
POST /api/auth/admin/login
POST /api/auth/refresh-token
POST /api/auth/logout

### Jobs
GET    /api/jobs
GET    /api/jobs/:id
POST   /api/jobs         (admin only)
PUT    /api/jobs/:id     (admin only)
DELETE /api/jobs/:id     (admin only)

### Applications
POST /api/applications/jobs/:id/apply  (user only)
GET  /api/applications/me              (user only)
GET  /api/applications                 (admin only)