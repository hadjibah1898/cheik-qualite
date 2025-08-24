import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            <img src={product.imageUrl} alt={product.name} />
            <div className="product-content">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <span className="product-badge">{product.badge}</span>
            </div>
        </div>
    );
};

export default ProductCard;
