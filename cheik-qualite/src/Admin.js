import React, { useState, useEffect } from 'react';
import './Admin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faBoxes, faExclamationTriangle, faSignOutAlt, faBell, faEnvelope, faCheck, faTrashAlt, faBullhorn } from '@fortawesome/free-solid-svg-icons';

// --- SUB-COMPONENTS ---

const Sidebar = ({ view, setView }) => (
    <div className="admin-sidebar">
        <div className="sidebar-header">
            <h1>ONCQ</h1>
            <span>Admin</span>
        </div>
        <nav className="sidebar-nav">
            <a href="#dashboard" onClick={() => setView('dashboard')} className={view === 'dashboard' ? 'active' : ''}>
                <FontAwesomeIcon icon={faChartLine} />
                <span>Tableau de Bord</span>
            </a>
            <a href="#products" onClick={() => setView('products')} className={view === 'products' ? 'active' : ''}>
                <FontAwesomeIcon icon={faBoxes} />
                <span>Produits</span>
            </a>
            <a href="#alerts" onClick={() => setView('alerts')} className={view === 'alerts' ? 'active' : ''}>
                <FontAwesomeIcon icon={faExclamationTriangle} />
                <span>Alertes</span>
            </a>
        </nav>
        <div className="sidebar-footer">
            <a href="/">
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Déconnexion</span>
            </a>
        </div>
    </div>
);

const AdminHeader = ({ adminName }) => (
    <header className="admin-header">
        <div className="header-welcome">
            <h2>Bonjour, {adminName} !</h2>
            <p>Bienvenue sur votre tableau de bord.</p>
        </div>
        <div className="header-profile">
            <FontAwesomeIcon icon={faEnvelope} className="header-icon" />
            <FontAwesomeIcon icon={faBell} className="header-icon" />
            <div className="user-avatar">A</div>
        </div>
    </header>
);

const StatCard = ({ title, value, color }) => (
    <div className="stat-card" style={{ borderLeftColor: color }}>
        <h3>{title}</h3>
        <p>{value}</p>
    </div>
);

