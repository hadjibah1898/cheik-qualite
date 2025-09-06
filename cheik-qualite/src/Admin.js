import React, { useState, useEffect } from 'react';
import './Admin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faBoxes, faExclamationTriangle, faSignOutAlt, faBell, faEnvelope, faCheck, faTrashAlt, faBullhorn } from '@fortawesome/free-solid-svg-icons';

// --- MOCK DATA ---
// In a real app, this would come from an API
const initialProducts = [
    { id: 1, name: "Huile de palmiste", vendor: "Producteur Mamadou", category: "Alimentaire", status: "pending" },
    { id: 2, name: "Savon de ménage", vendor: "Société GIP", category: "Hygiène", status: "approved" },
    { id: 3, name: "Fonio Bio", vendor: "Coopérative Kindia", category: "Alimentaire", status: "pending" },
    { id: 4, name: "Jus de gingembre", vendor: "Néné Bio", category: "Boisson", status: "rejected" },
    { id: 5, name: "Tissu Lépi", vendor: "Artisanat de Guinée", category: "Artisanat", status: "approved" },
    { id: 6, name: "Miel de Forêt", vendor: "Api-Guinée", category: "Alimentaire", status: "pending" },
];

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

const DashboardView = ({ stats, pendingProducts, handleProductAction }) => (
    <>
        <div className="dashboard-stats">
            <StatCard title="Produits en attente" value={stats.pending} color="#f39c12" />
            <StatCard title="Vendeurs Certifiés" value={stats.certified} color="#2ecc71" />
            <StatCard title="Utilisateurs" value={stats.users} color="#3498db" />
        </div>
        <div className="card">
            <h3>Produits en attente de validation</h3>
            <div className="table-container">
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
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.vendor}</td>
                                <td>{product.category}</td>
                                <td>
                                    <button className="action-btn approve" onClick={() => handleProductAction(product.id, 'approved')} title="Approuver">
                                        <FontAwesomeIcon icon={faCheck} />
                                    </button>
                                    <button className="action-btn reject" onClick={() => handleProductAction(product.id, 'rejected')} title="Rejeter">
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
            </div>
        </div>
    </>
);

const ProductsView = ({ products }) => (
    <div className="card">
        <h3>Tous les Produits</h3>
        <div className="table-container">
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
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.vendor}</td>
                            <td>{product.category}</td>
                            <td>
                                <span className={`status-badge status-${product.status}`}>
                                    {product.status === 'pending' ? 'En attente' : product.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const AlertsView = ({ alertTitle, setAlertTitle, alertMessage, setAlertMessage, handleAlertSubmit }) => (
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
    </div>
);


// --- MAIN ADMIN COMPONENT ---

const Admin = () => {
    const [view, setView] = useState('dashboard');
    const [products, setProducts] = useState(initialProducts);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const [stats, setStats] = useState({
        pending: 0,
        certified: 42,
        users: 150
    });

    useEffect(() => {
        const pendingProductsCount = products.filter(p => p.status === 'pending').length;
        setStats(prevStats => ({ ...prevStats, pending: pendingProductsCount }));
    }, [products]);

    const handleProductAction = (id, action) => {
        setProducts(products.map(p => p.id === id ? { ...p, status: action } : p));
        alert(`Produit ID ${id} a été ${action === 'approved' ? 'Approuvé' : 'Rejeté'} !`);
    };

    const handleAlertSubmit = (e) => {
        e.preventDefault();
        alert(`Nouvelle alerte publiée ! Titre : "${alertTitle}"`);
        setAlertTitle('');
        setAlertMessage('');
    };

    const renderContent = () => {
        const pendingProducts = products.filter(p => p.status === 'pending');

        switch (view) {
            case 'dashboard':
                return <DashboardView stats={stats} pendingProducts={pendingProducts} handleProductAction={handleProductAction} />;
            case 'products':
                return <ProductsView products={products} />;
            case 'alerts':
                return <AlertsView 
                            alertTitle={alertTitle} 
                            setAlertTitle={setAlertTitle} 
                            alertMessage={alertMessage} 
                            setAlertMessage={setAlertMessage} 
                            handleAlertSubmit={handleAlertSubmit} 
                        />;
            default:
                return <DashboardView stats={stats} pendingProducts={pendingProducts} handleProductAction={handleProductAction} />;
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
