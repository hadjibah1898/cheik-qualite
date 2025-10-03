import React from 'react';
import { NavLink } from 'react-router-dom';
import './BecomeAgentSection.css';

const BecomeAgentSection = () => {
    return (
        <section className="become-agent-section">
            <div className="container">
                <h2 className="agent-section-title">Rejoignez Notre Mission de Qualité</h2>
                <p className="agent-section-subtitle">
                    Devenez un maillon essentiel de la chaîne de confiance en devenant un agent de qualité.
                    Aidez-nous à vérifier et à valoriser les produits de nos terroirs pour un avenir plus sûr et plus prospère.
                </p>
                <div className="benefits-container">
                    <div className="benefit-card">
                        <div className="benefit-icon">
                            <i className="fas fa-shield-alt"></i>
                        </div>
                        <h3>Impact Concret</h3>
                        <p>Contribuez directement à la sécurité et à la santé de votre communauté en assurant la qualité des produits locaux.</p>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-icon">
                            <i className="fas fa-rocket"></i>
                        </div>
                        <h3>Développement</h3>
                        <p>Acquérez de nouvelles compétences, recevez une formation continue et devenez un expert en contrôle qualité.</p>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-icon">
                            <i className="fas fa-users"></i>
                        </div>
                        <h3>Réseau Engagé</h3>
                        <p>Rejoignez une communauté d'agents passionnés et engagés pour la valorisation des produits guinéens.</p>
                    </div>
                </div>
                <NavLink to="/devenir-agent" className="cta-button agent-cta">
                    Postuler pour Devenir Agent
                </NavLink>
            </div>
        </section>
    );
};

export default BecomeAgentSection;