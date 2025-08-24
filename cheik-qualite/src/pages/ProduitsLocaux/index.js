import React, { useState, useEffect } from 'react';
import './ProduitsLocaux.css';
import ContactModal from './components/ContactModal'; // Import the ContactModal component

const ProduitsLocaux = () => {
    const [producers, setProducers] = useState([]); // Change sellers to producers
    const [filteredProducers, setFilteredProducers] = useState([]); // Change filteredSellers to filteredProducers
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [selectedProducer, setSelectedProducer] = useState(null); // State for selected producer to contact

    useEffect(() => {
        const fetchProducers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/producers');
                if (!response.ok) {
                    throw new Error('Failed to fetch producers');
                }
                const data = await response.json();
                setProducers(data);
                setFilteredProducers(data); // Initialize filtered producers with all producers
            } catch (error) {
                console.error('Error fetching producers:', error);
                // Handle error, e.g., display an error message to the user
            }
        };

        fetchProducers();
    }, []); // Empty dependency array means this runs once on mount

    useEffect(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const filtered = producers.filter(producer => { // Change sellers to producers
            const matchesProduct = lowercasedSearchTerm === '' || producer.tags.some(tag => tag.toLowerCase().includes(lowercasedSearchTerm));
            const matchesRegion = selectedRegion === '' || producer.location === selectedRegion;
            return matchesProduct && matchesRegion;
        });
        setFilteredProducers(filtered);
    }, [searchTerm, selectedRegion, producers]); // Change sellers to producers

    const handleContact = (producer) => { // Pass producer object to handleContact
        setSelectedProducer(producer);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProducer(null);
    };

    return (
        <>
            <section className="promo-banner">
                <h2>L'excellence de nos terroirs</h2>
                <p>Découvrez et soutenez les produits locaux guinéens, certifiés pour votre santé et votre sécurité.</p>
            </section>
            
            <section className="search-section">
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
            
            <section className="sellers-section">
                <h2 className="section-title" style={{marginTop: '30px'}}><i className="fas fa-store"></i> Vendeurs Certifiés</h2>
                <div className="sellers-grid">
                    {filteredProducers.length > 0 ? (
                        filteredProducers.map((producer, index) => (
                            <div className="seller-card" key={index}>
                                {producer.isTopSeller && <div className="seller-badge"><i className="fas fa-star"></i> Top vendeur</div>}
                                {producer.isFastDelivery && <div className="seller-badge"><i className="fas fa-bolt"></i> Livraison rapide</div>}
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
            
            <section className="how-to-publish">
                <h2>Comment publier mes produits ?</h2>
                <div className="conditions-list">
                    <div className="condition-card">
                        <i className="fas fa-user-check"></i>
                        <h4>1. Avoir un compte</h4>
                        <p>Créez un profil producteur et fournissez vos informations de contact.</p>
                    </div>
                    <div className="condition-card">
                        <i className="fas fa-certificate"></i>
                        <h4>2. Obtenir une certification</h4>
                        <p>Faites certifier vos produits par l'ONCQ (Office National de Contrôle Qualité) pour garantir la sécurité et la santé de nos citoyens.</p>
                    </div>
                    <div className="condition-card">
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