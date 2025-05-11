import bcrypt from 'bcryptjs';
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { firstName, lastName, dateOfBirth, _id } = user;
    const token = jwt.sign(
      { userId: user._id, firstName, lastName }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { firstName, lastName, email, dateOfBirth, _id },
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: `Server Error: ${err.message}` });
  }
};

export default loginUser;