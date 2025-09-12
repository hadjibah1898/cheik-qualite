import React from 'react';
import { NavLink } from 'react-router-dom';
import './BecomeAgentSection.css';

const BecomeAgentSection = () => {
    return (
        <section className="become-agent-section">
            <div className="container">
                <h2>Rejoignez Notre Mission</h2>
                <p>
                    Devenez un maillon essentiel de la chaîne de confiance en devenant un agent de qualité. 
                    Aidez-nous à vérifier et à valoriser les produits de nos terroirs pour un avenir plus sûr et plus prospère.
                </p>
                <NavLink to="/devenir-agent" className="cta-button">
                    Postuler pour Devenir Agent
                </NavLink>
            </div>
        </section>
    );
};

export default BecomeAgentSection;
