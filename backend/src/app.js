import express from 'express';
import cors from 'cors';
import representativeRoutes from './routes/representatives.js';
import attendanceRoutes from './routes/attendance.js';

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/v1/representatives', representativeRoutes);
app.use('/api/v1/attendance', attendanceRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', system: 'ITERIQ', institution: 'Bells University of Technology' });
});

export default app;