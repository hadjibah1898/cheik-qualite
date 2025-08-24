import React, { useState, useEffect } from 'react';
import './Admin.css';

const Admin = () => {
    const [products, setProducts] = useState([
        { id: 1, name: "Huile de palmiste", vendor: "Producteur Mamadou", category: "Alimentaire", status: "pending" },
        { id: 2, name: "Savon de ménage", vendor: "Société GIP", category: "Hygiène", status: "approved" },
        { id: 3, name: "Fonio Bio", vendor: "Coopérative Kindia", category: "Alimentaire", status: "pending" },
        { id: 4, name: "Jus de gingembre", vendor: "Néné Bio", category: "Boisson", status: "rejected" },
    ]);

    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const [stats, setStats] = useState({
        pending: 0,
        certified: 42, // static value from html
        users: 150 // static value from html
    });

    useEffect(() => {
        const pendingProducts = products.filter(p => p.status === 'pending').length;
        setStats(prevStats => ({...prevStats, pending: pendingProducts}));
    }, [products]);

    const handleProductAction = (id, action) => {
        const product = products.find(p => p.id === id);
        if (!product) return;

        alert(`Produit ID ${id} a été ${action === 'approved' ? 'Approuvé' : 'Rejeté'} ! (Démo)`);

        // Remove the product from the list of pending products
        setProducts(products.filter(p => p.id !== id));
    };

    const handleAlertSubmit = (e) => {
        e.preventDefault();
        alert(`Nouvelle alerte publiée ! Titre : "${alertTitle}", Message : "${alertMessage}"`);
        setAlertTitle('');
        setAlertMessage('');
    };

    return (
        <>
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h2>Bienvenue, Admin !</h2>
                    <p>Aperçu de l'activité du site et actions à prendre</p>
                </div>
                
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <h3>Produits en attente</h3>
                        <p>{stats.pending}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Vendeurs certifiés</h3>
                        <p>{stats.certified}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Utilisateurs enregistrés</h3>
                        <p>{stats.users}</p>
                    </div>
                </div>

                <div className="dashboard-section">
                    <h3><i className="fas fa-clock"></i> Produits en attente de validation</h3>
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
                                {products.filter(p => p.status === 'pending').map(product => (
                                    <tr key={product.id}>
                                        <td>{product.name}</td>
                                        <td>{product.vendor}</td>
                                        <td>{product.category}</td>
                                        <td>
                                            <button className="action-btn approve-btn" onClick={() => handleProductAction(product.id, 'approved')} title="Approuver"><i className="fas fa-check"></i></button>
                                            <button className="action-btn delete-btn" onClick={() => handleProductAction(product.id, 'rejected')} title="Rejeter"><i className="fas fa-trash-alt"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="dashboard-section">
                    <h3><i className="fas fa-exclamation-triangle"></i> Gérer les alertes ONCQ</h3>
                    <form id="add-alert-form" onSubmit={handleAlertSubmit}>
                        <div className="form-group">
                            <label htmlFor="alert-title">Titre de l'alerte</label>
                            <input type="text" id="alert-title" value={alertTitle} onChange={(e) => setAlertTitle(e.target.value)} required style={{width:'100%', padding:'10px',  borderRadius:'5px', border:'1px solid #ccc'}} />
                        </div>
                        <div className="form-group" style={{marginTop:'15px'}}>
                            <label htmlFor="alert-message">Message de l'alerte</label>
                                                            <textarea id="alert-message" rows="4" value={alertMessage} onChange={(e) => setAlertTitle(e.target.value)} required style={{width:'100%', padding:'10px', marginTop:'5px', borderRadius:'5px', border:'1px solid #ccc'}}></textarea>
                        </div>
                        <button type="submit" style={{marginTop:'20px', background:'#e74c3c', color:'white', padding:'10px 20px', border:'none', borderRadius:'5px', cursor:'pointer'}}><i className="fas fa-bullhorn"></i> Publier l'alerte</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Admin;