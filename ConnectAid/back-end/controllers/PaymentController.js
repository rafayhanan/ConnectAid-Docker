import Wallet from "../models/Wallet.js";

export const getWalletBalance = async (req, res) => {
    try {
      let wallet = await Wallet.findOne({ user: req.user.userId });
      if (!wallet) {
        wallet = await Wallet.create({ 
          user: req.user.userId,
          balance: 0 
        });
      }
      res.json({ balance: wallet.balance });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
  
export const addFunds = async (req, res) => {
    try {
      const { amount } = req.body;
      let wallet = await Wallet.findOne({ user: req.user.userId });
      
      if (!wallet) {
        wallet = await Wallet.create({ 
          user: req.user.userId,
          balance: amount 
        });
      } else {
        wallet.balance += Number(amount);
        await wallet.save();
      }
      
      res.json({ balance: wallet.balance });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

export const updateBalance =  async (req, res) => {
  try {
    const { amount, type } = req.body;
    const wallet = await Wallet.findOne({ user: req.user.userId });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    if (type === 'add') {
      wallet.balance += Number(amount);
    } else if (type === 'deduct') {
      if (wallet.balance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
      wallet.balance -= Number(amount);
    }

    await wallet.save();

    res.json({ balance: wallet.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};