import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const Dashboard = () => {
  const [userPets, setUserPets] = useState([]);
  const [allPets, setAllPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('myPets');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRarity, setFilterRarity] = useState('');
  const [filterType, setFilterType] = useState('');

  // Define rarity colors for styling
  const rarityColors = {
    Common: 'bg-gray-200 text-gray-800',
    Uncommon: 'bg-green-200 text-green-800',
    Rare: 'bg-blue-200 text-blue-800',
    Epic: 'bg-purple-200 text-purple-800',
    Legendary: 'bg-yellow-200 text-yellow-800'
  };

  // Static lists for filtering
  const petTypes = ['Dog', 'Cat', 'Dragon', 'Bird', 'Rabbit', 'Fox'];
  const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's pets
      const userPetsResponse = await axiosInstance.get('/pets');
      setUserPets(userPetsResponse.data);
      
      // Fetch all users' pets
      const allPetsResponse = await axiosInstance.get('/pets/all');
      setAllPets(allPetsResponse.data);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load pet data');
      setLoading(false);
      console.error(err);
    }
  };

  // Create a random pet (for testing purposes)
  const createRandomPet = async () => {
    try {
      setLoading(true);
      await axiosInstance.post('/pets/create');
      // Refresh pets data
      fetchData();
    } catch (error) {
        console.log('Error creating pet:', error);
      setError('Failed to create pet');
      setLoading(false);
    }
  };

  // Apply filters and search to pet list
  const filterPets = (petList) => {
    return petList.filter(pet => {
      // Apply search term filter
      const matchesSearch = searchTerm === '' || 
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pet.owner?.username && pet.owner.username.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Apply rarity filter
      const matchesRarity = filterRarity === '' || pet.rarity === filterRarity;
      
      // Apply type filter
      const matchesType = filterType === '' || pet.type === filterType;
      
      return matchesSearch && matchesRarity && matchesType;
    });
  };

  // Calculate progress bar width based on stat value (1-100)
  const getStatBarWidth = (value) => {
    return `${value}%`;
  };

  // Display loading state
  if (loading && !userPets.length && !allPets.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading pets...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-4 md:mb-0">Pet Dashboard</h1>
          {/* <button
            onClick={createRandomPet}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Create Random Pet
          </button> */}
        </div>

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

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('myPets')}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'myPets'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Pets ({userPets.length})
          </button>
          <button
            onClick={() => setActiveTab('allPets')}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'allPets'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Pets ({allPets.length})
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by pet name or owner..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="px-4 py-2 border text-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value)}
            >
              <option  value="">All Rarities</option>
              {rarities.map(rarity => (
                <option key={rarity} value={rarity}>{rarity}</option>
              ))}
            </select>
            <select
              className="px-4 py-2 border text-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              {petTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'myPets' && filterPets(userPets).length === 0 && (
            <div className="col-span-full text-center p-8">
              <p className="text-gray-600">You don't have any pets yet. Create one to get started!</p>
            </div>
          )}
          
          {activeTab === 'allPets' && filterPets(allPets).length === 0 && (
            <div className="col-span-full text-center p-8">
              <p className="text-gray-600">No pets found matching your filters.</p>
            </div>
          )}

          {filterPets(activeTab === 'myPets' ? userPets : allPets).map((pet) => (
            <div key={pet._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white truncate">{pet.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${rarityColors[pet.rarity]}`}>
                    {pet.rarity}
                  </span>
                </div>
                {activeTab === 'allPets' && pet.owner && (
                  <p className="text-blue-100 text-sm ">Owner: {pet.owner.username || 'Unknown'}</p>
                )}
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Type</p>
                    <p className="font-medium text-gray-600">{pet.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Color</p>
                    <p className="font-medium text-gray-600">{pet.color}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Age</p>
                    <p className="font-medium text-gray-600">{pet.age} years</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Level</p>
                    <p className="font-medium text-gray-600">{pet.level}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-600 text-sm mb-1">Special Ability</p>
                  <p className="font-medium text-gray-600">{pet.specialAbility}</p>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="flex text-gray-600 justify-between text-xs mb-1">
                      <span>Strength</span>
                      <span>{pet.strength}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: getStatBarWidth(pet.strength) }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex  text-gray-600 not-odd:justify-between text-xs mb-1">
                      <span>Agility</span>
                      <span>{pet.agility}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: getStatBarWidth(pet.agility) }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex  text-gray-600 justify-between text-xs mb-1">
                      <span>Intelligence</span>
                      <span>{pet.intelligence}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: getStatBarWidth(pet.intelligence) }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;