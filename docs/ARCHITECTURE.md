# ITERIQ System Architecture

## 1. Overview
ITERIQ is a Single Page Application (SPA) built with Vanilla JavaScript (ES Modules), HTML5, and CSS3 on the frontend, powered by an Express.js and Node.js backend, backed by Supabase (PostgreSQL + Auth), and integrated with a dedicated Python FastAPI + ReportLab microservice for deterministic PDF attendance register generation.

## 2. Frontend Architecture
- **Single Entry Point**: `frontend/index.html` hosts the application root.
- **Routing & Navigation**: Custom client-side router (`frontend/src/router.js`) using the HTML5 History API supporting routes such as `/portal/overview`, `/portal/attendance`, `/portal/profile`, `/access/sign-in`, and `/access/create-account`.
- **Modular Design**: Scoped page modules (`auth.page.js`, `dashboard.page.js`, `attendance.page.js`, `profile.page.js`) encapsulating presentation and styling logic. Leaflet.js is integrated within map components for real-time campus geofencing verification.

## 3. Backend Architecture
- **API Server**: Express.js REST API handling session verification, attendance logging, and role-based access control.
- **Geofence Enforcement**: Server-side validation service comparing client GPS coordinates against authoritative venue coordinates defined in `backend/data/campus_locations.json`.
- **Database & Auth**: Supabase PostgreSQL database protected by Row Level Security (RLS) policies and Supabase Auth JWT verification middleware.

## 4. PDF Generation Service
- **Microservice**: Python FastAPI service (`python-pdf/app.py`).
- **Engine**: ReportLab constructs publication-quality academic attendance registers in A4 landscape format. Secure communication is mediated via the Node.js backend.