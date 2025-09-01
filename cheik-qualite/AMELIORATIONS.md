# Mémoire des Améliorations du Site

Ce fichier suit les tâches planifiées, en cours et terminées pour l'amélioration du site web.

## À Faire

-   **Backend Robustesse et Scalabilité :**
    -   Développer des APIs backend robustes pour la gestion complète des profils utilisateurs, y compris la validation des données côté serveur.
    -   Mettre en place un système de stockage d'images efficace pour les photos de profil (par exemple, intégration avec un service de stockage cloud comme AWS S3 ou Cloudinary).
    -   Implémenter une gestion des erreurs plus détaillée et des logs pour le backend.
    -   Considérer l'ajout de WebSockets pour un statut en ligne en temps réel si nécessaire.

-   **Améliorations de l'Interface Utilisateur (UI) et de l'Expérience Utilisateur (UX) :**
    -   Affiner le design général pour une esthétique plus moderne et cohérente sur toutes les pages.
    -   Améliorer la réactivité de l'application sur différents appareils et tailles d'écran.
    -   Ajouter des animations et des transitions fluides pour une meilleure interaction utilisateur.
    -   Mettre en œuvre des icônes plus diversifiées et cohérentes si nécessaire.
    -   Améliorer l'accessibilité (ARIA, navigation au clavier) pour les utilisateurs ayant des besoins spécifiques.

-   **Fonctionnalités Utilisateur Avancées :**
    -   Implémenter une fonctionnalité de réinitialisation de mot de passe (via e-mail).
    -   Ajouter la vérification des e-mails après l'inscription.
    -   Développer une fonctionnalité de recherche avancée pour les produits ou conseils de santé.
    -   Intégrer des notifications en temps réel pour les événements importants (par exemple, messages, mises à jour de statut).

-   **Sécurité :**
    -   Renforcer la sécurité des mots de passe (salage et hachage robustes).
    -   Mettre en œuvre des mesures de protection contre les attaques courantes (XSS, CSRF, injection SQL).
    -   Ajouter une limitation de débit (rate limiting) pour les tentatives de connexion et d'inscription.

-   **Tests :**
    -   Développer des tests unitaires complets pour les composants React et les fonctions utilitaires.
    -   Mettre en place des tests d'intégration pour les interactions frontend-backend.
    -   Considérer des tests de bout en bout (end-to-end) avec des outils comme Cypress ou Playwright.

-   **Optimisation des Performances :**
    -   Optimiser le chargement des ressources (images, polices, scripts).
    -   Mettre en œuvre le découpage de code (code splitting) et le chargement paresseux (lazy loading) pour les routes et composants.
    -   Améliorer les performances de rendu des composants React.

-   **Internationalisation (i18n) :**
    -   Ajouter la prise en charge de plusieurs langues pour l'interface utilisateur.

## En Cours

-   Intégration du statut en ligne statique sur la page de profil.
-   Préparation de la fonctionnalité de téléchargement de photo de profil (côté frontend).

## Terminé

-   Création de ce fichier de suivi.
-   Correction des erreurs d'analyse JSX dans `AuthPage.js`.
-   Renommage du fichier CSS de `AuthPage.js` en `AuthPage.module.css` et mise à jour de l'importation.
-   Redirection de l'utilisateur vers la page de profil après une inscription réussie.
-   Implémentation de la récupération et de l'édition des données de profil utilisateur (`Profil.js`).
-   Ajout de la sélection du statut de santé (Diabétique, Hypertendu, Drépanocytaire, Aucun) via des cases à cocher sur la page de profil.
-   Amélioration du style des champs de saisie et des boutons sur la page de profil pour un aspect plus moderne.