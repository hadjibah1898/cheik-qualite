import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QRCodeSVG } from 'qrcode.react'; // Importer QRCodeSVG
import Modal from '../../components/Modal/Modal.js'; // Importer le composant Modal
import './VerificationProduit.css';

const VerificationProduit = () => {
  const [scanResult, setScanResult] = useState(null);
  const [productInfo, setProductInfo] = useState(null);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQrModal, setShowQrModal] = useState(false); // État pour la modale QR

  useEffect(() => {
    // Fonction pour détecter si l'appareil est un mobile
    const isMobile = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    let scanner;
    if (isMobile()) {
        scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 300,
                height: 300,
            },
            fps: 10,
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
    }

    return () => {
        if (scanner) {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner.", error);
            });
        }
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

  // Fonction pour détecter si l'appareil est un mobile
  const isMobile = () => {
    return false; // Temporairement forcé à false pour le débogage sur ordinateur
  }

  return (
    <div className="verification-container">
      <h1>Vérification des Produits</h1>

      {isMobile() ? (
        <>
          <p className="scan-instruction">Veuillez centrer le code-barres dans le viseur.</p>
          <div id="reader"></div>
        </>
      ) : (
        <div className="desktop-qr-prompt">
          <p>Utilisez votre téléphone pour scanner un produit.</p>
          <button onClick={() => setShowQrModal(true)} className="qr-share-btn">
            Afficher le QR Code
          </button>
          <p className="desktop-alt-search">Ou recherchez manuellement un produit ci-dessous.</p>
        </div>
      )}

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

      {/* Modale pour afficher le QR Code */}
      <Modal show={showQrModal} onClose={() => setShowQrModal(false)}>
        <div className="qr-modal-content">
            <h2>Ouvrir sur votre mobile</h2>
            <p>Scannez ce QR Code avec votre téléphone pour ouvrir cette page et utiliser la caméra.</p>
            <QRCodeSVG value={window.location.href} size={256} />
        </div>
      </Modal>
    </div>
  );
};

export default VerificationProduit;
