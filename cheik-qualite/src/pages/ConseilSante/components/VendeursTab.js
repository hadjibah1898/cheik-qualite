import React, { useState, useEffect } from 'react';

const VendeursTab = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/health-advice/vendors');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setVendors(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchVendors();
    }, []);

    if (loading) {
        return <div className="tab-content active" id="vendeurs-tab"><p>Chargement des vendeurs certifiés...</p></div>;
    }

    if (error) {
        return <div className="tab-content active" id="vendeurs-tab"><p>Erreur: {error.message}</p></div>;
    }

    return (
        <div className="tab-content active" id="vendeurs-tab">
            <section className="sellers-section">
                <h2 className="section-title"><i className="fas fa-store"></i> Vendeurs Certifiés</h2>
                <div className="certification-banner">
                    <i className="fas fa-certificate"></i>
                    <div>
                        <h3>Certification ONCQ</h3>
                        <p>Tous nos vendeurs sont certifiés par l'Office National de Contrôle Qualité de Guinée</p>
                    </div>
                </div>
                <div className="sellers-grid">
                    {vendors.map((seller) => (
                        <div key={seller.id} className="seller-card">
                            {seller.badge && <div className="seller-badge"><i className="fas fa-star"></i> {seller.badge}</div>}
                            <div className="seller-header">
                                <h3>{seller.name}</h3>
                                <div className="seller-location"><i className="fas fa-map-marker-alt"></i> {seller.location}</div>
                                <div className="seller-rating">
                                    {[...Array(Math.floor(seller.rating))].map((_, i) => <i key={i} className="fas fa-star"></i>)}
                                    {seller.rating % 1 !== 0 && <i className="fas fa-star-half-alt"></i>} {seller.rating} ({seller.reviews} avis)
                                </div>
                            </div>
                            <div className="seller-products">
                                <h4><i className="fas fa-seedling"></i> Produits certifiés</h4>
                                <div className="product-tags">
                                    {seller.products.map((product, index) => (
                                        <span key={index} className="product-tag">{product}</span>
                                    ))}
                                </div>
                            </div>
                            <button className="contact-btn">Contacter</button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default VendeursTab;
