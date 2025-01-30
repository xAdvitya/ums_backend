import User from '../models/user.model.js';

// Update user profile
export const updateProfile = async (req, res) => {
  const { userId } = req;

  const { name, mobileNumber, bio, availability } = req.body;

  try {
    // Check if user ID is provided
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate availability times
    if (availability) {
      const { start, end } = availability;

      if (!start || !end) {
        return res
          .status(400)
          .json({ error: 'Availability start and end times are required' });
      }

      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(start) || !timeRegex.test(end)) {
        return res
          .status(400)
          .json({ error: 'Invalid time format. Use HH:MM' });
      }

      const startTime = new Date(`1970-01-01T${start}:00`);
      const endTime = new Date(`1970-01-01T${end}:00`);

      if (startTime >= endTime) {
        return res
          .status(400)
          .json({ error: 'Start time must be before end time' });
      }
    }

    // Update user details
    if (name) user.name = name;
    if (mobileNumber) user.mobileNumber = mobileNumber;
    if (bio) user.bio = bio;
    if (availability) user.availability = availability;

    await user.save();

    // Remove password before sending response
    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user profile
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};
