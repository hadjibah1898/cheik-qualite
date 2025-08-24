import React from 'react';
import { NavLink } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-container">
                <div className="footer-section about">
                    <h3>À Propos de nous</h3>
                    <p>Conseils Santé Guinée est une initiative dédiée à la promotion d'une meilleure nutrition et d'une vie plus saine pour la population guinéenne.</p>
                </div>
                <div className="footer-section links">
                    <h3>Liens Utiles</h3>
                    <ul>
                        <li><NavLink to="/conseils">Analyse Alimentaire</NavLink></li>
                        <li><a href="#">Magazines Santé</a></li>
                        <li><NavLink to="/produits-locaux">Vendeurs Certifiés</NavLink></li>
                        <li><a href="#">Conditions d'utilisation</a></li>
                        <li><a href="#">Politique de Confidentialité</a></li>
                    </ul>
                </div>
                <div className="footer-section contact">
                    <h3>Contactez-nous</h3>
                    <p><i className="fas fa-map-marker-alt"></i> Conakry, Guinée</p>
                    <p><i className="fas fa-envelope"></i> contact@conseilsanteguinee.com</p>
                    <p><i className="fas fa-phone"></i> +224 620 00 00 00</p>
                </div>
                <div className="footer-section social">
                    <h3>Suivez-nous</h3>
                    <div className="social-icons">
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        <a href="#"><i className="fab fa-twitter"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                        <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2025 Conseils Santé Guinée. Tous droits réservés.</p>
            </div>
        </footer>
    );
};

export default Footer;
