import { motion } from 'framer-motion';
import { GiSwordsPower } from 'react-icons/gi';
import { IoMdStats } from 'react-icons/io';
import { RiSwordFill } from 'react-icons/ri';
import { GiTrophy } from 'react-icons/gi';

const TutorialModal = ({ setShowTutorial }) => {
  return (
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
  );
};

export default TutorialModal;