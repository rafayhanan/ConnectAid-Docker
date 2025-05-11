import React, { useState } from 'react';
import FormInput from '../components/FormInput';
import '../styles/add-donation.css';
import axios from 'axios';

const AddDonationCall = () => {
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!title || !goal || !category || !description) {
      setMessage('All fields are required');
      return;
    }
  
    try {
      setLoading(true);
      setMessage(null);
  
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('goal', Number(goal));
      formData.append('category', category);
      formData.append('description', description.trim());
      if (image) formData.append('image', image);
  
      const token = localStorage.getItem("authToken");
  
      const response = await axios.post('/api/users/donation-appeals', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
        }
      });
  
      setMessage(response.data.message);
      setLoading(false);
  
      // Reset form only on success
      setTitle('');
      setGoal('');
      setCategory('');
      setDescription('');
      setImage(null);
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      setMessage(errorMessage);
    }
};

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-md shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Donation Call</h1>
      {message && (
                    <p className={`text-center mb-4 ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
                        {message}
                    </p>
      )}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <FormInput
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for your donation call"
          required
        />

        <FormInput
          type="number"
          label="Goal Amount (PKR)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Enter your donation goal amount"
          required
        />

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="input-field w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
            <option value="Environment">Environment</option>
            <option value="Community">Community</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your cause in detail"
            required
            className="input-field w-full h-32 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="input-field w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="submit-btn bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-all"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
          
        </button>
      </form>
    </div>
  );
};

export default AddDonationCall;
