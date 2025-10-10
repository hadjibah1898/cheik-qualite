import React, { useState, useEffect } from 'react';
import './Banner.css';

const images = [
    'https://images.unsplash.com/photo-1535090467336-95d21c1b2356', 
    'https://images.unsplash.com/photo-1547486894-864a31340712', 
    'https://images.unsplash.com/photo-1587899769963-3c09c0358666'
];

const Banner = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // Change image every 5 seconds

        return () => clearTimeout(timer);
    }, [currentImageIndex]);

    return (
        <section 
            className="banner-section" 
            id="banner" 
        >
            <div className="banner-background-slider">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`banner-background ${index === currentImageIndex ? 'active' : ''}`}
                        style={{ 
                            backgroundImage: `url('${image}')`
                        }}
                    />
                ))}
            </div>
            <div className="banner-overlay"></div>
            <div className="banner-content">
                <h1>Bienvenue sur la Plateforme de Qualité Guinéenne</h1>
                <p>Votre source de confiance pour la vérification des produits et le soutien à l'économie locale.</p>
                <a href="#verification" className="banner-cta-button">Vérifier un produit</a>
            </div>
        </section>
    );
};

export default Banner;