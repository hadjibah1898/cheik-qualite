import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import './GuideAvatar.css';

const GuideAvatar = () => {
    const location = useLocation();
    const [message, setMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    const pageMessages = useMemo(() => ({
        '/': {
            text: "Bienvenue sur la page d'accueil ! Ici, vous pouvez vérifier la certification des produits et découvrir nos actualités.",
            role: "Accueil"
        },
        '/conseils': {
            text: "Sur cette page, explorez nos conseils santé et prenez rendez-vous avec nos diététiciens.",
            role: "Conseils Santé"
        },
        '/produits-locaux': {
            text: "Découvrez une variété de produits locaux certifiés. Soutenez nos producteurs !",
            role: "Produits Locaux"
        },
        '/agent/dashboard': {
            text: "Ceci est votre tableau de bord agent. Soumettez de nouveaux produits et gérez vos activités.",
            role: "Tableau de Bord Agent"
        },
        '/admin': {
            text: "Bienvenue, administrateur. Gérez les utilisateurs, les certifications et le contenu du site.",
            role: "Administration"
        },
        '/login': {
            text: "Connectez-vous ou créez un compte pour accéder à plus de fonctionnalités.",
            role: "Connexion"
        },
        '/devenir-agent': {
            text: "Intéressé à devenir agent ? Remplissez le formulaire pour rejoindre notre équipe.",
            role: "Devenir Agent"
        },
        '/soumission-certificat': {
            text: "Soumettez un certificat pour un produit. Assurez la qualité et la conformité.",
            role: "Soumission Certificat"
        },
        '/profil': {
            text: "Gérez votre profil et consultez vos informations personnelles ici.",
            role: "Profil"
        },
        '/notifications': {
            text: "Consultez vos notifications et restez informé des dernières mises à jour.",
            role: "Notifications"
        },
        '/contact': {
            text: "Contactez-nous pour toute question ou assistance.",
            role: "Contact"
        },
        '/faq': {
            text: "Trouvez les réponses à vos questions fréquentes sur cette page.",
            role: "FAQ"
        },
        '/a-propos': {
            text: "Apprenez-en plus sur notre mission et notre équipe.",
            role: "À Propos"
        },
        // Add more pages as needed
    }), []);

    useEffect(() => {
        const currentPath = location.pathname;
        const pageInfo = pageMessages[currentPath];

        if (pageInfo) {
            setMessage(pageInfo.text);
            setIsVisible(true);
            // Optionally hide after some time
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 10000); // Message visible for 10 seconds
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            setMessage('');
        }
    }, [location.pathname, pageMessages]);

    if (!isVisible) return null;

    return (
        <div className="guide-avatar-container">
            <div className="avatar-icon">
                <i className="fas fa-robot"></i> {/* Example icon, can be an image */}
            </div>
            <div className="avatar-message">
                <p><strong>Guide ({pageMessages[location.pathname]?.role || 'Page'}):</strong> {message}</p>
            </div>
            <button className="close-avatar" onClick={() => setIsVisible(false)}>
                &times;
            </button>
        </div>
    );
};

export default GuideAvatar;

