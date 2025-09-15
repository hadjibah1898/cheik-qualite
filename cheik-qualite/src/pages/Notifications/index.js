import React, { useState, useEffect, useContext } from 'react';
import './Notifications.css';
import { AuthContext } from '../../context/AuthContext.js';
import Modal from '../../components/Modal/Modal.js';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState('');
    const [settings, setSettings] = useState({
        email: false,
        vocal: false,
        push: false
    });
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const { user, login } = useContext(AuthContext);

    useEffect(() => {
        if (user && user.email) {
            setUserEmail(user.email);
        }
        const token = localStorage.getItem('token');

        const fetchNotifications = async () => {
            try {
                const response = await fetch('/api/alerts', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch alerts');
                }
                const data = await response.json();
                setNotifications(data);
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchSettings = async () => {
            try {
                const response = await fetch('/api/settings', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setSettings(data);
                } else {
                    console.error('Failed to fetch settings');
                }
            } catch (err) {
                console.error('Error fetching settings:', err);
            }
        };

        const markAlertsAsRead = async () => {
            try {
                const response = await fetch('/api/alerts/mark-as-read', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    console.error('Failed to mark alerts as read');
                }
            } catch (err) {
                console.error('Error marking alerts as read:', err);
            }
        };

        fetchNotifications();
        fetchSettings();
        markAlertsAsRead();

    }, [user]);

    const updateSettingsOnServer = async (newSettings) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSettings),
            });

            if (!response.ok) {
                console.error('Failed to update settings');
                // Revert on failure
                setSettings(settings);
            }
        } catch (err) {
            console.error('Error updating settings:', err);
            setSettings(settings);
        }
    };

    const handleSettingChange = async (e) => {
        const { id, checked } = e.target;

        if (id === 'email' && checked && (!user || !user.email)) {
            setShowEmailModal(true);
            return; // Stop processing until email is provided
        }

        const newSettings = { ...settings, [id]: checked };
        setSettings(newSettings);
        await updateSettingsOnServer(newSettings);
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...user, email: userEmail }),
            });

            if (response.ok) {
                // Refresh user context by re-triggering login logic
                login(token);
                setShowEmailModal(false);
                // Automatically enable and save the email setting
                const newSettings = { ...settings, email: true };
                setSettings(newSettings);
                await updateSettingsOnServer(newSettings);
            } else {
                console.error('Failed to update email');
            }
        } catch (error) {
            console.error('Error updating email', error);
        }
    };

    return (
        <>
            <Modal show={showEmailModal} onClose={() => setShowEmailModal(false)}>
                <h4>Votre adresse e-mail est requise</h4>
                <p>Veuillez fournir votre adresse e-mail pour recevoir des notifications.</p>
                <form onSubmit={handleEmailSubmit} className="email-modal-form">
                    <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="votre.email@example.com"
                        required
                    />
                    <button type="submit">Enregistrer</button>
                </form>
            </Modal>

            <section className="notification-section">
                <h2><i className="fas fa-bell"></i> Votre Centre de Notifications</h2>

                <div id="notification-list">
                    {error && <p className="error-message">{error}</p>}
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div className={`notification-card ${notification.type === 'success' ? 'success' : ''}`} key={notification._id}>
                                <i className={notification.icon || 'fas fa-exclamation-triangle'}></i>
                                <div className="notification-card-content">
                                    <h3>{notification.title}</h3>
                                    <p>{notification.message}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        !error && <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#7f8c8d' }}>Aucune notification pour le moment.</p>
                    )}
                </div>
            </section>

            <section className="settings-section">
                <h2><i className="fas fa-cog"></i> Paramètres de notifications</h2>
                <div className="settings-option">
                    <label>
                        <i className="fas fa-envelope"></i>
                        Recevoir les alertes par email
                    </label>
                    <label className="switch">
                        <input type="checkbox" id="email" checked={settings.email} onChange={handleSettingChange} />
                        <span className="slider"></span>
                    </label>
                </div>
                <div className="settings-option">
                    <label>
                        <i className="fas fa-volume-up"></i>
                        Recevoir les alertes vocales (par email)
                    </label>
                    <label className="switch">
                        <input type="checkbox" id="vocal" checked={settings.vocal} onChange={handleSettingChange} />
                        <span className="slider"></span>
                    </label>
                </div>
                <div className="settings-option">
                    <label>
                        <i className="fas fa-mobile-alt"></i>
                        Recevoir les notifications push (sur votre navigateur)
                    </label>
                    <label className="switch">
                        <input type="checkbox" id="push" checked={settings.push} onChange={handleSettingChange} />
                        <span className="slider"></span>
                    </label>
                </div>
            </section>
        </>
    );
};

export default Notifications;