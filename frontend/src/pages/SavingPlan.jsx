import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const SavingPlan = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States for creating a new plan
  const [goalAmount, setGoalAmount] = useState(1000);
  const [duration, setDuration] = useState(30); // days
  
  // State for updating the current plan
  const [savingAmount, setSavingAmount] = useState(0);
  
  // Predefined plans
  const predefinedPlans = [
    { name: "Vacation Fund", amount: 1000, duration: 30 },
    { name: "Emergency Fund", amount: 5000, duration: 90 },
    { name: "New Phone", amount: 800, duration: 45 },
    { name: "Holiday Gifts", amount: 500, duration: 60 },
    { name: "Car Repair", amount: 1500, duration: 60 }
  ];

  useEffect(() => {
    fetchUserSavingPlan();
  }, []);

  const fetchUserSavingPlan = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/savingplans');
      if (response.data && response.data.length > 0) {
        setPlan(response.data[0]); // Assuming we're getting the latest plan
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

  const selectPredefinedPlan = (selectedPlan) => {
    setGoalAmount(selectedPlan.amount);
    setDuration(selectedPlan.duration);
  };

  const createSavingPlan = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/savingplans/create', {
        goalAmount,
        duration
      });
      setPlan(response.data.savingPlan);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create saving plan');
      setLoading(false);
    }
  };

  const updateSavedAmount = async () => {
    if (!savingAmount || savingAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.put('/savingplans/update', {
        savingPlanId: plan._id,
        amount: Number(savingAmount)
      });
      setPlan(response.data.savingPlan);
      setSavingAmount(0); // Reset input after update
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update saving amount');
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    if (!plan) return 0;
    return (plan.currentlySaved / plan.goalAmount) * 100;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(amount);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <span className="font-bold">Error:</span> {error}
          <button 
            className="float-right text-red-700 hover:text-red-900"
            onClick={() => setError(null)}
          >
            &times;
          </button>
        </div>
      )}

      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">Your Saving Journey</h1>

      {!plan ? (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Create a New Saving Plan</h2>
          <p className="text-gray-600 mb-6">
            Select a predefined plan or customize your own to start your saving journey.
            Each plan will reward you with a unique virtual pet when completed!
          </p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Choose a Predefined Plan:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {predefinedPlans.map((predefPlan) => (
                <div 
                  key={predefPlan.name}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => selectPredefinedPlan(predefPlan)}
                >
                  <h4 className="font-medium text-lg">{predefPlan.name}</h4>
                  <p className="text-gray-600">Goal: {formatCurrency(predefPlan.amount)}</p>
                  <p className="text-gray-600">Duration: {predefPlan.duration} days</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Customize Your Plan:</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Amount (₱)
                </label>
                <input
                  type="number"
                  min="100"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (days)
                </label>
                <input
                  type="number"
                  min="7"
                  max="365"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <button
            onClick={createSavingPlan}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Start My Saving Plan
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl text-gray-600  font-semibold mb-4">Your Current Saving Plan</h2>
          
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="font-medium text-gray-600">Progress: {formatCurrency(plan.currentlySaved)} of {formatCurrency(plan.goalAmount)}</span>
              <span className="text-sm font-medium">{Math.round(calculateProgress())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-gray-600">Plan Details</h3>
              <p className="text-gray-600">Goal Amount: {formatCurrency(plan.goalAmount)}</p>
              <p className="text-gray-600">Duration: {plan.duration} days</p>
              <p className="text-gray-600">Status: {plan.isCompleted ? 'Completed' : 'In Progress'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-gray-600">Pet Reward</h3>
              {plan.petReward && (
                <>
                  <p className="text-gray-600">Name: {plan.petReward.name}</p>
                  <p className="text-gray-600">Type: {plan.petReward.type}</p>
                  <p className="text-gray-600">Rarity: <span className={`font-semibold ${
                    plan.petReward.rarity === 'Legendary' ? 'text-yellow-500' :
                    plan.petReward.rarity === 'Epic' ? 'text-purple-500' :
                    plan.petReward.rarity === 'Rare' ? 'text-blue-500' :
                    plan.petReward.rarity === 'Uncommon' ? 'text-green-500' : 'text-gray-500'
                  }`}>{plan.petReward.rarity}</span></p>
                  <p className="text-gray-600">Special Ability: {plan.petReward.specialAbility}</p>
                </>
              )}
            </div>
          </div>

          {!plan.isCompleted && (
            <div className="mt-6">
              <h3 className="text-lg text-gray-600 font-semibold mb-2">Update Your Progress</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={savingAmount}
                  onChange={(e) => setSavingAmount(Number(e.target.value))}
                  placeholder="Amount saved today"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={updateSavedAmount}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Update
                </button>
              </div>
            </div>
          )}

{plan.isCompleted && (
  <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
    <h3 className="text-xl font-bold text-green-600 mb-2">Congratulations!</h3>
    <p>You've completed your saving goal and earned your pet reward!</p>
    <button
      onClick={() => setPlan(null)} // Reset the plan to allow creating a new one
      className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
    >
      Create a New Saving Plan
    </button>
  </div>
)}
        </div>
      )}
    </div>
  );
};

export default SavingPlan;