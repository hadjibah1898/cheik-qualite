import React from 'react';
import './Propos.css';

const Propos = () => {
    return (
        <>
            <section className="about-section">
                <h2>Notre Initiative</h2>
                <div className="divider"></div>
                <div className="mission-vision">
                    <div className="mission-vision-card">
                        <h3><i className="fas fa-bullseye"></i> Notre Mission</h3>
                        <p>Faciliter l'accès à une information fiable sur l'alimentation et la santé, en rendant les données de l'Office National de la Qualité et du Contrôle (ONCQ) accessibles au grand public. Nous visons à permettre à chaque Guinéen de faire des choix alimentaires éclairés pour prévenir les maladies chroniques.</p>
                    </div>
                    <div className="mission-vision-card">
                        <h3><i className="fas fa-seedling"></i> Notre Vision</h3>
                        <p>Construire une plateforme numérique de référence en Guinée qui responsabilise les consommateurs et encourage les producteurs locaux à se conformer aux normes de qualité. Nous rêvons d'une Guinée où l'accès à l'information de santé n'est plus un privilège mais un droit pour tous.</p>
                    </div>
                </div>
                
                <section className="team-section">
                    <h3>L'équipe du Projet</h3>
                    <div className="team-member">
                        <img src="https://via.placeholder.com/150" alt="Mamadou Djouldé Bah" />
                        <p>Mamadou Djouldé Bah</p>
                        <span>Chef de Projet / Développeur</span>
                    </div>
                    </section>
                
                <section className="partners-section">
                    <h3>Nos Partenaires</h3>
                    <div className="partners-logos">
                        <img src="https://via.placeholder.com/150x80?text=ONCQ" alt="Logo ONCQ" />
                        <img src="https://via.placeholder.com/150x80?text=Ministère+de+la+Santé" alt="Logo Ministère de la Santé" />
                        <img src="https://via.placeholder.com/150x80?text=Partenaire+3" alt="Logo Partenaire 3" />
                    </div>
                </section>
            </section>
        </>
    );
};

export default Propos;