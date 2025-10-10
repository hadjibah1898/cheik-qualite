// save this as addHealthAdvice.js in your backend directory

const articleData = {
  "title": "Aliments Recommandés pour l'Hypertension",
  "content": "Pour gérer l'hypertension, privilégiez les aliments riches en potassium comme les bananes, les avocats, les épinards et les patates douces. Réduisez votre consommation de sel en évitant les aliments transformés, les charcuteries et les plats préparés. Optez pour des herbes et épices pour assaisonner vos plats. Les céréales complètes, les légumineuses et les poissons gras (riches en oméga-3) sont également bénéfiques. N'oubliez pas de boire suffisamment d'eau et de limiter l'alcool.",
  "background": "linear-gradient(45deg, #3498db, #2980b9)",
  "icon": "fas fa-heartbeat",
  "date": new Date().toISOString(), // Use current date and time
  "readTime": 5
};

// IMPORTANT: Replace 'YOUR_ADMIN_TOKEN_HERE' with an actual admin JWT token.
// You can get this token by logging in as an admin user in your frontend
// and inspecting the localStorage, or by using your backend's login endpoint
// with a tool like Postman.
const ADMIN_TOKEN = process.env.ADMIN_TOKEN; 

async function addHealthAdvice() {
  try {
    const response = await fetch('http://localhost:5000/api/health-advice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify(articleData)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Article ajouté avec succès:', data);
    } else {
      console.error('Erreur lors de l\'ajout de l\'article:', data);
    }
  } catch (error) {
    console.error('Erreur lors de la connexion au serveur:', error);
  }
}

addHealthAdvice();
