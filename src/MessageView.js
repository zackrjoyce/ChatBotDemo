import React, { useState, useRef, useEffect } from 'react';
import './MessageView.css';
import Message from './Message';
import Sidebar from './Sidebar';

function MessageView(props) {
    const [messages, setMessages] = useState([]); //Visual component of messages
    const [newMessage, setNewMessage] = useState(''); //Text entry string
    const messageContainerRef = useRef(); //Reference to message container for scrolling purposes
    const lastMessageRef = useRef(null); //Reference to last sent message
    const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false); //Send button state for disabling/enabling while messages are being sent
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); //Sidebar enable/disable

    const [messagesMap, setMessagesMap] = useState({}); //Map representing prompts and corresponding messages
    const [selectedPrompt, setSelectedPrompt] = useState(null); //Currently selected prompt

    const { user } = props; //Logged in user, currently a placeholder but can be used later with authentication

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

    //Currently a placeholder to simulate a bot response, add AI response to messages here
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

        //Set visual component of empty message for loading effect
        await setMessages((prevMessages) => [emptyChatBotMessage, ...prevMessages]);

        //Send prompt to bot
        const response = await handleBotResponse(userMessage);

        // Replace the contents of the temporary ChatBot message with the actual response
        emptyChatBotMessage.contents = response;

        // Update visual component of messages with newly loaded response
        await setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages]; //initialize as previous messages
            const emptyMessageIndex = updatedMessages.findIndex( //find empty message representing loading
                (message) => message.sender === 'ChatBot' && message.contents === ''
            );
            if (emptyMessageIndex !== -1) {
                updatedMessages[emptyMessageIndex] = emptyChatBotMessage; //If found, replace with new message
            }
            return updatedMessages;
        });

        return emptyChatBotMessage; //Return bot response message
    };

    //Called by send button, outputs user message and gets bot response.
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

            //If new prompt and it exists already, navigate to that tab
            if (!selectedPrompt && newMessage in messagesMap) {

                handleTabClick(newMessage);
            }
            else {
                if (!selectedPrompt) {
                    // Create a new prompt for the first message
                    currentPrompt = newMessage.toString();

                    //Set selected prompt to new prompt
                    await setSelectedPrompt(currentPrompt);
                }
                else {
                    // Add the User message to the list of messages
                    currentPrompt = selectedPrompt;
                }

                //create user message from sender and contents
                const userMessage = { sender: user, contents: newMessage };

                //Set visual component
                await setMessages((prevMessages) => [userMessage, ...prevMessages]);

                // Generate the ChatBot response
                const botMessage = await generateResponse(newMessage);

                const updatedMessagesMap = { ...messagesMap }; //Set to reference of previous contents of message map

                if (!updatedMessagesMap[currentPrompt]) {
                    updatedMessagesMap[currentPrompt] = [];
                }

                updatedMessagesMap[currentPrompt].unshift(userMessage); //Add user message
                updatedMessagesMap[currentPrompt].unshift(botMessage); //Add bot message

                await Promise.all([
                    setMessagesMap(updatedMessagesMap), //Await and promise update to prevent synchronization issues.
                ]);
            }

            setIsSendButtonDisabled(false); //Re enable send button to allow for more messages
        }
    };

    //Scrolls message view to bottom on new message
    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTo(0, messageContainerRef.current.scrollHeight);
        }
    };

    //Sets newMessage to contents of text entry
    const handleMessageChange = (e) => {
        setNewMessage(e.target.value);
    };

    //Scrolls view to bottom on new message sent
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