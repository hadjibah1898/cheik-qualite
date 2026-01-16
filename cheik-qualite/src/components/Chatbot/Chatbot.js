import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './Chatbot.css';

const Chatbot = () => {
    const [chatbotOpen, setChatbotOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: Date.now(),
            sender: 'bot',
            text: "Bonjour! 👋 Je suis votre assistant santé. Comment puis-je vous aider aujourd'hui?"
        }
    ]);
    const timersRef = useRef([]);
    const [chatbotInput, setChatbotInput] = useState('');
    const [error, setError] = useState('');

    const handleSendMessage = async () => {
        const message = chatbotInput.trim();
        if (message === '') return;
        const userMsg = { id: Date.now() + Math.random(), sender: 'user', text: message };
        setMessages(prev => [...prev, userMsg]);
        setChatbotInput('');

        // Send message to backend for processing
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chatbot`, {
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
            const botMsg = { id: Date.now() + Math.random(), sender: 'bot', text: data.response };
            setMessages(prevMessages => [...prevMessages, botMsg]);
            // Supprimer le message du bot après 3 secondes
            const t = setTimeout(() => {
                setMessages(prev => prev.filter(m => m.id !== botMsg.id));
            }, 3000);
            timersRef.current.push(t);
        } catch (err) {
            setError(err.message);
            const errMsg = { id: Date.now() + Math.random(), sender: 'bot', text: "Désolé, une erreur est survenue lors de la communication avec l'assistant." };
            setMessages(prevMessages => [...prevMessages, errMsg]);
            const tErr = setTimeout(() => {
                setMessages(prev => prev.filter(m => m.id !== errMsg.id));
            }, 3000);
            timersRef.current.push(tErr);
        }
    };

    useEffect(() => {
        return () => {
            // Cleanup des timers en cas de démontage
            timersRef.current.forEach(t => clearTimeout(t));
            timersRef.current = [];
        };
    }, []);

    const location = useLocation();
    useEffect(() => {
        // Lors d'un changement de route, supprimer les messages du bot et annuler les timers
        setMessages(prev => prev.filter(m => m.sender !== 'bot'));
        setChatbotOpen(false);
        timersRef.current.forEach(t => clearTimeout(t));
        timersRef.current = [];
        setError('');
    }, [location]);

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