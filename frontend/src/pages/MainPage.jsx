import { useState } from "react";
import Navbar from "../components/NavBar";
import Dashboard from "./Dashboard";
import DefaultPage from "../default/DefaultPage";
import SavingPlan from "./SavingPlan";



const MainPage = () => {
    const [selectedSection, setSelectedSection] = useState("dashboard");

    const renderContent = () => {
        switch (selectedSection) {
            case "settings":
                return <DefaultPage />;
            case "save":
                return <DefaultPage />;
            case "gift-pets":
                return <DefaultPage />;
            case "saving-plan":
                return <SavingPlan />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar with section selection */}
            <Navbar setSelectedSection={setSelectedSection} selectedSection={selectedSection} />

            {/* Main Content */}
            <div
                className="flex-grow bg-amber-50 mx-auto mt-6 px-4 py-6 max-w-7xl w-full sm:px-6 lg:px-8"
                style={{ paddingTop: '4rem' }} // Adjust this value to match the Navbar height
            >
                {renderContent()}
            </div>
        </div>
    );
};

export default MainPage;