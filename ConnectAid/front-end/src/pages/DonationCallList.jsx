import React, { useState, useEffect } from 'react';
import DonationFilterBar from '../components/DonationFilterBar';
import DonationCallCard from '../components/DonationCallCard';
import '../styles/donation-list.css';
import axios from 'axios';

const DonationCallsList = () => {
  const [donationCalls, setDonationCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('recent');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchDonationCalls = async () => {
      try {
        const response = await axios.get('/api/users/donation-appeals/all');

        // a check to update the status of each call based on the goal and raised amount
        const updatedCalls = response.data.map((call) => ({
          ...call,
          status: call.raised >= call.goal ? 'completed' : 'active',
        }));

        setDonationCalls(updatedCalls);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch donation calls');
        console.error('Error details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonationCalls();
  }, []);

  const filteredCalls = donationCalls.filter((call) => {
    const matchesSearch = call.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || call.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedCalls = [...filteredCalls].sort((a, b) => {
    if (sortOption === 'recent') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOption === 'goal_asc') {
      return a.goal - b.goal;
    } else if (sortOption === 'goal_desc') {
      return b.goal - a.goal;
    }
    return 0;
  });

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-64 bg-blue-600 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="hero-title text-4xl font-extrabold text-white mb-2">Make a Difference</h1>
          <p className="hero-subtitle text-white text-lg">
            Explore and support life-changing donation calls.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <DonationFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSortChange={setSortOption}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Donation Calls Grid */}
      <div className="max-w-7xl mx-auto py-10 px-4">
        {sortedCalls.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedCalls.map((call) => (
              <DonationCallCard key={call._id} call={call} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 mt-20">
            <p>No donation calls found matching your criteria.</p>
          </div>
        )}
      </div>



    </div>
  );
};

export default DonationCallsList;
