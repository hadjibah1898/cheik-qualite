import React, { useState, useEffect } from 'react';

const AlimentsTab = ({ getStatus }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            const term = searchTerm.trim();
            if (term === '') {
                setFilteredProducts([]);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(`/api/openfoodfacts/search?q=${encodeURIComponent(term)}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setFilteredProducts(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des produits:", error);
                setFilteredProducts([]); // Clear products on error
            } finally {
                setLoading(false);
            }
        };

        const handler = setTimeout(() => {
            fetchProducts();
        }, 500); // Debounce search to avoid too many API calls

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

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
                {loading ? (
                    <p>Chargement...</p>
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <div key={product.name} className="product-card-aliment">
                            <div className="product-header-aliment">
                                <div className="product-image-aliment">
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: 'auto' }} />
                                    ) : (
                                        <i className="fas fa-utensils" id="product-icon"></i> // Generic icon
                                    )}
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
                                    {getStatus("diabetic", product.nutriments.sugars)}
                                </div>

                                <div className="indicator hypertension">
                                    <h3><i className="fas fa-heartbeat"></i> Hypertension</h3>
                                    <p>Teneur en sodium et graisses saturées</p>
                                    {getStatus("hypertension", product.nutriments.salt)}
                                </div>

                                <div className="indicator drepanocytosis">
                                    <h3><i className="fas fa-dna"></i> Drépanocytose</h3>
                                    <p>Teneur en fer et propriétés hydratantes</p>
                                    {getStatus("drepanocytosis", product.nutriments.iron)}
                                </div>
                            </div>
                        </div>
                    ))
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <div key={product.name} className="product-card-aliment">
                            <div className="product-header-aliment">
                                <div className="product-image-aliment">
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: 'auto' }} />
                                    ) : (
                                        <i className="fas fa-utensils" id="product-icon"></i> // Generic icon
                                    )}
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
                                    {getStatus("diabetic", product.nutriments.sugars)}
                                </div>

                                <div className="indicator hypertension">
                                    <h3><i className="fas fa-heartbeat"></i> Hypertension</h3>
                                    <p>Teneur en sodium et graisses saturées</p>
                                    {getStatus("hypertension", product.nutriments.salt)}
                                </div>

                                <div className="indicator drepanocytosis">
                                    <h3><i className="fas fa-dna"></i> Drépanocytose</h3>
                                    <p>Teneur en fer et propriétés hydratantes</p>
                                    {getStatus("drepanocytosis", product.nutriments.iron)}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-results-aliment">
                        {searchTerm.length > 0 ? 
                            `Aucun résultat trouvé pour "${searchTerm}". Veuillez essayer un autre terme de recherche.` :
                            `Veuillez rechercher un aliment.`
                        }
                    </p>
                )}
            </section>
        </div>
    );
};

export default AlimentsTab;
