import React, { useState, useEffect } from 'react';
import './Notifications.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState('');
    const [settings, setSettings] = useState({
        email: true,
        vocal: false,
        push: false
    });

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('/api/alerts'); // Changed from /api/notifications
                if (!response.ok) {
                    throw new Error('Failed to fetch alerts');
                }
                const data = await response.json();
                setNotifications(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchNotifications();

        // Mark alerts as read when Notifications component is viewed
        const markAlertsAsRead = async () => {
            try {
                const token = localStorage.getItem('token');
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
        markAlertsAsRead();

    }, []);

    const handleSettingChange = (e) => {
        const { id, checked } = e.target;
        setSettings(prevSettings => ({ ...prevSettings, [id]: checked }));
    };

    return (
        <>
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