import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import DefaultPage from '../default/DefaultPage';
import SavingPlan from './SavingPlan';
import Dashboard from './Dashboard';
import PetVsEnvironment from './PetVsEnvironment';

const MainPage = () => {
    const [selectedSection, setSelectedSection] = useState("dashboard");

    const renderContent = () => {
        switch (selectedSection) {
            case "saving-plan":
                return <SavingPlan />;
            case "gift-pets":
                return <DefaultPage />;
            case "settings":
                return <DefaultPage />;
            case "pet-vs-environment":
                return <PetVsEnvironment />;



            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar Navigation */}
            <Sidebar
                setSelectedSection={setSelectedSection}
                selectedSection={selectedSection}
            >
                {/* Main Content */}
                <div className="flex-grow bg-amber-50 ">
                    {renderContent()}
                </div>
            </Sidebar>
        </div>
    );
};

export default MainPage;