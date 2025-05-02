import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import { GiSwordsPower } from 'react-icons/gi';
import TutorialModal from '../components/PetVsEnvironment/TutorialModal';
import PetSelection from '../components/PetVsEnvironment/PetSelection';
import BattleStage from '../components/PetVsEnvironment/BattleStage';
import BattleResult from '../components/PetVsEnvironment/BattleResult';
import { petEmojis, rarityColors, typeAdvantages } from '../utils/petConstants';

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
      const response = await axiosInstance.post(`/pets/pve/${selectedPet._id}`);
      const enemyData = response.data.enemy;
      setEnemy(enemyData);
      
      const typeMultiplier = calculateTypeAdvantage(selectedPet.type, enemyData.type);
      const typeMessage = typeMultiplier > 1 
        ? `${selectedPet.name} has type advantage against ${enemyData.type}!`
        : typeMultiplier < 1 
          ? `${selectedPet.name} is at a disadvantage against ${enemyData.type}!`
          : null;
      
      if (typeMessage) {
        setBattleLog(prev => [...prev, typeMessage]);
      }

      let petHealth = 100 + (selectedPet.level * 5);
      let enemyHealth = 100 + (enemyData.level * 5);
      
      const maxTurns = 10;
      let turn = 0;
      
      const battleInterval = setInterval(() => {
        if (turn >= maxTurns || petHealth <= 0 || enemyHealth <= 0) {
          clearInterval(battleInterval);
          
          const petWon = petHealth > 0;
          const resultMessage = petWon 
            ? `${selectedPet.name} defeated ${enemyData.name}!`
            : `${selectedPet.name} was defeated by ${enemyData.name}!`;
          
          setBattleLog(prev => [...prev, resultMessage, "Battle concluded!"]);
          
          if (petWon) {
            const baseXP = 50 + (enemyData.level * 5);
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
          }
          
          setTimeout(() => {
            setBattleResult(petWon ? `You won! ${selectedPet.name} gained ${xpGained} XP` : `You lost! Better luck next time.`);
            setBattleStage('result');
            setLoading(false);
          }, 1500);
          return;
        }
        
        turn++;
        
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
        } else {
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

      <AnimatePresence>
        {showTutorial && <TutorialModal setShowTutorial={setShowTutorial} />}
      </AnimatePresence>

      {battleStage === 'selection' && (
        <PetSelection 
          userPets={userPets}
          selectedPet={selectedPet}
          setSelectedPet={setSelectedPet}
          handleBattle={handleBattle}
          loading={loading}
          petEmojis={petEmojis}
        />
      )}

      {battleStage === 'battle' && (
        <BattleStage 
          selectedPet={selectedPet}
          battleLog={battleLog}
          petEmojis={petEmojis}
        />
      )}

      {battleStage === 'result' && (
        <BattleResult 
          battleResult={battleResult}
          selectedPet={selectedPet}
          enemy={enemy}
          xpGained={xpGained}
          levelUp={levelUp}
          statsIncreased={statsIncreased}
          calculateWinProbability={calculateWinProbability}
          typeAdvantages={typeAdvantages}
          rematch={rematch}
          setBattleStage={setBattleStage}
          petEmojis={petEmojis}
        />
      )}
    </div>
  );
};

export default PetVsEnvironment;