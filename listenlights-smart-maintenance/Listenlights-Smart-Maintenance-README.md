
# 🏢 Listenlights Smart Maintenance System

A full-stack smart building maintenance system built using **Angular**, **Node.js**, **Express.js**, and **MongoDB**.  
It enables **Admin** and **Technicians** to manage smart devices (Lights, AC, Sensors) and create maintenance tasks.  
Designed specifically to align with **Listenlights (P) Ltd.** IoT + Smart Infrastructure domain.

## 📌 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Roles](#system-roles)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Usage Instructions](#usage-instructions)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## 🚀 Features

✔ Secure user login using **JWT Authentication**  
✔ Role-based access:
- **Admin** → Full control (Devices + Tasks)
- **Technician** → Only their assigned tasks  

✔ Smart Device Management
- Add / View / Delete smart devices with type & location  
- Device statuses: *Online / Offline / Maintenance*  

✔ Maintenance Task Management  
- Create tasks linked to a specific device  
- Assign task to technician  
- Task priority: *Low / Medium / High*  
- Task workflow:
  → Open → In-Progress → Completed  

✔ Angular Admin Dashboard UI  
✔ MongoDB as persistent data storage  
✔ Fully responsive & modern styled UI  

---

## 🛠 Technology Stack

| Category | Tools / Frameworks |
|---------|------------------|
| Frontend | Angular 17 |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JSON Web Tokens (JWT), Bcrypt |
| UI | Custom Styled Components (Responsive) |
| Logging | Morgan |
| Version control | Git & GitHub |

---

## 👥 System Roles

| Role | Capabilities |
|------|--------------|
| Admin | Manage users, manage devices, create/assign tasks, update all task statuses |
| Technician | View ONLY their assigned tasks, update statuses while working |

---

## 📦 Prerequisites

- Node.js (v16+ recommended)
- Angular CLI installed globally:
  ```sh
  npm install -g @angular/cli
  ```
- MongoDB installed locally  
  or MongoDB Atlas cloud instance

---

## ⚙️ Installation

### 🔹 Backend

```sh
cd backend
npm install
```

(optional) Configure `.env` file:

```
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/listenlights_smart_maintenance
JWT_SECRET=supersecretjwtkeychange
```

Start backend server:

```sh
npm start
```

📌 API will run at:
```
http://localhost:4000
```

➡ Seed default Admin & Technician users:
```
POST http://localhost:4000/api/auth/seed
```

Demo Credentials:  
| Role | Email | Password |
|------|------|---------|
| Admin | admin@listenlights.com | admin123 |
| Technician | tech@listenlights.com | tech123 |

---

### 🔹 Frontend (Angular)

```sh
cd frontend-angular
npm install
npx ng serve --port 4200
```

📌 Open UI in browser:
```
http://localhost:4200
```

---

## 🌐 API Endpoints (Major)

### 🔑 Auth APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create a new user (demo mode) |
| POST | `/api/auth/login` | Login & get JWT |
| GET | `/api/auth/me` | Get logged-in user details |
| POST | `/api/auth/seed` | Create default admin + technician |

---

### 🔌 Device APIs (Admin Only)

| Method | Endpoint |
|--------|---------|
| GET | `/api/devices` |
| POST | `/api/devices` |
| PUT | `/api/devices/:id` |
| DELETE | `/api/devices/:id` |
| POST | `/api/devices/seed` |

---

### 🧰 Task APIs

| Role | Method | Endpoint |
|------|--------|---------|
| Admin | GET | `/api/tasks` |
| Technician | GET | `/api/tasks` (only assigned tasks) |
| Admin | POST | `/api/tasks` |
| Admin + Technician | PUT | `/api/tasks/:id` |
| Admin | DELETE | `/api/tasks/:id` |

---

## 🧑‍💻 Usage Instructions

1️⃣ Login using Admin or Technician credentials  
2️⃣ Admin Dashboard:
- Load or seed smart devices
- Create tasks & assign device + technician  
- Update any task status  

3️⃣ Technician Dashboard:
- View and update only assigned tasks  
- Move status: **Open → In-Progress → Completed**

4️⃣ Logout anytime to secure the session  

---

## 🔮 Future Enhancements

✔ Real IoT integration (MQTT / BACnet / KNX)  
✔ Maintenance scheduling & alerts  
✔ Mobile application for technicians (React Native)  
✔ QR code scan for device tracking  
✔ Report generation + dashboards  

---

## 📄 License

This project is licensed under the **MIT License**.
