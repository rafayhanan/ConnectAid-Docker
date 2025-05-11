import User from "../models/User.js";
import Donation from "../models/Donation.js";
import DonationAppeal from "../models/DonationAppeal.js";

export const createDonationAppeal = async (req, res) => {
  try {
    const { title, description, category, goal } = req.body;
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user found in token' });
    }
    
    const validationErrors = [];
    if (!title?.trim()) validationErrors.push('Title is required');
    if (!description?.trim()) validationErrors.push('Description is required');
    if (!category?.trim()) validationErrors.push('Category is required');
    if (!goal || isNaN(Number(goal)) || Number(goal) <= 0) {
      validationErrors.push('Valid goal amount is required');
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: validationErrors.join(', ')
      });
    }

    const appeal = new DonationAppeal({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      goal: Number(goal),
      image: req.file ? req.file.path : null,
      creator: userId
    });

    await appeal.save();

    await User.findByIdAndUpdate(userId, {
      $push: { donationAppeals: appeal._id }
    });

    res.status(201).json({ 
      message: 'Donation appeal created successfully', 
      appeal 
    });
  } catch (error) {
    console.error('Error creating donation appeal:', error);
    res.status(500).json({ 
      message: 'Failed to create donation appeal. Please try again.' 
    });
  }
};

export const getUserAppeals = async (req, res) => {
  try {
    const appeals = await DonationAppeal.find({ creator: req.user.userId })
      .sort({ createdAt: -1 });
    
    res.json(appeals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getUserContributions = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.userId })
      .populate('donationAppeal')
      .sort({ createdAt: -1 });
    
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const makeDonation = async (req, res) => {
  try {
    const { appealId, amount, message } = req.body;
    const userId = req.user.userId;

    const appeal = await DonationAppeal.findById(appealId);
    if (!appeal) {
      return res.status(404).json({ message: 'Donation appeal not found' });
    }

    const remainingGoal = appeal.goal - appeal.raised;
    if (amount > remainingGoal) {
      return res.status(400).json({ message: 'Donation amount exceeds the remaining goal' });
    }

    const donation = new Donation({
      amount,
      message,
      donationAppeal: appealId,
      donor: userId,
      status: "completed"
    });

    await donation.save();

    // Update appeal's raised amount
    await DonationAppeal.findByIdAndUpdate(appealId, {
      $inc: { raised: amount },
      $push: { donations: donation._id }
    });

    // Add to user's donations
    await User.findByIdAndUpdate(userId, {
      $push: { donationsMade: donation._id }
    });

    res.status(201).json({ message: 'Donation successful', donation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllDonationAppeals = async (req, res) => {
  try {
    // Only get active and completed appeals, not cancelled ones
    const appeals = await DonationAppeal.find({ 
      status: { $in: ['active', 'completed'] } 
    })
    .sort({ createdAt: -1 })
    
    res.json(appeals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getDonationAppeal = async (req, res) => {
  try {
    const appeal = await DonationAppeal.findById(req.params.id)
      .populate('creator', 'name')
      .populate({
        path: 'donations',
        populate: { path: 'donor', select: 'name' }
      });
      
    if (!appeal) {
      return res.status(404).json({ message: 'Donation appeal not found' });
    }
    
    res.json(appeal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDonationAppeal = async (req, res) => {
  try {
    const { title, description, category, goal } = req.body;
    const appealId = req.params.id;

    const appeal = await DonationAppeal.findById(appealId);
    
    if (!appeal) {
      return res.status(404).json({ message: 'Donation appeal not found' });
    }

    if (appeal.creator.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this appeal' });
    }

    // Validation checks
    const validationErrors = [];
    if (!title?.trim()) validationErrors.push('Title is required');
    if (!description?.trim()) validationErrors.push('Description is required');
    if (!category?.trim()) validationErrors.push('Category is required');
    if (!goal || isNaN(Number(goal)) || Number(goal) <= 0) {
      validationErrors.push('Valid goal amount is required');
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: validationErrors.join(', ')
      });
    }

    const updateData = {
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      goal: Number(goal)
    };

    // Only update image if a new one is provided
    if (req.file) {
      updateData.image = req.file.path;
      // Here you could also add logic to delete the old image file if needed
    }

    const updatedAppeal = await DonationAppeal.findByIdAndUpdate(
      appealId,
      updateData,
      { new: true }
    );

    res.json(updatedAppeal);
  } catch (error) {
    console.error('Error updating donation appeal:', error);
    res.status(500).json({ message: 'Failed to update appeal' });
  }
};

export const cancelDonationAppeal = async (req, res) => {
  try {
    const appealId = req.params.id;
    const appeal = await DonationAppeal.findById(appealId);
    
    if (!appeal) {
      return res.status(404).json({ message: 'Donation appeal not found' });
    }

    if (appeal.creator.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this appeal' });
    }

    // Update the status to cancelled
    appeal.status = 'cancelled';
    await appeal.save();


    res.json({ message: 'Donation appeal cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling donation appeal:', error);
    res.status(500).json({ message: 'Failed to cancel appeal' });
  }
};