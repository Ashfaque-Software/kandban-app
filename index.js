import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import connection from './config/db.js';  // Make sure this imports the correct connection
import authRoutes from './routes/authRoutes.js'; // Use 'authRoutes' for clarity

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Corrected path to start with '/'
app.use('/user', authRoutes);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
