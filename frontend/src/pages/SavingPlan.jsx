import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { motion } from 'framer-motion';

const SavingPlan = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rewardPet, setRewardPet] = useState(null);
  const [goalAmount, setGoalAmount] = useState(1000);
  const [duration, setDuration] = useState(30); // days
  const [showConfetti, setShowConfetti] = useState(false);
  const [canSaveToday, setCanSaveToday] = useState(true);
  const [dailyAmount, setDailyAmount] = useState(0);

  useEffect(() => {
    fetchUserSavingPlan();
  }, []);

  useEffect(() => {
    console.log('Current plan:', plan);
    console.log('Daily amount type:', typeof dailyAmount);
    console.log('Goal amount type:', typeof goalAmount);
    console.log('Duration type:', typeof duration);
  }, [plan, dailyAmount, goalAmount, duration]);

  const fetchUserSavingPlan = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/savingplans');
      console.log('response', JSON.stringify(response.data));
      
      if (response.data && response.data.length > 0) {
        // Find the first active (incomplete) plan, or fall back to the first completed plan
        const activePlan = response.data.find(plan => !plan.isCompleted);
        const currentPlan = activePlan || response.data[0];
        
        setPlan(currentPlan);
        
        if (currentPlan.isCompleted && currentPlan.petReward) {
          // Fetch pet reward details if needed
          try {
            const petResponse = await axiosInstance.get(`/pets/${currentPlan.petReward}`);
            setRewardPet(petResponse.data);
          } catch (petError) {
            console.error('Error fetching pet reward:', petError);
          }
        }
        
        // Calculate daily amount when plan is first loaded
        if (currentPlan && !currentPlan.isCompleted) {
          const daysRemaining = currentPlan.daysRemaining || 
            Math.max(1, Math.ceil((new Date(currentPlan.endDate) - new Date()) / (1000 * 60 * 60 * 24)));
          const remainingAmount = currentPlan.remainingAmount || 
            (currentPlan.goalAmount - currentPlan.currentlySaved);
          const calculatedDaily = currentPlan.adjustedDailyAmount || 
            Math.ceil(remainingAmount / daysRemaining);
          setDailyAmount(calculatedDaily);
        }
        
        // Check if user already saved today
        if (currentPlan.lastSavedDate) {
          const lastSaved = new Date(currentPlan.lastSavedDate);
          const today = new Date();
          setCanSaveToday(!(lastSaved.toDateString() === today.toDateString()));
        } else {
          setCanSaveToday(true);
        }
      } else {
        setPlan(null);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching saving plan:', error);
      setError('Failed to fetch your saving plan');
      setLoading(false);
    }
  };
  const createSavingPlan = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/savingplans/create', {
        goalAmount,
        duration,
      });
      
      const newPlan = response.data.savingPlan;
      setPlan(newPlan);
      setRewardPet(null);
      
      // Calculate daily amount
      const daily = Math.ceil(newPlan.goalAmount / newPlan.duration);
      setDailyAmount(daily);
      setCanSaveToday(true);
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create saving plan');
      setLoading(false);
    }
  };

  const addDailySavings = async () => {
    if (!plan || plan.isCompleted || !canSaveToday) return;
    
    try {
      setLoading(true);
      const response = await axiosInstance.put('/savingplans/update', {
        savingPlanId: plan._id,
        amount: dailyAmount  // Make sure this is a number
      });
      
      console.log('Update response:', response.data); // Debug log
      
      const updatedPlan = response.data.savingPlan;
      setPlan(updatedPlan);
      
      // Update daily amount based on response
      if (updatedPlan.adjustedDailyAmount) {
        setDailyAmount(updatedPlan.adjustedDailyAmount);
      } else {
        // Fallback calculation if backend doesn't provide it
        const daysRemaining = Math.max(1, Math.ceil(
          (new Date(updatedPlan.endDate) - new Date()) / (1000 * 60 * 60 * 24)
        ));
        const remainingAmount = updatedPlan.goalAmount - updatedPlan.currentlySaved;
        setDailyAmount(Math.ceil(remainingAmount / daysRemaining));
      }
      
      setCanSaveToday(false);
      
      if (response.data.rewardPet) {
        setRewardPet(response.data.rewardPet);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Update error:', err.response?.data); // More detailed error logging
      setError(err.response?.data?.message || 'Failed to update saving amount');
      setLoading(false);
    }
  };

  const resetPlanAndStartNew = () => {
    setPlan(null);
    setRewardPet(null);
    setCanSaveToday(true);
    setDailyAmount(0);
  };

  const calculateProgress = () => {
    if (!plan) return 0;
    return (plan.currentlySaved / plan.goalAmount) * 100;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(amount);
  };

  const getRarityStyle = (rarity) => {
    switch (rarity) {
      case 'Legendary': return 'bg-gradient-to-r from-yellow-400 to-amber-600 text-white';
      case 'Epic': return 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white';
      case 'Rare': return 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white';
      case 'Uncommon': return 'bg-gradient-to-r from-green-500 to-lime-500 text-white';
      default: return 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800';
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-gradient-to-r from-amber-400 to-orange-500';
    if (percentage >= 75) return 'bg-gradient-to-r from-emerald-400 to-teal-500';
    if (percentage >= 50) return 'bg-gradient-to-r from-blue-400 to-indigo-500';
    if (percentage >= 25) return 'bg-gradient-to-r from-violet-400 to-purple-500';
    return 'bg-gradient-to-r from-gray-300 to-gray-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div 
          className="flex flex-col items-center"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5,
            ease: "easeInOut"
          }}
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-xl font-bold text-gray-700">
            Loading your savings...
          </span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-6">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              initial={{ 
                y: -100,
                x: Math.random() * window.innerWidth - window.innerWidth / 2,
                opacity: 1,
                scale: 1
              }}
              animate={{ 
                y: window.innerHeight,
                x: Math.random() * 200 - 100,
                opacity: 0,
                scale: 0.5,
                rotate: Math.random() * 360
              }}
              transition={{ 
                duration: 3,
                ease: "linear"
              }}
              style={{
                color: ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ef4444'][Math.floor(Math.random() * 5)]
              }}
            >
              {['💰', '🎯', '🏆', '✨', '🤑', '💎'][Math.floor(Math.random() * 6)]}
            </motion.div>
          ))}
        </div>
      )}

      {error && (
        <motion.div 
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex justify-between items-center shadow-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="font-medium">{error}</span>
          <button
            className="ml-4 text-red-500 hover:text-red-700 transition-colors"
            onClick={() => setError(null)}
          >
            &times;
          </button>
        </motion.div>
      )}

      <motion.h1 
        className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Savings Challenge
      </motion.h1>

      {!plan ? (
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-lg mx-auto w-full border border-gray-200"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Start Your Savings Journey
          </h2>
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <motion.div 
                className="flex-1"
                whileHover={{ scale: 1.02 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Amount (₱)
                </label>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(Number(e.target.value))}  // Ensure conversion to number
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </motion.div>
              <motion.div 
                className="flex-1"
                whileHover={{ scale: 1.02 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (days)
                </label>
                <input
                  type="number"
                  min="7"
                  max="365"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}  // Ensure conversion to number
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </motion.div>
            </div>
          </div>

          <motion.button
            onClick={createSavingPlan}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-bold shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Challenge 🚀
          </motion.button>
        </motion.div>
      ) : (
        <div className="max-w-lg mx-auto w-full">
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Your Savings Progress
            </h2>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="font-bold text-gray-700">
                  {formatCurrency(plan.currentlySaved)} of {formatCurrency(plan.goalAmount)}
                </span>
                <span className="font-bold text-blue-600">{Math.round(calculateProgress())}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner overflow-hidden">
                <motion.div
                  className={`h-3 rounded-full ${getProgressColor(calculateProgress())}`}
                  initial={{ width: '0%' }}
                  animate={{ width: `${calculateProgress()}%` }}
                  transition={{ duration: 1, type: "spring" }}
                />
              </div>
            </div>

            {!plan.isCompleted && (
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-3 text-gray-700">
                  Daily Savings
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Today's Amount</p>
                      <p className="text-2xl font-bold text-blue-800">{formatCurrency(dailyAmount)}</p>
                    </div>
                    <motion.button
                      onClick={addDailySavings}
                      disabled={!canSaveToday || loading}
                      className={`px-6 py-3 rounded-lg font-bold shadow-md ${
                        canSaveToday 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      whileHover={canSaveToday ? { scale: 1.05 } : {}}
                      whileTap={canSaveToday ? { scale: 0.95 } : {}}
                    >
                      {canSaveToday ? 'Add Today\'s Savings 💰' : 'Already Saved Today'}
                    </motion.button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Days Remaining</p>
                    <p className="font-bold text-gray-800">
                      {Math.max(0, Math.ceil((new Date(plan.endDate) - new Date()) / (1000 * 60 * 60 * 24)))}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Amount Left</p>
                    <p className="font-bold text-gray-800">
                      {formatCurrency(plan.goalAmount - plan.currentlySaved)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {plan.isCompleted && (
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring" }}
            >
              <div className="flex items-center justify-center mb-4">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-md"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 2
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              </div>
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
                Challenge Complete!
              </h3>
              <p className="text-center text-gray-600 mb-6">
                You've unlocked a reward! 🎉
              </p>
              
              {rewardPet && (
                <motion.div 
                  className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="text-xl font-bold text-center text-gray-800 mb-4">
                    Your Reward Pet
                  </h4>
                  
                  <div className="flex justify-center mb-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${getRarityStyle(rewardPet.rarity)} shadow-sm`}>
                      {rewardPet.rarity} Pet
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-4xl mb-3 shadow-md">
                      {getPetEmoji(rewardPet.type)}
                    </div>
                    <h5 className="text-xl font-bold text-gray-800">{rewardPet.name}</h5>
                    <p className="text-gray-600">{rewardPet.type}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Color</p>
                      <p className="font-bold text-gray-800">{rewardPet.color}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Level</p>
                      <p className="font-bold text-gray-800">{rewardPet.level}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200 col-span-2">
                      <p className="text-xs text-gray-500 mb-1">Special Ability</p>
                      <p className="font-bold text-gray-800">{rewardPet.specialAbility}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white p-2 rounded-lg border border-blue-100 text-center">
                      <p className="text-xs text-blue-500 mb-1">Strength</p>
                      <div className="flex justify-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                          {rewardPet.strength}
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-green-100 text-center">
                      <p className="text-xs text-green-500 mb-1">Agility</p>
                      <div className="flex justify-center">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600">
                          {rewardPet.agility}
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-amber-100 text-center">
                      <p className="text-xs text-amber-500 mb-1">Intelligence</p>
                      <div className="flex justify-center">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-600">
                          {rewardPet.intelligence}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <motion.button
                onClick={resetPlanAndStartNew}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-bold shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start New Challenge 🏆
              </motion.button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to get pet emoji
function getPetEmoji(type) {
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
}

export default SavingPlan;