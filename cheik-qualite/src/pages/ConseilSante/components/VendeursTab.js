import React from 'react';

const VendeursTab = () => {
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
                    {/* Seller Cards Here */}
                    <div className="seller-card">
                        <div className="seller-badge"><i className="fas fa-star"></i> Top vendeur</div>
                        <div className="seller-header">
                            <h3>La Ferme Bio de Kindia</h3>
                            <div className="seller-location"><i className="fas fa-map-marker-alt"></i> Kindia, Guinée</div>
                            <div className="seller-rating">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star-half-alt"></i> 4.5 (87 avis)
                            </div>
                        </div>
                        <div className="seller-products">
                            <h4><i className="fas fa-seedling"></i> Produits certifiés</h4>
                            <div className="product-tags">
                                <span className="product-tag">Fonio bio</span>
                                <span className="product-tag">Fruits locaux</span>
                                <span className="product-tag">Légumes frais</span>
                                <span className="product-tag">Miel pur</span>
                            </div>
                        </div>
                        <button className="contact-btn">Contacter</button>
                    </div>
                    <div className="seller-card">
                        <div className="seller-header">
                            <h3>Marché Santé de Conakry</h3>
                            <div className="seller-location"><i className="fas fa-map-marker-alt"></i> Conakry, Guinée</div>
                            <div className="seller-rating">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i> 5.0 (42 avis)
                            </div>
                        </div>
                        <div className="seller-products">
                            <h4><i className="fas fa-seedling"></i> Produits certifiés</h4>
                            <div className="product-tags">
                                <span className="product-tag">Poisson frais</span>
                                <span className="product-tag">Huile de palme bio</span>
                                <span className="product-tag">Noix de cajou</span>
                                <span className="product-tag">Feuilles de baobab</span>
                            </div>
                        </div>
                        <button className="contact-btn">Contacter</button>
                    </div>
                        <div className="seller-card">
                        <div className="seller-badge"><i className="fas fa-bolt"></i> Livraison rapide</div>
                        <div className="seller-header">
                            <h3>Produits du Terroir</h3>
                            <div className="seller-location"><i className="fas fa-map-marker-alt"></i> Labé, Guinée</div>
                            <div className="seller-rating">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i> 4.9 (65 avis)
                            </div>
                        </div>
                        <div className="seller-products">
                            <h4><i className="fas fa-seedling"></i> Produits certifiés</h4>
                            <div className="product-tags">
                                <span className="product-tag">Patate douce</span>
                                <span className="product-tag">Moringa</span>
                                <span className="product-tag">Arachides</span>
                                <span className="product-tag">Gingembre bio</span>
                            </div>
                        </div>
                        <button className="contact-btn">Contacter</button>
                    </div>
                        <div className="seller-card">
                        <div className="seller-header">
                            <h3>Les Jardins de Mamou</h3>
                            <div className="seller-location"><i className="fas fa-map-marker-alt"></i> Mamou, Guinée</div>
                            <div className="seller-rating">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i> 4.8 (53 avis)
                            </div>
                        </div>
                        <div className="seller-products">
                            <h4><i className="fas fa-seedling"></i> Produits certifiés</h4>
                            <div className="product-tags">
                                <span className="product-tag">Bananes plantain</span>
                                <span className="product-tag">Légumes feuilles</span>
                                <span className="product-tag">Fruits saisonniers</span>
                            </div>
                        </div>
                        <button className="contact-btn">Contacter</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default VendeursTab;
