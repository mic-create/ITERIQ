import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'production',
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    courseRepCode: process.env.COURSE_REP_REGISTRATION_CODE || '$$$MYJOBHTML$$$',
    pdfServiceUrl: process.env.PDF_SERVICE_URL || 'https://iteriq-1.onrender.com/',
    pdfServiceToken: process.env.PDF_SERVICE_TOKEN || 'bells-iteriq-pdf-secret-token-2026',
    frontendUrl: process.env.FRONTEND_URL || 'https://iteriq.vercel.app/'
};