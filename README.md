# Full Stack Learning Management System (LMS)

A robust, secure, and role-based Learning Management System designed to facilitate online education. Built with a Django REST Framework backend and a React frontend, this application manages the complete lifecycle of courses, from creation by instructors to enrollment and progress tracking by students, all overseen by an administrative dashboard.

## Features

### Backend (Django & DRF)
*   **Secure Authentication**: Full JWT-based authentication flow including Registration, Login, and Logout.
*   **Role-Based Access Control**: Strict permissions for three distinct roles:
    *   **Admin**: Full access to system stats and user management.
    *   **Instructor**: Can create, update, and delete their own courses.
    *   **Student**: Can browse and enroll in courses.
*   **Password Management**: Secure password hashing and a complete Forgot/Reset Password workflow using email tokens.
*   **Course Management**: Comprehensive CRUD operations for Courses and Categories.
*   **Enrollment System**: Logic to handle student enrollments and prevent duplicate entries.
*   **Dashboard & Reports**: APIs calculating real-time statistics for users, courses, and enrollments.

### Frontend (React & Tailwind CSS)
*   **Modern UI**: Responsive and clean interface built with React 19 and Tailwind CSS.
*   **Protected Routes**: ensuring users only access pages authorized for their role.
*   **Dynamic Dashboard**: Visualizing platform statistics with Recharts.
*   **Course Catalog**: Interactive grid view of available courses with filtering by category.
*   **Instructor Portal**: Dedicated forms for creating and managing course content.
*   **Real-time Feedback**: Immediate visual feedback for actions like Enrolling (e.g., "✅ You are enrolled").

## Tech Stack

### Backend
*   **Framework**: Django 6.0
*   **API**: Django REST Framework (DRF)
*   **Authentication**: SimpleJWT
*   **Database**: SQLite (Development)
*   **Utilities**: Django CORS Headers

### Frontend
*   **Library**: React 19
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **Routing**: React Router DOM 7
*   **HTTP Client**: Axios (with Interceptors)
*   **Charts**: Recharts

## Setup Instructions

### Prerequisites
*   Node.js (v16+) & npm
*   Python (v3.10+) & pip

### 1. Backend Setup
Navigate to the backend directory:
```bash
cd backend
```

Create and activate a virtual environment:
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

Install python dependencies:
```bash
pip install -r requirements.txt
```

Run database migrations:
```bash
python manage.py migrate
```

Create an Admin user (Superuser):
```bash
python manage.py createsuperuser
```

Start the Django development server:
```bash
python manage.py runserver
```
*The backend API will run at `http://127.0.0.1:8000/`*

### 2. Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install JavaScript dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
*The frontend application will run at `http://localhost:3000/`*

## Screenshots

### Login Page
![Login Page]()

### Dashboard (Admin View)
![Dashboard]()

### Course Pages (Listing & Details)
![Course Listing]()
![Course Details]()
