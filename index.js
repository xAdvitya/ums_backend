import express from 'express';
import dotenv from 'dotenv';
import connectDB from './utils/mongo.util.js';
import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';
import notificationRoute from './routes/notification.route.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());
app.use(express.json());
dotenv.config();

connectDB();

app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/notification', notificationRoute);

// addTaskToQueue();
app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
