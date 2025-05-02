import { motion } from 'framer-motion';
import { GiTrophy } from 'react-icons/gi';
import { FaSkull } from 'react-icons/fa';
import { IoMdStats } from 'react-icons/io';
import { RiSwordFill } from 'react-icons/ri';

const BattleResult = ({
  battleResult,
  selectedPet,
  enemy,
  xpGained,
  levelUp,
  statsIncreased,
  calculateWinProbability,
  typeAdvantages,
  rematch,
  setBattleStage,
  petEmojis
}) => {
  return (
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
              <span className="text-red-400">😢 {battleResult}</span>
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
  );
};

export default BattleResult;