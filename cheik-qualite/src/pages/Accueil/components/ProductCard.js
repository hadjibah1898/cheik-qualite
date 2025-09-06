import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const handleContact = () => {
        alert(`Contactez le vendeur au : ${product.contact}`);
    };

    // Détermine la source correcte de l'image
    const getImageUrl = (url) => {
        if (!url) return ''; // Gère les URL nulles ou indéfinies

        // Vérifie si l'URL est une chaîne de données Base64
        if (url.startsWith('data:image')) {
            return url;
        }

        // Vérifie si c'est une URL absolue (contient '://')
        if (url.includes('://')) {
            return url;
        }
        // Si c'est une URL relative au protocole (commence par '//'), ajoute 'https:'
        if (url.startsWith('//')) {
            return `https:${url}`;
        }
        // Sinon, suppose que c'est un chemin relatif depuis le backend
        // Idéalement, l'URL de base du backend devrait être une variable d'environnement
        const baseUrl = 'http://localhost:5000';
        const cleanedUrl = url.startsWith('/') ? url : `/${url}`;
        return `${baseUrl}${cleanedUrl}`;
    };

    return (
        <div className="product-card">
            <img src={getImageUrl(product.imageUrl)} alt={product.name} />
            <div className="product-content">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <span className="product-badge">{product.badge}</span>
                <button className="contact-btn" onClick={handleContact}><i className="fas fa-phone"></i> Contacter</button>
            </div>
        </div>
    );
}; 

export default ProductCard;
