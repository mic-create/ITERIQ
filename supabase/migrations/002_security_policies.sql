-- Enable Row Level Security (RLS) on all tables
alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.course_representatives enable row level security;
alter table public.venues enable row level security;
alter table public.attendance_sessions enable row level security;
alter table public.attendance_records enable row level security;

-- PROFILES POLICIES
create policy "Users can view own profile"
    on public.profiles for select
    using (auth.uid() = id);

create policy "Users can update own profile name"
    on public.profiles for update
    using (auth.uid() = id)
    with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

-- STUDENTS POLICIES
create policy "Students can view own student record"
    on public.students for select
    using (auth.uid() = id);

-- COURSE REPRESENTATIVES POLICIES
create policy "Anyone can view active course representatives"
    on public.course_representatives for select
    using (status = 'ACTIVE');

-- VENUES POLICIES
create policy "Authenticated users can view active venues"
    on public.venues for select
    to authenticated
    using (is_active = true);

-- ATTENDANCE SESSIONS POLICIES
create policy "Authenticated users can view attendance sessions"
    on public.attendance_sessions for select
    to authenticated
    using (true);

-- ATTENDANCE RECORDS POLICIES
create policy "Students can view own attendance records"
    on public.attendance_records for select
    using (auth.uid() = student_id);

create policy "Course Representatives can view attendance records for their sessions"
    on public.attendance_records for select
    using (
        exists (
            select 1 from public.attendance_sessions s
            join public.course_representatives cr on s.course_code = cr.course_code and s.academic_level = cr.academic_level
            where s.id = attendance_records.session_id 
            and cr.profile_id = auth.uid() 
            and cr.status = 'ACTIVE'
        )
    );