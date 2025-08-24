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
        <div className="App">
            <header>
                <div className="guinea-flag"></div>
                <h1><i className="fas fa-chart-line"></i> Tableau de Bord Administrateur</h1>
                <p>Gérez les produits, les utilisateurs et les alertes du site</p>
                
                <nav className="header-nav">
                    <ul>
                        <li><a href="/">Accueil</a></li>
                        <li><a href="/profil">Mon Profil</a></li>
                        <li><a href="#">Déconnexion</a></li>
                    </ul>
                </nav>
            </header>

            <div className="main-content container">
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
                                <input type="text" id="alert-title" value={alertTitle} onChange={(e) => setAlertTitle(e.target.value)} required style={{width:'100%', padding:'10px', margin-top:'5px', borderRadius:'5px', border:'1px solid #ccc'}} />
                            </div>
                            <div className="form-group" style={{marginTop:'15px'}}>
                                <label htmlFor="alert-message">Message de l'alerte</label>
                                <textarea id="alert-message" rows="4" value={alertMessage} onChange={(e) => setAlertMessage(e.target.value)} required style={{width:'100%', padding:'10px', margin-top:'5px', borderRadius:'5px', border:'1px solid #ccc'}}></textarea>
                            </div>
                            <button type="submit" style={{marginTop:'20px', background:'#e74c3c', color:'white', padding:'10px 20px', border:'none', borderRadius:'5px', cursor:'pointer'}}><i className="fas fa-bullhorn"></i> Publier l'alerte</button>
                        </form>
                    </div>
                </div>
            </div>

            <footer className="site-footer">
                <div className="footer-container">
                    <div className="footer-section about">
                        <h3>À Propos de nous</h3>
                        <p>Conseils Santé Guinée est une initiative dédiée à la promotion d'une meilleure nutrition et d'une vie plus saine pour la population guinéenne.</p>
                    </div>
                    <div className="footer-section links">
                        <h3>Liens Utiles</h3>
                        <ul>
                            <li><a href="#">Analyse Alimentaire</a></li>
                            <li><a href="#">Magazines Santé</a></li>
                            <li><a href="#">Vendeurs Certifiés</a></li>
                            <li><a href="#">Conditions d'utilisation</a></li>
                            <li><a href="#">Politique de Confidentialité</a></li>
                        </ul>
                    </div>
                    <div className="footer-section contact">
                        <h3>Contactez-nous</h3>
                        <p><i className="fas fa-map-marker-alt"></i> Conakry, Guinée</p>
                        <p><i className="fas fa-envelope"></i> contact@conseilsanteguinee.com</p>
                        <p><i className="fas fa-phone"></i> +224 620 00 00 00</p>
                    </div>
                    <div className="footer-section social">
                        <h3>Suivez-nous</h3>
                        <div className="social-icons">
                            <a href="#"><i className="fab fa-facebook-f"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                            <a href="#"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2025 Conseils Santé Guinée. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
};

export default Admin;