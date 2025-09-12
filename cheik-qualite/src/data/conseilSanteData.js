export const products = [
    {
        name: "Fonio",
        description: "Céréale traditionnelle sans gluten",
        icon: "fas fa-seedling",
        diabetic: "recommended",
        hypertension: "recommended",
        drepanocytosis: "recommended"
    },
    {
        name: "Banane plantain",
        description: "Fruit riche en potassium",
        icon: "fas fa-apple-alt",
        diabetic: "moderate",
        hypertension: "recommended",
        drepanocytosis: "recommended"
    },
    {
        name: "Poisson fumé",
        description: "Source de protéines mais riche en sel",
        icon: "fas fa-fish",
        diabetic: "recommended",
        hypertension: "not-recommended",
        drepanocytosis: "moderate"
    },
    {
        name: "Sauce d'arachide",
        description: "Plat traditionnel protéiné",
        icon: "fas fa-utensil-spoon",
        diabetic: "moderate",
        hypertension: "moderate",
        drepanocytosis: "recommended"
    }
];

export const chatbotKnowledge = [
    {
        keywords: ["bonjour", "salut", "coucou"],
        response: "Bonjour! 👋 Comment puis-je vous aider aujourd'hui?"
    },
    {
        keywords: ["diabète", "diabétique", "glycémie"],
        response: "Pour les personnes diabétiques, je recommande de privilégier les aliments à faible index glycémique comme le fonio, les légumes verts et les légumineuses. Évitez les sucres ajoutés et les aliments transformés. Vous pouvez utiliser notre vérificateur de produits pour savoir si un aliment est adapté."
    },
    {
        keywords: ["hypertension", "tension", "pression"],
        response: "Pour l'hypertension, il est important de réduire la consommation de sel. Privilégiez les aliments riches en potassium comme la banane plantain, les épinards et les patates douces. Évitez les aliments en conserve et les plats préparés qui sont souvent très salés."
    },
    {
        keywords: ["drépanocytose", "drépanocytaire", "anémie"],
        response: "Pour les personnes drépanocytaires, maintenir une bonne hydratation est essentiel. Consommez des aliments riches en acide folique comme les légumes verts à feuilles et les légumineuses. Évitez les aliments riches en fer héminique comme la viande rouge. Le fonio et les fruits riches en vitamine C sont excellents."
    },
    {
        keywords: ["fonio", "céréale"],
        response: "Le fonio est une céréale traditionnelle guinéenne exceptionnelle! 🌾 Elle est sans gluten, riche en fibres, avec un index glycémique bas. Parfaite pour les diabétiques, elle contient aussi du fer et du calcium bénéfiques pour les drépanocytaires. C'est l'un des aliments les plus recommandés dans notre base."
    },
    {
        keywords: ["merci", "remercier"],
        response: "Je vous en prie! N'hésitez pas si vous avez d'autres questions. 😊"
    },
    {
        keywords: ["contact", "vendeur", "acheter"],
        response: "Vous pouvez trouver des vendeurs certifiés dans la section 'Vendeurs Certifiés' de l'application. Tous nos partenaires sont vérifiés par l'Office National de Contrôle Qualité de Guinée pour garantir des produits de qualité."
    },
    {
        keywords: ["magazine", "article", "lire"],
        response: "Nous avons une section dédiée aux magazines santé avec des articles rédigés par nos experts. Vous y trouverez des conseils pratiques adaptés au contexte guinéen. Accédez-y via l'onglet 'Magazines Santé'."
    },
    {
        keywords: ["publier", "produit", "local"],
        response: "Pour publier un produit local, vous devez d'abord vous inscrire en tant que producteur sur notre plateforme. Une fois votre compte validé, vous aurez accès à un formulaire de soumission de produit où vous pourrez renseigner les détails de votre produit, ajouter des photos et le soumettre pour vérification."
    },
    {
        keywords: ["certifier", "certification"],
        response: "La certification de votre produit se fait après une série de contrôles de qualité par nos agents. Vous devez soumettre une demande de certification via votre espace producteur. Un agent prendra ensuite contact avec vous pour planifier une visite et des prélèvements si nécessaire."
    },
    {
        keywords: ["vérifier", "conforme", "conformité"],
        response: "Vous pouvez vérifier la conformité de votre produit en consultant son statut dans votre espace producteur. Si le produit est certifié, un certificat numérique sera disponible. Les consommateurs peuvent également vérifier la conformité d'un produit en scannant son code QR sur notre application."
    }
];
