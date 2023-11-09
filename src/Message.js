import React, { forwardRef } from 'react';
import './Message.css';

const Message = forwardRef(({ sender, contents, user }, ref) => {
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
        <div className={`message ${messageClass}`} style={messageStyle} ref={ref}>
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
});

export default Message;