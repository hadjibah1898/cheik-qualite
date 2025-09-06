import React, { useState, useEffect } from 'react';
import './AlimentsTab.css';

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
                <p className="importance-phrase">Votre santé commence dans votre assiette. Recherchez des aliments pour des choix éclairés.</p>
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
                                    <h2 id="product-name">{product.product_name_fr || product.name}</h2>
                                    {product.brands && <p className="product-brand">Marque: {product.brands}</p>}
                                    {product.categories && <p className="product-category">Catégories: {product.categories.join(', ')}</p>}
                                    <p id="product-description">{product.description}</p>
                                </div>
                            </div>

                            {product.ingredients_text_fr && (
                                <div className="product-ingredients">
                                    <h3>Ingrédients:</h3>
                                    <p>{product.ingredients_text_fr}</p>
                                </div>
                            )}

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

                            {product.nutriments && (
                                <div className="nutritional-info">
                                    <h3>Informations Nutritionnelles (pour 100g):</h3>
                                    <ul>
                                        {product.nutriments.energy_kcal_100g && <li>Énergie: {product.nutriments.energy_kcal_100g} kcal</li>}
                                        {product.nutriments.proteins_100g && <li>Protéines: {product.nutriments.proteins_100g} g</li>}
                                        {product.nutriments.carbohydrates_100g && <li>Glucides: {product.nutriments.carbohydrates_100g} g</li>}
                                        {product.nutriments.fat_100g && <li>Matières grasses: {product.nutriments.fat_100g} g</li>}
                                        {product.nutriments.fiber_100g && <li>Fibres: {product.nutriments.fiber_100g} g</li>}
                                    </ul>
                                </div>
                            )}
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
