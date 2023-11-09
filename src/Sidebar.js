import React from 'react';
import './Sidebar.css';

function Sidebar({ tabs, onTabClick, isSidebarOpen, onCloseSidebar, onClearMessagesAndPrompt }) {
    return (
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <button className="close-button" onClick={onCloseSidebar}>
                Close
            </button>
            <div className="tabs">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            if (tab.label === "Create New Entry") {
                                onClearMessagesAndPrompt();
                            } else {
                                console.log("New prompt: " + tab.label);
                                onTabClick(tab.label);
                            }
                            onCloseSidebar();
                        }}
                        className="tab-button">
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Sidebar;