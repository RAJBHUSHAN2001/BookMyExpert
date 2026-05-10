# BookMyExpert

A real-time expert session booking system built with React, Node.js, Express, MongoDB and Socket.io.

## Features
- Browse and search experts by name and category
- Real-time slot availability updates via Socket.io
- Race-condition-safe booking using MongoDB atomic updates
- Track your bookings by email

## Tech Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Real-time: Socket.io

## Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017

### Installation & Run
1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```
2. **Seed the database:**
   ```bash
   npm run seed
   ```
3. **Start the project (Frontend & Backend):**
   ```bash
   npm run dev
   ```

The application will be available at **http://localhost:5173**.

## API Reference
GET    /api/experts              - List experts (pagination, search, filter)
GET    /api/experts/:id          - Get expert details
POST   /api/bookings             - Create booking (atomic, race-safe)
PATCH  /api/bookings/:id/status  - Update booking status
GET    /api/bookings?email=      - Get bookings by email
