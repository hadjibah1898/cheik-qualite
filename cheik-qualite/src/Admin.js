import React, { useState, useEffect, createContext, useContext } from 'react';
import './Admin.css';
import {
    FiHome, FiUsers, FiBarChart2, FiSettings, FiLogOut, FiBell, FiMenu, FiX, FiSun, FiMoon, FiCheckCircle, FiXCircle
} from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- THEME CONTEXT ---
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    useEffect(() => {
        document.body.className = theme + '-mode';
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

const useTheme = () => useContext(ThemeContext);

// --- MOCK DATA ---
const chartData = [
    { name: 'Jan', Ventes: 400, Inscriptions: 240 },
    { name: 'Fév', Ventes: 300, Inscriptions: 139 },
    { name: 'Mar', Ventes: 200, Inscriptions: 980 },
    { name: 'Avr', Ventes: 278, Inscriptions: 390 },
    { name: 'Mai', Ventes: 189, Inscriptions: 480 },
    { name: 'Juin', Ventes: 239, Inscriptions: 380 },
    { name: 'Juil', Ventes: 349, Inscriptions: 430 },
];

// --- SUB-COMPONENTS ---

const Sidebar = ({ isSidebarOpen, setSidebarOpen }) => {
    const [active, setActive] = useState('Accueil');

    const navItems = [
        { name: 'Accueil', icon: <FiHome /> },
        { name: 'Utilisateurs', icon: <FiUsers /> },
        { name: 'Statistiques', icon: <FiBarChart2 /> },
        { name: 'Paramètres', icon: <FiSettings /> },
    ];

    return (
        <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <h1 className="sidebar-logo">ONCQ</h1>
                <button className="sidebar-toggle-close" onClick={() => setSidebarOpen(false)}>
                    <FiX />
                </button>
            </div>
            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <a
                        key={item.name}
                        href="#"
                        className={`nav-item ${active === item.name ? 'active' : ''}`}
                        onClick={() => setActive(item.name)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-text">{item.name}</span>
                    </a>
                ))}
            </nav>
            <div className="sidebar-footer">
                <a href="#" className="nav-item">
                    <span className="nav-icon"><FiLogOut /></span>
                    <span className="nav-text">Déconnexion</span>
                </a>
            </div>
        </aside>
    );
};

const Topbar = ({ setSidebarOpen }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="topbar">
            <div className="topbar-left">
                <button className="sidebar-toggle-open" onClick={() => setSidebarOpen(true)}>
                    <FiMenu />
                </button>
                <h2>Tableau de Bord</h2>
            </div>
            <div className="topbar-right">
                <button className="theme-toggle" onClick={toggleTheme}>
                    {theme === 'light' ? <FiMoon /> : <FiSun />}
                </button>
                <a href="#" className="topbar-icon">
                    <FiBell />
                </a>
                <div className="user-avatar">
                    <span>A</span>
                </div>
            </div>
        </header>
    );
};

const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="stat-card" style={{ '--accent-color': color }}>
        <div className="stat-card-icon">{icon}</div>
        <div className="stat-card-info">
            <p className="stat-card-title">{title}</p>
            <h3 className="stat-card-value">{value}</h3>
            {trend && <p className="stat-card-trend">{trend}</p>}
        </div>
    </div>
);

const ChartCard = ({ title, data }) => (
    <div className="card chart-card">
        <h3>{title}</h3>
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Ventes" stroke="var(--chart-color-1)" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Inscriptions" stroke="var(--chart-color-2)" />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

const TableCard = ({ title, headers, data }) => (
    <div className="card table-card">
        <h3>{title}</h3>
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        {headers.map(h => <th key={h}>{h}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data.map(row => (
                        <tr key={row._id}>
                            <td>{row.name}</td>
                            <td>{row.vendor || 'N/A'}</td>
                            <td>{row.category || 'N/A'}</td>
                            <td>
                                <span className={`status-badge status-${row.status}`}>
                                    {row.status === 'pending' ? 'En attente' : row.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                                </span>
                            </td>
                            <td className="action-cell">
                                <button className="action-btn approve" title="Approuver"><FiCheckCircle /></button>
                                <button className="action-btn reject" title="Rejeter"><FiXCircle /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);


// --- MAIN ADMIN COMPONENT ---

const Admin = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mock stats
    const stats = [
        { title: 'Total Utilisateurs', value: '1,254', icon: <FiUsers />, color: '#3b82f6', trend: '+12% ce mois-ci' },
        { title: 'Produits Actifs', value: '320', icon: <FiBarChart2 />, color: '#10b981', trend: '+5 nouveaux' },
        { title: 'Alertes Récentes', value: '12', icon: <FiBell />, color: '#f59e0b', trend: '2 non lues' },
        { title: 'Taux de Rejet', value: '4.8%', icon: <FiXCircle />, color: '#ef4444', trend: '-1.2% vs hier' },
    ];

    // Fetch products (simplified)
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // This is a mock fetch. Replace with your actual API call.
                const mockProducts = [
                    { _id: 1, name: 'Produit A', vendor: 'Vendeur 1', category: 'Catégorie X', status: 'approved' },
                    { _id: 2, name: 'Produit B', vendor: 'Vendeur 2', category: 'Catégorie Y', status: 'pending' },
                    { _id: 3, name: 'Produit C', vendor: 'Vendeur 1', category: 'Catégorie X', status: 'rejected' },
                    { _id: 4, name: 'Produit D', vendor: 'Vendeur 3', category: 'Catégorie Z', status: 'pending' },
                ];
                await new Promise(res => setTimeout(res, 1000)); // Simulate network delay
                setProducts(mockProducts);
            } catch (err) {
                setError('Impossible de charger les produits.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const tableHeaders = ['Nom du produit', 'Vendeur', 'Catégorie', 'Statut', 'Actions'];

    return (
        <ThemeProvider>
            <div className="admin-panel">
                <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="admin-main-content">
                    <Topbar setSidebarOpen={setSidebarOpen} />
                    <div className="stats-grid">
                        {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
                    </div>
                    <ChartCard title="Activité Récente" data={chartData} />
                    <TableCard title="Gestion des Produits" headers={tableHeaders} data={products} />
                </main>
            </div>
        </ThemeProvider>
    );
};

export default Admin;

