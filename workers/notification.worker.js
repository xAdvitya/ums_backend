import { Worker } from 'bullmq';
import mongoose from 'mongoose';
import Notification from '../models/notification.model.js';
import notificationQueue from '../queues/notification.queue.js';
import {
  getISTTime,
  getNextAvailability,
  isAvailableNow,
} from '../utils/time.utils.js';
import dotenv from 'dotenv';
import User from '../models/user.model.js';

dotenv.config();

// Database connection setup
const connectDB = async () => {
  try {
    // Connect to MongoDB using connection string (consider moving to env variables in production)
    await mongoose.connect(process.env.DATABASE_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

// Initialize database connection
connectDB();

const connection = {
  host: 'redis',
};

const worker = new Worker(
  'notifications',
  async (job) => {
    try {
      const { notificationId } = job.data;
      console.log(
        `Processing job ${job.id} for notification ${notificationId}`
      );

      // Retrieve notification with populated recipient data
      const notification = await Notification.findById(notificationId).populate(
        'recipients'
      );

      if (!notification) {
        throw new Error('Notification not found');
      }

      // Handle critical notifications immediately
      if (notification.isCritical) {
        await Notification.updateOne(
          { _id: notificationId },
          {
            status: 'delivered',
            deliveredAt: getISTTime(),
            $inc: { __v: 1 },
          }
        );
        console.log(`Critical notification ${notificationId} delivered.`);
        return;
      }

      // Check recipient availability in IST timezone
      const currentIST = getISTTime();
      const allAvailable = notification.recipients.every((recipient) =>
        isAvailableNow(recipient.availability, currentIST)
      );

      if (allAvailable) {
        // Mark notification as delivered if all recipients are available
        await Notification.updateOne(
          { _id: notificationId },
          { status: 'delivered', deliveredAt: getISTTime(), $inc: { __v: 1 } }
        );
        console.log(`Notification ${notificationId} delivered.`);
      } else {
        // Calculate next available time slot and requeue
        const nextAvailable = getNextAvailability(
          notification.recipients[0].availability, // Simplified: uses first recipient's availability
          currentIST
        );

        // Add delayed job to retry delivery
        await notificationQueue.add(
          `retry-${notificationId}`,
          { notificationId },
          { delay: nextAvailable.delay } // Delay in milliseconds
        );

        console.log(`Notification ${notificationId} re-queued.`);
      }
    } catch (error) {
      // Handle job failures and update notification status
      console.error(`Job ${job.id} failed:`, error);
      await Notification.updateOne(
        { _id: job.data.notificationId },
        { status: 'failed', $inc: { __v: 1 } }
      );
      throw error;
    }
  },
  { connection } // BullMQ worker configuration
);

// Worker event listeners for monitoring
worker.on('completed', async (job) => {
  const notification = await Notification.findById(job.data.notificationId);

  if (notification?.status === 'delivered') {
    console.log('Notification sent successfully:', job.data);
  } else {
    console.log(
      'Notification is still pending and has been re-queued:',
      job.data
    );
  }
});

worker.on('failed', (job, error) =>
  console.error(`Job ${job.id} failed:`, error)
);

// Handle graceful shutdown signals
process.on('SIGTERM', async () => {
  await worker.close();
  console.log('Worker closed gracefully.');
  process.exit(0);
});

export default worker;
