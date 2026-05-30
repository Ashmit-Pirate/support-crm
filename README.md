# SupportCRM — Customer Support Ticketing System

A full-stack web application for managing customer support tickets.

## Live Demo
- **Frontend**: https://support-crm-one.vercel.app
- **Backend API**: https://support-crm-api.onrender.com

## Test Credentials
- **Username**: admin
- **Password**: support123

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas + Mongoose
- **Auth**: JWT
- **Deployment**: Vercel (frontend) + Render (backend)

## Features
- Create and manage support tickets
- Search across name, email, ticket ID, description
- Filter by status (Open / In Progress / Closed)
- Add notes/comments to tickets
- JWT-based authentication

## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Backend
cd server
npm install
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET in .env
npm run dev

### Frontend
cd client
npm install
cp .env.example .env
# Fill in your VITE_API_URL in .env
npm run dev

## Environment Variables

### Backend (/server/.env)
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

### Frontend (/client/.env)
VITE_API_URL=http://localhost:5000

## API Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/login | Login | No |
| POST | /api/tickets | Create ticket | Yes |
| GET | /api/tickets | List all tickets | Yes |
| GET  | /api/tickets/:ticket_id | Get ticket detail | Yes |
| PUT  | /api/tickets/:ticket_id | Update ticket     | Yes |
