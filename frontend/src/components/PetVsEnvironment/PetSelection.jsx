import { motion } from 'framer-motion';
import { GiSwordman, GiSwordwoman, GiSwordsPower } from 'react-icons/gi';
import PetCard from '../../utils/PetCard';
import PetStats from '../../utils/PetStats';

const PetSelection = ({ 
  userPets, 
  selectedPet, 
  setSelectedPet, 
  handleBattle, 
  loading,
  petEmojis
}) => {
  return (
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
            <PetCard 
              key={pet._id}
              pet={pet}
              isSelected={selectedPet?._id === pet._id}
              onClick={() => setSelectedPet(pet)}
              petEmojis={petEmojis}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-xl text-gray-400">You have no pets. Create one to start battling!</p>
          </div>
        )}
      </div>

      {selectedPet && (
        <PetStats pet={selectedPet} petEmojis={petEmojis} />
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
  );
};

export default PetSelection;