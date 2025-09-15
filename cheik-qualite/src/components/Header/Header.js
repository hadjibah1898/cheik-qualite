import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Header.css';

const Header = () => {
    const [isNavActive, setIsNavActive] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navRef = useRef(null);
    const [alertsList, setAlertsList] = useState([]); // State to store alerts
    const [hasAlerts, setHasAlerts] = useState(false); // State to control blinking

    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem('token');
            setIsAuthenticated(!!token);
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    setUserRole(decodedToken.role);
                } catch (error) {
                    console.error("Error decoding token in Header:", error);
                    setUserRole(null);
                    localStorage.removeItem('token');
                }
            } else {
                setUserRole(null);
            }
        };
        checkAuthStatus();
        window.addEventListener('focus', checkAuthStatus);
        return () => {
            window.removeEventListener('focus', checkAuthStatus);
        };
    }, []);

    // Fetch alerts when component mounts or when isAuthenticated changes
    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await fetch('/api/alerts');
                const data = await response.json();
                if (response.ok) {
                    setAlertsList(data);
                    setHasAlerts(data.length > 0); // Set hasAlerts based on fetched data
                } else {
                    console.error('Failed to fetch alerts');
                }
            } catch (error) {
                console.error('Error fetching alerts:', error);
            }
        };
        fetchAlerts();

        // Optional: Poll for new alerts every X seconds
        const alertInterval = setInterval(fetchAlerts, 60000); // Fetch every 60 seconds
        return () => clearInterval(alertInterval);
    }, []); // Empty dependency array to run once on mount

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close profile dropdown
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            // Close hamburger menu
            if (navRef.current && !navRef.current.contains(event.target) && isNavActive) {
                setIsNavActive(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef, navRef, isNavActive]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <header>
            <button className="hamburger-btn" aria-label="Toggle navigation menu" onClick={() => setIsNavActive(!isNavActive)}>
                <i className={`fas ${isNavActive ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
            <div className="header-top-right">
                {isAuthenticated && (
                    <NavLink to="/notifications" className={`notification-icon ${hasAlerts ? 'blink-animation' : ''}`}>
                        <i className="far fa-bell"></i>
                        {hasAlerts && <span className="notification-dot"></span>} {/* Optional: A small dot to indicate new alerts */}
                    </NavLink>
                )}
                <div className="profile-dropdown" ref={dropdownRef}>
                    {isAuthenticated ? (
                        <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="profile-icon-btn">
                            <i className="fas fa-user-circle"></i>
                        </button>
                    ) : (
                        <div className="guinea-flag"></div>
                    )}
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <ul>
                                <li><NavLink to="/profil">Profil</NavLink></li>
                                <li><button onClick={handleLogout} className="logout-btn-dropdown">Déconnexion</button></li>
                            </ul>
                        </div>
                    )}
                </div>
                 {!isAuthenticated && <div className="guinea-flag"></div>}
            </div>
            <div className="logo-container">
                <div className="logo-text">
                    <span className="logo-q">Q</span><span className="logo-s">S</span><span className="logo-l">L</span><span className="logo-guinee"> Guinée</span>
                </div>
                <p>Votre guide pour la Qualité, la Santé et les produits Locaux en Guinée</p>
            </div>
            
                        <nav ref={navRef} className={`header-nav ${isNavActive ? 'active' : ''}`} id="header-nav">
                <ul>
                    <li><NavLink to="/" end>Accueil</NavLink></li>
                    <li><NavLink to="/conseils">Conseils</NavLink></li>
                    <li><NavLink to="/produits-locaux">Produits Locaux</NavLink></li>
                    <li><NavLink to="/a-propos">À Propos</NavLink></li>
                    <li><NavLink to="/contact">Contact</NavLink></li>
                    {!isAuthenticated && (
                        <li><NavLink to="/login">Se connecter</NavLink></li>
                    )}
                   {userRole === 'admin' && (
                        <li><NavLink to="/admin">Admin</NavLink></li>
                   )}
                   {userRole === 'agent' && (
                        <li><NavLink to="/agent/dashboard">Dashboard Agent</NavLink></li>
                   )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;