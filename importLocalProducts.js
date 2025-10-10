import 'dotenv/config';
import { MongoClient } from 'mongodb';
import { localProducts } from '../cheik-qualite/src/data/localProducts.js'; // Adjust path as needed

const url = 'mongodb+srv://mouhamaddjoulde1998:lmCujlEw957U3P0e@clients.uxjtons.mongodb.net/cheikqualite';
const dbName = 'cheik-qualite'; // Your database name

async function importData() {
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbName);

        const collection = db.collection('local_products');

        // Optional: Clear existing data before inserting
        // await collection.deleteMany({});
        // console.log('Cleared existing local_products data.');

        const result = await collection.insertMany(localProducts);
        console.log(`${result.insertedCount} local products inserted.`);
    } catch (err) {
        console.error('Error importing data:', err);
    } finally {
        await client.close();
        console.log('MongoDB connection closed.');
    }
}

importData();