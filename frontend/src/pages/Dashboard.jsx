import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [userPets, setUserPets] = useState([]);
  const [allPets, setAllPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('myPets');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRarity, setFilterRarity] = useState('');
  const [filterType, setFilterType] = useState('');

  // Neutral rarity styles
  const rarityStyles = {
    Common: 'bg-gray-100 text-gray-800 border-gray-300',
    Uncommon: 'bg-green-100 text-green-800 border-green-300',
    Rare: 'bg-blue-100 text-blue-800 border-blue-300',
    Epic: 'bg-purple-100 text-purple-800 border-purple-300',
    Legendary: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  };

  // Neutral rarity backgrounds for cards
  const rarityCardStyles = {
    Common: 'bg-gradient-to-br from-gray-50 to-gray-100',
    Uncommon: 'bg-gradient-to-br from-green-50 to-green-100',
    Rare: 'bg-gradient-to-br from-blue-50 to-blue-100',
    Epic: 'bg-gradient-to-br from-purple-50 to-purple-100',
    Legendary: 'bg-gradient-to-br from-yellow-50 to-yellow-100'
  };

  // Pet type emojis
  const petEmojis = {
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

  const petTypes = Object.keys(petEmojis);
  const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const userPetsResponse = await axiosInstance.get('/pets');
      setUserPets(userPetsResponse.data);

      const allPetsResponse = await axiosInstance.get('/pets/all');
      setAllPets(allPetsResponse.data);

      setLoading(false);
    } catch (err) {
      setError('Failed to load pet data');
      setLoading(false);
      console.error(err);
    }
  };

  const filterPets = (petList) => {
    return petList.filter(pet => {
      const matchesSearch = searchTerm === '' ||
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pet.owner?.username && pet.owner.username.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesRarity = filterRarity === '' || pet.rarity === filterRarity;
      const matchesType = filterType === '' || pet.type === filterType;

      return matchesSearch && matchesRarity && matchesType;
    });
  };

  const getStatClass = (value) => {
    if (value >= 80) return 'bg-gradient-to-r from-red-500 to-orange-500';
    if (value >= 60) return 'bg-gradient-to-r from-blue-500 to-indigo-500';
    if (value >= 40) return 'bg-gradient-to-r from-green-500 to-teal-500';
    if (value >= 20) return 'bg-gradient-to-r from-yellow-400 to-amber-400';
    return 'bg-gradient-to-r from-gray-400 to-gray-500';
  };

  if (loading && !userPets.length && !allPets.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          className="flex flex-col items-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-xl font-bold text-gray-700">
            Loading pets...
          </span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <motion.div
              className="mr-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-white">Pet Collection</h1>
              <p className="text-blue-100">Manage and explore your pet companions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {error && (
          <motion.div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex justify-between items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
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

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <motion.button
            onClick={() => setActiveTab('myPets')}
            className={`py-3 px-6 font-bold text-sm relative ${activeTab === 'myPets'
              ? 'text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
            whileHover={{ scale: 1.05 }}
          >
            My Pets ({userPets.length})
            {activeTab === 'myPets' && (
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full"
                layoutId="underline"
              />
            )}
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('allPets')}
            className={`py-3 px-6 font-bold text-sm relative ${activeTab === 'allPets'
              ? 'text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
            whileHover={{ scale: 1.05 }}
          >
            Community Pets ({allPets.length})
            {activeTab === 'allPets' && (
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-t-full"
                layoutId="underline"
              />
            )}
          </motion.button>
        </div>

        {/* Filters */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-xl shadow-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search pets or owners..."
              className="w-full pl-14 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select
              className="px-4 py-3 border border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm appearance-none bg-white"
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value)}
            >
              <option value="">All Rarities</option>
              {rarities.map(rarity => (
                <option key={rarity} value={rarity}>{rarity}</option>
              ))}
            </select>
            <select
              className="px-4 py-3 border border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm appearance-none bg-white"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              {petTypes.map(type => (
                <option key={type} value={type}>{type} {petEmojis[type]}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Pet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'myPets' && filterPets(userPets).length === 0 && (
            <motion.div
              className="col-span-full bg-white rounded-xl shadow-lg p-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-6xl mb-6">🐾</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">No Pets Found</h3>
              <p className="text-gray-600 text-lg mb-6">Your collection is empty.</p>
            </motion.div>
          )}

          {activeTab === 'allPets' && filterPets(allPets).length === 0 && (
            <motion.div
              className="col-span-full bg-white rounded-xl shadow-lg p-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">No Pets Found</h3>
              <p className="text-gray-600 text-lg">Try adjusting your filters to find pets!</p>
            </motion.div>
          )}

          {filterPets(activeTab === 'myPets' ? userPets : allPets).map((pet, index) => (
            <motion.div
              key={pet._id}
              className="rounded-xl overflow-hidden border-2 border-white hover:border-blue-200 hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <div className={`${rarityCardStyles[pet.rarity]} p-6 relative`}>
                <div className="absolute top-0 right-0 mt-4 mr-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${rarityStyles[pet.rarity]} shadow-md`}>
                    {pet.rarity}
                  </span>
                </div>

                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-3xl">{petEmojis[pet.type] || '🐾'}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 truncate">{pet.name}</h3>
                    <div className="flex items-center">
                      <span className="text-xs font-medium bg-blue-600 text-white px-2 py-0.5 rounded-full shadow">
                        LVL {pet.level}
                      </span>
                      {activeTab === 'allPets' && pet.owner && (
                        <span className="ml-2 text-xs text-blue-800">
                          Owner: {pet.owner.username || 'Unknown'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-500 mb-1">Type</p>
                    <p className="font-bold text-blue-800">{pet.type} {petEmojis[pet.type]}</p>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <p className="text-xs text-indigo-500 mb-1">Color</p>
                    <p className="font-bold text-indigo-800">{pet.color}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Age</p>
                    <p className="font-bold text-gray-800">{pet.age} years</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <p className="text-xs text-amber-500 mb-1">Special</p>
                    <p className="font-bold text-amber-800 truncate">{pet.specialAbility}</p>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-2">Stats</h4>

                  {/* Strength */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-gray-700">STRENGTH</span>
                      <span className="font-bold text-gray-700">{pet.strength}</span>
                    </div>
                    <div className="flex space-x-1 h-3 rounded-full overflow-hidden bg-gray-200">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 ${i < pet.strength / 10 ? getStatClass(pet.strength) : 'bg-gray-200'}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Agility */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-gray-700">AGILITY</span>
                      <span className="font-bold text-gray-700">{pet.agility}</span>
                    </div>
                    <div className="flex space-x-1 h-3 rounded-full overflow-hidden bg-gray-200">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 ${i < pet.agility / 10 ? getStatClass(pet.agility) : 'bg-gray-200'}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Intelligence */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-gray-700">INTELLIGENCE</span>
                      <span className="font-bold text-gray-700">{pet.intelligence}</span>
                    </div>
                    <div className="flex space-x-1 h-3 rounded-full overflow-hidden bg-gray-200">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 ${i < pet.intelligence / 10 ? getStatClass(pet.intelligence) : 'bg-gray-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;