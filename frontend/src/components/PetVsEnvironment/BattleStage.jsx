import { motion } from 'framer-motion';
import { GiSwordsPower } from 'react-icons/gi';
import { RiSwordFill } from 'react-icons/ri';
import { FaRegQuestionCircle, FaHeart, FaBolt, FaBrain } from 'react-icons/fa';

import { petEmojis } from '../../utils/petConstants';

const BattleStage = ({ 
  selectedPet, 
  battleLog 
}) => {
  return (
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
  );
};

export default BattleStage;