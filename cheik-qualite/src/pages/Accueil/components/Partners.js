import React from 'react';
import { partnersData } from '../../../data/partnersData.js';
import './Partners.css';

const Partners = () => {
    return (
        <section className="section-box partners-section" id="partners">
            <h2 className="section-title">Nos Partenaires de Confiance</h2>
            <div className="partners-grid">
                {partnersData.map(partner => (
                    <div key={partner.id} className="partner-logo">
                        <img src={partner.logoUrl} alt={partner.name} title={partner.name} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Partners;