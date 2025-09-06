import React, { useState } from 'react';
import './ConseilSante.css';
import AlimentsTab from './components/AlimentsTab.js';
import MagazinesTab from './components/MagazinesTab.js';
import VendeursTab from './components/VendeursTab.js';


const ConseilSante = () => {
    const [activeTab, setActiveTab] = useState('aliments');

    const getStatus = (condition, value) => {
        let text, icon, className;
        let status = "unknown"; // Default status

        switch (condition) {
            case "diabetic":
                // Assuming 'value' is sugars_100g
                if (value === undefined || value === null) {
                    status = "unknown";
                } else if (value < 5) {
                    status = "recommended";
                } else if (value >= 5 && value < 15) {
                    status = "moderate";
                } else {
                    status = "not-recommended";
                }
                break;
            case "hypertension":
                // Assuming 'value' is salt_100g
                if (value === undefined || value === null) {
                    status = "unknown";
                } else if (value < 0.3) {
                    status = "recommended";
                } else if (value >= 0.3 && value < 1.5) {
                    status = "moderate";
                } else {
                    status = "not-recommended";
                }
                break;
            case "drepanocytosis":
                // Assuming 'value' is iron_100g
                // NOTE: This is a simplified example. Iron intake for drepanocytosis is complex and requires medical advice.
                if (value === undefined || value === null) {
                    status = "unknown";
                } else if (value >= 0.002 && value < 0.008) { // Example range for 'recommended'
                    status = "recommended";
                } else if (value < 0.002 || value >= 0.008) { // Example range for 'moderate'
                    status = "moderate";
                } else {
                    status = "not-recommended"; // Fallback, though unlikely with current logic
                }
                break;
            default:
                status = "unknown";
        }

        if (status === "recommended") {
            text = "Recommandé";
            icon = "fas fa-check";
            className = "recommended";
        } else if (status === "moderate") {
            text = "Consommation modérée";
            icon = "fas fa-exclamation";
            className = "moderate";
        } else if (status === "not-recommended") {
            text = "Non recommandé";
            icon = "fas fa-times";
            className = "not-recommended";
        } else { // unknown
            text = "Information non disponible";
            icon = "fas fa-question-circle";
            className = "unknown";
        }

        return (
            <div className={`status-container`}>
                <div className={`status-indicator ${className}`}>
                    <i className={icon}></i>
                </div>
                <div className={`status-text ${className}`}>{text}</div>
            </div>
        );
    };

    return (
        <>
            <div className="nav-tabs">
                <div className={`nav-tab ${activeTab === 'aliments' ? 'active' : ''}`} onClick={() => setActiveTab('aliments')}>Aliments</div>
                <div className={`nav-tab ${activeTab === 'magazines' ? 'active' : ''}`} onClick={() => setActiveTab('magazines')}>Prendre rendez-vous</div>
                <div className={`nav-tab ${activeTab === 'vendeurs' ? 'active' : ''}`} onClick={() => setActiveTab('vendeurs')}>Vendeurs Certifiés</div>
            </div>

            {activeTab === 'aliments' && <AlimentsTab getStatus={getStatus} />}
            {activeTab === 'magazines' && <MagazinesTab />}
            {activeTab === 'vendeurs' && <VendeursTab />}

            <div className="footer-note">
                <p><i className="fas fa-info-circle"></i> Ces conseils ne remplacent pas une consultation médicale. Consultez toujours un professionnel de santé pour des recommandations personnalisées.</p>
            </div>

            
        </>
    );
};

export default ConseilSante;