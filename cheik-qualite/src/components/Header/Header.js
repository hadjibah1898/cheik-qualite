import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [isNavActive, setIsNavActive] = useState(false);

    return (
        <header>
            <button className="hamburger-btn" aria-label="Toggle navigation menu" onClick={() => setIsNavActive(!isNavActive)}>
                <i className={`fas ${isNavActive ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
            <div className="guinea-flag"></div>
            <h1>Conseils Santé Guinée</h1>
            <p>Votre guide pour une vie saine et des produits de qualité en Guinée</p>
            
            <nav className={`header-nav ${isNavActive ? 'active' : ''}`} id="header-nav">
                <ul>
                    <li><NavLink to="/" end>Accueil</NavLink></li>
                    <li><NavLink to="/conseils">Conseils</NavLink></li>
                    <li><NavLink to="/produits-locaux">Produits Locaux</NavLink></li>
                    <li><NavLink to="/notifications">Notifications</NavLink></li>
                    <li><NavLink to="/a-propos">À Propos</NavLink></li>
                    <li><NavLink to="/profil">Mon Profil</NavLink></li>
                    <li><NavLink to="/login">Se connecter</NavLink></li>
                    <li><NavLink to="/admin">Admin</NavLink></li>
                    <li><NavLink to="/soumission">Soumettre</NavLink></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
