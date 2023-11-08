import React, { useState, useRef, useEffect } from 'react';
import './MessageView.css';
import Message from './Message';

function MessageView(props) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messageContainerRef = useRef();
    const lastMessageRef = useRef(null);
    const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false);

    const { user } = props;

    const handleBotResponse = async (userMessage) => {
        //OpenAI Functionality
        /*
        const prompt = {
            role: "system",
            content: userMessage,
        };

        const messages = [
            {
                role: "user",
                content: userMessage,
            },
            prompt,
        ];

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const res = data.choices[0].message.content;

                // You can process and use 'res' as needed
                return res;
            } else {
                // Handle the case where the API request is not successful
                throw new Error("OpenAI API request failed: " + response.status);
            }
        } catch (error) {
            // Handle any errors that may occur during the request
            console.error("Error:", error);
            throw error;
        }
        */

        return new Promise((resolve) => {
            setTimeout(() => {
                const response = "Demo Response Message to: " + userMessage;
                resolve(response);
            }, 1000); // Simulate a 1-second delay
        });
    };

    const generateResponse = async (userMessage) => {
        // Add a temporary empty ChatBot message
        const emptyChatBotMessage = { sender: 'ChatBot', contents: '' };
        setMessages((prevMessages) => [emptyChatBotMessage, ...prevMessages]);

        // Simulate an asynchronous operation (e.g., an API call)
        const response = await handleBotResponse(userMessage);

        // Replace the contents of the temporary ChatBot message with the actual response
        emptyChatBotMessage.contents = response;

        // Update the state with the modified messages array
        setMessages((prevMessages) => [...prevMessages]);

        return response;
    };

    const addMessage = (sender, contents) => {
        const newMessage = { sender, contents };
        setMessages((prevMessages) => [newMessage, ...prevMessages]);
    };

    const handleUserMessage = async () => {
        if (newMessage.trim() !== '') {
            // Scroll to the bottom to show the initial message
            scrollToBottom();

            // Clear the input field
            setNewMessage('');
            // Disable button while loading
            setIsSendButtonDisabled(true);

            // Add the User message to the list of messages
            addMessage(user, newMessage);

            // Generate the ChatBot response
            const responseContents = await generateResponse(newMessage);

            setIsSendButtonDisabled(false);
        }
    };

    const updateLastMessage = (sender, contents) => {
        const updatedMessages = [...messages];
        if (updatedMessages.length > 0) {
            updatedMessages[0] = { sender, contents };
            setMessages(updatedMessages);
        }
    };

    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTo(0, messageContainerRef.current.scrollHeight);
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleMessageChange = (e) => {
        setNewMessage(e.target.value);
    };

    return (
        <div className="message-view">
            <div className="header">
                <img
                    src={process.env.PUBLIC_URL + '/rapp_logo.svg'}
                    alt="RAPP Logo"
                    className="logo"
                />
                <h1>
                    QA ChatBot Demo
                </h1>
            </div>
            <div className="message-container" ref={messageContainerRef}>
                {messages.slice().reverse().map((message, index) => (
                    <Message
                        key={index}
                        sender={message.sender}
                        contents={message.contents}
                        user={user}
                        ref={(el) => {
                            if (index === messages.length - 1) {
                                lastMessageRef.current = el;
                            }
                        }}
                    />
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Type message here..."
                    className="message-input"
                    value={newMessage}
                    onChange={handleMessageChange}
                />
                <button className={`send-button ${isSendButtonDisabled ? 'disabled' : ''}`} onClick={handleUserMessage} disabled={isSendButtonDisabled}>
                    Send
                </button>
            </div>
        </div>
    );
}

export default MessageView;