const DashboardView = ({ stats, pendingProducts, handleProductAction, loading, error }) => (
    <>
        <div className="dashboard-stats">
            <StatCard title="Produits en attente" value={stats.pending} color="#f39c12" />
            <StatCard title="Vendeurs Certifiés" value={stats.certified} color="#2ecc71" />
            <StatCard title="Utilisateurs" value={stats.users} color="#3498db" />
        </div>
        <div className="card">
            <h3>Produits en attente de validation</h3>
            <div className="table-container">
                {loading && <p>Chargement des produits...</p>}
                {error && <p className="error-message">Erreur: {error}</p>}
                {!loading && !error && (
                    <table>
                        <thead>
                            <tr>
                                <th>Nom du produit</th>
                                <th>Vendeur</th>
                                <th>Catégorie</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingProducts.length > 0 ? pendingProducts.map(product => (
                                <tr key={product._id}>
                                    <td>{product.name}</td>
                                    <td>{product.vendor || 'N/A'}</td>
                                    <td>{product.category || 'N/A'}</td>
                                    <td>
                                        <button className="action-btn approve" onClick={() => handleProductAction(product._id, 'approved')} title="Approuver">
                                            <FontAwesomeIcon icon={faCheck} />
                                        </button>
                                        <button className="action-btn reject" onClick={() => handleProductAction(product._id, 'rejected')} title="Rejeter">
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4">Aucun produit en attente.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    </>
);

const ProductsView = ({ products, loading, error }) => (
    <div className="card">
        <h3>Tous les Produits</h3>
        <div className="table-container">
            {loading && <p>Chargement des produits...</p>}
            {error && <p className="error-message">Erreur: {error}</p>}
            {!loading && !error && (
                <table>
                    <thead>
                        <tr>
                            <th>Nom du produit</th>
                            <th>Vendeur</th>
                            <th>Catégorie</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? products.map(product => (
                            <tr key={product._id}>
                                <td>{product.name}</td>
                                <td>{product.vendor || 'N/A'}</td>
                                <td>{product.category || 'N/A'}</td>
                                <td>
                                    <span className={`status-badge status-${product.status}`}>
                                        {product.status === 'pending' ? 'En attente' : product.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4">Aucun produit trouvé.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    </div>
);

const AlertsView = ({ alertTitle, setAlertTitle, alertMessage, setAlertMessage, handleAlertSubmit, alerts, handleDeleteAlert, loading, error }) => (
    <div className="card">
        <h3>Gérer les alertes ONCQ</h3>
        <form id="add-alert-form" onSubmit={handleAlertSubmit}>
            <div className="form-group">
                <label htmlFor="alert-title">Titre de l'alerte</label>
                <input 
                    type="text" 
                    id="alert-title" 
                    value={alertTitle} 
                    onChange={(e) => setAlertTitle(e.target.value)} 
                    required 
                />
            </div>
            <div className="form-group">
                <label htmlFor="alert-message">Message de l'alerte</label>
                <textarea 
                    id="alert-message" 
                    rows="5" 
                    value={alertMessage} 
                    onChange={(e) => setAlertMessage(e.target.value)} 
                    required 
                ></textarea>
            </div>
            <button type="submit" className="submit-btn">
                <FontAwesomeIcon icon={faBullhorn} /> Publier l'alerte
            </button>
        </form>

        <h3 style={{ marginTop: '30px' }}>Alertes existantes</h3>
        <div className="table-container">
            {loading && <p>Chargement des alertes...</p>}
            {error && <p className="error-message">Erreur: {error}</p>}
            {!loading && !error && (
                <table>
                    <thead>
                        <tr>
                            <th>Titre</th>
                            <th>Message</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alerts.length > 0 ? alerts.map(alert => (
                            <tr key={alert._id}>
                                <td>{alert.title}</td>
                                <td>{alert.message}</td>
                                <td>{new Date(alert.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button className="action-btn reject" onClick={() => handleDeleteAlert(alert._id)} title="Supprimer">
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4">Aucune alerte trouvée.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    </div>
);


// --- MAIN ADMIN COMPONENT ---

const Admin = () => {
    const [view, setView] = useState('dashboard');
    const [products, setProducts] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [users, setUsers] = useState([]);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [stats, setStats] = useState({
        pending: 0,
        certified: 0,
        users: 0
    });

    // Fonction utilitaire pour obtenir le token JWT (à adapter selon votre implémentation d'authentification)
    const getAuthToken = () => {
        // Exemple: récupérer le token depuis le localStorage
        return localStorage.getItem('token'); 
    };

    // --- FETCH DATA EFFECTS ---

    // Effect pour récupérer les produits
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = getAuthToken();
                const response = await fetch('/api/products', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                console.error("Erreur lors de la récupération des produits:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []); // S'exécute une seule fois au montage du composant

    // Effect pour récupérer les alertes
    useEffect(() => {
        const fetchAlerts = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = getAuthToken();
                const response = await fetch('/api/alerts', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }
                const data = await response.json();
                setAlerts(data);
            } catch (err) {
                console.error("Erreur lors de la récupération des alertes:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, []); // S'exécute une seule fois au montage du composant

    // Effect pour récupérer les utilisateurs
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = getAuthToken();
                const response = await fetch('/api/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                console.error("Erreur lors de la récupération des utilisateurs:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []); // S'exécute une seule fois au montage du composant

    // Effect pour mettre à jour les statistiques
    useEffect(() => {
        const pendingProductsCount = products.filter(p => p.status === 'pending').length;
        setStats({
            pending: pendingProductsCount,
            certified: products.filter(p => p.status === 'approved').length, // Exemple: produits approuvés comme certifiés
            users: users.length
        });
    }, [products, users]); // Dépend des produits et des utilisateurs

    // --- HANDLERS ---

    const handleProductAction = async (id, action) => {
        const token = getAuthToken();
        if (!token) {
            alert("Vous n'êtes pas authentifié.");
            return;
        }
        try {
            const method = action === 'approved' ? 'PUT' : 'DELETE'; // Assumons PUT pour approuver, DELETE pour rejeter
            const url = `/api/products/${id}`;
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: action }) // Envoyer le nouveau statut si PUT
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erreur lors de l'action sur le produit: ${response.status}`);
            }
            alert(`Produit ID ${id} a été ${action === 'approved' ? 'Approuvé' : 'Rejeté'} avec succès !`);
            // Re-fetch products to update the list
            const updatedProductsResponse = await fetch('/api/products', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const updatedProductsData = await updatedProductsResponse.json();
            setProducts(updatedProductsData);

        } catch (err) {
            console.error("Erreur lors de l'action sur le produit:", err);
            alert(`Erreur: ${err.message}`);
        }
    };

    const handleAlertSubmit = async (e) => {
        e.preventDefault();
        const token = getAuthToken();
        if (!token) {
            alert("Vous n'êtes pas authentifié.");
            return;
        }
        try {
            const response = await fetch('/api/alerts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title: alertTitle, message: alertMessage })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erreur lors de la publication de l'alerte: ${response.status}`);
            }
            alert(`Nouvelle alerte publiée avec succès !`);
            setAlertTitle('');
            setAlertMessage('');
            // Re-fetch alerts to update the list
            const updatedAlertsResponse = await fetch('/api/alerts', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const updatedAlertsData = await updatedAlertsResponse.json();
            setAlerts(updatedAlertsData);

        } catch (err) {
            console.error("Erreur lors de la publication de l'alerte:", err);
            alert(`Erreur: ${err.message}`);
        }
    };

    const handleDeleteAlert = async (id) => {
        const token = getAuthToken();
        if (!token) {
            alert("Vous n'êtes pas authentifié.");
            return;
        }
        try {
            const response = await fetch(`/api/alerts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erreur lors de la suppression de l'alerte: ${response.status}`);
            }
            alert(`Alerte supprimée avec succès !`);
            // Re-fetch alerts to update the list
            const updatedAlertsResponse = await fetch('/api/alerts', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const updatedAlertsData = await updatedAlertsResponse.json();
            setAlerts(updatedAlertsData);

        } catch (err) {
            console.error("Erreur lors de la suppression de l'alerte:", err);
            alert(`Erreur: ${err.message}`);
        }
    };

    const renderContent = () => {
        const pendingProducts = products.filter(p => p.status === 'pending');

        switch (view) {
            case 'dashboard':
                return <DashboardView stats={stats} pendingProducts={pendingProducts} handleProductAction={handleProductAction} loading={loading} error={error} />;
            case 'products':
                return <ProductsView products={products} loading={loading} error={error} />;
            case 'alerts':
                return <AlertsView 
                            alertTitle={alertTitle} 
                            setAlertTitle={setAlertTitle} 
                            alertMessage={alertMessage} 
                            setAlertMessage={setAlertMessage} 
                            handleAlertSubmit={handleAlertSubmit} 
                            alerts={alerts}
                            handleDeleteAlert={handleDeleteAlert}
                            loading={loading}
                            error={error}
                        />;
            default:
                return <DashboardView stats={stats} pendingProducts={pendingProducts} handleProductAction={handleProductAction} loading={loading} error={error} />;
        }
    };

    return (
        <div className="admin-panel">
            <Sidebar view={view} setView={setView} />
            <main className="admin-main-content">
                <AdminHeader adminName="Admin" />
                {renderContent()}
            </main>
        </div>
    );
};

export default Admin;
