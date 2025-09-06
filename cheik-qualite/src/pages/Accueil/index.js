import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { QRCodeSVG } from 'qrcode.react';
import { NavLink } from 'react-router-dom';
import './Accueil.css';


import ProductCard from './components/ProductCard.js';
import { toast } from 'react-toastify';

// Imports for new components
import Banner from './components/Banner.js';
import About from './components/About.js';
import News from './components/News.js';
import Testimonials from './components/Testimonials.js';
import Partners from './components/Partners.js';

const Accueil = () => {
    const [productQuery, setProductQuery] = useState('');
    const [email, setEmail] = useState('');
    const [result, setResult] = useState(null);
    const [showScanner, setShowScanner] = useState(false);
    const [products, setProducts] = useState([]);
    const scannerRef = useRef(null);

    useEffect(() => {
        const fetchLocalProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/local-products'); // Assuming this endpoint
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching local products:", error);
                toast.error("Erreur lors du chargement des produits locaux.");
            }
        };

        fetchLocalProducts();
    }, []); // Empty dependency array means this runs once on mount

    const verifyProduct = async (query) => {
        if (!query) {
            setResult(null);
            toast.error("Veuillez entrer un code ou un nom de produit.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/certificates/verify/${query}`);
            const data = await response.json();

            if (response.ok) {
                // Product is certified
                setResult({
                    status: 'conforme',
                    name: data.certificate.productName,
                    type: data.certificate.productType,
                    lotNumber: data.certificate.batchNumber,
                    producer: data.certificate.origin, // Assuming origin is producer
                    certification: data.certificate.oncqNumber,
                    imageUrl: data.certificate.productImagePaths && data.certificate.productImagePaths.length > 0 ? data.certificate.productImagePaths[0] : null,
                    qrData: data.certificate.oncqNumber // Or a more complex QR data
                });
                toast.success("Produit certifié et conforme !");
            } else if (response.status === 404) {
                // Product not found or not certified
                setResult({
                    status: "inconnu",
                    name: query,
                    message: data.message || "Produit non trouvé ou non certifié."
                });
                toast.warn(data.message || "Produit non trouvé ou non certifié.");
            } else {
                // Other errors
                setResult({ status: "inconnu", name: query });
                toast.error(`Erreur: ${data.message || 'Erreur lors de la vérification du produit.'}`);
            }
        } catch (error) {
            console.error('Erreur lors de la vérification du produit:', error);
            setResult({ status: "inconnu", name: query });
            toast.error('Erreur de connexion au serveur lors de la vérification du produit.');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        verifyProduct(productQuery);
    };

    const handleEmailSubmit = async (e) => { // Added 'async'
        e.preventDefault();
        const link = process.env.REACT_APP_FRONTEND_URL + window.location.pathname + '?action=scan';

        try {
            const response = await fetch('http://localhost:5000/api/send-scan-link', { // Assuming backend runs on port 5000
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, scanLink: link }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message); // Show success message from backend
                setEmail(''); // Clear the email input on success
            } else {
                toast.error(`Erreur: ${data.message || 'Quelque chose s\'est mal passé.'}`); // Show error message from backend
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi du lien de scan:', error);
            toast.error('Erreur lors de la connexion au serveur.');
        }
    };

    const toggleCamera = () => {
        setShowScanner(!showScanner);
    };
    
    const simulateScanForPC = (code) => {
        setProductQuery(code);
        verifyProduct(code); // Call the new verifyProduct function
        setShowScanner(false);
    }

    useEffect(() => {
        if (showScanner) {
            const config = {
                fps: 10,
                qrbox: 250,
                formatsToSupport: [
                    Html5QrcodeSupportedFormats.QR_CODE,
                    Html5QrcodeSupportedFormats.EAN_13,
                    Html5QrcodeSupportedFormats.EAN_8,
                    Html5QrcodeSupportedFormats.UPC_A,
                    Html5QrcodeSupportedFormats.UPC_E,
                    Html5QrcodeSupportedFormats.CODE_128,
                    Html5QrcodeSupportedFormats.CODE_39,
                    Html5QrcodeSupportedFormats.ITF,
                ]
            };
            const scanner = new Html5QrcodeScanner(
                "interactive",
                config,
                true // verbose
            );

            const onScanSuccess = (decodedText, decodedResult) => {
                setProductQuery(decodedText);
                verifyProduct(decodedText);
                scanner.clear();
                setShowScanner(false);
            };

            const onScanFailure = (error) => {
                // handle scan failure, usually better to ignore and keep scanning.
                // console.warn(`Code scan error = ${error}`);
            };

            scanner.render(onScanSuccess, onScanFailure);
            scannerRef.current = scanner;
        } else {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5-qrcode-scanner.", error);
                });
            }
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5-qrcode-scanner on cleanup.", error);
                });
            }
        };
    }, [showScanner]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('action') === 'scan') {
            setShowScanner(true);
        }
    }, []);

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    return (
        <>
            <Banner />

            <section className="section-box" id="verification">
                <h2 className="section-title">Vérifier la Certification d'un Produit</h2>
                <div className="verification-container">
                    <div className="verification-form-container">
                        <p style={{textAlign:'center', marginBottom: '20px'}}>
                            <i className="fas fa-barcode" style={{color:'#3498db'}}></i>
                            Entrez le numéro de code-barres, le nom du produit, ou le numéro de certification ONCQ.
                        </p>
                        <form className="verification-form" onSubmit={handleSearch}>
                            <input type="text" value={productQuery} onChange={(e) => setProductQuery(e.target.value)} placeholder="Entrez le code ou le nom du produit..." required />
                            <div className="button-group">
                                <button type="submit" className="search-btn"><i className="fas fa-search"></i> Rechercher</button>
                                <button type="button" className="camera-btn" onClick={toggleCamera}><i className="fas fa-camera"></i> {showScanner ? 'Stopper le Scan' : 'Scan par Caméra'} </button>
                            </div>
                        </form>
                    </div>
                    {!isMobile && (
                        <div className="email-form-container">
                            <div className="email-form">
                                <h3>Recevoir un lien de scan direct par email</h3>
                                <p>Recevez un lien unique pour scanner un produit instantanément sur votre téléphone.</p>
                                <form onSubmit={handleEmailSubmit}>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Entrez votre email" required />
                                    <button type="submit"><i className="fas fa-envelope"></i> Envoyer le lien de scan</button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
                
                {showScanner && (
                    <div id="scanner-container" style={{textAlign:'center', position: 'relative'}}>
                        <div id="interactive" className="viewport"></div>
                        <div id="scan-frame"></div>
                        <p id="camera-message" style={{marginTop: '10px', color: '#555', fontWeight: 'bold'}}>
                            {isMobile ? "Pointez la caméra sur le code-barres ou le QR code. Assurez-vous d'un bon éclairage." : "Pointez la webcam sur un code-barres ou un QR code. Assurez-vous d'un bon éclairage, ou cliquez sur l'image ci-dessous pour simuler un scan."}
                        </p>
                        {!isMobile && (
                            <div id="pc-barcode-sim">
                                <p style={{fontSize: '0.9em', color: '#777'}}>(Si vous êtes sur PC, vous pouvez cliquer sur l'image ci-dessous pour simuler un scan)</p>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b3/Code-barres_EAN-13_Wikip%C3%A9dia.png" alt="Code-barres de simulation" onClick={() => simulateScanForPC('9780201379624')} />
                            </div>
                        )}
                    </div>
                )}

                {result && (
                    <div id="result-container">
                        <div className={`result-box result-${result.status === 'conforme' ? 'success' : (result.status === 'non_conforme' ? 'danger' : 'info')}`}>
                            <img src={result.imageUrl} alt={`Produit ${result.status}`} className="result-image" />
                            <h3>{result.status === 'conforme' ? '✅ Produit Certifié et Conforme' : (result.status === 'non_conforme' ? '❌ Avertissement : Produit Non Conforme' : '⚠ Statut Indéterminé')}</h3>
                            <p><strong>Nom du produit :</strong> {result.name}</p>
                            {result.status === 'conforme' &&
                                <>
                                    <p><strong>Type :</strong> {result.type}</p>
                                    <p><strong>Numéro de lot :</strong> {result.lotNumber}</p>
                                    <p><strong>Producteur :</strong> {result.producer}</p>
                                    <p><strong>Numéro de certification :</strong> {result.certification}</p>
                                    <p>Ce produit respecte les normes de l'ONCQ.</p>
                                </>
                            }
                            {result.status === 'non_conforme' &&
                                <>
                                    <p>Ce produit ne dispose pas d\'une certification ONCQ valide ou est en cours de rappel.</p>
                                    <p>Pour votre santé, il est déconseillé de consommer ce produit.</p>
                                    <p><strong>Raison :</strong> {result.reason}</p>
                                </>
                            }
                            {result.status === 'inconnu' &&
                                <>
                                    <p>La requête <strong>{productQuery}</strong> ne figure pas dans notre base de données.</p>
                                    <p>Cela peut signifier que le produit n\'est pas certifié ou que l\'information n\'est pas encore disponible.</p>
                                    <p style={{marginTop: '15px'}}>Si vous pensez que ce produit devrait être certifié, vous pouvez <NavLink to="/soumission-certificat" className="link-button">soumettre un certificat</NavLink>.</p>
                                </>
                            }
                            <div style={{marginTop: '15px'}}>
                                <QRCodeSVG value={result.qrData} size={150} />
                            </div>
                            <p style={{fontSize: '0.9em', marginTop: '10px'}}>Scannez ce code QR pour voir la certification en ligne.</p>
                        </div>
                    </div>
                )}
            </section>

            <News />
            <Testimonials />

            <section className="section-box local-products-section">
                <h2 className="section-title">LES PRODUIT LOCAU EXISTANT</h2>
                <p style={{textAlign:'center', marginBottom: '20px'}}>Soutenons l\'économie guinéenne en consommant des produits du terroir, sûrs et de qualité.</p>
                <div className="local-products-grid">
                    {products.slice(-6).map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            <Partners />
            <About />
        </>
    );
};

export default Accueil;
