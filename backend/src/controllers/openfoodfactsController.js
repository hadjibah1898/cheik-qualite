import fetch from 'node-fetch';

// Recherche sur l'API OpenFoodFacts et renvoie les résultats.
const searchOpenFoodFacts = async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ message: 'q parameter is required' });

  try {
    const params = new URLSearchParams({
      search_terms: q,
      search_simple: '1',
      action: 'process',
      json: '1',
      page_size: '30'
    });
    const url = `https://world.openfoodfacts.org/cgi/search.pl?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(502).json({ message: 'OpenFoodFacts upstream error' });
    }
    const data = await response.json();
    // Retourner la liste brute de produits (frontend utilise product_name_fr, nutriments, etc.)
    return res.json(data.products || []);
  } catch (err) {
    console.error('Error fetching OpenFoodFacts', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { searchOpenFoodFacts };
