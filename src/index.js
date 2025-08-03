import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/cryptoRoutes.js';
import connectDB from './db/db.js';
import { scheduleCryptoJob } from './cron/ScheduleCryptoJob.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cookieParser());

app.use(cors(corsOptions));

app.use(express.json());

scheduleCryptoJob();

app.use('/api', routes);

async function server() {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}

server();
