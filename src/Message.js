import React from 'react';
import './Message.css';

function Message({ sender, contents, user }) {
    const isUser = sender === user;
    const messageClass = isUser ? 'right' : 'left';
    const backgroundColor = isUser ? 'orange' : '#F2F2F2';
    const textColor = isUser ? 'white' : 'black';

    const messageStyle = {
        backgroundColor,
        color: textColor,
    };


    const showTypingAnimation = contents.length === 0;

    return (
        <div className={`message ${messageClass}`} style={messageStyle}>
            <div className="contents">
                {contents}
                {showTypingAnimation && (
                    <div className="typing-dots-container">
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Message;