# Society Maintenance Tracker

A full-stack web application for managing apartment society maintenance complaints. Residents can raise and track complaints with photos, admins manage them through a workflow with priorities, and everyone stays informed through a notice board and email updates.

---

## Live Demo

- **Frontend:**  https://society-maintenance-tracker-indol.vercel.app
- **Backend:** https://society-maintenance-tracker-4uhi.onrender.com
---

## Demo Credentials

### Resident Account
- **Email:** resident@demo.com
- **Password:** demo1234

### Admin Account
- **Email:** admin@demo.com
- **Password:** demo1234

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (role-based) |
| Photo Upload | Cloudinary |
| Email | Nodemailer + Gmail SMTP |
| Hosting | Vercel (frontend) + Render (backend) |

---

## Features

### Resident
- Register and login
- Raise a complaint with category, description, and optional photo
- View all own complaints with full status history (timestamp + note per change)
- Receive email on status change
- View notice board

### Admin
- View all complaints with filters (category, status, date)
- Set priority: Low, Medium, High
- Update status: Open → In Progress → Resolved (each change logged)
- Overdue complaints auto-flagged after configurable days and shown at top
- Post notices to notice board (pin important ones)
- Send email to all residents on important notice
- View dashboard: complaints by status, by category, overdue count

---

## Project Structure

```
society-maintenance-tracker/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── complaintController.js
│   │   ├── noticeController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Complaint.js
│   │   └── Notice.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   ├── noticeRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   ├── cloudinary.js
│   │   ├── sendEmail.js
│   │   └── cronJobs.js
│   ├── .env.example
│   └── server.js
├── frontend/
│   └── src/
│       ├── api/
│       │   └── axios.js
│       ├── components/
│       │   └── Navbar.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── ResidentDashboard.jsx
│       │   ├── RaiseComplaint.jsx
│       │   ├── MyComplaints.jsx
│       │   ├── NoticeBoard.jsx
│       │   ├── AdminDashboard.jsx
│       │   ├── AdminComplaints.jsx
│       │   └── PostNotice.jsx
│       └── App.jsx
└── README.md
```

---

## Setup Guide

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account (free)
- Gmail account with App Password enabled

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/society-maintenance-tracker.git
cd society-maintenance-tracker
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder (see `.env.example`):

```bash
cp .env.example .env
```

Fill in your values and start the server:

```bash
node server.js
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Environment Variables

Create a `.env` file in the `backend/` folder with the following:

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/society_tracker
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

---

## API Documentation

### Auth Routes
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | /api/auth/register | Register a new user | Public |
| POST | /api/auth/login | Login and get JWT token | Public |

### Complaint Routes
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | /api/complaints | Raise a new complaint (with photo) | Resident |
| GET | /api/complaints/my | Get own complaints with history | Resident |
| GET | /api/complaints/all | Get all complaints with filters | Admin |
| PUT | /api/complaints/:id/status | Update complaint status | Admin |
| PUT | /api/complaints/:id/priority | Set complaint priority | Admin |

### Notice Routes
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | /api/notices | Post a new notice | Admin |
| GET | /api/notices | Get all notices (pinned first) | All |

### Admin Routes
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | /api/admin/dashboard | Get dashboard stats | Admin |

---

## Database Schema

### Users Collection
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String (unique)",
  "password": "String (hashed)",
  "role": "String (resident | admin)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Complaints Collection
```json
{
  "_id": "ObjectId",
  "user": "ObjectId (ref: User)",
  "category": "String (plumbing | electrical | cleaning | security | other)",
  "description": "String",
  "photoUrl": "String (Cloudinary URL)",
  "status": "String (open | in_progress | resolved)",
  "priority": "String (low | medium | high)",
  "isOverdue": "Boolean",
  "history": [
    {
      "oldStatus": "String",
      "newStatus": "String",
      "note": "String",
      "changedBy": "ObjectId (ref: User)",
      "changedAt": "Date"
    }
  ],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Notices Collection
```json
{
  "_id": "ObjectId",
  "admin": "ObjectId (ref: User)",
  "content": "String",
  "isImportant": "Boolean",
  "isPinned": "Boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## Overdue Detection

The cron job runs every night at midnight and checks for complaints that:
- Are not resolved
- Were created more than `OVERDUE_DAYS` days ago (default: 7)

To change the threshold, update this line in `backend/utils/cronJobs.js`:
```javascript
const OVERDUE_DAYS = 7; // change this value
```
