# 📌 UserHub – Authentication & User Management System

## 🔍 Project Overview & Purpose

**UserHub** is a full-stack authentication and user management system built with modern web technologies.
It provides secure, cookie-based authentication, role-based access control (RBAC), and an admin dashboard for managing users.

### 🎯 Purpose

* Demonstrate **production-grade authentication**
* Implement **secure cookie-based JWT auth**
* Showcase **admin-level user management**
* Follow **real-world deployment practices**

This project is suitable for **assessments, interviews, and portfolio demonstration**.

---

## 🛠️ Tech Stack Used

### Backend

* **Node.js**
* **Express.js**
* **TypeScript**
* **Prisma ORM**
* **PostgreSQL (NeonDB)**
* **JWT (Cookie-based authentication)**
* **Zod (Validation)**

### Frontend

* **React (Vite)**
* **TypeScript**
* **Axios**
* **React Router**
* **Context API**

### DevOps / Deployment

* **Render** – Backend hosting - https://user-hub-nu.vercel.app 
* **Vercel** – Frontend hosting
* **Postman** – API testing
* **Swagger / OpenAPI (optional)**

---

## ⚙️ Setup Instructions

### 📦 Prerequisites

* Node.js (v18+ recommended)
* PostgreSQL database
* Git

---

## 🔧 Backend Setup

```bash
git clone https://github.com/sohel-sk/UserHub.git
cd UserHub/backend
npm install
```

### Prisma Setup

```bash
npx prisma generate
npx prisma migrate dev
```

### Run Backend

```bash
npm run dev
```

Backend runs on:

```
http://localhost:3000
```

---

## 🎨 Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
PORT=
DATABASE_URL=
JWT_SECRET=
FRONTEND_URL=
NODE_ENV=
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=
```

> ⚠️ **Never commit `.env` files to version control**

---

## 🚀 Deployment Instructions

### Backend Deployment (Render)

1. Create a **Web Service** on Render
2. Root directory: `backend`
3. Build command:

```bash
npm install --include=dev && npm run build && npx prisma migrate deploy
```

4. Start command:

```bash
npm run start
```

5. Add environment variables (same as backend `.env`)
6. Enable HTTPS (default on Render)

---

### Frontend Deployment (Vercel)

1. Import frontend repo into Vercel
2. Root directory: `frontend`
3. Add environment variable:

```env
VITE_API_URL=https://your-backend.onrender.com
```

4. Add `vercel.json` for SPA routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

5. Deploy

---

## 📡 API Documentation

### 🔹 Authentication APIs

#### POST `/auth/signup`

**Request**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response**

```json
{
  "message": "User registered successfully"
}
```

---

#### POST `/auth/login`

**Request**

```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response**

```json
{
  "message": "Login successful"
}
```

> Auth token is stored in an **HTTP-only cookie**

---

#### GET `/auth/me`

**Response**

```json
{
  "id": "uuid",
  "email": "john@example.com",
  "role": "USER"
}
```

---

#### POST `/auth/logout`

**Response**

```json
{
  "message": "Logout successful"
}
```

---

### 🔹 Admin APIs (Protected)

#### GET `/admin/users?page=1&limit=10`

**Response**

```json
{
  "users": [],
  "pagination": {
    "totalUsers": 26,
    "totalPages": 3,
    "currentPage": 1
  }
}
```

---

#### PATCH `/admin/user/:id/activate`

```json
{
  "message": "User activated successfully"
}
```

---

#### PATCH `/admin/user/:id/deactivate`

```json
{
  "message": "User deactivated successfully"
}
```

> Admin cannot deactivate their own account.

---

## 🧪 API Testing

### 📬 Postman Collection

👉 **Postman Collection Link:**
`<Add your Postman collection URL here>`

### 📘 Swagger / OpenAPI (Optional)

If enabled:

```
/api-docs
```

---

## 🔒 Security Highlights

* HTTP-only cookies (XSS-safe)
* Secure + SameSite=None cookies in production
* Role-based access control
* CORS with credentials
* Password hashing using bcrypt

---

## ✅ Features Implemented

* User signup & login
* Cookie-based authentication
* Persistent login across refresh
* Admin dashboard
* User activation/deactivation
* Pagination
* Secure deployment

---

## 📌 Author

**Sheikh Sohel**
B.Tech CSE (Cyber Security)
Shri Ramdeobaba College of Engineering and Management

---

## 📄 License

This project is for **educational and assessment purposes**.

---

