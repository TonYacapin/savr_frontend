// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const DefaultPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center border-2 border-blue-100"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <motion.h1
          className="text-4xl sm:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          🚧 Feature Under Construction 🚧
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl mb-8 text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Abakus is working hard to bring this feature to life. Stay tuned for updates!
        </motion.p>
      </motion.div>
    </div>
  );
};

export default DefaultPage;