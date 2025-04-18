import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ setSelectedSection, selectedSection }) => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const clearCookies = () => {
        const cookies = document.cookie.split(";");
        cookies.forEach((cookie) => {
            const cookieName = cookie.split("=")[0].trim();
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
    };

    const handleLogout = () => {
        clearCookies();
        localStorage.removeItem("token");
        navigate("/login");
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleNavigation = (section) => {
        setSelectedSection(section);
        setMobileMenuOpen(false);
    };

    const navItems = [
        { name: "Dashboard", section: "dashboard" },
        { name: "Saving Journey", section: "saving-plan" },
        { name: "Gift Pets", section: "gift-pets" },
        { name: "Settings", section: "settings" }
    ];

    return (
        <header className="bg-[#2F3E46] text-white shadow-md">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Brand Name */}
                    <h1 className="text-xl font-bold z-10">
                        <a
                            href="/"
                            className="hover:text-[#F4A261] transition duration-300"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavigation("dashboard");
                            }}
                        >
                            <span className="text-[#F4A261]">Pocket</span>Savr
                        </a>
                    </h1>

                    {/* Desktop Navigation */}
                    <ul className="hidden md:flex space-x-6">
                        {navItems.map((item) => (
                            <li key={item.section}>
                                <button
                                    className={`hover:text-[#8EC6D7] transition duration-300 ${
                                        selectedSection === item.section ? "text-[#F4A261]" : ""
                                    }`}
                                    onClick={() => handleNavigation(item.section)}
                                    aria-current={selectedSection === item.section ? "page" : undefined}
                                >
                                    {item.name}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMobileMenu}
                            className="text-white focus:outline-none mr-4"
                            aria-expanded={mobileMenuOpen}
                            aria-label="Toggle navigation menu"
                        >
                            <svg 
                                className="w-6 h-6" 
                                fill="none" 
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {mobileMenuOpen ? (
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M6 18L18 6M6 6l12 12" 
                                    />
                                ) : (
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M4 6h16M4 12h16M4 18h16" 
                                    />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Logout Button (visible on desktop) */}
                    <button
                        onClick={handleLogout}
                        className="hidden md:block bg-[#F4A261] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#e08e4f] transition duration-300"
                    >
                        Logout
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                <div 
                    className={`fixed inset-0 z-10 bg-[#2F3E46] transform ${
                        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    } transition-transform duration-300 ease-in-out md:hidden`}
                    style={{ top: '60px' }}
                >
                    <div className="px-4 py-6 space-y-6 flex flex-col h-full">
                        <ul className="space-y-6 flex-grow">
                            {navItems.map((item) => (
                                <li key={item.section}>
                                    <button
                                        className={`text-lg block w-full text-left py-2 ${
                                            selectedSection === item.section ? "text-[#F4A261]" : "text-white"
                                        }`}
                                        onClick={() => handleNavigation(item.section)}
                                        aria-current={selectedSection === item.section ? "page" : undefined}
                                    >
                                        {item.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        
                        {/* Logout Button (visible in mobile menu) */}
                        <button
                            onClick={handleLogout}
                            className="w-full bg-[#F4A261] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#e08e4f] transition duration-300 mt-4"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default NavBar;