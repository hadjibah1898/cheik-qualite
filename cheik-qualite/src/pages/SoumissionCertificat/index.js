
import React, { useState } from 'react';
import './SoumissionCertificat.css';

const SoumissionCertificat = () => {
  const [formData, setFormData] = useState({
    productName: '',
    productType: '',
    barcode: '',
    batchNumber: '',
    origin: '',
    description: '',
    oncqNumber: '',
    validityPeriod: ''
  });
  const [certificate, setCertificate] = useState(null);
  const [productImages, setProductImages] = useState(null);
  const [message, setMessage] = useState('');
  const [messageStatus, setMessageStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setCertificate(e.target.files[0]);
  };

  const handleImagesChange = (e) => {
    setProductImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageStatus('');
    setLoading(true);

    const data = new FormData();
    data.append('productName', formData.productName);
    data.append('productType', formData.productType);
    data.append('barcode', formData.barcode);
    data.append('batchNumber', formData.batchNumber);
    data.append('origin', formData.origin);
    data.append('description', formData.description);
    data.append('oncqNumber', formData.oncqNumber);
    data.append('validityPeriod', formData.validityPeriod);

    if (certificate) {
      data.append('certificate', certificate);
    }
    if (productImages) {
      for (let i = 0; i < productImages.length; i++) {
        data.append('productImages', productImages[i]);
      }
    }

    const token = localStorage.getItem('token'); // Assuming token is in localStorage

    try {
      const response = await fetch('/api/certificates', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (response.ok) {
        setMessage('Certificat soumis avec succès !');
        setMessageStatus('success');
        // Clear form
        setFormData({
          productName: '',
          productType: '',
          barcode: '',
          batchNumber: '',
          origin: '',
          description: '',
          oncqNumber: '',
          validityPeriod: ''
        });
        setCertificate(null);
        setProductImages(null);
        e.target.reset();
      } else {
        const errorData = await response.json();
        setMessage(`Erreur lors de la soumission : ${errorData.message}`);
        setMessageStatus('error');
      }
    } catch (error) {
      setMessage('Erreur réseau ou serveur. Veuillez réessayer.');
      setMessageStatus('error');
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submission-container">
      <h2>Soumission de Certificat d'Analyse</h2>
      <form onSubmit={handleSubmit} className="submission-form">
        <div className="form-group">
          <label>Nom du Produit</label>
          <input type="text" name="productName" value={formData.productName} onChange={handleChange} required disabled={loading} />
        </div>
        <div className="form-group">
          <label>Type du Produit</label>
          <input type="text" name="productType" value={formData.productType} onChange={handleChange} required disabled={loading} />
        </div>
        <div className="form-group">
          <label>Numéro de Code-barres</label>
          <input type="text" name="barcode" value={formData.barcode} onChange={handleChange} required disabled={loading} />
        </div>
        <div className="form-group">
          <label>Numéro de Lot</label>
          <input type="text" name="batchNumber" value={formData.batchNumber} onChange={handleChange} required disabled={loading} />
        </div>
        <div className="form-group">
          <label>Provenance</label>
          <input type="text" name="origin" value={formData.origin} onChange={handleChange} required disabled={loading} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required disabled={loading} />
        </div>
        <div className="form-group">
          <label>Numéro de Certification ONCQ</label>
          <input type="text" name="oncqNumber" value={formData.oncqNumber} onChange={handleChange} required disabled={loading} />
        </div>
        <div className="form-group">
          <label>Temps de Validité</label>
          <input type="text" name="validityPeriod" value={formData.validityPeriod} onChange={handleChange} required disabled={loading} />
        </div>
        <div className="form-group">
          <label>Certificat (ONCQ)</label>
          <input type="file" name="certificate" onChange={handleFileChange} required disabled={loading} />
        </div>
        <div className="form-group">
          <label>Images du Produit</label>
          <input type="file" name="productImages" onChange={handleImagesChange} multiple required disabled={loading} />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Soumission en cours...' : 'Soumettre'}
        </button>
      </form>
      {message && <p className={`message ${messageStatus}`}>{message}</p>}
    </div>
  );
};

export default SoumissionCertificat;
