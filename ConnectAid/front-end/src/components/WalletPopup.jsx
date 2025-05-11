import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { XMarkIcon } from '@heroicons/react/24/outline';

const WalletPopup = ({ isOpen, onClose }) => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchBalance();
    }
  }, [isOpen]);

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('/api/users/wallet', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBalance(response.data.balance);
    } catch (err) {
      setError('Failed to fetch balance');
    }
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      
      // Update wallet balance
      await axios.put('/api/users/wallet/update', {
        amount: Number(amount),
        type: 'add'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      // Get updated balance
      const response = await axios.get('/api/users/wallet', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBalance(response.data.balance);
      setAmount('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add funds');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Wallet</h2>
          <button onClick={onClose}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600">Current Balance</p>
          <p className="text-2xl font-bold">PKR {balance}</p>
        </div>

        <form onSubmit={handleAddFunds} className="space-y-4">
          <div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter amount"
              min="1"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Add Funds
          </button>
        </form>
      </div>
    </div>
  );
};

export default WalletPopup;