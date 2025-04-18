import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axiosInstance.post('/login', { email, password });
            document.cookie = `token=${res.data.token}; path=/`;
            window.location.href = '/home';
        } catch (error) {
            console.log('Login error:', error);
            setError('Invalid email or password.');
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-6 sm:px-6 md:px-8"
            style={{ backgroundColor: '#D1E8E2' }} // Sage Green
        >
            <div
                className="w-full max-w-md rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 relative"
                style={{
                    backgroundColor: '#F1F2F6', // Cool Light Gray
                    border: '2px solid #6B5B4C', // Warm Taupe border
                }}
            >
                {/* Brand Name */}
                <div className="text-center mb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#2F3E46' }}>
                        <span style={{ color: '#F4A261' }}>Pocket</span>Savr
                    </h1>
                </div>
                
                {/* Pet Avatar */}
                <div className="flex justify-center mb-2 sm:mb-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#8EC6D7] flex items-center justify-center shadow-lg border-4 border-[#F4A261] animate-bounce-slow">
                        {/* Example SVG pet (cat) - scaled for mobile */}
                        <svg width="80%" height="80%" viewBox="0 0 48 48" fill="none">
                            <ellipse cx="24" cy="30" rx="14" ry="12" fill="#fff"/>
                            <ellipse cx="24" cy="30" rx="10" ry="8" fill="#8EC6D7"/>
                            <ellipse cx="18" cy="28" rx="2" ry="3" fill="#2F3E46"/>
                            <ellipse cx="30" cy="28" rx="2" ry="3" fill="#2F3E46"/>
                            <ellipse cx="24" cy="34" rx="3" ry="2" fill="#F4A261"/>
                            <polygon points="12,18 18,22 16,14" fill="#fff"/>
                            <polygon points="36,18 30,22 32,14" fill="#fff"/>
                        </svg>
                    </div>
                </div>
       
                <h2
                    className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center"
                    style={{ color: '#2F3E46' }} // Slate Gray
                >
                    Welcome Back!
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div>
                        <label
                            className="block mb-1 font-medium text-sm sm:text-base"
                            style={{ color: '#6B5B4C' }} // Warm Taupe
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full px-3 sm:px-4 py-2 rounded-lg border focus:outline-none text-sm sm:text-base"
                            style={{
                                borderColor: '#6B5B4C', // Warm Taupe
                                backgroundColor: '#F1F2F6', // Cool Light Gray
                                color: '#2F3E46', // Slate Gray
                            }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label
                            className="block mb-1 font-medium text-sm sm:text-base"
                            style={{ color: '#6B5B4C' }} // Warm Taupe
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="w-full px-3 sm:px-4 py-2 rounded-lg border focus:outline-none text-sm sm:text-base"
                                style={{
                                    borderColor: '#6B5B4C', // Warm Taupe
                                    backgroundColor: '#F1F2F6', // Cool Light Gray
                                    color: '#2F3E46', // Slate Gray
                                }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>
                    {error && (
                        <div className="text-xs sm:text-sm text-center" style={{ color: '#EF476F' }}>
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full py-2 rounded-lg font-semibold shadow transition-transform duration-150 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base"
                        style={{
                            backgroundColor: '#F4A261', // Soft Orange
                            color: '#fff',
                            border: 'none',
                        }}
                    >
                        <span>Login</span>
                        {/* Coin Icon */}
                        <svg width="18" height="18" viewBox="0 0 22 22" fill="none" className="sm:w-[22px] sm:h-[22px]">
                            <circle cx="11" cy="11" r="10" fill="#FFF3B0" stroke="#F4A261" strokeWidth="2"/>
                            <text x="11" y="16" textAnchor="middle" fill="#F4A261" fontSize="14" fontWeight="bold">$</text>
                        </svg>
                    </button>
                    
                    <div className="flex justify-between text-center mt-4 text-xs sm:text-sm" style={{ color: '#6B5B4C' }}>
                        <a href="/forgot-password">Forgot password?</a>
                        <a href="/register">Create account</a>
                    </div>
                </form>
                
                {/* Footer with brand */}
                <div className="mt-6 pt-4 text-center text-xs sm:text-sm" style={{ color: '#6B5B4C' }}>
                    <p>© 2025 <strong>PocketSavr</strong> - Save with joy!</p>
                </div>
            </div>
            {/* Animation keyframes for bounce */}
            <style>
                {`
                .animate-bounce-slow {
                    animation: bounce 2s infinite;
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0);}
                    50% { transform: translateY(-10px);}
                }
                
                @media (max-width: 640px) {
                    input, button {
                        font-size: 16px; /* Prevents zoom on mobile */
                    }
                }
                `}
            </style>
        </div>
    );
};

export default LoginPage;