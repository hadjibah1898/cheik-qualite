import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './GestionPermissions.css';

const allAgentRoutes = [
    { path: '/notifications', label: 'Notifications' },
    { path: '/profil', label: 'Profil' },
    { path: '/soumission', label: 'Soumission de produit' },
    { path: '/verifier-produit', label: 'Vérification de produit' },
    { path: '/recherche-avancee', label: 'Recherche Avancée' },
    { path: '/agent/dashboard', label: 'Tableau de bord Agent' },
];

const GestionPermissions = () => {
    const [allowedRoutes, setAllowedRoutes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        const fetchPermissions = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/permissions/agent`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!response.ok) throw new Error('Impossible de charger les permissions.');
                const data = await response.json();
                setAllowedRoutes(data.allowedRoutes || []);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPermissions();
    }, []);

    const handleCheckboxChange = (path) => {
        setAllowedRoutes(prev => 
            prev.includes(path) ? prev.filter(r => r !== path) : [...prev, path]
        );
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/permissions/agent`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ allowedRoutes }),
            });
            if (!response.ok) throw new Error('Erreur lors de la sauvegarde des permissions.');
            toast.success('Permissions mises à jour avec succès !');
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (isLoading) {
        return <p>Chargement des permissions...</p>;
    }

    return (
        <div className="gestion-permissions-container">
            <h3>Gérer les Permissions des Agents</h3>
            <p>Cochez les pages auxquelles les agents auront accès sur leur tableau de bord.</p>
            <div className="permissions-list">
                {allAgentRoutes.map(route => (
                    <div key={route.path} className="permission-item">
                        <input 
                            type="checkbox"
                            id={`route-${route.path}`}
                            checked={allowedRoutes.includes(route.path)}
                            onChange={() => handleCheckboxChange(route.path)}
                        />
                        <label htmlFor={`route-${route.path}`}>{route.label} (<code>{route.path}</code>)</label>
                    </div>
                ))}
            </div>
            <button onClick={handleSave} className="save-permissions-btn">
                Enregistrer les permissions
            </button>
        </div>
    );
};

export default GestionPermissions;
