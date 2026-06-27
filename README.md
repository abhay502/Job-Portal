# Job Portal - Full Stack Application

A complete Job Portal Management System with separate Admin and User portals, built with React.js, Node.js, Prisma, and PostgreSQL.

## Live Demo Credentials
- **Admin:** admin@jobportal.com / admin123
- **User:** user@jobportal.com / user123

## 🛠 Tech Stack

### Frontend
- React.js + Vite
- Redux Toolkit
- Material UI
- React Router DOM
- Axios

### Backend
- Node.js + Express.js
- Prisma ORM (v5)
- PostgreSQL (Neon Cloud)
- JWT Authentication (Access + Refresh tokens)
- bcryptjs

## Project Structure

Job-Portal/

├── job-portal-frontend/   # React frontend

└── job-portal-backend/    # Node.js backend

##  Setup Instructions

### Backend
```bash
cd job-portal-backend
npm install

# Create .env file (see .env.example)
# Add your DATABASE_URL and JWT secrets

npx prisma generate
npx prisma migrate deploy
npm run seed
npm run dev
```

### Frontend
```bash
cd job-portal-frontend
npm install

# Create .env file (see .env.example)
# VITE_API_BASE_URL=http://localhost:5000/api

npm run dev
```

##  Features

### Admin Portal (/admin)
- JWT login with access & refresh tokens
- Dashboard with job statistics
- Create / Edit / Delete job postings
- Filter by category, experience, status
- Pagination

### User Portal
- Landing page with featured jobs & categories
- Advanced job listing with filters & salary range
- Job details page
- User registration & login
- Apply for jobs with cover letter & resume URL

##  API Endpoints

### Auth
- POST /api/auth/user/register
- POST /api/auth/user/login
- POST /api/auth/admin/login
- POST /api/auth/refresh-token

### Jobs
- GET /api/jobs
- GET /api/jobs/:id
- POST /api/jobs (admin)
- PUT /api/jobs/:id (admin)
- DELETE /api/jobs/:id (admin)

### Applications
- POST /api/applications/jobs/:id/apply
- GET /api/applications/me
- GET /api/applications (admin)