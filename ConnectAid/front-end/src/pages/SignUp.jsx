import React, { useState } from 'react';
import Button from '../components/Button';
import axios from 'axios';

const SignUp = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setMessage(null);

            const response = await axios.post('/api/users/signup', {
                firstName,
                lastName,
                email,
                password,
                dateOfBirth: birthDate,
            });

            setMessage(response.data.message); 
            setLoading(false);

            
            setFirstName('');
            setLastName('');
            setEmail('');
            setBirthDate('');
            setPassword('');
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
                <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
                {message && (
                    <p className={`text-center mb-4 ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
                        {message}
                    </p>
                )}
                <form onSubmit={handleSignup}>
                    <div className="mb-4">
                        <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter First Name"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Last Name"
                            required
                        />
                    </div>
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
                    <div className="mb-4">
                        <label htmlFor="birthDate" className="block text-sm font-semibold text-gray-700 mb-2">
                            Date Of Birth
                        </label>
                        <input
                            type="date"
                            id="birthDate"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="flex space-x-3 justify-center">
                        <Button
                            text={loading ? 'Signing Up...' : 'Sign Up'}
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

export default SignUp;
