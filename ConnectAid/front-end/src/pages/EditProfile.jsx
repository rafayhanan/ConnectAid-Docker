import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FormInput from '../components/FormInput';

const EditProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    password: '', // Old password
    newPassword: '', // New password (optional)
    dateOfBirth: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData((prev) => ({
          ...prev,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          dateOfBirth: response.data.dateOfBirth,
        }));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(
        '/api/users/profile',
        userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      try {
        const token = localStorage.getItem('authToken');
        await axios.delete('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.removeItem('authToken');
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete account');
      }
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white shadow-md rounded-md p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Edit Profile</h1>

      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="First Name"
          value={userData.firstName}
          onChange={(e) =>
            setUserData({ ...userData, firstName: e.target.value })
          }
          required
        />

        <FormInput
          label="Last Name"
          value={userData.lastName}
          onChange={(e) =>
            setUserData({ ...userData, lastName: e.target.value })
          }
          required
        />

        <FormInput
          label="Old Password"
          type="password"
          placeholder="Enter Your Old Password"
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
          required
        />

        <FormInput
          label="New Password (Optional)"
          type="password"
          placeholder="Enter Your New Password"
          onChange={(e) =>
            setUserData({ ...userData, newPassword: e.target.value })
          }
        />

        <FormInput
          label="Date of Birth"
          type="date"
          value={userData.dateOfBirth.split('T')[0]}
          onChange={(e) =>
            setUserData({ ...userData, dateOfBirth: e.target.value })
          }
          required
        />

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Delete Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
