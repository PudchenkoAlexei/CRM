import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import customerRoute from './routes/customer.js';
import userRoute from './routes/user.js';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 7700;

app.use(cookieParser());
app.use(express.json());
app.use(helmet());

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

app.use(morgan('common'));

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.use('/api/users', userRoute);
app.use('/api/customers', customerRoute);

app.use((err, req, res) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || 'Something went wrong!';
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
