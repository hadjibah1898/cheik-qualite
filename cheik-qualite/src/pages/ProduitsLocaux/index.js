import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './ProduitsLocaux.css';
import ContactModal from './components/ContactModal.js'; // Import the ContactModal component

const ProduitsLocaux = () => {
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedProducer, setSelectedProducer] = useState(null);
    const [producers, setProducers] = useState([]);
    const [filteredProducers, setFilteredProducers] = useState([]);
    const [localProducts, setLocalProducts] = useState([]); // Renamed from localProducts
    const [filteredLocalProducts, setFilteredLocalProducts] = useState([]); // Renamed from filteredLocalProducts
    const [promoPhrase, setPromoPhrase] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    const promoPhrases = useMemo(() => [
        "Du champ à l'assiette : la fierté guinéenne.",
        "Votre soutien, leur avenir. Achetez local.",
        "La certification : notre pacte de confiance avec vous.",
        "Goûtez à l'authenticité, savourez la Guinée.",
        "L'agriculture guinéenne, un trésor à portée de main."
    ], []);

    useEffect(() => {
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * promoPhrases.length);
            setPromoPhrase(promoPhrases[randomIndex]);
        }, 10000); // Change phrase every 10 seconds

        // Set initial phrase
        const randomIndex = Math.floor(Math.random() * promoPhrases.length);
        setPromoPhrase(promoPhrases[randomIndex]);

        return () => clearInterval(interval);
    }, [promoPhrases]);

    useEffect(() => {
        const fetchProducers = async () => {
            const cachedProducers = sessionStorage.getItem('producers');
            if (cachedProducers) {
                const producersData = JSON.parse(cachedProducers);
                setProducers(producersData);
                setFilteredProducers(producersData);
            } else {
                try {
                    const response = await fetch('http://localhost:5000/api/producers');
                    if (!response.ok) {
                        throw new Error('Failed to fetch producers');
                    }
                    const data = await response.json();
                    setProducers(data);
                    setFilteredProducers(data);
                    sessionStorage.setItem('producers', JSON.stringify(data));
                } catch (error) {
                    console.error('Error fetching producers:', error);
                    // Handle error, e.g., display an error message to the user
                }
            }
        };

        fetchProducers();
    }, []); // Empty dependency array means this runs once on mount

    const fetchLocalProducts = useCallback(async (pageNum) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/local-products?page=${pageNum}&limit=10`);
            if (!response.ok) {
                throw new Error('Failed to fetch local products');
            }
            const data = await response.json();
            setLocalProducts(prev => [...prev, ...data.products]);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching local products:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLocalProducts(page);
    }, [fetchLocalProducts, page]);

    // Effect for filtering producers (sellers)
    useEffect(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const filtered = producers.filter(producer => {
            const matchesProduct = lowercasedSearchTerm === '' || (producer.tags && producer.tags.some(tag => tag && tag.toLowerCase().includes(lowercasedSearchTerm)));
            const matchesRegion = selectedRegion === '' || producer.location === selectedRegion;
            return matchesProduct && matchesRegion;
        });
        setFilteredProducers(filtered);
    }, [searchTerm, selectedRegion, producers]);

    // New useEffect for filtering local products
    useEffect(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const filtered = localProducts.filter(product => {
            const matchesName = lowercasedSearchTerm === '' || (product.name && product.name.toLowerCase().includes(lowercasedSearchTerm));
            const matchesCategory = lowercasedSearchTerm === '' || (product.category && product.category.toLowerCase().includes(lowercasedSearchTerm));
            // Assuming products also have a region or location property for filtering by region
            // If not, you might need to adjust this or add a region property to your local products data
            const matchesRegion = selectedRegion === '' || (product.region && product.region.toLowerCase() === selectedRegion.toLowerCase());
            
            return (matchesName || matchesCategory) && matchesRegion;
        });
        setFilteredLocalProducts(filtered);
    }, [searchTerm, selectedRegion, localProducts]);

    const handleContact = (producer) => { // Pass producer object to handleContact
        setSelectedProducer(producer);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProducer(null);
    };

    const loadMore = () => {
        if (page < totalPages) {
            setPage(prevPage => prevPage + 1);
        }
    };

    return (
        <>
            <section className="promo-banner fade-in-up">
                <h2>{promoPhrase}</h2>
            </section>
            
            <section className="search-section fade-in-up delay-1">
                <div className="search-bar">
                    <div className="input-group">
                        <input 
                          type="text" 
                          placeholder="Rechercher un produit (ex: Fonio, Ananas...)" 
                          value={searchTerm} 
                          onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                    <div className="input-group">
                        <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
                            <option value="">Toutes les régions</option>
                            <option value="conakry">Conakry</option>
                            <option value="kindia">Kindia</option>
                            <option value="labe">Labé</option>
                            <option value="kankan">Kankan</option>
                            <option value="n'zerekore">N'Zérékoré</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <button type="button"><i className="fas fa-search"></i> Rechercher</button>
                    </div>
                </div>
            </section>

            <section className="local-products-section fade-in-up delay-2">
                <h2 className="section-title" style={{marginTop: '30px'}}><i className="fas fa-leaf"></i> Nos Produits Locaux Certifiés</h2>
                <div className="products-grid">
                    {filteredLocalProducts.length > 0 ? (
                        filteredLocalProducts.map((product, index) => (
                            <div className={`product-card fade-in-up delay-${index + 3}`} key={product._id}>
                                <img src={product.imageUrl} alt={product.name} className="product-image" />
                                <div className="product-info">
                                    <h3>{product.name}</h3>
                                    <p className="product-category">{product.category}</p>
                                    <p className="product-description">{product.description}</p>
                                    {product.badge && <span className="product-badge">{product.badge}</span>}
                                    {product.producer && product.producer.phone && (
                                        <button className="contact-btn" onClick={() => handleContact(product.producer)}><i className="fas fa-phone"></i> Contacter le producteur</button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{textAlign: 'center', fontStyle: 'italic', color: '#7f8c8d', gridColumn: '1 / -1'}}>Aucun produit local disponible pour le moment.</p>
                    )}
                </div>
                {loading && <p>Chargement...</p>}
                {!loading && page < totalPages && (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <button onClick={loadMore} className="load-more-btn">
                            Charger plus
                        </button>
                    </div>
                )}
            </section>
            
            <section className="sellers-section fade-in-up delay-3">
                <h2 className="section-title" style={{marginTop: '30px'}}><i className="fas fa-store"></i> Vendeurs Certifiés</h2>
                <div className="sellers-grid">
                    {filteredProducers.length > 0 ? (
                        filteredProducers.map((producer, index) => (
                            <div className={`seller-card fade-in-up delay-${index + 4}`} key={index}>
                                <img src={producer.image} alt={producer.name} className="seller-image" />
                                
                                
                                <div className="seller-header">
                                    <h3>{producer.name}</h3>
                                    <div className="seller-location"><i className="fas fa-map-marker-alt"></i> {producer.region}</div>
                                    <div className="seller-rating">
                                        <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star-half-alt"></i> {producer.rating}
                                    </div>
                                </div>
                                <div className="seller-products">
                                    <h4><i className="fas fa-seedling"></i> Produits certifiés</h4>
                                    <div className="product-tags">
                                        {producer.tags.map((tag, i) => <span className="product-tag" key={i}>{tag}</span>)}
                                    </div>
                                </div>
                                <button className="contact-btn" onClick={() => handleContact(producer)}><i className="fas fa-phone"></i> Contacter</button> {/* Pass producer to handleContact */}
                            </div>
                        ))
                    ) : (
                        <p style={{textAlign: 'center', fontStyle: 'italic', color: '#7f8c8d', gridColumn: '1 / -1'}}>Aucun vendeur ne correspond à votre recherche.</p>
                    )}
                </div>
            </section>
            
            <section className="how-to-publish fade-in-up delay-5">
                <h2>Comment publier mes produits ?</h2>
                <div className="conditions-list">
                    <div className="condition-card fade-in-up delay-6">
                        <i className="fas fa-user-check"></i>
                        <h4>1. Avoir un compte</h4>
                        <p>Créez un profil producteur et fournissez vos informations de contact.</p>
                    </div>
                    <div className="condition-card fade-in-up delay-7">
                        <i className="fas fa-certificate"></i>
                        <h4>2. Obtenir une certification</h4>
                        <p>Faites certifier vos produits par l'ONCQ (Office National de Contrôle Qualité) pour garantir la sécurité et la santé de nos citoyens.</p>
                    </div>
                    <div className="condition-card fade-in-up delay-8">
                        <i className="fas fa-clipboard-list"></i>
                        <h4>3. Publier vos produits</h4>
                        <p>Une fois certifié, listez vos produits, votre localisation et vos coordonnées pour être visible par les acheteurs.</p>
                    </div>
                </div>
            </section>

            {showModal && selectedProducer && (
                <ContactModal producer={selectedProducer} onClose={handleCloseModal} />
            )}
        </>
    );
};

export default ProduitsLocaux;