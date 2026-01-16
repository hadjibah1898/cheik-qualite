// Importation des bibliothèques nécessaires de React.
// React est la bibliothèque principale pour construire l'interface utilisateur.
// useState est un "Hook" qui permet d'ajouter un état local à un composant fonction.
// useEffect est un autre "Hook" qui permet d'exécuter des effets de bord (comme des appels API) en réponse à des changements dans le composant.
import React, { useState, useEffect } from 'react';

// Importation du fichier CSS pour styliser ce composant.
import './AlimentsTab.css';

// Déclaration du composant AlimentsTab. C'est un composant fonctionnel React.
// Il prend une prop "getStatus", qui est une fonction passée depuis le composant parent.
const AlimentsTab = ({ getStatus }) => {
    // Déclaration d'un état "searchTerm" pour stocker la valeur de l'input de recherche.
    // `setSearchTerm` est la fonction pour mettre à jour cet état.
    const [searchTerm, setSearchTerm] = useState('');

    // Déclaration d'un état "filteredProducts" pour stocker les produits filtrés reçus de l'API.
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Déclaration d'un état "loading" pour savoir si une recherche est en cours.
    // Utile pour afficher un message de chargement.
    const [loading, setLoading] = useState(false);

    // Le Hook useEffect est utilisé ici pour lancer la recherche de produits
    // à chaque fois que la valeur de "searchTerm" change.
    useEffect(() => {
        // Définition d'une fonction asynchrone pour récupérer les produits.
        const fetchProducts = async () => {
            // `trim()` enlève les espaces au début et à la fin du terme de recherche.
            const term = searchTerm.trim();

            // Si le terme de recherche est vide, on vide la liste des produits et on arrête.
            if (term === '') {
                setFilteredProducts([]);
                return;
            }

            // On passe à l'état de chargement.
            setLoading(true);
            try {
                // Appel à l'API backend pour rechercher des produits.
                // `encodeURIComponent` formate le terme de recherche pour l'URL.
                const response = await fetch(`/api/openfoodfacts/search?q=${encodeURIComponent(term)}`);
                
                // Si la réponse du serveur n'est pas "ok" (ex: erreur 404 ou 500), on lance une erreur.
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // On convertit la réponse en JSON.
                const data = await response.json();
                // On met à jour l'état avec les produits reçus.
                setFilteredProducts(data);
            } catch (error) {
                // En cas d'erreur lors de l'appel API, on l'affiche dans la console.
                console.error("Erreur lors de la récupération des produits:", error);
                // On vide la liste des produits en cas d'erreur.
                setFilteredProducts([]);
            } finally {
                // `finally` s'exécute toujours, que l'appel ait réussi ou échoué.
                // On repasse l'état de chargement à `false`.
                setLoading(false);
            }
        };

        // "Debouncing": C'est une technique pour ne pas lancer la recherche à chaque frappe.
        // On attend 500ms après la dernière frappe de l'utilisateur avant de lancer la recherche.
        // `setTimeout` exécute `fetchProducts` après 500ms.
        const handler = setTimeout(() => {
            fetchProducts();
        }, 500);

        // Fonction de "nettoyage" de useEffect.
        // Elle est exécutée quand le composant est "démonté" ou avant le prochain `useEffect`.
        // `clearTimeout` annule le timer si l'utilisateur tape à nouveau avant les 500ms.
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]); // Le tableau de dépendances: cet effet ne s'exécute que si `searchTerm` change.

    // Helper: retourne la meilleure URL d'image disponible depuis les champs OpenFoodFacts
    const getProductImage = (p) => {
        return (
            p.image_front_small_url ||
            p.image_front_thumb_url ||
            p.image_front_url ||
            p.image_small_url ||
            p.image_thumb_url ||
            p.image_url ||
            p.image ||
            null
        );
    };

    // La partie "render" du composant : ce qui est affiché à l'écran.
    return (
        <div className="tab-content active" id="aliments-tab">
            {/* Section de la barre de recherche */}
            <section className="search-section">
                <p className="importance-phrase">Votre santé commence dans votre assiette. Recherchez des aliments pour des choix éclairés.</p>
                <div className="search-box">
                    {/* L'input de recherche. Sa valeur est liée à l'état `searchTerm`. */}
                    {/* `onChange` est appelé à chaque fois que l'utilisateur tape quelque chose. */}
                    <input
                        type="text"
                        id="product-search"
                        placeholder="Rechercher un aliment..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="aliment-search-input"
                    />
                </div>
                <p className="examples">Exemples: Fonio, Banane plantain, Poisson fumé, Sauce d'arachide</p>
            </section>

            {/* Section des résultats de la recherche */}
            <section className="results-list-section">
                {/* Affichage conditionnel */}
                {loading ? (
                    // Si `loading` est vrai, on affiche "Chargement...".
                    <p>Chargement...</p>
                ) : filteredProducts.length > 0 ? (
                    // Si on a des produits, on les affiche en utilisant `map`.
                    // `map` est une fonction de tableau qui crée un nouvel élément pour chaque item du tableau.
                    filteredProducts.map(product => (
                        // `key` est un attribut spécial en React pour aider à identifier les éléments dans une liste.
                        <div key={product.code || product._id || product.name} className="product-card-aliment">
                            <div className="product-header-aliment">
                                <div className="product-image-aliment">
                                    {/* Affiche l'image du produit si elle existe, sinon une icône par défaut. */}
                                    {getProductImage(product) ? (
                                        <img
                                            className="aliment-img"
                                            src={getProductImage(product)}
                                            alt={product.product_name_fr || product.product_name || product.name}
                                            loading="lazy"
                                            decoding="async"
                                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='400'%20height='400'%3E%3Crect%20fill='%23f0f0f0'%20width='100%25'/%3E%3Ctext%20x='50%25'%20y='50%25'%20dominant-baseline='middle'%20text-anchor='middle'%20fill='%23808080'%20font-family='Arial'%20font-size='24'%3EImage%20indisponible%3C/text%3E%3C/svg%3E"; }}
                                            srcSet={`${product.image_front_small_url || ''} 200w, ${product.image_front_thumb_url || ''} 400w, ${product.image_front_url || ''} 800w`}
                                            sizes="(max-width: 600px) 80px, 160px"
                                        />
                                    ) : (
                                        <div className="product-icon-fallback" aria-hidden="true"><i className="fas fa-utensils" id="product-icon"></i></div>
                                    )}
                                </div>
                                <div className="product-info-aliment">
                                    {/* Affiche le nom du produit, la marque, les catégories, etc. */}
                                    <h2 id="product-name">{product.product_name_fr || product.name}</h2>
                                    {product.brands && <p className="product-brand">Marque: {product.brands}</p>}
                                    {product.categories && (
                                        <p className="product-category">
                                            Catégories: {Array.isArray(product.categories) ? product.categories.join(', ') : (typeof product.categories === 'string' ? product.categories : (Array.isArray(product.categories_tags) ? product.categories_tags.join(', ') : String(product.categories)))}
                                        </p>
                                    )}
                                    <p id="product-description">{product.description}</p>
                                </div>
                            </div>

                            {/* Affiche les ingrédients si disponibles. */}
                            {product.ingredients_text_fr && (
                                <div className="product-ingredients">
                                    <h3>Ingrédients:</h3>
                                    <p>{product.ingredients_text_fr}</p>
                                </div>
                            )}

                            {/* Section des indicateurs de santé. */}
                            <div className="health-indicators-aliment">
                                <div className="indicator diabetic">
                                    <h3><i className="fas fa-syringe"></i> Diabète</h3>
                                    <p>Charge glycémique et teneur en sucre</p>
                                    {/* Appel de la fonction `getStatus` passée en prop pour afficher l'indicateur. */}
                                    {getStatus("diabetic", product.nutriments && product.nutriments.sugars)}
                                </div>

                                <div className="indicator hypertension">
                                    <h3><i className="fas fa-heartbeat"></i> Hypertension</h3>
                                    <p>Teneur en sodium et graisses saturées</p>
                                    {getStatus("hypertension", product.nutriments && product.nutriments.salt)}
                                </div>

                                <div className="indicator drepanocytosis">
                                    <h3><i className="fas fa-dna"></i> Drépanocytose</h3>
                                    <p>Teneur en fer et propriétés hydratantes</p>
                                    {getStatus("drepanocytosis", product.nutriments && product.nutriments.iron)}
                                </div>
                            </div>

                            {/* Affiche les informations nutritionnelles si disponibles. */}
                            {product.nutriments && (
                                <div className="nutritional-info">
                                    <h3>Informations Nutritionnelles (pour 100g):</h3>
                                    <ul>
                                        {product.nutriments.energy_kcal_100g && <li>Énergie: {product.nutriments.energy_kcal_100g} kcal</li>}
                                        {product.nutriments.proteins_100g && <li>Protéines: {product.nutriments.proteins_100g} g</li>}
                                        {product.nutriments.carbohydrates_100g && <li>Glucides: {product.nutriments.carbohydrates_100g} g</li>}
                                        {product.nutriments.fat_100g && <li>Matières grasses: {product.nutriments.fat_100g} g</li>}
                                        {product.nutriments.fiber_100g && <li>Fibres: {product.nutriments.fiber_100g} g</li>}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    // Si la recherche est terminée et qu'il n'y a pas de produits.
                    <p className="no-results-aliment">
                        {searchTerm.length > 0 ? 
                            `Aucun résultat trouvé pour "${searchTerm}". Veuillez essayer un autre terme de recherche.` :
                            `Veuillez rechercher un aliment.`
                        }
                    </p>
                )}
            </section>
        </div>
    );
};

// Exportation du composant pour qu'il puisse être utilisé dans d'autres fichiers.
export default AlimentsTab;