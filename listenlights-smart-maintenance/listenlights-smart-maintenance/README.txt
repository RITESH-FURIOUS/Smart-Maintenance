Listenlights Smart Maintenance - Full Project
============================================

This is a Smart Building Maintenance demo project aligned with Listenlights domain.

Stacks:
- Backend: Node.js + Express + MongoDB + JWT Auth + Roles (admin / technician)
- Frontend: Angular 17 single-page console (login + devices + tasks)

Folder Structure
----------------
- backend/            -> REST API server
- frontend-angular/   -> Angular web app

How to Run (Step by Step)
-------------------------

1) Prerequisites
   - Node.js installed
   - MongoDB running locally (default: mongodb://127.0.0.1:27017)

2) Backend
   ----------
   Open a terminal and run:

   cd backend
   npm install

   Copy .env.example to .env (optional; defaults are fine):

   - On Windows:
     copy .env.example .env

   Then start MongoDB (if not already) and run:

   npm start

   Backend will run at: http://localhost:4000

   Seed demo users:
   - In a separate terminal (while server is running), call:
     POST http://localhost:4000/api/auth/seed

   Seed devices:
   - Login as admin from frontend first (see below), then click "Seed Devices" button
     OR call:
     POST http://localhost:4000/api/devices/seed  (with admin token)

   Demo logins created by /api/auth/seed:
   - Admin:
       email: admin@listenlights.com
       pass:  admin123
   - Technician:
       email: tech@listenlights.com
       pass:  tech123

3) Frontend (Angular)
   -------------------
   Open another terminal:

   cd frontend-angular
   npm install

   Then run:

   npx ng serve --port 4200

   Open browser at:

   http://localhost:4200

   - Login with admin or technician credentials from above.
   - Admin can:
       * View devices
       * Add new devices
       * Seed demo devices
       * View all tasks
       * Create tasks and change their status
   - Technician can:
       * View only tasks assigned to them (if assigned)
       * Cycle status of their tasks (open -> in-progress -> completed)

Notes
-----
- JWT token is stored in browser localStorage as 'll_token'.
- Angular app automatically attaches Authorization header via AuthInterceptor.
- The project is intentionally simple and clean for resume & internship demo.
