import { motion } from 'framer-motion';
import { FaHeart, FaBolt, FaBrain } from 'react-icons/fa';
import RarityBadge from './RarityBadge';
import { petEmojis } from './petConstants';
import { rarityColors } from './petConstants';
import { typeAdvantages } from './petConstants';
const PetCard = ({ pet, isSelected, onClick }) => {
  return (
    <motion.div
      className={`p-3 rounded-xl cursor-pointer transition-all border-2 ${
        isSelected
          ? 'border-yellow-400 bg-gray-700 scale-105 shadow-lg shadow-yellow-500/20' 
          : 'border-gray-600 bg-gray-800 hover:border-gray-400 hover:bg-gray-700'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="text-4xl">{petEmojis[pet.type] || '🐾'}</div>
        <RarityBadge rarity={pet.rarity} />
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
  );
};

export default PetCard;