import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    courseRepCode: process.env.COURSE_REP_REGISTRATION_CODE || '$$$MYJOBHTML$$$',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
};