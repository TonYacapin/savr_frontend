import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import { GiSwordman, GiSwordwoman, GiSwordsPower } from 'react-icons/gi';
import { FaHeart, FaShieldAlt, FaBolt, FaBrain } from 'react-icons/fa';

const PetVsEnvironment = () => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [userPets, setUserPets] = useState([]);
  const [battleResult, setBattleResult] = useState(null);
  const [enemy, setEnemy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [battleLog, setBattleLog] = useState([]);
  const [showTutorial, setShowTutorial] = useState(true);
  const [battleStage, setBattleStage] = useState('selection'); // 'selection', 'battle', 'result'

  // Expanded pet emojis with more fantasy creatures
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
    Jellyfish: '🎐',
    Manticore: '🦂',
    Basilisk: '🐍',
    Chimera: '🦁',
    Kraken: '🐙',
    Yeti: '❄️',
    Minotaur: '🐮',
    Pegasus: '🦄',
    Cerberus: '🐕🐕🐕',
    Hydra: '🐉🐉🐉',
    Golem: '🗿',
    Imp: '👹',
    Fairy: '🧚',
    Ghost: '👻',
    Vampire: '🧛',
    Werewolf: '🐺🌕',
    Zombie: '🧟',
    Skeleton: '💀',
    Demon: '😈',
    Angel: '👼',
    Alien: '👽',
    Robot: '🤖',
    Dinosaur: '🦖',
    Treant: '🌳'
  };

  const rarityColors = {
    Common: 'bg-gray-100 text-gray-800',
    Uncommon: 'bg-green-100 text-green-800',
    Rare: 'bg-blue-100 text-blue-800',
    Epic: 'bg-purple-100 text-purple-800',
    Legendary: 'bg-yellow-100 text-yellow-800'
  };

  useEffect(() => {
    const fetchUserPets = async () => {
      try {
        const response = await axiosInstance.get('/pets');
        setUserPets(response.data);
      } catch (error) {
        console.error('Error fetching user pets:', error);
        alert('Failed to load your pets. Please try again.');
      }
    };

    fetchUserPets();
  }, []);

  const handleBattle = async () => {
    if (!selectedPet) {
      alert('Please select a pet to battle!');
      return;
    }

    setLoading(true);
    setBattleStage('battle');
    setBattleLog([]); // Clear previous battle log

    try {
      // Simulate battle with delay for dramatic effect
      const response = await axiosInstance.post(`/pets/pve/${selectedPet._id}`);
      
      // Simulate battle turns
      const turns = [
        `${selectedPet.name} charges at the enemy!`,
        `The enemy ${response.data.enemy.name} counterattacks!`,
        `Critical hit from ${selectedPet.name}!`,
        `The battle reaches its climax...`
      ];
      
      // Animate battle log
      turns.forEach((message, i) => {
        setTimeout(() => {
          setBattleLog(prev => [...prev, message]);
        }, (i + 1) * 1000);
      });

      // Show final result after all turns
      setTimeout(() => {
        setBattleResult(response.data.message);
        setEnemy(response.data.enemy);
        setBattleStage('result');
        setLoading(false);
      }, 5000);

    } catch (error) {
      console.error('Error during battle:', error);
      alert('Failed to simulate the battle. Please try again.');
      setLoading(false);
      setBattleStage('selection');
    }
  };

  const calculateWinProbability = () => {
    if (!selectedPet || !enemy) return 50;
    
    const petPower = selectedPet.strength + selectedPet.agility + selectedPet.intelligence;
    const enemyPower = enemy.strength + enemy.agility + enemy.intelligence;
    
    // Simple probability calculation based on stats
    return Math.round((petPower / (petPower + enemyPower)) * 100);
  };

  const rematch = () => {
    setBattleResult(null);
    setEnemy(null);
    setBattleLog([]);
    setBattleStage('selection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6 text-white">
      <h1 className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
        Pet vs Environment
      </h1>

      {showTutorial && (
        <motion.div 
          className="fixed inset-0 bg-black/50 bg-opacity-80 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="bg-gray-800/50 rounded-xl p-6 max-w-md w-full border-2 border-yellow-400"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Battle Tutorial</h2>
            <div className="space-y-4 mb-6">
              <p>1. Select your pet from your collection</p>
              <p>2. Battle against randomly generated enemies</p>
              <p>3. Win battles to earn experience and level up</p>
              <p>4. Stronger pets have better chances of winning</p>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => setShowTutorial(false)}
                className="px-4 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition"
              >
                Got It!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Pet Selection */}
      {battleStage === 'selection' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">Select Your Champion</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {userPets.length > 0 ? (
              userPets.map((pet) => (
                <motion.div
                  key={pet._id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedPet?._id === pet._id 
                      ? 'border-yellow-400 bg-gray-700 scale-105 shadow-lg' 
                      : 'border-gray-600 bg-gray-800 hover:border-gray-400'
                  }`}
                  onClick={() => setSelectedPet(pet)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-5xl">{petEmojis[pet.type]}</div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${rarityColors[pet.rarity]}`}>
                      {pet.rarity}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold truncate">{pet.name}</h3>
                  <div className="flex justify-between text-sm mt-2">
                    <span>Lvl {pet.level}</span>
                    <div className="flex space-x-1">
                      <span className="flex items-center text-red-400"><FaHeart className="mr-1" /> {pet.strength}</span>
                      <span className="flex items-center text-blue-400"><FaBolt className="mr-1" /> {pet.agility}</span>
                      <span className="flex items-center text-purple-400"><FaBrain className="mr-1" /> {pet.intelligence}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-xl text-gray-400">You have no pets. Create one to start battling!</p>
              </div>
            )}
          </div>

          {selectedPet && (
            <motion.div 
              className="mb-8 p-6 bg-gray-800 rounded-xl border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <GiSwordman className="text-yellow-500 mr-2" /> Selected Champion
              </h3>
              <div className="flex items-center">
                <div className="text-6xl mr-4">{petEmojis[selectedPet.type]}</div>
                <div>
                  <h4 className="text-2xl font-bold">{selectedPet.name}</h4>
                  <div className="flex space-x-4 mt-2">
                    <div>
                      <p className="text-sm text-gray-400">Level</p>
                      <p className="font-bold">{selectedPet.level}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Strength</p>
                      <p className="font-bold text-red-400">{selectedPet.strength}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Agility</p>
                      <p className="font-bold text-blue-400">{selectedPet.agility}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Intelligence</p>
                      <p className="font-bold text-purple-400">{selectedPet.intelligence}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="text-center">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              onClick={handleBattle}
              disabled={loading || !selectedPet}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center justify-center">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Preparing Battle...
                  </>
                ) : (
                  <>
                    <GiSwordsPower className="mr-2 text-xl" />
                    {selectedPet ? 'Start Battle!' : 'Select a Pet First'}
                  </>
                )}
              </div>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Battle Animation */}
      {battleStage === 'battle' && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-yellow-400">BATTLE IN PROGRESS!</h2>
          
          <div className="flex justify-center items-center space-x-4 md:space-x-12 mb-8">
            {/* Player Pet */}
            <motion.div
              className="text-center"
              animate={{ 
                x: [0, 20, -20, 0],
                y: [0, -10, 10, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut"
              }}
            >
              <div className="text-8xl mb-2">{petEmojis[selectedPet.type]}</div>
              <div className="bg-gray-800 rounded-lg p-2">
                <h3 className="font-bold">{selectedPet.name}</h3>
                <div className="flex justify-center space-x-2 text-xs">
                  <span className="text-red-400">❤️ {selectedPet.strength}</span>
                  <span className="text-blue-400">⚡ {selectedPet.agility}</span>
                  <span className="text-purple-400">🧠 {selectedPet.intelligence}</span>
                </div>
              </div>
            </motion.div>

            {/* VS Badge */}
            <motion.div
              className="bg-red-600 text-white font-bold rounded-full w-16 h-16 flex items-center justify-center text-xl"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut"
              }}
            >
              VS
            </motion.div>

            {/* Enemy - Loading state */}
            <motion.div
              className="text-center"
              animate={{ 
                x: [0, -20, 20, 0],
                y: [0, 10, -10, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <div className="text-8xl mb-2">❓</div>
              <div className="bg-gray-800 rounded-lg p-2">
                <h3 className="font-bold">Unknown Enemy</h3>
                <div className="flex justify-center space-x-2 text-xs">
                  <span className="text-gray-400">????</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Battle Log */}
          <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-4 h-48 overflow-y-auto">
            <h3 className="text-lg font-bold mb-2 text-yellow-400">Battle Log</h3>
            <div className="space-y-2 text-left">
              {battleLog.length > 0 ? (
                battleLog.map((log, index) => (
                  <motion.p 
                    key={index}
                    className="text-sm border-l-2 border-yellow-500 pl-2 py-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {log}
                  </motion.p>
                ))
              ) : (
                <p className="text-gray-400">The battle is about to begin...</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Battle Result */}
      {battleStage === 'result' && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-3xl font-bold mb-8">
            {battleResult.includes('won') ? (
              <span className="text-green-400">VICTORY!</span>
            ) : (
              <span className="text-red-400">DEFEAT!</span>
            )}
          </h2>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
            {/* Player Pet */}
            <motion.div
              className="text-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <div className="text-8xl mb-2">{petEmojis[selectedPet.type]}</div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-bold text-xl">{selectedPet.name}</h3>
                <div className="flex justify-center space-x-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-400">Level</p>
                    <p className="font-bold">{selectedPet.level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Strength</p>
                    <p className="font-bold text-red-400">{selectedPet.strength}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Agility</p>
                    <p className="font-bold text-blue-400">{selectedPet.agility}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Intelligence</p>
                    <p className="font-bold text-purple-400">{selectedPet.intelligence}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* VS Badge */}
            <div className="my-4 md:my-0">
              <div className="bg-gray-700 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center">
                VS
              </div>
            </div>

            {/* Enemy */}
            <motion.div
              className="text-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-8xl mb-2">{petEmojis[enemy.type]}</div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-bold text-xl">{enemy.name}</h3>
                <div className="flex justify-center space-x-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-400">Level</p>
                    <p className="font-bold">{enemy.level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Strength</p>
                    <p className="font-bold text-red-400">{enemy.strength}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Agility</p>
                    <p className="font-bold text-blue-400">{enemy.agility}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Intelligence</p>
                    <p className="font-bold text-purple-400">{enemy.intelligence}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Battle Summary */}
          <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Battle Summary</h3>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span>Win Probability</span>
                <span>{calculateWinProbability()}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div 
                  className="h-4 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" 
                  style={{ width: `${calculateWinProbability()}%` }}
                ></div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-700 rounded-lg mb-4">
              <p className="text-lg font-semibold text-center">
                {battleResult.includes('won') ? (
                  <span className="text-green-400">🎉 {battleResult} 🎉</span>
                ) : (
                  <span className="text-red-400">😢 {battleResult} 😢</span>
                )}
              </p>
            </div>
            
            {battleResult.includes('won') && (
              <div className="p-4 bg-yellow-900 rounded-lg text-yellow-200">
                <p className="font-bold">✨ Reward: +50 XP</p>
                <p className="text-sm">Your pet is getting stronger!</p>
              </div>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={rematch}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
            >
              Rematch
            </button>
            <button
              onClick={() => setBattleStage('selection')}
              className="px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition"
            >
              Choose New Pet
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PetVsEnvironment;