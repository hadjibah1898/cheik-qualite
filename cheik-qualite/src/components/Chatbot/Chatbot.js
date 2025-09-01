import React, { useState, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
    const [chatbotOpen, setChatbotOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            sender: 'bot',
            text: "Bonjour! 👋 Je suis votre assistant santé. Comment puis-je vous aider aujourd'hui?"
        }
    ]);
    const [chatbotInput, setChatbotInput] = useState('');
    const [error, setError] = useState('');

    const handleSendMessage = async () => {
        const message = chatbotInput.trim();
        if (message === '') return;

        const newMessages = [...messages, { sender: 'user', text: message }];
        setMessages(newMessages);
        setChatbotInput('');

        // Send message to backend for processing
        try {
            const response = await fetch('http://localhost:5000/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error('Failed to get chatbot response');
            }

            const data = await response.json();
            setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: data.response }]);
        } catch (err) {
            setError(err.message);
            setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: "Désolé, une erreur est survenue lors de la communication avec l'assistant." }]);
        }
    };

    return (
        <>
            <div className="chatbot-icon" id="chatbot-icon" onClick={() => setChatbotOpen(!chatbotOpen)}>
                <i className="fas fa-robot"></i>
            </div>

            {chatbotOpen && (
                <div className="chatbot-container" id="chatbot-container">
                    <div className="chatbot-header" id="chatbot-header" onClick={() => setChatbotOpen(!chatbotOpen)}>
                        <h3><i className="fas fa-robot"></i> Assistant Santé Guinée</h3>
                        <i className="fas fa-times" id="close-chatbot" onClick={() => setChatbotOpen(false)}></i>
                    </div>
                    <div className="chatbot-messages" id="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}-message`}>
                                <div className="message-sender">{msg.sender === 'user' ? 'Vous' : 'Assistant Santé'}</div>
                                <div className="message-content">{msg.text}</div>
                            </div>
                        ))}
                        {error && <p className="error-message">{error}</p>}
                    </div>
                    <div className="chatbot-input">
                        <input type="text" id="chatbot-input" placeholder="Posez votre question ici..." value={chatbotInput} onChange={(e) => setChatbotInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
                        <button id="send-message" onClick={handleSendMessage}><i className="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;