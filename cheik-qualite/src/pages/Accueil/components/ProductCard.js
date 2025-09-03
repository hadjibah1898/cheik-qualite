import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const handleContact = () => {
        alert(`Contactez le vendeur au : ${product.contact}`);
    };

    return (
        <div className="product-card">
            <img src={product.imageUrl} alt={product.name} />
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
