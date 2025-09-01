import React, { useState } from 'react';
import './ConseilSante.css';
import { products } from '../../data/conseilSanteData.js';
import AlimentsTab from './components/AlimentsTab.js';
import MagazinesTab from './components/MagazinesTab.js';
import VendeursTab from './components/VendeursTab.js';
import Chatbot from '../../components/Chatbot/Chatbot.js';

const ConseilSante = () => {
    const [activeTab, setActiveTab] = useState('aliments');

    const getStatus = (condition, status) => {
        let text, icon, className;
        if (status === "recommended") {
            text = "Recommandé";
            icon = "fas fa-check";
            className = "recommended";
        } else if (status === "moderate") {
            text = "Consommation modérée";
            icon = "fas fa-exclamation";
            className = "moderate";
        } else {
            text = "Non recommandé";
            icon = "fas fa-times";
            className = "not-recommended";
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
                <div className={`nav-tab ${activeTab === 'magazines' ? 'active' : ''}`} onClick={() => setActiveTab('magazines')}>Magazines Santé</div>
                <div className={`nav-tab ${activeTab === 'vendeurs' ? 'active' : ''}`} onClick={() => setActiveTab('vendeurs')}>Vendeurs Certifiés</div>
            </div>

            {activeTab === 'aliments' && <AlimentsTab products={products} getStatus={getStatus} />}
            {activeTab === 'magazines' && <MagazinesTab />}
            {activeTab === 'vendeurs' && <VendeursTab />}

            <div className="footer-note">
                <p><i className="fas fa-info-circle"></i> Ces conseils ne remplacent pas une consultation médicale. Consultez toujours un professionnel de santé pour des recommandations personnalisées.</p>
            </div>

            <Chatbot />
        </>
    );
};

export default ConseilSante;