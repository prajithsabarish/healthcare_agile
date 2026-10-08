# HealthFlow – Agile Healthcare Management System

## Project Overview
"Design and Development of an Agile Healthcare Management System for Sprint-Based Healthcare Service Improvement"

### Problem Statement
Healthcare organizations increasingly require digital systems for appointments, prescriptions, patient services and healthcare workflows. However, developing such systems using rigid development processes can make it difficult to respond quickly to changing healthcare requirements.

HealthFlow demonstrates how Agile/Scrum practices can be applied to healthcare software development by providing Product Backlog management, Sprint Planning, Scrum Boards, Daily Scrum updates, Sprint Reviews, Retrospectives and Agile performance analytics in one integrated platform.

### Objectives
- Demonstrate Agile project planning in a healthcare context.
- Product Backlog management for user stories.
- Scrum Board management with 5 specific states.
- Velocity and Burndown analysis based on real metrics.

## Technology Stack
- **Frontend**: React.js, Vite, Tailwind CSS, Recharts, Lucide React, Axios.
- **Backend**: Node.js, Express.js, JWT Authentication.
- **Database**: MySQL (mysql2).

## User Roles
- **Admin**: Manages projects and users.
- **Scrum Master**: Manages sprints, backlog, reviews, and analytics.
- **Team Member**: Updates story status on the board and logs daily scrum.

## Installation & Setup

1. **Database Setup**
   - Ensure MySQL is running locally.
   - Execute the SQL schema:
     ```bash
     cd backend/database
     mysql -u root -p < schema.sql
     ```

2. **Backend Setup**
   - Navigate to the `backend` folder.
   - Run `npm install`.
   - Update `.env` with your DB credentials.
   - Run the seed script to generate demo data:
     ```bash
     node seed/seed.js
     ```
   - Start the server:
     ```bash
     npm run dev
     ```

3. **Frontend Setup**
   - Navigate to the `frontend` folder.
   - Run `npm install`.
   - Start the Vite server:
     ```bash
     npm run dev
     ```

## Demo Credentials
- Admin: `admin@healthflow.com` / `password123`
- Scrum Master: `scrummaster@healthflow.com` / `password123`
- Developer: `developer@healthflow.com` / `password123`

## Project Screens Implemented
- Login & Registration
- Projects Dashboard
- Product Backlog
- Scrum Board (Interactive)
- Analytics Dashboard (Velocity & Burndown)

*Built by Antigravity.*
