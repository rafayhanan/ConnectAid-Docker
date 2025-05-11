import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    donationAppeal: { type: mongoose.Schema.Types.ObjectId, ref: 'DonationAppeal', required: true },
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    message: { type: String }
  }, {
    timestamps: true
});

export default mongoose.model('Donation',DonationSchema);