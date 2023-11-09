import React, { useState, useRef, useEffect } from 'react';
import './MessageView.css';
import Message from './Message';
import Sidebar from './Sidebar';

function MessageView(props) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messageContainerRef = useRef();
    const lastMessageRef = useRef(null);
    const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [messagesMap, setMessagesMap] = useState({});
    const [selectedPrompt, setSelectedPrompt] = useState(null);

    // Add a state variable to track whether to create a new entry
    const [createNewEntry, setCreateNewEntry] = useState(false);

    const handleOpenSidebar = () => {
        setIsSidebarOpen(true);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

    const handleTabClick = (prompt) => {
        setSelectedPrompt(prompt);
        setMessages(messagesMap[prompt] || []);
    };

    const handleClearMessagesAndPrompt = () => {
        setSelectedPrompt(null);
        setMessages([]);
    };

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

        await setMessages((prevMessages) => [emptyChatBotMessage, ...prevMessages]);

        // Simulate an asynchronous operation (e.g., an API call)
        const response = await handleBotResponse(userMessage);

        // Replace the contents of the temporary ChatBot message with the actual response
        emptyChatBotMessage.contents = response;

        // Update the state with the modified messages array
        await setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            const emptyMessageIndex = updatedMessages.findIndex(
                (message) => message.sender === 'ChatBot' && message.contents === ''
            );
            if (emptyMessageIndex !== -1) {
                updatedMessages[emptyMessageIndex] = emptyChatBotMessage;
            }
            return updatedMessages;
        });

        return emptyChatBotMessage;
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
            let currentPrompt = null;

            if (!selectedPrompt && newMessage in messagesMap) {

                handleTabClick(newMessage);
            }
            else {
                if (!selectedPrompt) {
                    // Create a new prompt for the first message
                    currentPrompt = newMessage.toString();

                    await setSelectedPrompt(currentPrompt);
                }
                else {
                    // Add the User message to the list of messages
                    currentPrompt = selectedPrompt;
                }

                const userMessage = { sender: user, contents: newMessage };

                await setMessages((prevMessages) => [userMessage, ...prevMessages]);

                // Generate the ChatBot response
                const botMessage = await generateResponse(newMessage);

                const updatedMessagesMap = { ...messagesMap };

                if (!updatedMessagesMap[currentPrompt]) {
                    updatedMessagesMap[currentPrompt] = [];
                }

                updatedMessagesMap[currentPrompt].unshift(userMessage);
                updatedMessagesMap[currentPrompt].unshift(botMessage);

                await Promise.all([
                    setMessagesMap(updatedMessagesMap),
                ]);
            }

            setIsSendButtonDisabled(false);
        }
    };

    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTo(0, messageContainerRef.current.scrollHeight);
        }
    };

    const handleMessageChange = (e) => {
        setNewMessage(e.target.value);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="message-view">
            <Sidebar
                tabs={[
                    ...Object.keys(messagesMap).map((prompt) => ({
                        label: prompt,
                        content: messagesMap[prompt].length + ' Messages',
                    })),
                    {
                        label: "Create New Entry",
                        content: "Start a new conversation",
                    }
                ]}
                onTabClick={(prompt) => {handleTabClick(prompt)}}
                isSidebarOpen={isSidebarOpen}
                onCloseSidebar={handleCloseSidebar}
                onClearMessagesAndPrompt={handleClearMessagesAndPrompt}
            />
            <div className="header">
                <button className="button" onClick={handleOpenSidebar}>
                    History
                </button>
                <img
                    src={process.env.PUBLIC_URL + '/rapp_logo.svg'}
                    alt="RAPP Logo"
                    className="logo"
                />
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