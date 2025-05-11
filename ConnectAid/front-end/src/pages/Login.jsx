import React, { useState } from 'react';
import Button from '../components/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage(null);

      const response = await axios.post('/api/users/login', { email, password });

      localStorage.setItem('authToken', response.data.token);
      setMessage(response.data.message); 
      setLoading(false);

      navigate('/main');
    } catch (error) {
      setLoading(false);

      if (error.response) {
        setMessage(error.response.data.message); 
      } else {
        setMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div>
      <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        {message && (
          <p className={`text-center mb-4 ${message.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex space-x-3 justify-center">
            <Button
              text={loading ? 'Logging in...' : 'Login'}
              type="submit"
              color="bg-blue-500"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
