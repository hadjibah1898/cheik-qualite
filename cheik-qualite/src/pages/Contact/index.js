import React, { useState } from 'react';
import Modal from '../../components/Modal/Modal.js';
import './contact.css';

export default function AideForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [messageType, setMessageType] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, message }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowModal(true);
        setEmail('');
        setMessage('');
        setMessageType('success'); // Set message type to success
      } else {
        setResponseMessage(data.message || 'Une erreur est survenue.');
        setMessageType('error'); // Set message type to error
      }
    } catch (error) {
      console.error('Erreur:', error);
      setResponseMessage('Impossible de se connecter au serveur.');
      setMessageType('error'); // Set message type to error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page-container">
      <div className="contact-form-container">
        <h1 className="contact-title">Contactez-nous</h1>
        <p className="contact-subtitle">Vous avez une question ou une suggestion ? N'hésitez pas à nous écrire.</p>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Envoi en cours...' : 'Envoyer le message'}
          </button>
        </form>
        {responseMessage && (
            <p className={`response-message ${messageType}`}>
                {responseMessage}
            </p>
        )}
      </div>
      <div className="contact-info-container">
        <h2>Informations de contact</h2>
        <p><i className="fas fa-map-marker-alt"></i> Conakry, Guinée</p>
        <p><i className="fas fa-envelope"></i> contact@conseils-sante-guinee.com</p>
        <p><i className="fas fa-phone"></i> +224 123 456 789</p>
        <div className="social-links">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
        </div>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <h2>Message envoyé !</h2>
        <p>Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.</p>
      </Modal>
    </div>
  );
}