import React from 'react';
import './About.css';
import { NavLink } from 'react-router-dom';

const About = () => {
    return (
        <section className="section-box about-section" id="about">
            <h2 className="section-title">À Propos de l'ONCQ</h2>
            <div className="about-content">
                <div className="about-text">
                    <p>L'<strong>Office National de Contrôle de Qualité (ONCQ)</strong> est l'organisme guinéen chargé de veiller à ce que les produits mis sur le marché respectent les normes de qualité et de sécurité. Notre mission est de protéger les consommateurs, de promouvoir l'excellence des produits guinéens et de soutenir une économie locale forte et fiable.</p>
                    <NavLink to="/propos" className="learn-more-btn">En savoir plus sur nos missions</NavLink>
                </div>
                <div className="about-image">
                    <img src="https://via.placeholder.com/400x300?text=ONCQ+Bureaux" alt="À propos de l'ONCQ" />
                </div>
            </div>
        </section>
    );
};

export default About;