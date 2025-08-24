import React, { useState, useEffect } from 'react';

const AlimentsTab = ({ products, getStatus }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    const handleSearch = () => {
        const term = searchTerm.trim().toLowerCase();
        if (term === "") {
            alert("Veuillez entrer un nom de produit");
            return;
        }
        const product = products.find(p => p.name.toLowerCase().includes(term));
        if (product) {
            setSearchResult(product);
        } else {
            alert("Produit non trouvé dans notre base de données. Essayez un autre produit.");
        }
    };

    useEffect(() => {
        const initialSearch = () => {
            const product = products.find(p => p.name.toLowerCase().includes("fonio"));
            if(product) setSearchResult(product);
        }
        initialSearch();
    }, [products]);

    return (
        <div className="tab-content active" id="aliments-tab">
            <section className="search-section">
                <div className="search-box">
                    <input type="text" id="product-search" placeholder="Entrez un aliment ou scannez un produit..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} />
                    <button id="search-btn" onClick={handleSearch}><i className="fas fa-search"></i> Analyser</button>
                </div>
                <p className="examples">Exemples: Fonio, Banane plantain, Poisson fumé, Sauce d'arachide</p>
            </section>

            {searchResult && (
                <section className="result-section" style={{display: 'block'}}>
                    <div className="product-header">
                        <div className="product-image">
                            <i className={searchResult.icon} id="product-icon"></i>
                        </div>
                        <div className="product-info">
                            <h2 id="product-name">{searchResult.name}</h2>
                            <p id="product-description">{searchResult.description}</p>
                        </div>
                    </div>

                    <div className="health-indicators">
                        <div className="indicator diabetic">
                            <h3><i className="fas fa-syringe"></i> Diabète</h3>
                            <p>Charge glycémique et teneur en sucre</p>
                            {getStatus("diabetic", searchResult.diabetic)}
                        </div>

                        <div className="indicator hypertension">
                            <h3><i className="fas fa-heartbeat"></i> Hypertension</h3>
                            <p>Teneur en sodium et graisses saturées</p>
                            {getStatus("hypertension", searchResult.hypertension)}
                        </div>

                        <div className="indicator drepanocytosis">
                            <h3><i className="fas fa-dna"></i> Drépanocytose</h3>
                            <p>Teneur en fer et propriétés hydratantes</p>
                            {getStatus("drepanocytosis", searchResult.drepanocytosis)}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default AlimentsTab;
