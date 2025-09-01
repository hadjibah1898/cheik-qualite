import 'dotenv/config';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const url = 'mongodb+srv://mouhamaddjoulde1998:lmCujlEw957U3P0e@clients.uxjtons.mongodb.net/cheikqualite';
const client = new MongoClient(url);
const dbName = 'cheik-qualite';

async function createAdmin() {
  try {
    await client.connect();
    console.log('Connecté à MongoDB');
    const db = client.db(dbName);
    const usersCollection = db.collection('users');

    const adminUsername = 'mou';
    const adminPassword = 'medby';

    const existingUser = await usersCollection.findOne({ username: adminUsername });
    if (existingUser) {
      console.log('L\'utilisateur administrateur existe déjà.');
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await usersCollection.insertOne({
      username: adminUsername,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Utilisateur administrateur créé avec succès.');

  } catch (err) {
    console.error('Erreur lors de la création de l\'utilisateur administrateur:', err);
  } finally {
    await client.close();
    console.log('Déconnecté de MongoDB');
  }
}

createAdmin();