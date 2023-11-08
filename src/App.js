import React, { useState, useRef } from 'react';
import './App.css';
import MessageView from './MessageView';

function App() {
    const [newMessage, setNewMessage] = useState('');
    const messageScrollViewRef = useRef();
    const user = 'YourUserName'; // Set your user name here

    const sendMessage = () => {
        if (newMessage.trim() !== '') {
            messageScrollViewRef.current.addMessage(user, newMessage);
            setNewMessage('');
        }
    };

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
    };

    return (
        <div className="App">
            <MessageView user="User" />
        </div>
    );
}

export default App;