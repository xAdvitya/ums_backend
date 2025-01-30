import mongoose from 'mongoose';

// Notification Schema
const notificationSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  message: {
    type: String,
    required: true,
    trim: true,
  },
  isCritical: {
    type: Boolean,
    default: false,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  deliveredAt: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['pending', 'delivered'],
    default: 'pending',
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
