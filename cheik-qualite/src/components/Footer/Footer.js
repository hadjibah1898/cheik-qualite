import React from 'react';
import { NavLink } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-container">
                <div className="footer-section about">
                    <h3>QSL Guinée</h3>
                    <p>Votre guide pour la Qualité, la Santé et les produits Locaux en Guinée. Nous nous engageons à promouvoir un mode de vie sain et à soutenir les producteurs locaux.</p>
                </div>
                <div className="footer-section links">
                    <h3>Navigation</h3>
                    <ul>
                        <li><NavLink to="/">Accueil</NavLink></li>
                        <li><NavLink to="/conseils">Conseils Santé</NavLink></li>
                        <li><NavLink to="/produits-locaux">Produits Locaux</NavLink></li>
                        <li><NavLink to="/a-propos">À Propos</NavLink></li>
                        <li><NavLink to="/contact">Contact</NavLink></li>
                        <li><NavLink to="/faq">FAQ</NavLink></li>
                    </ul>
                </div>
                <div className="footer-section contact">
                    <h3>Contactez-nous</h3>
                    <p><i className="fas fa-map-marker-alt"></i> Conakry, Guinée</p>
                    <p><i className="fas fa-envelope"></i> contact@qslguinee.com</p>
                    <p><i className="fas fa-phone"></i> +224 620 00 00 00</p>
                </div>
                <div className="footer-section social">
                    <h3>Suivez-nous</h3>
                    <div className="social-icons">
                        <a href="https://example.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                        <a href="https://example.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                        <a href="https://example.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                        <a href="https://example.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} QSL Guinée. Tous droits réservés.</p>
            </div>
        </footer>
    );
};

export default Footer;