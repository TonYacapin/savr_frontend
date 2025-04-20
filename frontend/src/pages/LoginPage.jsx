import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [showPetModal, setShowPetModal] = useState(false);
    const [starterPet, setStarterPet] = useState(null);
    const [communityPets, setCommunityPets] = useState([]);
    const [loadingPets, setLoadingPets] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch community pets when component mounts
        const fetchCommunityPets = async () => {
            try {
            const res = await axiosInstance.get('/pets/all');
            // Filter out pets with the same owner and get 6 random pets
            const uniqueOwners = new Set();
            const uniquePets = res.data.filter((pet) => {
                if (uniqueOwners.has(pet.owner?.username)) {
                return false;
                }
                uniqueOwners.add(pet.owner?.username);
                return true;
            });
            const shuffled = uniquePets.sort(() => 0.5 - Math.random());
            setCommunityPets(shuffled.slice(0, 6));
            setLoadingPets(false);
            } catch (error) {
            console.error('Failed to fetch community pets:', error);
            setLoadingPets(false);
            }
        };

        fetchCommunityPets();
    }, []);

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
            Fox: '🦊',
            Wolf: '🐺',
            Turtle: '🐢',
            Lizard: '🦎',
            Tiger: '🐅',
            Lion: '🦁',
            Bear: '🐻',
            Unicorn: '🦄',
            Penguin: '🐧',
            Frog: '🐸',
            Dolphin: '🐬',
            Shark: '🦈',
            Octopus: '🐙',
            Deer: '🦌',
            Bat: '🦇',
            Panda: '🐼',
            Raccoon: '🦝',
            Koala: '🐨',
            Hedgehog: '🦔',
            Chameleon: '🦎',
            Squirrel: '🐿️',
            Snake: '🐍',
            Crocodile: '🐊',
            Horse: '🐎',
            Elephant: '🐘',
            Phoenix: '🔥',
            Griffin: '🦅',
            Slime: '👾',
            Bee: '🐝',
            Ant: '🐜',
            Spider: '🕷️',
            Rat: '🐀',
            Hamster: '🐹',
            Giraffe: '🦒',
            Zebra: '🦓',
            Leopard: '🐆',
            Cheetah: '🐆',
            Eagle: '🦅',
            Parrot: '🦜',
            Seahorse: '🦄',
            Crab: '🦀',
            Moose: '🫎',
            Goat: '🐐',
            Ox: '🐂',
            Jellyfish: '🎐'
        };
        return emojiMap[type] || '🐾';
    };

    const rarityStyles = {
        Common: 'bg-gray-100 text-gray-800',
        Uncommon: 'bg-green-100 text-green-800',
        Rare: 'bg-blue-100 text-blue-800',
        Epic: 'bg-purple-100 text-purple-800',
        Legendary: 'bg-yellow-100 text-yellow-800'
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            {/* Pet Modal */}
            {showPetModal && starterPet && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
                            Welcome to <span className="font-bold text-indigo-600">Pocket Savr</span>! Your pet will grow stronger as you save more money! Start your first savings challenge now.
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
            <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-8">
                <motion.div
                    className="bg-white rounded-xl shadow-lg p-8 w-full lg:w-1/2 text-center border-2 border-blue-100"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <motion.h1
                        className="text-4xl sm:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Welcome to <span className="text-indigo-600">PocketSavr</span>
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

                {/* Community Pets Preview */}
                <motion.div
                    className="bg-white rounded-xl shadow-lg p-6 w-full lg:w-1/2 border-2 border-indigo-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                        Meet Our Community Pets
                    </h2>

                    {loadingPets ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {communityPets.map((pet, index) => (
                                    <motion.div
                                        key={index}
                                        className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-gray-200"
                                        whileHover={{ scale: 1.03 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        <div className="flex items-center">
                                            <div className="text-3xl mr-3">
                                                {getPetEmoji(pet.type)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800 truncate">{pet.name}</h3>
                                                <span className={`text-xs px-2 py-1 rounded-full ${rarityStyles[pet.rarity]}`}>
                                                    {pet.rarity}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-600">
                                            <p>Lvl {pet.level} {pet.type}</p>
                                            {pet.owner?.username && (
                                                <p className="truncate">Owner: {pet.owner.username}</p>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex justify-center"
                            >
                                <button
                                    onClick={() => navigate('/register')}
                                    className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all"
                                >
                                    Join to Get Your Own Pet
                                    <FaArrowRight className="ml-2" />
                                </button>
                            </motion.div>

                            <p className="text-center text-sm text-gray-500 mt-4">
                                Collect and grow unique pets by saving money and completing challenges!
                            </p>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;