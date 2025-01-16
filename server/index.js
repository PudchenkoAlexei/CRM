import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';

import customerRoute from './routes/customer.js';
import userRoute from './routes/user.js';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 7700;

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('Connected to MongoDB.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Завершує процес з кодом помилки, якщо не вдалося підключитися
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected!');
});

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// middlewares
app.use(cookieParser());
app.use(express.json());
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

app.use(morgan('common'));

// Routes
app.use('/api/users', userRoute);
app.use('/api/customers', customerRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  connect();
});
