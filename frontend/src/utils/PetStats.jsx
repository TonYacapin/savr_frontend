import { motion } from 'framer-motion';
import { FaHeart, FaBolt, FaBrain } from 'react-icons/fa';
import StatBar from './StatBar';
import RarityBadge from '../utils/RarityBadge';

const PetStats = ({ pet, petEmojis }) => {
  return (
    <motion.div 
      className="mb-8 p-6 bg-gray-800/80 rounded-xl border border-gray-700 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col md:flex-row items-center md:items-start">
        <div className="text-8xl mr-6 mb-4 md:mb-0 relative">
          {petEmojis[pet.type] || '🐾'}
          <RarityBadge rarity={pet.rarity} small />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start flex-wrap">
            <div>
              <h4 className="text-2xl font-bold">{pet.name}</h4>
              <p className="text-gray-400 capitalize">{pet.type}</p>
            </div>
            <div className="bg-gray-700 px-3 py-1 rounded-full text-sm font-bold">
              Level {pet.level}
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
              <div className="text-red-400 flex items-center">
                <FaHeart className="mr-1" /> Strength
              </div>
              <div className="text-xl font-bold mt-1">{pet.strength}</div>
              <StatBar value={pet.strength} color="bg-red-500" />
            </div>
            
            <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
              <div className="text-blue-400 flex items-center">
                <FaBolt className="mr-1" /> Agility
              </div>
              <div className="text-xl font-bold mt-1">{pet.agility}</div>
              <StatBar value={pet.agility} color="bg-blue-500" />
            </div>
            
            <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
              <div className="text-purple-400 flex items-center">
                <FaBrain className="mr-1" /> Intelligence
              </div>
              <div className="text-xl font-bold mt-1">{pet.intelligence}</div>
              <StatBar value={pet.intelligence} color="bg-purple-500" />
            </div>
          </div>
          
          {pet.specialAbility && pet.specialAbility !== 'None' && (
            <div className="mt-4 bg-purple-900/30 p-3 rounded-lg border border-purple-700">
              <div className="text-purple-300 font-bold">Special Ability:</div>
              <div className="text-yellow-300">{pet.specialAbility}</div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PetStats;