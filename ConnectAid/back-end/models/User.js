import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  donationsMade: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Donation' }],
  donationAppeals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DonationAppeal' }]
}, {
  timestamps: true
});

export default mongoose.model('User', UserSchema);