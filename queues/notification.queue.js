import { Queue } from 'bullmq';

const connection = {
  host: 'redis',
};

// Create the BullMQ queue
const notificationQueue = new Queue('notifications', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true, // Remove completed jobs from the queue
    removeOnFail: 50,
  },
});

// Listen for new jobs added to the queue
notificationQueue.on('waiting', (job) => {
  console.log(`New job added to the queue: ${job.id}`);
});

// Log errors in the queue
notificationQueue.on('error', (err) => {
  console.error('Queue error:', err);
});

export default notificationQueue;
