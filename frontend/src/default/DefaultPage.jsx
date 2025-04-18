import React from 'react';
import { Link } from 'react-router-dom';

const DefaultPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#D1E8E2] text-center px-4">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#2F3E46' }}>
                🚧 Feature Under Construction 🚧
            </h1>
            <p className="text-lg sm:text-xl mb-6" style={{ color: '#6B5B4C' }}>
               Abakus is working hard to bring this feature to life. Stay tuned for updates!
            </p>
          
        </div>
    );
};

export default DefaultPage;