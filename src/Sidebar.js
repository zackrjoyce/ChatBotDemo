import React from 'react';
import './Sidebar.css';

/*Sidebar component:
    tabs: map representing prompts with corresponding messages,
    onTabClick: function to set properties when tab is clicked
    IsSidebarOpen: function to set sidebar visible
    onCloseSidebar: function to close sidebar
    onClearMessagesAndPrompt: Called on Create New Entry to clear chat and prompt
*/
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