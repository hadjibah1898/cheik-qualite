import React, { useState } from 'react';
import './ContactModal.css';

const ContactModal = ({ producer, onClose }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError('');

    try {
      // This endpoint does not exist yet, I will need to create it.
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/contact-producer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          producerEmail: producer.email,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message.');
      }

      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSending(false);
    }
  };

  if (sent) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Message Envoyé !</h2>
          <p>Votre message a été envoyé avec succès au producteur.</p>
          <button onClick={onClose}>Fermer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Contacter {producer.name}</h2>
        {producer.phone && <p>Téléphone: <a href={`tel:${producer.phone}`}>{producer.phone}</a></p>}
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Votre message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          {error && <p className="error-message">{error}</p>}
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit" disabled={isSending}>
              {isSending ? 'Envoi en cours...' : 'Envoyer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
