import Notification from '../models/notification.model.js';
import notificationQueue from '../queues/notification.queue.js';
import { getISTTime } from '../utils/time.utils.js';

export const sendNotification = async (req, res) => {
  try {
    const { recipientIds, message, isCritical = false } = req.body;
    const senderId = req.userId;

    // Create the notification
    const notification = await Notification.create({
      sender: senderId,
      recipients: recipientIds,
      message,
      isCritical,
      status: isCritical ? 'delivered' : 'pending',
      deliveredAt: isCritical ? getISTTime() : null,
    });

    // Queue notification only if it's NOT critical and NOT Admin
    if (!isCritical && !req.isAdmin) {
      await notificationQueue.add(
        `notification-${notification._id}`,
        { notificationId: notification._id },
        { jobId: `notification-${notification._id}`, timeout: 30000 }
      );
    }

    return res.status(201).json({
      message: isCritical
        ? 'Critical notification delivered immediately'
        : 'Notification queued successfully',
      notification,
    });
  } catch (error) {
    console.error('Notification Error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process notification',
    });
  }
};
