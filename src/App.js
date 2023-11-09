import React, { useState, useRef } from 'react';
import './App.css';
import MessageView from './MessageView';

function App() {
    const user = 'YourUserName'; // Set your user name here

    return (
        <div className="App">
            <MessageView user="User" />
        </div>
    );
}

export default App;