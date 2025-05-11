import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/donation-card.css'

const DonationCallCard = ({ call }) => {
  const navigate = useNavigate();
  
  const calculateProgress = (raised, goal) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const getStatusBadge = () => {
    switch (call.status) {
      case 'completed':
        return (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm backdrop-blur-sm bg-opacity-90">
            Completed
          </div>
        );
      case 'cancelled':
        return (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm backdrop-blur-sm bg-opacity-90">
            Cancelled
          </div>
        );
      default:
        return (
          <div className="absolute top-3 right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm backdrop-blur-sm bg-opacity-90">
            Active
          </div>
        );
    }
  };

  return (
    <div className="donation-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      <div className="relative">
        {getStatusBadge()}
        <img
          src={call.image}
          alt={call.title}
          className="w-full h-48 object-cover card-image hover:opacity-95 transition-opacity duration-300"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 line-clamp-2 leading-snug">{call.title}</h3>
        <div className="mb-5">
        <div className="flex justify-between text-sm text-gray-600 mb-2 font-medium">
            <div className="flex-1 text-left">
              <span>Raised:</span>
              <span className="ml-2">{`PKR ${call.raised.toLocaleString()}`}</span>
            </div>
            <div className="flex-1 text-right">
              <span>Goal:</span>
              <span className="ml-2">{`PKR ${call.goal.toLocaleString()}`}</span>
            </div>
          </div>

          <div className="progress-bar-container mt-2">
            <div
              className={`progress-bar ${
                call.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${calculateProgress(call.raised, call.goal)}%` }}
            ></div>
          </div>
        </div>
        <button
          onClick={() => navigate(`/main/donation-calls/${call._id}`)}
          disabled={call.status !== 'active'}
          className={`donation-button w-full px-4 py-2.5 rounded-lg font-medium transition-all duration-300 ${
            call.status === 'active'
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow'
              : 'bg-gray-400 text-white cursor-not-allowed shadow-sm hover:shadow'
          }`}
        >
          {call.status === 'active' ? 'Donate Now' : 'Donation Closed'}
        </button>
      </div>
    </div>
  );
};

export default DonationCallCard;