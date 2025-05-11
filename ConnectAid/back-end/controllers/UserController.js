import bcrypt from 'bcryptjs';
import User from "../models/User.js";
import mongoose from 'mongoose';
import DonationAppeal from '../models/DonationAppeal.js';

export const addUser = async (req, res) => {
  const { firstName, lastName, email, password, dateOfBirth } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      dateOfBirth,
      donationsMade: [],
      donationAppeals: []
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: `Server Error: ${err.message}` });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-email');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, password, newPassword, dateOfBirth } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid old password' });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;


    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    const { password: _, ...updatedUser } = user.toObject();

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteUserProfile = async (req, res) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Get user's donation appeals
      const user = await User.findById(req.user.userId);
      
      // Cancel all active donation appeals
      await DonationAppeal.updateMany(
        { _id: { $in: user.donationAppeals } },
        { status: 'cancelled' }
      );


      await User.findByIdAndDelete(req.user.userId);

      await session.commitTransaction();
      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};