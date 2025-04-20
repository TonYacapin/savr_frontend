import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [showPetModal, setShowPetModal] = useState(false);
    const [starterPet, setStarterPet] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axiosInstance.post('/login', { email, password });
            
            // Store token and user data
            document.cookie = `token=${res.data.token}; path=/`;
            
            // Check if this is first login and has a starter pet
            if (res.data.firstLogin && res.data.newUserPet) {
                setStarterPet(res.data.newUserPet);
                setShowPetModal(true);
            } else {
                navigate('/home');
            }
        } catch (error) {
            console.log('Login error:', error);
            setError('Invalid email or password.');
        }
    };

    const handleCloseModal = () => {
        setShowPetModal(false);
        navigate('/home');
    };

    const getPetEmoji = (type) => {
        const emojiMap = {
            Dog: '🐕',
            Cat: '🐈',
            Dragon: '🐉',
            Bird: '🦜',
            Rabbit: '🐇',
            Fox: '🦊'
        };
        return emojiMap[type] || '🐾';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            {/* Pet Modal */}
            {showPetModal && starterPet && (
                <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50 p-4">
                    <motion.div 
                        className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">
                            Welcome to Your Savings Journey!
                        </h2>
                        <div className="text-center mb-2">
                            <div className="text-6xl mb-4">
                                {getPetEmoji(starterPet.type)}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">{starterPet.name}</h3>
                            <p className="text-gray-600">Your new {starterPet.color.toLowerCase()} {starterPet.type}</p>
                        </div>
                        
                        <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div>
                                    <p className="text-xs text-indigo-500">Strength</p>
                                    <p className="font-bold text-indigo-700">{starterPet.strength}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-indigo-500">Agility</p>
                                    <p className="font-bold text-indigo-700">{starterPet.agility}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-indigo-500">Intelligence</p>
                                    <p className="font-bold text-indigo-700">{starterPet.intelligence}</p>
                                </div>
                            </div>
                        </div>
                        
                        <p className="text-center text-gray-600 mb-6">
                            Your pet will grow stronger as you save more money! Start your first savings challenge now.
                        </p>
                        
                        <motion.button
                            onClick={handleCloseModal}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all font-bold shadow-md"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Continue to Dashboard
                        </motion.button>
                    </motion.div>
                </div>
            )}

            {/* Login Form */}
            <motion.div
                className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center border-2 border-blue-100"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                <motion.h1
                    className="text-4xl sm:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    Welcome Back!
                </motion.h1>
                <motion.p
                    className="text-lg sm:text-xl mb-8 text-gray-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Log in to continue your savings journey.
                </motion.p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            className="block mb-2 text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label
                            className="block mb-2 text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    {error && (
                        <motion.div
                            className="text-sm text-red-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {error}
                        </motion.div>
                    )}
                    <motion.button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:bg-blue-700 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Log In
                    </motion.button>
                </form>
                <div className="mt-6 text-sm text-gray-600">
                    <a href="/forgot-password" className="hover:text-blue-600">
                        Forgot password?
                    </a>
                    <span className="mx-2">|</span>
                    <a href="/register" className="hover:text-blue-600">
                        Create account
                    </a>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;