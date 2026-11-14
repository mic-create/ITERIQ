-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create App Role Enum
create type user_role as enum ('STUDENT', 'COURSE_REPRESENTATIVE', 'ADMIN');
create type account_status as enum ('ACTIVE', 'DEACTIVATED', 'SUSPENDED');

-- 1. Profiles Table (Linked to Supabase Auth)
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email varchar(255) unique not null,
    full_name varchar(255) not null,
    role user_role not null default 'STUDENT',
    status account_status not null default 'ACTIVE',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Students Table
create table public.students (
    id uuid references public.profiles(id) on delete cascade primary key,
    matric_number varchar(50) unique not null,
    academic_level varchar(20) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Course Representatives Table
-- Enforces one active representative per course code and academic level combination using a partial unique index.
create table public.course_representatives (
    id uuid default uuid_generate_v4() primary key,
    profile_id uuid references public.profiles(id) on delete cascade not null,
    course_code varchar(50) not null,
    academic_level varchar(20) not null,
    status account_status not null default 'ACTIVE',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Unique constraint index for active reps per course code and level
create unique index idx_unique_active_rep_per_course_level 
on public.course_representatives (course_code, academic_level) 
where status = 'ACTIVE';

-- 4. Venues Table
create table public.venues (
    venue_id varchar(50) primary key,
    venue_name varchar(255) not null,
    latitude decimal(10, 8),
    longitude decimal(11, 8),
    permitted_radius_meters integer not null default 50,
    max_gps_accuracy_meters integer not null default 15,
    is_active boolean not null default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Attendance Sessions Table
create table public.attendance_sessions (
    id uuid default uuid_generate_v4() primary key,
    course_code varchar(50) not null,
    course_title varchar(255) not null,
    academic_level varchar(20) not null,
    venue_id varchar(50) references public.venues(venue_id) not null,
    representative_id uuid references public.profiles(id) on delete set null,
    expires_at timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Attendance Records Table
create table public.attendance_records (
    id uuid default uuid_generate_v4() primary key,
    session_id uuid references public.attendance_sessions(id) on delete cascade not null,
    student_id uuid references public.profiles(id) on delete cascade not null,
    latitude_submitted decimal(10, 8) not null,
    longitude_submitted decimal(11, 8) not null,
    accuracy_meters decimal(6, 2) not null,
    verified_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint unique_student_session_attendance unique (session_id, student_id)
);

-- Indexes for performance
create index idx_profiles_email on public.profiles(email);
create index idx_students_matric on public.students(matric_number);
create index idx_records_student on public.attendance_records(student_id);
create index idx_records_session on public.attendance_records(session_id);