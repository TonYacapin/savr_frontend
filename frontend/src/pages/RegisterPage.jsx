import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axiosInstance.post('/users/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });

            setSuccess('User registered successfully!');
            setError('');
            setFormData({
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
            });
            console.log('Response:', response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
            setSuccess('');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4 py-8 sm:px-6 md:px-8">
            <div className="w-full max-w-md bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-800">
                    <span className="text-orange-400">Pocket</span>Savr Registration
                </h1>
                
                {error && (
                    <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded">
                        <p className="text-red-500 text-xs sm:text-sm">{error}</p>
                    </div>
                )}
                
                {success && (
                    <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded">
                        <p className="text-green-500 text-xs sm:text-sm">{success}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium text-xs sm:text-sm text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block mb-1 font-medium text-xs sm:text-sm text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block mb-1 font-medium text-xs sm:text-sm text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs sm:text-sm text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block mb-1 font-medium text-xs sm:text-sm text-gray-700">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                placeholder="Confirm your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs sm:text-sm text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-orange-400 text-white py-2 px-4 rounded-md font-medium text-sm transition duration-300 ${
                            isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-500'
                        }`}
                    >
                        {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
                </form>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs sm:text-sm text-center text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" className="text-blue-400 hover:underline">
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;