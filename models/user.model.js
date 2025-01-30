import mongoose from 'mongoose';

// User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, // Basic email format validation
      'Please provide a valid email address',
    ],
  },
  password: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number'],
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500, // Prevent long-form text in bio
  },
  availability: {
    start: {
      type: String,
      trim: true,
      required: true,
      validate: {
        // Validate 24-hour time format (HH:MM)
        validator: function (v) {
          return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: 'Start time must be in HH:MM format.',
      },
    },
    end: {
      type: String,
      trim: true,
      required: true,
      validate: {
        validator: function (v) {
          return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: 'End time must be in HH:MM format.',
      },
    },
  },
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notification',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to validate availability time logic
userSchema.pre('save', function (next) {
  if (this.availability?.start && this.availability?.end) {
    const startTime = new Date(`1970-01-01T${this.availability.start}:00Z`);
    const endTime = new Date(`1970-01-01T${this.availability.end}:00Z`);

    // Ensure start time is before end time
    if (startTime >= endTime) {
      return next(new Error('Start time must be before end time.'));
    }
  }
  next();
});

// Auto-update timestamp on document modification
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
