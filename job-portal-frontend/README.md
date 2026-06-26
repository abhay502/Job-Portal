# Job Portal - Frontend

A full-stack Job Portal Management System built with React.js, Redux Toolkit, and Material UI.

## Tech Stack
- React.js + Vite
- Redux Toolkit
- Material UI
- React Router DOM
- Axios

## Setup Instructions

### 1. Install dependencies
npm install

### 2. Create environment file
Create a `.env` file in the root:
VITE_API_BASE_URL=http://localhost:5000/api

### 3. Start development server
npm run dev

App runs on: http://localhost:5173

## Features

### Admin Portal
- Login with access & refresh token auth
- Dashboard with stats (total jobs, active jobs, applications)
- Create / Edit / Delete job postings
- Filter jobs by category, experience, status
- Pagination on job listings

### User Portal
- Landing page with featured jobs and categories
- Advanced job listing with filters and salary range slider
- Job details page
- User registration and login
- Apply for jobs with cover letter and resume URL