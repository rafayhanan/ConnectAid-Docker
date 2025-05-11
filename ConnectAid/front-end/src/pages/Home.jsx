import React from 'react';
import { PlusCircleIcon, CurrencyDollarIcon, ChartBarIcon } from '@heroicons/react/24/solid';
import educationImg from '../assets/education.jpg';
import healthcareImg from '../assets/healthcare.jpg';
import communityImg from '../assets/comm.webp';


const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero bg-blue-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to ConnectAid</h1>
          <p className="text-lg mb-6">
            Empowering communities through transparency and compassion. Join us to make a difference!
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Featured Donation Appeals */}
      <section className="featured-donations py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Explore Donation Appeals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="donation-card bg-white shadow-lg rounded-lg p-6">
              <img 
                src={educationImg} 
                alt="Education Appeal" 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Education for All</h3>
              <p className="text-gray-600 text-sm mb-4">
                Help underprivileged children access quality education and transform their lives.
              </p>
              <button 
                className="text-blue-600 font-semibold hover:underline"
                onClick={() => window.location.href = '/login'}
              >
                View Details
              </button>
            </div>
            <div className="donation-card bg-white shadow-lg rounded-lg p-6">
              <img 
                src={healthcareImg} 
                alt="Healthcare Appeal" 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Healthcare for All</h3>
              <p className="text-gray-600 text-sm mb-4">
                Provide essential medical supplies and support to those in need.
              </p>
              <button 
                className="text-blue-600 font-semibold hover:underline"
                onClick={() => window.location.href = '/login'}
              >
                View Details
              </button>
            </div>
            <div className="donation-card bg-white shadow-lg rounded-lg p-6">
              <img 
                src={communityImg} 
                alt="Community Support Appeal" 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Community Support</h3>
              <p className="text-gray-600 text-sm mb-8">
                Help rebuild communities and support local initiatives.
              </p>
              <button 
                className="text-blue-600 font-semibold hover:underline"
                onClick={() => window.location.href = '/login'}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="step">
              <div className="icon mb-4 flex items-center justify-center">
                <PlusCircleIcon className="h-16 w-16 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Create an Appeal</h3>
              <p className="text-gray-600">
                Set up a donation appeal for your cause in just a few steps.
              </p>
            </div>
            <div className="step">
              <div className="icon mb-4 flex items-center justify-center">
                <CurrencyDollarIcon className="h-16 w-16 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Donate</h3>
              <p className="text-gray-600">
                Browse donation appeals and contribute directly to causes you care about.
              </p>
            </div>
            <div className="step">
              <div className="icon mb-4 flex items-center justify-center">
                <ChartBarIcon className="h-16 w-16 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Stay updated on how your donations are making an impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer bg-black text-white py-6">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} ConnectAid. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
