import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import 'dotenv/config';

// --- Configuration de Cloudinary ---
// On configure l'accès à notre compte Cloudinary en utilisant les variables d'environnement.
// C'est plus sûr que de mettre les clés directement dans le code.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Fonction pour créer un stockage Cloudinary ---
// Cette fonction nous évite de répéter la configuration pour chaque type d'upload.
// Elle prend le nom du dossier sur Cloudinary en argument.
const createStorage = (folderName) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `cheik-qualite/${folderName}`, // Crée un sous-dossier pour mieux organiser les fichiers
      allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'], // Formats de fichiers autorisés
      // Génère un nom de fichier unique pour éviter les conflits.
      public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    },
  });
};

// --- Création des middlewares d'upload pour chaque type de fichier ---
// On crée une instance de Multer pour chaque type de fichier que nous voulons téléverser.
// Chaque instance utilise une configuration de stockage Cloudinary pointant vers un dossier spécifique.

const uploadCertificate = multer({ storage: createStorage('certificates') });
const uploadMagazine = multer({ storage: createStorage('magazines') });
const uploadProduct = multer({ storage: createStorage('products') });
const uploadDietitianPhoto = multer({ storage: createStorage('dietitians') });
const uploadProfilePic = multer({ storage: createStorage('profile-pictures') });
const uploadProducerImage = multer({ storage: createStorage('producers') });

// --- Exportation des middlewares ---
// On exporte toutes nos instances de Multer pour pouvoir les utiliser dans nos routes.
// Note: L'ancien middleware "upload" a été renommé en "uploadCertificate" pour plus de clarté.
// Il faudra vérifier que les routes utilisent le bon nom.
export {
  uploadCertificate,
  uploadMagazine,
  uploadProduct,
  uploadDietitianPhoto,
  uploadProfilePic,
  uploadProducerImage,
};