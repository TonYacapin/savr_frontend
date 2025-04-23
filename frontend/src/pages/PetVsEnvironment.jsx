import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import { GiSwordman, GiSwordwoman, GiSwordsPower, GiTrophy } from 'react-icons/gi';
import { FaHeart, FaShieldAlt, FaBolt, FaBrain, FaSkull, FaRegQuestionCircle } from 'react-icons/fa';
import { IoMdStats } from 'react-icons/io';
import { RiSwordFill } from 'react-icons/ri';

const PetVsEnvironment = () => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [userPets, setUserPets] = useState([]);
  const [battleResult, setBattleResult] = useState(null);
  const [enemy, setEnemy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [battleLog, setBattleLog] = useState([]);
  const [showTutorial, setShowTutorial] = useState(true);
  const [battleStage, setBattleStage] = useState('selection');
  const [xpGained, setXpGained] = useState(0);
  const [levelUp, setLevelUp] = useState(false);
  const [statsIncreased, setStatsIncreased] = useState({});

  // Enhanced pet emojis with more fantasy creatures and better organization
  const petEmojis = {
    // Common animals
    Dog: '🐕', Cat: '🐈', Bird: '🦜', Rabbit: '🐇', Fox: '🦊',
    Wolf: '🐺', Turtle: '🐢', Frog: '🐸', Penguin: '🐧', Bear: '🐻',
    
    // Mythical creatures
    Dragon: '🐉', Unicorn: '🦄', Phoenix: '🔥', Griffin: '🦅', Manticore: '🦂',
    Basilisk: '🐍', Chimera: '🦁', Kraken: '🐙', Yeti: '❄️', Minotaur: '🐮',
    Pegasus: '🦄', Cerberus: '🐕🐕🐕', Hydra: '🐉🐉🐉', Golem: '🗿', Fairy: '🧚',
    
    // Supernatural beings
    Ghost: '👻', Vampire: '🧛', Werewolf: '🐺🌕', Zombie: '🧟', Skeleton: '💀',
    Demon: '😈', Angel: '👼', Alien: '👽', Robot: '🤖',
    
    // Other
    Dinosaur: '🦖', Treant: '🌳', Slime: '👾', Jellyfish: '🎐'
  };

  const rarityColors = {
    Common: 'bg-gray-100 text-gray-800',
    Uncommon: 'bg-green-100 text-green-800',
    Rare: 'bg-blue-100 text-blue-800',
    Epic: 'bg-purple-100 text-purple-800',
    Legendary: 'bg-yellow-100 text-yellow-800',
    Mythic: 'bg-gradient-to-r from-pink-500 to-red-500 text-white'
  };

  const rarityWeights = {
    Common: 0.6,
    Uncommon: 0.25,
    Rare: 0.1,
    Epic: 0.04,
    Legendary: 0.01
  };

  const typeAdvantages = {
    Dragon: ['Dinosaur', 'Slime'],
    Unicorn: ['Ghost', 'Demon'],
    Phoenix: ['Treant', 'Yeti'],
    Vampire: ['Angel', 'Fairy'],
    Robot: ['Ghost', 'Zombie']
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

  const calculateTypeAdvantage = (petType, enemyType) => {
    if (typeAdvantages[petType] && typeAdvantages[petType].includes(enemyType)) {
      return 1.2; // 20% advantage
    }
    if (typeAdvantages[enemyType] && typeAdvantages[enemyType].includes(petType)) {
      return 0.8; // 20% disadvantage
    }
    return 1; // neutral
  };

  const simulateBattleTurn = (attacker, defender, isPlayerAttacking) => {
    const critChance = attacker.agility / 100;
    const isCrit = Math.random() < critChance;
    const baseDamage = (attacker.strength * 0.7 + attacker.agility * 0.3) * (isCrit ? 1.5 : 1);
    
    const dodgeChance = defender.agility / 150;
    const isDodged = Math.random() < dodgeChance;
    
    if (isDodged) {
      return {
        damage: 0,
        isCrit: false,
        isDodged: true,
        message: `${defender.name} dodged the attack!`
      };
    }
    
    return {
      damage: Math.max(1, Math.floor(baseDamage)),
      isCrit,
      isDodged: false,
      message: `${attacker.name} ${isCrit ? 'lands a critical hit!' : 'attacks!'}`
    };
  };

  const handleBattle = async () => {
    if (!selectedPet) {
      alert('Please select a pet to battle!');
      return;
    }

    setLoading(true);
    setBattleStage('battle');
    setBattleLog([]);
    setXpGained(0);
    setLevelUp(false);
    setStatsIncreased({});

    try {
      // Initial battle setup
      const response = await axiosInstance.post(`/pets/pve/${selectedPet._id}`);
      const enemyData = response.data.enemy;
      setEnemy(enemyData);
      
      // Add type advantage if applicable
      const typeMultiplier = calculateTypeAdvantage(selectedPet.type, enemyData.type);
      const typeMessage = typeMultiplier > 1 
        ? `${selectedPet.name} has type advantage against ${enemyData.type}!`
        : typeMultiplier < 1 
          ? `${selectedPet.name} is at a disadvantage against ${enemyData.type}!`
          : null;
      
      if (typeMessage) {
        setBattleLog(prev => [...prev, typeMessage]);
      }

      // Initialize health
      let petHealth = 100 + (selectedPet.level * 5);
      let enemyHealth = 100 + (enemyData.level * 5);
      
      // Battle turns
      const maxTurns = 10;
      let turn = 0;
      
      const battleInterval = setInterval(() => {
        if (turn >= maxTurns || petHealth <= 0 || enemyHealth <= 0) {
          clearInterval(battleInterval);
          
          // Determine winner
          const petWon = petHealth > 0;
          const resultMessage = petWon 
            ? `${selectedPet.name} defeated ${enemyData.name}!`
            : `${selectedPet.name} was defeated by ${enemyData.name}!`;
          
          setBattleLog(prev => [...prev, resultMessage, "Battle concluded!"]);
          
          // Calculate rewards
          if (petWon) {
            const baseXP = 50 + (enemyData.level * 5);
            const xp = Math.floor(baseXP * typeMultiplier);
            setXpGained(xp);
            
            // Check for level up (simplified)
            const newLevel = selectedPet.level + (xp >= 100 ? 1 : 0);
            if (newLevel > selectedPet.level) {
              setLevelUp(true);
              // Random stat increases
              const statIncreases = {
                strength: Math.floor(Math.random() * 3) + 1,
                agility: Math.floor(Math.random() * 3) + 1,
                intelligence: Math.floor(Math.random() * 2) + 1
              };
              setStatsIncreased(statIncreases);
            }
          }
          
          setTimeout(() => {
            setBattleResult(petWon ? `You won! ${selectedPet.name} gained ${xpGained} XP` : `You lost! Better luck next time.`);
            setBattleStage('result');
            setLoading(false);
          }, 1500);
          return;
        }
        
        turn++;
        
        // Player's turn
        if (turn % 2 === 1) {
          const attackResult = simulateBattleTurn(selectedPet, enemyData, true);
          enemyHealth -= attackResult.damage;
          
          setBattleLog(prev => [
            ...prev, 
            attackResult.message,
            attackResult.isDodged 
              ? null 
              : `${selectedPet.name} deals ${attackResult.damage} damage! ${attackResult.isCrit ? '✨' : ''}`
          ].filter(Boolean));
        } 
        // Enemy's turn
        else {
          const attackResult = simulateBattleTurn(enemyData, selectedPet, false);
          petHealth -= attackResult.damage;
          
          setBattleLog(prev => [
            ...prev, 
            attackResult.message,
            attackResult.isDodged 
              ? null 
              : `${enemyData.name} deals ${attackResult.damage} damage! ${attackResult.isCrit ? '💢' : ''}`
          ].filter(Boolean));
        }
        
        // Health update
        setBattleLog(prev => [
          ...prev,
          `Health: ${selectedPet.name} ${Math.max(0, petHealth)}/${100 + (selectedPet.level * 5)} | ${enemyData.name} ${Math.max(0, enemyHealth)}/${100 + (enemyData.level * 5)}`
        ]);
        
      }, 1000);
      
    } catch (error) {
      console.error('Error during battle:', error);
      alert('Failed to simulate the battle. Please try again.');
      setLoading(false);
      setBattleStage('selection');
    }
  };

  const calculateWinProbability = () => {
    if (!selectedPet || !enemy) return 50;
    
    const petPower = selectedPet.strength * 0.5 + selectedPet.agility * 0.3 + selectedPet.intelligence * 0.2;
    const enemyPower = enemy.strength * 0.5 + enemy.agility * 0.3 + enemy.intelligence * 0.2;
    
    // Factor in level difference
    const levelFactor = 1 + (selectedPet.level - enemy.level) * 0.05;
    
    // Factor in type advantage
    const typeMultiplier = calculateTypeAdvantage(selectedPet.type, enemy.type);
    
    const adjustedPetPower = petPower * levelFactor * typeMultiplier;
    
    // Simple probability calculation based on stats
    const rawProbability = (adjustedPetPower / (adjustedPetPower + enemyPower)) * 100;
    
    // Clamp between 5% and 95% so it's never certain
    return Math.min(95, Math.max(5, Math.round(rawProbability)));
  };

  const rematch = () => {
    setBattleResult(null);
    setEnemy(null);
    setBattleLog([]);
    setBattleStage('selection');
  };

  const getRarityGradient = (rarity) => {
    switch(rarity) {
      case 'Common': return 'from-gray-300 to-gray-400';
      case 'Uncommon': return 'from-green-300 to-green-500';
      case 'Rare': return 'from-blue-300 to-blue-600';
      case 'Epic': return 'from-purple-400 to-purple-700';
      case 'Legendary': return 'from-yellow-300 to-yellow-600';
      case 'Mythic': return 'from-pink-500 to-red-600';
      default: return 'from-gray-300 to-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-6 text-white">
      <h1 className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 py-2">
        Pet Battle Arena
      </h1>

      <AnimatePresence>
        {showTutorial && (
          <motion.div 
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-800 rounded-xl p-6 max-w-md w-full border-2 border-yellow-400 relative"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button 
                onClick={() => setShowTutorial(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-4 text-yellow-400 flex items-center">
                <GiSwordsPower className="mr-2" /> Battle Tutorial
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div className="bg-yellow-500 text-gray-900 rounded-full p-1 mr-3 mt-1 flex-shrink-0">
                    <IoMdStats size={14} />
                  </div>
                  <p>Stats matter! Strength increases damage, Agility affects critical hits and dodging.</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-red-500 text-white rounded-full p-1 mr-3 mt-1 flex-shrink-0">
                    <RiSwordFill size={14} />
                  </div>
                  <p>Some pet types have advantages against others (Dragons beat Dinosaurs, etc.)</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-500 text-white rounded-full p-1 mr-3 mt-1 flex-shrink-0">
                    <GiTrophy size={14} />
                  </div>
                  <p>Winning battles earns XP. Level up to increase stats and unlock new abilities!</p>
                </div>
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={() => setShowTutorial(false)}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-bold rounded-lg hover:from-yellow-400 hover:to-orange-400 transition flex items-center"
                >
                  Enter the Arena! <GiSwordsPower className="ml-2" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pet Selection */}
      {battleStage === 'selection' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center">
            <GiSwordman className="text-yellow-500 mr-2" /> Select Your Champion
            <GiSwordwoman className="text-yellow-500 ml-2" />
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            {userPets.length > 0 ? (
              userPets.map((pet) => (
                <motion.div
                  key={pet._id}
                  className={`p-3 rounded-xl cursor-pointer transition-all border-2 ${
                    selectedPet?._id === pet._id 
                      ? 'border-yellow-400 bg-gray-700 scale-105 shadow-lg shadow-yellow-500/20' 
                      : 'border-gray-600 bg-gray-800 hover:border-gray-400 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedPet(pet)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-4xl">{petEmojis[pet.type] || '🐾'}</div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${rarityColors[pet.rarity]}`}>
                      {pet.rarity}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold truncate">{pet.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm bg-gray-700 px-2 py-1 rounded">Lvl {pet.level}</span>
                    <div className="flex space-x-1 text-xs">
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
              className="mb-8 p-6 bg-gray-800/80 rounded-xl border border-gray-700 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-col md:flex-row items-center md:items-start">
                <div className="text-8xl mr-6 mb-4 md:mb-0 relative">
                  {petEmojis[selectedPet.type] || '🐾'}
                  <div className={`absolute -bottom-2 -right-2 text-xs px-2 py-1 rounded-full font-bold ${rarityColors[selectedPet.rarity]}`}>
                    {selectedPet.rarity}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start flex-wrap">
                    <div>
                      <h4 className="text-2xl font-bold">{selectedPet.name}</h4>
                      <p className="text-gray-400 capitalize">{selectedPet.type}</p>
                    </div>
                    <div className="bg-gray-700 px-3 py-1 rounded-full text-sm font-bold">
                      Level {selectedPet.level}
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                      <div className="text-red-400 flex items-center">
                        <FaHeart className="mr-1" /> Strength
                      </div>
                      <div className="text-xl font-bold mt-1">{selectedPet.strength}</div>
                      <div className="h-1 bg-gray-600 mt-1 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500 rounded-full" 
                          style={{ width: `${Math.min(100, selectedPet.strength)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                      <div className="text-blue-400 flex items-center">
                        <FaBolt className="mr-1" /> Agility
                      </div>
                      <div className="text-xl font-bold mt-1">{selectedPet.agility}</div>
                      <div className="h-1 bg-gray-600 mt-1 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${Math.min(100, selectedPet.agility)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                      <div className="text-purple-400 flex items-center">
                        <FaBrain className="mr-1" /> Intelligence
                      </div>
                      <div className="text-xl font-bold mt-1">{selectedPet.intelligence}</div>
                      <div className="h-1 bg-gray-600 mt-1 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full" 
                          style={{ width: `${Math.min(100, selectedPet.intelligence)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedPet.specialAbility && selectedPet.specialAbility !== 'None' && (
                    <div className="mt-4 bg-purple-900/30 p-3 rounded-lg border border-purple-700">
                      <div className="text-purple-300 font-bold">Special Ability:</div>
                      <div className="text-yellow-300">{selectedPet.specialAbility}</div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          <div className="text-center">
            <motion.button
              className={`px-8 py-4 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center mx-auto ${
                selectedPet 
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 hover:shadow-xl'
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
              onClick={handleBattle}
              disabled={loading || !selectedPet}
              whileHover={selectedPet ? { scale: 1.05 } : {}}
              whileTap={selectedPet ? { scale: 0.95 } : {}}
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
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.h2 
            className="text-3xl font-bold mb-8 text-yellow-400"
            animate={{
              scale: [1, 1.1, 1],
              textShadow: ["0 0 8px rgba(255, 215, 0, 0)", "0 0 16px rgba(255, 215, 0, 0.5)", "0 0 8px rgba(255, 215, 0, 0)"]
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut"
            }}
          >
            BATTLE IN PROGRESS!
          </motion.h2>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 mb-8">
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
              <div className="text-8xl mb-2">{petEmojis[selectedPet.type] || '🐾'}</div>
              <div className="bg-gray-800 rounded-lg p-3 border-2 border-blue-500">
                <h3 className="font-bold text-lg">{selectedPet.name}</h3>
                <div className="flex justify-center space-x-3 text-sm mt-1">
                  <span className="text-red-400 flex items-center"><FaHeart className="mr-1" /> {selectedPet.strength}</span>
                  <span className="text-blue-400 flex items-center"><FaBolt className="mr-1" /> {selectedPet.agility}</span>
                  <span className="text-purple-400 flex items-center"><FaBrain className="mr-1" /> {selectedPet.intelligence}</span>
                </div>
              </div>
            </motion.div>

            {/* VS Badge */}
            <motion.div
              className="bg-red-600 text-white font-bold rounded-full w-16 h-16 flex items-center justify-center text-xl relative z-10 my-4 md:my-0"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360],
                boxShadow: ["0 0 0 rgba(220, 38, 38, 0)", "0 0 20px rgba(220, 38, 38, 0.7)", "0 0 0 rgba(220, 38, 38, 0)"]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut"
              }}
            >
              <RiSwordFill className="absolute text-red-900 opacity-20" size={48} />
              <span className="relative">VS</span>
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
              <div className="text-8xl mb-2">
                <FaRegQuestionCircle className="inline-block animate-pulse" />
              </div>
              <div className="bg-gray-800 rounded-lg p-3 border-2 border-red-500">
                <h3 className="font-bold text-lg">Unknown Enemy</h3>
                <div className="flex justify-center space-x-3 text-sm mt-1">
                  <span className="text-gray-400">????</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Battle Log */}
          <div className="bg-gray-800/80 rounded-lg p-4 h-64 overflow-y-auto border border-gray-700 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-3 text-yellow-400 flex items-center">
              <GiSwordsPower className="mr-2" /> Battle Log
            </h3>
            <div className="space-y-2 text-left font-mono text-sm">
              {battleLog.length > 0 ? (
                battleLog.map((log, index) => (
                  <motion.p 
                    key={index}
                    className={`border-l-2 pl-2 py-1 ${
                      log.includes('dodged') ? 'border-blue-500 text-blue-300' :
                      log.includes('critical') ? 'border-yellow-500 text-yellow-300' :
                      log.includes('deals') && log.includes(selectedPet.name) ? 'border-green-500 text-green-300' :
                      log.includes('deals') ? 'border-red-500 text-red-300' :
                      log.includes('Health') ? 'border-gray-500 text-gray-300' :
                      'border-gray-600 text-gray-200'
                    }`}
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
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.h2 
            className="text-4xl font-bold mb-8"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {battleResult.includes('won') ? (
              <span className="text-green-400 flex items-center justify-center">
                <GiTrophy className="mr-3" /> VICTORY! <GiTrophy className="ml-3" />
              </span>
            ) : (
              <span className="text-red-400 flex items-center justify-center">
                <FaSkull className="mr-3" /> DEFEAT <FaSkull className="ml-3" />
              </span>
            )}
          </motion.h2>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 mb-8">
            {/* Player Pet */}
            <motion.div
              className="text-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <div className="text-8xl mb-2">{petEmojis[selectedPet.type] || '🐾'}</div>
              <div className={`bg-gray-800 rounded-lg p-4 border-2 ${
                battleResult.includes('won') ? 'border-green-500' : 'border-red-500'
              }`}>
                <h3 className="font-bold text-xl">{selectedPet.name}</h3>
                <div className="flex justify-center space-x-4 mt-3">
                  <div>
                    <p className="text-sm text-gray-400">Level</p>
                    <p className="font-bold">{selectedPet.level}{levelUp ? ' → ' + (selectedPet.level + 1) : ''}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Strength</p>
                    <p className="font-bold text-red-400">
                      {selectedPet.strength}
                      {statsIncreased.strength ? <span className="text-green-400"> +{statsIncreased.strength}</span> : ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Agility</p>
                    <p className="font-bold text-blue-400">
                      {selectedPet.agility}
                      {statsIncreased.agility ? <span className="text-green-400"> +{statsIncreased.agility}</span> : ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Intelligence</p>
                    <p className="font-bold text-purple-400">
                      {selectedPet.intelligence}
                      {statsIncreased.intelligence ? <span className="text-green-400"> +{statsIncreased.intelligence}</span> : ''}
                    </p>
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
              <div className="text-8xl mb-2">{petEmojis[enemy.type] || '👾'}</div>
              <div className={`bg-gray-800 rounded-lg p-4 border-2 ${
                battleResult.includes('won') ? 'border-red-500' : 'border-green-500'
              }`}>
                <h3 className="font-bold text-xl">{enemy.name}</h3>
                <div className="flex justify-center space-x-4 mt-3">
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
          <div className="max-w-2xl mx-auto bg-gray-800/80 rounded-xl p-6 mb-8 border border-gray-700 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4 flex items-center justify-center">
              <IoMdStats className="mr-2" /> Battle Summary
            </h3>
            
            <div className="mb-6">
              <div className="flex justify-between mb-1 text-sm">
                <span>Win Probability</span>
                <span>{calculateWinProbability()}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                <div 
                  className="h-3 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" 
                  style={{ width: `${calculateWinProbability()}%` }}
                ></div>
              </div>
              
              {typeAdvantages[selectedPet.type] && typeAdvantages[selectedPet.type].includes(enemy.type) && (
                <div className="text-sm text-green-400 mb-2">
                  ⚔️ Type Advantage: {selectedPet.type} is strong against {enemy.type}
                </div>
              )}
              {typeAdvantages[enemy.type] && typeAdvantages[enemy.type].includes(selectedPet.type) && (
                <div className="text-sm text-red-400 mb-2">
                  ⚔️ Type Disadvantage: {enemy.type} is strong against {selectedPet.type}
                </div>
              )}
            </div>
            
            <div className="p-4 bg-gray-700/50 rounded-lg mb-6 border border-gray-600">
              <p className="text-lg font-semibold text-center">
                {battleResult.includes('won') ? (
                  <span className="text-green-400">🎉 {battleResult} 🎉</span>
                ) : (
                  <span className="text-red-400">😢 {battleResult}
                  😢</span>
                )}
              </p>
            </div>
            
            {battleResult.includes('won') && (
              <div className="p-4 bg-yellow-900/30 rounded-lg text-yellow-200 border border-yellow-700">
                <p className="font-bold">✨ Reward: +{xpGained} XP</p>
                {levelUp && (
                  <p className="text-sm mt-2">
                    🎉 {selectedPet.name} leveled up to Level {selectedPet.level + 1}! Stats increased:
                    <ul className="list-disc list-inside mt-1">
                      {statsIncreased.strength && <li>Strength: +{statsIncreased.strength}</li>}
                      {statsIncreased.agility && <li>Agility: +{statsIncreased.agility}</li>}
                      {statsIncreased.intelligence && <li>Intelligence: +{statsIncreased.intelligence}</li>}
                    </ul>
                  </p>
                )}
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