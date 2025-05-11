import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContributionCard from '../components/ContributionCard';

const UserContributions = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('/api/users/my-contributions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContributions(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch contributions');
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Contributions</h1>

      {contributions.length === 0 ? (
        <div className="p-6 text-center text-gray-600">
          <p className="text-lg">You haven't made any donations yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {contributions.map((contribution) => (
            <ContributionCard key={contribution._id} contribution={contribution} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserContributions;