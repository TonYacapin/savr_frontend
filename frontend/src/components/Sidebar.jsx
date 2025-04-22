import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    PiggyBank,
    Gift,
    ChevronFirst,
    ChevronLast,
    Menu,
    LogOut,
    PawPrint,
} from 'lucide-react';

const Sidebar = ({ setSelectedSection, selectedSection, children }) => {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);

            if (mobile) {
                setIsCollapsed(false);
                setSidebarOpen(false); // Changed from true to false to start closed on mobile
            } else {
                setSidebarOpen(true);
                setIsCollapsed(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const effectiveIsCollapsed = isMobile ? false : isCollapsed;

    const clearCookies = () => {
        document.cookie.split(";").forEach((cookie) => {
            const cookieName = cookie.split("=")[0].trim();
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
    };

    const handleLogout = () => {
        clearCookies();
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleNavigation = (section) => {
        setSelectedSection(section);
        if (isMobile) setSidebarOpen(false);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleCollapse = () => {
        if (!isMobile) {
            setIsCollapsed(!isCollapsed);
        }
    };

    const navItems = [
        { name: "Dashboard", section: "dashboard", icon: <LayoutDashboard size={20} /> },
        { name: "Saving Journey", section: "saving-plan", icon: <PiggyBank size={20} /> },
        { name: "Gift Pets", section: "gift-pets", icon: <Gift size={20} /> },
        { name: "Pet vs Environment", section: "pet-vs-environment", icon: <PawPrint size={20} /> },
      
    ];

    return (
        <>
            {/* Mobile Toggle Button */}
            {isMobile && (
                <button
                    onClick={toggleSidebar}
                    className="fixed top-4 left-4 z-50 p-2 rounded-md bg-indigo-600 text-white shadow-md transition-all"
                >
                    <Menu size={24} />
                </button>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-indigo-700 text-white shadow-lg z-40 flex flex-col transition-all duration-300 ${effectiveIsCollapsed ? 'w-20' : 'w-64'
                    } ${isMobile
                        ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full')
                        : 'translate-x-0'
                    }`}
            >
                <div className={`flex items-center ${effectiveIsCollapsed ? 'justify-center' : 'justify-between'} p-3 border-b border-indigo-600`}>
                    {!effectiveIsCollapsed && (
                        <h1 className="text-xl font-bold text-white">PocketSavr</h1>
                    )}
                    {!isMobile && (
                        <button
                            onClick={toggleCollapse}
                            className="p-1.5 rounded-lg hover:bg-indigo-600 transition-colors"
                            aria-label={effectiveIsCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {effectiveIsCollapsed ? <ChevronLast size={20} /> : <ChevronFirst size={20} />}
                        </button>
                    )}
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.section}
                            onClick={() => handleNavigation(item.section)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${selectedSection === item.section
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'hover:bg-indigo-600/80 text-indigo-100'
                                } ${effectiveIsCollapsed ? 'justify-center' : ''}`}
                        >
                            <span className="text-indigo-100">
                                {item.icon}
                            </span>
                            {!effectiveIsCollapsed && (
                                <span className="font-medium">{item.name}</span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="p-3 border-t border-indigo-600">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-600 text-indigo-100 transition-colors ${effectiveIsCollapsed ? 'justify-center' : ''}`}
                    >
                        <LogOut size={20} />
                        {!effectiveIsCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            <div
                className={`flex-1 transition-all duration-300 ${isMobile && !sidebarOpen ? '' : ''
                    } ${!isMobile && effectiveIsCollapsed ? 'ml-20' :
                        !isMobile ? 'ml-64' : ''
                    }`}
                style={{ minHeight: 'calc(100vh - 4rem)' }}
            >
                {children}
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black/50 z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;