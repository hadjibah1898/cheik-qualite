# Projet Cheik Qualite

Ce projet est une application web développée pour [Décrire brièvement le but du projet, par exemple : gérer les profils utilisateurs, fournir des conseils de santé, etc.].

## Structure du Projet

Le projet est divisé en deux parties principales :

-   `cheik-qualite/cheik-qualite` : L'application frontend (React).
-   `cheik-qualite/backend` : Le serveur backend (Node.js/Express).

## Configuration du Projet

Suivez les étapes ci-dessous pour configurer et exécuter le projet sur votre machine locale.

### Prérequis

Assurez-vous d'avoir les éléments suivants installés :

-   Node.js (version 14 ou supérieure recommandée)
-   npm (généralement installé avec Node.js)

### 1. Configuration du Backend

1.  Naviguez vers le répertoire du backend :
    ```bash
    cd backend
    ```
2.  Installez les dépendances :
    ```bash
    npm install
    ```
3.  **Configuration de la base de données et des variables d'environnement :**
    *   Créez un fichier `.env` à la racine du répertoire `backend`.
    *   Ajoutez les variables d'environnement nécessaires (par exemple, `MONGO_URI`, `JWT_SECRET`, `PORT`). Référez-vous au code source du backend pour les variables exactes requises.
    *   Exemple de `.env` :
        ```
        PORT=5000
        MONGO_URI=mongodb://localhost:27017/cheikqualite_db
        JWT_SECRET=votre_secret_jwt_tres_securise
        ```
4.  Démarrez le serveur backend :
    ```bash
    node server.js
    ```
    Le serveur devrait démarrer sur `http://localhost:5000` (ou le port spécifié dans votre `.env`).

### 2. Configuration du Frontend

1.  Naviguez vers le répertoire du frontend :
    ```bash
    cd cheik-qualite
    ```
2.  Installez les dépendances :
    ```bash
    npm install
    ```
3.  Démarrez l'application frontend :
    ```bash
    npm start
    ```
    L'application devrait s'ouvrir dans votre navigateur par défaut sur `http://localhost:3000`.

## Fonctionnalités Clés

-   **Authentification Utilisateur :** Inscription et connexion des utilisateurs.
-   **Gestion de Profil :** Les utilisateurs peuvent consulter et modifier leurs informations de profil, y compris :
    -   Nom, e-mail, téléphone.
    -   Statut de santé (Diabétique, Hypertendu, Drépanocytaire, Aucun).
    -   Téléchargement d'une photo de profil (nécessite un point de terminaison backend pour le téléchargement de fichiers).
-   **Statut en Ligne :** Affichage et modification du statut en ligne de l'utilisateur.

## Points d'API Backend Utilisés

-   `POST /api/auth/register` : Inscription d'un nouvel utilisateur.
-   `POST /api/auth/login` : Connexion d'un utilisateur existant.
-   `GET /api/user/profile` : Récupère les informations de profil de l'utilisateur authentifié.
-   `PUT /api/user/profile` : Met à jour les informations de profil de l'utilisateur authentifié.
-   `POST /api/user/upload-profile-picture` : Télécharge une photo de profil pour l'utilisateur authentifié.

## Notes Importantes

-   Assurez-vous que votre backend est correctement configuré et en cours d'exécution avant de démarrer le frontend.
-   Le point de terminaison de téléchargement de la photo de profil (`/api/user/upload-profile-picture`) nécessite une implémentation backend pour gérer le stockage des fichiers et renvoyer l'URL de l'image. Sans cela, la fonctionnalité de téléchargement de photo de profil ne fonctionnera pas.

## Dépannage

Si vous rencontrez des problèmes, vérifiez les points suivants :

-   Les dépendances sont-elles installées pour le frontend et le backend ?
-   Le serveur backend est-il en cours d'exécution et accessible sur le bon port ?
-   Les variables d'environnement du backend sont-elles correctement configurées ?
-   Vérifiez la console du navigateur et le terminal du serveur pour les messages d'erreur.