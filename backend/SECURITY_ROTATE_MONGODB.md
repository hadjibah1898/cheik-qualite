# Rotation des identifiants MongoDB Atlas

Si une URI MongoDB (connexion) a été exposée, procédez immédiatement à la rotation du mot de passe et à la mise à jour de vos applications.

Étapes recommandées :

1. Générer un nouveau mot de passe fort (ex: 32+ caractères, gestionnaire de mots de passe).

2. Mettre à jour l'utilisateur dans MongoDB Atlas (UI) :
   - Ouvrez votre projet dans MongoDB Atlas.
   - Menu **Database Access** → trouvez l'utilisateur `62852hadji_db_user`.
   - Cliquez sur **Edit** → Renseignez le nouveau mot de passe → **Save**.

3. (Optionnel) via l'Atlas CLI `atlas` :
   - Installation : suivez https://www.mongodb.com/docs/atlas/cli/stable/
   - Exemple de commande (à adapter) :
     ```bash
     atlas dbuser update --username 62852hadji_db_user --password "NOUVEAU_MOT_DE_PASSE" --projectId <PROJECT_ID>
     ```

4. Mettre à jour votre fichier local `.env` (non committé) dans `backend` :
   - Remplacez `DATABASE_URL` par la nouvelle URI (encodez le mot de passe si nécessaire).

5. Redémarrer l'application backend :
   ```bash
   cd backend
   npm install   # si nécessaire
   npm restart   # ou npm start selon le script
   ```

6. Révoquer accès anciens secrets :
   - Si vous avez partagé la chaîne quelque part (Git, chat...), supprimez-la et signalez l'incident.
   - Considérez la rotation des clés Cloudinary / SMTP si elles étaient exposées en même temps.

7. Vérifier le bon fonctionnement et logs :
   - Tester les endpoints qui accèdent à la DB.
   - Surveillez les logs pour échecs d'authentification.

Notes de sécurité :
- N'ajoutez jamais de secrets dans le dépôt. Utilisez `backend/.env` local et `backend/.env.example` dans le repo.
- En production, utilisez un gestionnaire de secrets (Vault, AWS Secrets Manager, etc.).
