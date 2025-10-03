import React, { useState, useEffect, useMemo } from 'react';
import './Propos.css';

const Propos = () => {
    const [rotatingPhrase, setRotatingPhrase] = useState('');

    const phrases = useMemo(() => [
        "La certification des produits locaux : un gage de santé pour les consommateurs et une porte ouverte sur le marché international.",
        "Développons l'économie guinéenne ! Certifier nos produits, c'est assurer leur qualité et leur compétitivité mondiale.",
        "La santé de nos citoyens est notre priorité. La certification garantit des produits locaux sûrs et de haute qualité.",
        "Fiers de nos produits guinéens ! La certification est la clé pour les faire rayonner au-delà de nos frontières.",
        "Investir dans la certification, c'est investir dans la confiance des consommateurs et la croissance de nos producteurs locaux."
    ], []);

    useEffect(() => {
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * phrases.length);
            setRotatingPhrase(phrases[randomIndex]);
        }, 7000); // Change phrase every 7 seconds

        // Set initial phrase
        const initialIndex = Math.floor(Math.random() * phrases.length);
        setRotatingPhrase(phrases[initialIndex]);

        return () => clearInterval(interval);
    }, [phrases]);

    return (
        <>
            <div className="rotating-phrase-banner">
                <p>{rotatingPhrase}</p>
            </div>

            <section className="about-section fade-in-up">
                <h2>Notre Initiative</h2>
                <div className="divider"></div>
                <div className="mission-vision">
                    <div className="mission-vision-card fade-in-up delay-1">
                        <h3><i className="fas fa-bullseye"></i> Notre Mission</h3>
                        <p>Faciliter l'accès à une information fiable sur l'alimentation et la santé, en rendant les données de l'Office National de la Qualité et du Contrôle (ONCQ) accessibles au grand public. Nous visons à permettre à chaque Guinéen de faire des choix alimentaires éclairés pour prévenir les maladies chroniques.</p>
                    </div>
                    <div className="mission-vision-card fade-in-up delay-2">
                        <h3><i className="fas fa-seedling"></i> Notre Vision</h3>
                        <p>Construire une plateforme numérique de référence en Guinée qui responsabilise les consommateurs et encourage les producteurs locaux à se conformer aux normes de qualité. Nous rêvons d'une Guinée où l'accès à l'information de santé n'est plus un privilège mais un droit pour tous.</p>
                    </div>
                </div>
                
                <section className="team-section fade-in-up delay-3">
                    <h3>L'équipe du Projet</h3>
                    <div className="team-member">
                        <img src="/images/team-member.png" alt="Mamadou Djouldé Bah" /> {/* Chemin local */}
                        <p>Mamadou Djouldé Bah</p>
                        <span>Chef de Projet / Développeur</span>
                    </div>
                    </section>
                
                <section className="partners-section fade-in-up delay-4">
                    <h3>Nos Partenaires</h3>
                    <div className="partners-logos">
                        <img src="/images/logo-oncq.png" alt="Logo ONCQ" /> {/* Chemin local */}
                        <img src="/images/logo-ministere-sante.png" alt="Logo Ministère de la Santé" /> {/* Chemin local */}
                        <img src="/images/logo-partenaire3.png" alt="Logo Partenaire 3" /> {/* Chemin local */}
                    </div>
                </section>
            </section>
        </>
    );
};

export default Propos;
