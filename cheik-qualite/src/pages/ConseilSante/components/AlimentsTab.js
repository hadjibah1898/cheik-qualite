import React, { useState, useEffect } from 'react';

const AlimentsTab = ({ products, getStatus }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        const term = searchTerm.trim().toLowerCase();
        if (term === '') {
            setFilteredProducts([]); // Show nothing if search term is empty
        } else {
            const results = products.filter(p =>
                p.name.toLowerCase().includes(term) ||
                (p.description && p.description.toLowerCase().includes(term))
            );
            setFilteredProducts(results);
        }
    }, [searchTerm, products]);

    // No need for the second useEffect to set all products on initial load anymore

    return (
        <div className="tab-content active" id="aliments-tab">
            <section className="search-section">
                <div className="search-box">
                    <input
                        type="text"
                        id="product-search"
                        placeholder="Rechercher un aliment..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="aliment-search-input"
                    />
                </div>
                <p className="examples">Exemples: Fonio, Banane plantain, Poisson fumé, Sauce d'arachide</p>
            </section>

            <section className="results-list-section">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <div key={product.name} className="product-card-aliment">
                            <div className="product-header-aliment">
                                <div className="product-image-aliment">
                                    <i className={product.icon} id="product-icon"></i>
                                </div>
                                <div className="product-info-aliment">
                                    <h2 id="product-name">{product.name}</h2>
                                    <p id="product-description">{product.description}</p>
                                </div>
                            </div>

                            <div className="health-indicators-aliment">
                                <div className="indicator diabetic">
                                    <h3><i className="fas fa-syringe"></i> Diabète</h3>
                                    <p>Charge glycémique et teneur en sucre</p>
                                    {getStatus("diabetic", product.diabetic)}
                                </div>

                                <div className="indicator hypertension">
                                    <h3><i className="fas fa-heartbeat"></i> Hypertension</h3>
                                    <p>Teneur en sodium et graisses saturées</p>
                                    {getStatus("hypertension", product.hypertension)}
                                </div>

                                <div className="indicator drepanocytosis">
                                    <h3><i className="fas fa-dna"></i> Drépanocytose</h3>
                                    <p>Teneur en fer et propriétés hydratantes</p>
                                    {getStatus("drepanocytosis", product.drepanocytosis)}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-results-aliment">Veuillez rechercher un aliment.</p>
                )}
            </section>
        </div>
    );
};

export default AlimentsTab;
