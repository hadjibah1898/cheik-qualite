import React from 'react';
import SoumissionProduitLocal from '../Admin/components/SoumissionProduitLocal.js';
import './AgentDashboard.css';
import { jwtDecode } from 'jwt-decode'; // Corrected import

const AgentDashboard = () => {
    const token = localStorage.getItem('token');
    let agentName = 'Agent';

    if (token) {
        try {
            const decodedToken = jwtDecode(token); // Corrected function call
            agentName = decodedToken.username || agentName;
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    }

    return (
        <div className="agent-dashboard-container">
            <header className="agent-dashboard-header">
                <h1>Tableau de Bord de l'Agent</h1>
                <p>Bienvenue, {agentName}.</p>
            </header>
            <main className="agent-dashboard-main">
                <SoumissionProduitLocal />
            </main>
        </div>
    );
};

export default AgentDashboard;
