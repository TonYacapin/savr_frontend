import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import { GiSwordsPower, GiHealthPotion } from 'react-icons/gi';
import { RiSwordFill, RiShieldFill } from 'react-icons/ri';
import { FaRegQuestionCircle, FaHeart, FaBolt, FaBrain } from 'react-icons/fa';
import { petEmojis, typeAdvantages } from '../utils/petConstants';

const BattleStage = ({
  selectedPet,
  enemy,
  battleLog,
  playerTurn,
  onAttack,
  onDefend,
  onSpecial,
  onUseItem,
  petHealth,
  enemyHealth,
  maxPetHealth,
  maxEnemyHealth
}) => {
  return (
    <motion.div
      className="t ext-center max-w-4xl mx-auto"
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
        {playerTurn ? "YOUR TURN!" : "ENEMY'S TURN"}
      </motion.h2>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 mb-8">
        {/* Player Pet */}
        <motion.div
          className="text-center"
          animate={playerTurn ? {
            scale: [1, 1.05, 1],
            boxShadow: ["0 0 0 rgba(59, 130, 246, 0)", "0 0 20px rgba(59, 130, 246, 0.5)", "0 0 0 rgba(59, 130, 246, 0)"]
          } : {}}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut"
          }}
        >
          <div className="text-8xl mb-2">{petEmojis[selectedPet.type] || '🐾'}</div>
          <div className="bg-gray-800 rounded-lg p-3 border-2 border-blue-500 relative">
            <div className="absolute -top-5 left-0 right-0">
              <div className="h-4 bg-red-500 rounded-full mx-2 relative overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${(petHealth / maxPetHealth) * 100}%` }}
                ></div>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                  {petHealth}/{maxPetHealth}
                </span>
              </div>
            </div>
            <h3 className="font-bold text-lg mt-2">{selectedPet.name}</h3>
            <div className="flex justify-center space-x-3 text-sm mt-1">
              <span className="text-red-400 flex items-center"><RiSwordFill className="mr-1" /> {selectedPet.strength}</span>
              <span className="text-blue-400 flex items-center"><FaBolt className="mr-1" /> {selectedPet.agility}</span>
              <span className="text-purple-400 flex items-center"><FaBrain className="mr-1" /> {selectedPet.intelligence}</span>
            </div>
          </div>
        </motion.div>

        {/* VS Badge */}
        <motion.div
          className="bg-red-600 text-white font-bold rounded-full w-16 h-16 flex items-center justify-center text-xl relative z-10 my-4 md:my-0"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut"
          }}
        >
          <RiSwordFill className="absolute text-red-900 opacity-20" size={48} />
          <span className="relative">VS</span>
        </motion.div>

        {/* Enemy */}
        <motion.div
          className="text-center"
          animate={!playerTurn ? {
            scale: [1, 1.05, 1],
            boxShadow: ["0 0 0 rgba(220, 38, 38, 0)", "0 0 20px rgba(220, 38, 38, 0.5)", "0 0 0 rgba(220, 38, 38, 0)"]
          } : {}}
        >
          <div className="text-8xl mb-2">
            {enemy ? petEmojis[enemy.type] || '👾' : <FaRegQuestionCircle className="inline-block animate-pulse" />}
          </div>
          <div className="bg-gray-800 rounded-lg p-3 border-2 border-red-500 relative">
            {enemy ? (
              <>
                <div className="absolute -top-5 left-0 right-0">
                  <div className="h-4 bg-red-500 rounded-full mx-2 relative overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${(enemyHealth / maxEnemyHealth) * 100}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                      {enemyHealth}/{maxEnemyHealth}
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-lg mt-2">{enemy.name}</h3>
                <div className="flex justify-center space-x-3 text-sm mt-1">
                  <span className="text-red-400 flex items-center"><RiSwordFill className="mr-1" /> {enemy.strength}</span>
                  <span className="text-blue-400 flex items-center"><FaBolt className="mr-1" /> {enemy.agility}</span>
                  <span className="text-purple-400 flex items-center"><FaBrain className="mr-1" /> {enemy.intelligence}</span>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-bold text-lg">Unknown Enemy</h3>
                <div className="flex justify-center space-x-3 text-sm mt-1">
                  <span className="text-gray-400">????</span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Battle Log */}
      <div className="bg-gray-800/80 rounded-lg p-4 h-48 overflow-y-auto border border-gray-700 backdrop-blur-sm mb-6">
        <h3 className="text-lg font-bold mb-3 text-yellow-400 flex items-center">
          <GiSwordsPower className="mr-2" /> Battle Log
        </h3>
        <div className="space-y-2 text-left font-mono text-sm">
          {battleLog.length > 0 ? (
            battleLog.map((log, index) => (
              <motion.p
                key={index}
                className={`border-l-2 pl-2 py-1 ${log.includes('dodged') ? 'border-blue-500 text-blue-300' :
                    log.includes('critical') ? 'border-yellow-500 text-yellow-300' :
                      log.includes('deals') && log.includes(selectedPet.name) ? 'border-green-500 text-green-300' :
                        log.includes('deals') ? 'border-red-500 text-red-300' :
                          log.includes('Health') ? 'border-gray-500 text-gray-300' :
                            'border-gray-600 text-gray-200'
                  }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {log}
              </motion.p>
            ))
          ) : (
            <p className="text-gray-400">The battle is about to begin...</p>
          )}
        </div>
      </div>

      {/* Battle Actions */}
      {playerTurn && (
        <motion.div
          className="grid grid-cols-2 gap-4 max-w-md mx-auto"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={onAttack}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition"
          >
            <RiSwordFill className="mr-2" /> Attack
          </button>
          <button
            onClick={onDefend}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition"
          >
            <RiShieldFill className="mr-2" /> Defend
          </button>
          <button
            onClick={onSpecial}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition"
          >
            <GiSwordsPower className="mr-2" /> Special
          </button>
          <button
            onClick={onUseItem}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition"
          >
            <GiHealthPotion className="mr-2" /> Item
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

const PetVsEnvironment = () => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [userPets, setUserPets] = useState([]);
  const [battleResult, setBattleResult] = useState(null);
  const [enemy, setEnemy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [battleLog, setBattleLog] = useState([]);
  const [battleStage, setBattleStage] = useState('selection');
  const [xpGained, setXpGained] = useState(0);
  const [levelUp, setLevelUp] = useState(false);
  const [statsIncreased, setStatsIncreased] = useState({});
  const [playerTurn, setPlayerTurn] = useState(true);
  const [petHealth, setPetHealth] = useState(0);
  const [enemyHealth, setEnemyHealth] = useState(0);
  const [maxPetHealth, setMaxPetHealth] = useState(0);
  const [maxEnemyHealth, setMaxEnemyHealth] = useState(0);
  const [defending, setDefending] = useState(false);
  const [items, setItems] = useState([
    { name: "Health Potion", amount: 3, effect: 30 }
  ]);

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

  const calculateDamage = (attacker, defender, isSpecial = false) => {
    const typeMultiplier = calculateTypeAdvantage(attacker.type, defender.type);
    const critChance = attacker.agility / 100;
    const isCrit = Math.random() < critChance;

    let baseDamage;
    if (isSpecial) {
      // Special attack uses intelligence more
      baseDamage = (attacker.strength * 0.3 + attacker.agility * 0.2 + attacker.intelligence * 0.5);
    } else {
      // Normal attack
      baseDamage = (attacker.strength * 0.7 + attacker.agility * 0.3);
    }

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

    const damage = Math.max(1, Math.floor(baseDamage * typeMultiplier * (isCrit ? 1.5 : 1)));

    return {
      damage,
      isCrit,
      isDodged: false,
      message: `${attacker.name} ${isCrit ? 'lands a critical hit!' : 'attacks!'}`
    };
  };

  const enemyTurn = () => {
    setPlayerTurn(false);

    // Simple AI - 70% chance to attack, 20% to defend, 10% to special
    const action = Math.random();

    setTimeout(() => {
      if (action < 0.7 || enemyHealth < maxEnemyHealth * 0.3) {
        // Attack
        const attackResult = calculateDamage(enemy, selectedPet);
        let damage = attackResult.damage;

        if (defending) {
          damage = Math.floor(damage * 0.6); // Reduce damage by 40% when defending
          setBattleLog(prev => [...prev,
          `${selectedPet.name} is defending and takes reduced damage!`,
          attackResult.message,
          attackResult.isDodged
            ? null
            : `${enemy.name} deals ${damage} damage! ${attackResult.isCrit ? '💢' : ''}`
          ].filter(Boolean));
        } else {
          setBattleLog(prev => [...prev,
          attackResult.message,
          attackResult.isDodged
            ? null
            : `${enemy.name} deals ${damage} damage! ${attackResult.isCrit ? '💢' : ''}`
          ].filter(Boolean));
        }

        setPetHealth(prev => Math.max(0, prev - damage));
      }
      else if (action < 0.9) {
        // Defend
        setBattleLog(prev => [...prev, `${enemy.name} is preparing to defend!`]);
      }
      else {
        // Special attack
        const attackResult = calculateDamage(enemy, selectedPet, true);
        let damage = attackResult.damage;

        if (defending) {
          damage = Math.floor(damage * 0.6);
          setBattleLog(prev => [...prev,
          `${selectedPet.name} is defending and takes reduced damage!`,
          `${enemy.name} uses a special attack!`,
          attackResult.isDodged
            ? null
            : `${enemy.name} deals ${damage} damage! ${attackResult.isCrit ? '💢' : ''}`
          ].filter(Boolean));
        } else {
          setBattleLog(prev => [...prev,
          `${enemy.name} uses a special attack!`,
          attackResult.isDodged
            ? null
            : `${enemy.name} deals ${damage} damage! ${attackResult.isCrit ? '💢' : ''}`
          ].filter(Boolean));
        }

        setPetHealth(prev => Math.max(0, prev - damage));
      }

      // Check if pet fainted
      if (petHealth <= 0) {
        setTimeout(() => {
          setBattleLog(prev => [...prev, `${selectedPet.name} fainted!`]);
          endBattle(false);
        }, 1000);
      } else {
        setDefending(false);
        setPlayerTurn(true);
      }
    }, 1500);
  };

  const handleAttack = () => {
    const attackResult = calculateDamage(selectedPet, enemy);
    setBattleLog(prev => [...prev,
    attackResult.message,
    attackResult.isDodged
      ? null
      : `${selectedPet.name} deals ${attackResult.damage} damage! ${attackResult.isCrit ? '✨' : ''}`
    ].filter(Boolean));

    setEnemyHealth(prev => Math.max(0, prev - attackResult.damage));

    if (enemyHealth - attackResult.damage <= 0) {
      setTimeout(() => {
        setBattleLog(prev => [...prev, `${enemy.name} fainted!`]);
        endBattle(true);
      }, 1000);
    } else {
      enemyTurn();
    }
  };

  const handleDefend = () => {
    setDefending(true);
    setBattleLog(prev => [...prev, `${selectedPet.name} is preparing to defend!`]);
    enemyTurn();
  };

  const handleSpecial = () => {
    const attackResult = calculateDamage(selectedPet, enemy, true);
    setBattleLog(prev => [...prev,
    `${selectedPet.name} uses a special attack!`,
    attackResult.isDodged
      ? null
      : `${selectedPet.name} deals ${attackResult.damage} damage! ${attackResult.isCrit ? '✨' : ''}`
    ].filter(Boolean));

    setEnemyHealth(prev => Math.max(0, prev - attackResult.damage));

    if (enemyHealth - attackResult.damage <= 0) {
      setTimeout(() => {
        setBattleLog(prev => [...prev, `${enemy.name} fainted!`]);
        endBattle(true);
      }, 1000);
    } else {
      enemyTurn();
    }
  };

  const handleUseItem = () => {
    const potion = items.find(item => item.name === "Health Potion");
    if (potion && potion.amount > 0) {
      const newHealth = Math.min(maxPetHealth, petHealth + potion.effect);
      const healedAmount = newHealth - petHealth;

      setPetHealth(newHealth);
      setItems(prev => prev.map(item =>
        item.name === "Health Potion" ? { ...item, amount: item.amount - 1 } : item
      ));

      setBattleLog(prev => [...prev,
      `${selectedPet.name} used a Health Potion and recovered ${healedAmount} HP!`
      ]);

      enemyTurn();
    } else {
      setBattleLog(prev => [...prev, "No Health Potions left!"]);
    }
  };

  const endBattle = (playerWon) => {
    if (playerWon) {
      const baseXP = 50 + (enemy.level * 5);
      const typeMultiplier = calculateTypeAdvantage(selectedPet.type, enemy.type);
      const xp = Math.floor(baseXP * typeMultiplier);
      setXpGained(xp);

      const newLevel = selectedPet.level + (xp >= 100 ? 1 : 0);
      if (newLevel > selectedPet.level) {
        setLevelUp(true);
        const statIncreases = {
          strength: Math.floor(Math.random() * 3) + 1,
          agility: Math.floor(Math.random() * 3) + 1,
          intelligence: Math.floor(Math.random() * 2) + 1
        };
        setStatsIncreased(statIncreases);
      }

      setBattleResult(`You won! ${selectedPet.name} gained ${xp} XP`);
    } else {
      setBattleResult(`You lost! Better luck next time.`);
    }

    setTimeout(() => {
      setBattleStage('result');
      setLoading(false);
    }, 1500);
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
    setPlayerTurn(true);
    setDefending(false);

    try {
      const response = await axiosInstance.post(`/pets/pve/${selectedPet._id}`);
      const enemyData = response.data.enemy;
      setEnemy(enemyData);

      // Calculate max health based on level
      const petMaxHealth = 100 + (selectedPet.level * 5);
      const enemyMaxHealth = 100 + (enemyData.level * 5);

      setMaxPetHealth(petMaxHealth);
      setMaxEnemyHealth(enemyMaxHealth);
      setPetHealth(petMaxHealth);
      setEnemyHealth(enemyMaxHealth);

      const typeMultiplier = calculateTypeAdvantage(selectedPet.type, enemyData.type);
      const typeMessage = typeMultiplier > 1
        ? `${selectedPet.name} has type advantage against ${enemyData.type}!`
        : typeMultiplier < 1
          ? `${selectedPet.name} is at a disadvantage against ${enemyData.type}!`
          : null;

      if (typeMessage) {
        setBattleLog(prev => [...prev, typeMessage]);
      }

      setBattleLog(prev => [...prev, `A wild ${enemyData.name} appeared!`]);

    } catch (error) {
      console.error('Error during battle:', error);
      alert('Failed to start the battle. Please try again.');
      setLoading(false);
      setBattleStage('selection');
    }
  };

  const calculateWinProbability = () => {
    if (!selectedPet || !enemy) return 50;

    const petPower = selectedPet.strength * 0.5 + selectedPet.agility * 0.3 + selectedPet.intelligence * 0.2;
    const enemyPower = enemy.strength * 0.5 + enemy.agility * 0.3 + enemy.intelligence * 0.2;

    const levelFactor = 1 + (selectedPet.level - enemy.level) * 0.05;
    const typeMultiplier = calculateTypeAdvantage(selectedPet.type, enemy.type);
    const adjustedPetPower = petPower * levelFactor * typeMultiplier;

    const rawProbability = (adjustedPetPower / (adjustedPetPower + enemyPower)) * 100;
    return Math.min(95, Math.max(5, Math.round(rawProbability)));
  };

  const rematch = () => {
    setBattleResult(null);
    setEnemy(null);
    setBattleLog([]);
    setBattleStage('selection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-6 text-white">
      <h1 className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 py-2">
        Pet Battle Arena
      </h1>

      {battleStage === 'selection' && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Select Your Pet</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {userPets.map(pet => (
              <motion.div
                key={pet._id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-gray-800 rounded-lg p-4 cursor-pointer border-2 ${selectedPet?._id === pet._id ? 'border-blue-500' : 'border-gray-700'
                  }`}
                onClick={() => setSelectedPet(pet)}
              >
                <div className="text-6xl text-center mb-2">
                  {petEmojis[pet.type] || '🐾'}
                </div>
                <h3 className="font-bold text-lg text-center">{pet.name}</h3>
                <div className="flex justify-between mt-2 text-sm">
                  <span>Lvl: {pet.level}</span>
                  <span className="text-red-400">⚔️ {pet.strength}</span>
                  <span className="text-blue-400">⚡ {pet.agility}</span>
                  <span className="text-purple-400">🧠 {pet.intelligence}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {selectedPet && (
            <motion.button
              onClick={handleBattle}
              disabled={loading}
              className="mt-8 px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? 'Starting Battle...' : 'Start Battle'}
            </motion.button>
          )}
        </div>
      )}

      {battleStage === 'battle' && (
        <BattleStage
          selectedPet={selectedPet}
          enemy={enemy}
          battleLog={battleLog}
          playerTurn={playerTurn}
          onAttack={handleAttack}
          onDefend={handleDefend}
          onSpecial={handleSpecial}
          onUseItem={handleUseItem}
          petHealth={petHealth}
          enemyHealth={enemyHealth}
          maxPetHealth={maxPetHealth}
          maxEnemyHealth={maxEnemyHealth}
          petEmojis={petEmojis}
        />
      )}

      {battleStage === 'result' && (
        <div className="text-center max-w-4xl mx-auto">
          <motion.h2
            className="text-4xl font-bold mb-8"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {battleResult.includes('won') ? (
              <span className="text-green-400 flex items-center justify-center">
                🏆 VICTORY! 🏆
              </span>
            ) : (
              <span className="text-red-400 flex items-center justify-center">
                ☠️ DEFEAT ☠️
              </span>
            )}
          </motion.h2>

          <div className="bg-gray-800/80 rounded-xl p-6 mb-8 border border-gray-700 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4">Battle Summary</h3>

            {battleResult.includes('won') && (
              <div className="p-4 bg-yellow-900/30 rounded-lg text-yellow-200 border border-yellow-700 mb-4">
                <p className="font-bold">✨ Reward: +{xpGained} XP</p>
                {levelUp && (
                  <p className="text-sm mt-2">
                    🎉 {selectedPet.name} leveled up! Stats increased:
                    <ul className="list-disc list-inside mt-1">
                      {statsIncreased.strength && <li>Strength: +{statsIncreased.strength}</li>}
                      {statsIncreased.agility && <li>Agility: +{statsIncreased.agility}</li>}
                      {statsIncreased.intelligence && <li>Intelligence: +{statsIncreased.intelligence}</li>}
                    </ul>
                  </p>
                )}
              </div>
            )}

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
          </div>
        </div>
      )}
    </div>
  );
};

export default PetVsEnvironment;