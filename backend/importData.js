import { MongoClient } from 'mongodb';
import { products as healthAdvice, chatbotKnowledge } from '../cheik-qualite/src/data/conseilSanteData.js';
import { mockDatabase as products } from '../cheik-qualite/src/data/products.js';

const url = 'mongodb+srv://mouhamaddjoulde1998:lmCujlEw957U3P0e@clients.uxjtons.mongodb.net/cheikqualite';
const client = new MongoClient(url);
const dbName = 'cheik-qualite';

async function main() {
  await client.connect();
  console.log('Connecté à MongoDB');
  const db = client.db(dbName);

  // Health Advice
  const healthAdviceCollection = db.collection('health_advice');
  await healthAdviceCollection.deleteMany({});
  await healthAdviceCollection.insertMany(healthAdvice);
  console.log('Conseils santé importés');

  // Chatbot Knowledge
  const chatbotCollection = db.collection('chatbot');
  await chatbotCollection.deleteMany({});
  await chatbotCollection.insertMany(chatbotKnowledge);
  console.log('Connaissances du chatbot importées');

  // Products
  const productsCollection = db.collection('products');
  await productsCollection.deleteMany({});
  await productsCollection.insertMany(products);
  console.log('Produits importés');

  return 'Terminé.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
