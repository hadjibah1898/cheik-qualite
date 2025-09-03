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
                    <p>Pour nos producteurs locaux, obtenir une certification de l'ONCQ est un véritable tremplin. C'est la garantie d'offrir des produits de qualité supérieure, de gagner la confiance des consommateurs et de se démarquer sur le marché. C'est un label d'excellence qui valorise leur savoir-faire et ouvre les portes à de nouvelles opportunités.</p>
                    <NavLink to="/propos" className="learn-more-btn">En savoir plus sur nos missions</NavLink>
                </div>
                <div className="about-image">
                    <img src="https://cdn.brandfetch.io/idMaXNnUpj/w/699/h/177/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1744809581132" alt="Logo de l'ONCQ" />
                </div>
            </div>
        </section>
    );
};

export default About;