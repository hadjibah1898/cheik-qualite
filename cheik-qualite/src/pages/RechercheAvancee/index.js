import React, { useState } from 'react';
import './RechercheAvancee.css';

const RechercheAvancee = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({
    products: [],
    healthAdvice: [],
    producers: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearchResults({ products: [], healthAdvice: [], producers: [] });

    try {
      // Fetch products
      const productsResponse = await fetch(`http://localhost:5000/api/products/search-all?q=${searchTerm}`);
      const productsData = await productsResponse.json();
      
      // Fetch health advice
      const healthAdviceResponse = await fetch(`http://localhost:5000/api/health-advice/search?q=${searchTerm}`);
      const healthAdviceData = await healthAdviceResponse.json();

      // Fetch producers
      const producersResponse = await fetch(`http://localhost:5000/api/producers/search?q=${searchTerm}`);
      const producersData = await producersResponse.json();

      setSearchResults({
        products: productsResponse.ok ? productsData : [],
        healthAdvice: healthAdviceResponse.ok ? healthAdviceData : [],
        producers: producersResponse.ok ? producersData : [],
      });

    } catch (err) {
      setError('Erreur lors de la recherche. Veuillez réessayer.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recherche-avancee-container">
      <h1>Recherche Avancée</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Rechercher des produits, conseils santé, producteurs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Recherche...' : 'Rechercher'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {searchTerm && !loading && !error && (
        <div className="search-results">
          <h2>Résultats pour "{searchTerm}"</h2>

          {searchResults.products.length > 0 && (
            <div className="result-category">
              <h3>Produits ({searchResults.products.length})</h3>
              {searchResults.products.map((product) => (
                <div key={product._id} className="result-item">
                  <h4>{product.name}</h4>
                  <p>{product.info}</p>
                </div>
              ))}
            </div>
          )}

          {searchResults.healthAdvice.length > 0 && (
            <div className="result-category">
              <h3>Conseils Santé ({searchResults.healthAdvice.length})</h3>
              {searchResults.healthAdvice.map((advice) => (
                <div key={advice._id} className="result-item">
                  <h4>{advice.title}</h4>
                  <p>{advice.content}</p>
                </div>
              ))}
            </div>
          )}

          {searchResults.producers.length > 0 && (
            <div className="result-category">
              <h3>Producteurs ({searchResults.producers.length})</h3>
              {searchResults.producers.map((producer) => (
                <div key={producer._id} className="result-item">
                  <h4>{producer.name}</h4>
                  <p>{producer.region} - {producer.tags.join(', ')}</p>
                </div>
              ))}
            </div>
          )}

          {searchResults.products.length === 0 &&
           searchResults.healthAdvice.length === 0 &&
           searchResults.producers.length === 0 && (
            <p>Aucun résultat trouvé pour votre recherche.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RechercheAvancee;