import mongoose from "mongoose";

const DonationAppealSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    goal: { type: Number, required: true },
    raised: { type: Number, default: 0 },
    image: { type: String},
    status: { 
      type: String, 
      enum: ['active', 'completed', 'cancelled'],
      default: 'active'
    },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    donations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Donation' }],
    views: { type: Number, default: 0 },
    reaches: { type: Number, default: 0 }
  }, {
    timestamps: true
});

export default mongoose.model('DonationAppeal',DonationAppealSchema);