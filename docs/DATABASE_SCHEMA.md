# ITERIQ Database Schema (Supabase / PostgreSQL)

## 1. Tables

### `profiles`
- `id` (UUID, Primary Key, references auth.users)
- `email` (VARCHAR, Unique)
- `full_name` (VARCHAR)
- `matric_number` (VARCHAR, Nullable for staff/reps if applicable)
- `role` (ENUM: 'STUDENT', 'COURSE_REPRESENTATIVE')
- `created_at` (TIMESTAMP)

### `venues`
- `id` (VARCHAR, Primary Key)
- `venue_name` (VARCHAR)
- `latitude` (DECIMAL)
- `longitude` (DECIMAL)
- `permitted_radius_meters` (INTEGER)
- `max_gps_accuracy_meters` (INTEGER)
- `is_active` (BOOLEAN)

### `attendance_sessions`
- `id` (UUID, Primary Key)
- `course_code` (VARCHAR)
- `course_title` (VARCHAR)
- `venue_id` (VARCHAR, references venues)
- `representative_id` (UUID, references profiles)
- `expires_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)

### `attendance_records`
- `id` (UUID, Primary Key)
- `session_id` (UUID, references attendance_sessions)
- `student_id` (UUID, references profiles)
- `latitude_submitted` (DECIMAL)
- `longitude_submitted` (DECIMAL)
- `accuracy_meters` (DECIMAL)
- `verified_at` (TIMESTAMP)

## 2. Security Policies (RLS)
- Students can read active sessions, insert their own attendance records, and view their attendance history.
- Course Representatives can create attendance sessions and view/export attendance records for their managed courses.