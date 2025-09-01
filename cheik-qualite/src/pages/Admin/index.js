import React, { useState, useEffect } from 'react';
import './Admin.css';
import AddMagazineForm from './components/AddMagazineForm.js';
import SoumissionCertificat from './components/SoumissionCertificat.js';
import SoumissionProduit from './components/SoumissionProduit.js'; // Import the new component
import { toast } from 'react-toastify';

const Admin = () => {
    const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'alerts', 'magazines', 'certificates', 'products'

    const [products, setProducts] = useState([
        { id: 1, name: "Huile de palmiste", vendor: "Producteur Mamadou", submissionDate: "2023-10-25", status: "pending" },
        { id: 3, name: "Fonio Bio", vendor: "Coopérative Kindia", submissionDate: "2023-10-23", status: "pending" },
    ]);

    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [stats, setStats] = useState({
        pending: 0,
        certified: 42,
        users: 150
    });
    const [alertsList, setAlertsList] = useState([]); // New state for alerts

    useEffect(() => {
        const pendingProducts = products.filter(p => p.status === 'pending').length;
        setStats(prevStats => ({...prevStats, pending: pendingProducts}));
    }, [products]);

    // New useEffect for fetching alerts
    useEffect(() => {
        if (activeView === 'alerts') {
            fetchAlerts();
        }
    }, [activeView]);

    const fetchAlerts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/alerts', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setAlertsList(data);
            } else {
                toast.error('Erreur lors de la récupération des alertes.');
            }
        } catch (error) {
            console.error('Error fetching alerts:', error);
            toast.error('Erreur de connexion au serveur pour les alertes.');
        }
    };

    const handleProductAction = (id, action) => {
        alert(`Produit ID ${id} a été ${action === 'approved' ? 'Approuvé' : 'Rejeté'} ! (Démo)`);
        setProducts(products.filter(p => p.id !== id));
    };

    const handleAlertSubmit = async (e) => {
        e.preventDefault();
        const alertData = { title: alertTitle, message: alertMessage };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/alerts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(alertData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setAlertTitle('');
                setAlertMessage('');
                fetchAlerts(); // Refresh alerts after submission
            } else {
                toast.error(`Erreur: ${data.message || 'Quelque chose s\'est mal passé.'}`);
            }
        } catch (error) {
            console.error('Erreur lors de la publication de l\'alerte:', error);
            toast.error('Erreur lors de la connexion au serveur.');
        }
    };

    const handleDeleteAlert = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/alerts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                toast.success('Alerte supprimée avec succès.');
                setAlertsList(alertsList.filter(alert => alert._id !== id)); // Optimistic update
            } else {
                const errorData = await response.json();
                toast.error(`Erreur: ${errorData.message || 'Quelque chose s\'est mal passé lors de la suppression.'}`);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'alerte:', error);
            toast.error('Erreur de connexion au serveur lors de la suppression de l\'alerte.');
        }
    };

    const filteredProducts = products.filter(p => p.status === 'pending' && p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard':
                return (
                    <>
                        <div className="stats-section">
                            <div className="stat-card">
                                <div className="stat-title"><i className="fas fa-hourglass-half"></i> Produits en attente</div>
                                <div className="stat-value">{stats.pending}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-title"><i className="fas fa-award"></i> Vendeurs certifiés</div>
                                <div className="stat-value">{stats.certified}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-title"><i className="fas fa-users"></i> Utilisateurs enregistrés</div>
                                <div className="stat-value">{stats.users}</div>
                            </div>
                        </div>
                        <div className="dashboard-section">
                            <h3>Produits en attente de validation</h3>
                            <div className="header-actions">
                                <div className="search-box">
                                    <input 
                                        type="text" 
                                        id="searchInput" 
                                        placeholder="Rechercher un produit..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button className="add-button" onClick={() => setActiveView('products')}>Ajouter un produit</button>
                            </div>
                            <div className="table-container">
                                <table id="productTable">
                                    <thead>
                                        <tr>
                                            <th>Nom du produit</th>
                                            <th>Vendeur</th>
                                            <th>Date de soumission</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.length > 0 ? filteredProducts.map(product => (
                                            <tr key={product.id}>
                                                <td>{product.name}</td>
                                                <td>{product.vendor}</td>
                                                <td>{product.submissionDate}</td>
                                                <td>
                                                    <button className="action-btn approve-btn" onClick={() => handleProductAction(product.id, 'approved')}>Approuver</button>
                                                    <button className="action-btn reject-btn" onClick={() => handleProductAction(product.id, 'rejected')}>Rejeter</button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" style={{ textAlign: 'center' }}>Aucun produit en attente</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                );
            case 'alerts':
                return (
                    <div className="dashboard-section">
                        <h3>Gérer les alertes ONCQ</h3>
                        {/* Alert Submission Form */}
                        <form onSubmit={handleAlertSubmit}>
                            <div className="form-group">
                                <label htmlFor="alert-title">Titre de l'alerte</label>
                                <input type="text" id="alert-title" value={alertTitle} onChange={(e) => setAlertTitle(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="alert-message">Message de l'alerte</label>
                                <textarea id="alert-message" rows="4" value={alertMessage} onChange={(e) => setAlertMessage(e.target.value)} required></textarea>
                            </div>
                            <button type="submit" className="submit-btn">Publier l'alerte</button>
                        </form>

                        {/* Existing Alerts Display */}
                        <h3 style={{ marginTop: '2rem' }}>Alertes existantes</h3>
                        {alertsList.length > 0 ? (
                            <div className="table-container">
                                <table id="alertsTable">
                                    <thead>
                                        <tr>
                                            <th>Titre</th>
                                            <th>Message</th>
                                            <th>Date de publication</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {alertsList.map(alert => (
                                            <tr key={alert._id}>
                                                <td>{alert.title}</td>
                                                <td>{alert.message}</td>
                                                <td>{new Date(alert.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <button className="action-btn reject-btn" onClick={() => handleDeleteAlert(alert._id)}>Supprimer</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p style={{ textAlign: 'center', marginTop: '1rem' }}>Aucune alerte publiée pour le moment.</p>
                        )}
                    </div>
                );
            case 'magazines':
                return (
                    <div className="dashboard-section">
                        <h3>Ajouter un Magazine Santé</h3>
                        <AddMagazineForm />
                    </div>
                );
            case 'certificates':
                return <SoumissionCertificat />;
            case 'products':
                return <SoumissionProduit />;
            default:
                return <h2>Dashboard</h2>;
        }
    };

    return (
        <div className="dashboard-container">
            <header className="header">
                <div className="user-info">
                    <span>Bienvenue,</span>
                    <span className="user-name"> Admin</span>
                </div>
            </header>

            <nav className="sidebar">
                <ul>
                    <li><a href="#" className={`sidebar-item ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveView('dashboard')}>Dashboard</a></li>
                    <li><a href="#" className={`sidebar-item ${activeView === 'alerts' ? 'active' : ''}`} onClick={() => setActiveView('alerts')}>Gérer les alertes</a></li>
                    <li><a href="#" className={`sidebar-item ${activeView === 'magazines' ? 'active' : ''}`} onClick={() => setActiveView('magazines')}>Gérer les magazines</a></li>
                    <li><a href="#" className={`sidebar-item ${activeView === 'certificates' ? 'active' : ''}`} onClick={() => setActiveView('certificates')}>Soumettre un certificat</a></li>
                </ul>
            </nav>

            <main className="main-content">
                {renderContent()}
            </main>
        </div>
    );
};

export default Admin;