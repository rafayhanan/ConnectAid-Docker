import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FormInput from '../components/FormInput';

const EditDonationAppeal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appealData, setAppealData] = useState({
    title: '',
    description: '',
    category: '',
    goal: '',
    image: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAppealData = async () => {
      try {
        const response = await axios.get(`/api/users/donation-appeals/${id}`);
        const { title, description, category, goal } = response.data;
        setAppealData({ title, description, category, goal });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch appeal data');
      } finally {
        setLoading(false);
      }
    };

    fetchAppealData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      
      Object.keys(appealData).forEach(key => {
        if (key === 'image' && appealData[key]) {
          formData.append('image', appealData[key]);
        } else if (key !== 'image') {
          formData.append(key, appealData[key]);
        }
      });

      await axios.put(`/api/users/edit-appeal/${id}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setMessage('Appeal updated successfully');
      setTimeout(() => navigate('/main/my-appeals'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update appeal');
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this donation appeal? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('authToken');
        await axios.delete(`/api/users/cancel-appeal/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate('/main/my-appeals');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to cancel appeal');
      }
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white shadow-md rounded-md p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Edit Donation Appeal</h1>

      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Title"
          value={appealData.title}
          onChange={(e) => setAppealData({...appealData, title: e.target.value})}
          required
        />

        <FormInput
          type="number"
          label="Goal Amount (PKR)"
          value={appealData.goal}
          onChange={(e) => setAppealData({...appealData, goal: e.target.value})}
          required
        />

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={appealData.category}
            onChange={(e) => setAppealData({...appealData, category: e.target.value})}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            value={appealData.description}
            onChange={(e) => setAppealData({...appealData, description: e.target.value})}
            required
            className="w-full h-32 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Update Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAppealData({...appealData, image: e.target.files[0]})}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Cancel Appeal
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDonationAppeal;
