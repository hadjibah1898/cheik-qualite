import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './VerificationProduit.css';

const VerificationProduit = () => {
  const [scanResult, setScanResult] = useState(null);
  const [productInfo, setProductInfo] = useState(null);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 300, // Increased size
        height: 300, // Increased size
      },
      fps: 10, // Increased FPS
    });

    const success = (result) => {
      scanner.clear();
      setScanResult(result);
      fetchProductByBarcode(result);
    };

    const error = (err) => {
      // console.warn(err);
    };

    scanner.render(success, error);

    return () => {
      scanner.clear();
    };
  }, []);

  const fetchProductByBarcode = async (barcode) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${barcode}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Produit non trouvé');
      }
      const data = await response.json();
      setProductInfo(data);
      setError('');
    } catch (err) {
      setError(err.message);
      setProductInfo(null);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setProductInfo(null);

    try {
      // This endpoint does not exist yet, I will need to create it.
      const response = await fetch(`http://localhost:5000/api/products/search/${searchQuery}`);
      if (!response.ok) {
        throw new Error('Produit non trouvé');
      }
      const data = await response.json();
      setProductInfo(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="verification-container">
      <h1>Vérification des Produits</h1>

      <p className="scan-instruction">Veuillez centrer le code QR dans le viseur.</p>
      <div id="reader"></div>

      <form onSubmit={handleSearch} className="search-form">
        <input 
          type="text" 
          placeholder="Rechercher par nom de produit"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Rechercher</button>
      </form>

      {scanResult && <p>Résultat du scan : {scanResult}</p>}
      {error && <p className="error-message">{error}</p>}
      {productInfo && (
        <div className="product-info">
          <h2>{productInfo.name}</h2>
          <p><strong>Marque :</strong> {productInfo.brand}</p>
          <p><strong>Conformité :</strong> {productInfo.compliant ? 'Conforme' : 'Non conforme'}</p>
          <p><strong>Informations :</strong> {productInfo.info}</p>
          {productInfo.source === 'certificates' && <p><small>(Source: Certificat ONCQ)</small></p>}
        </div>
      )}
    </div>
  );
};

export default VerificationProduit;
