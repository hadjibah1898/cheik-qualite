export const mockDatabase = [
    {
        type: "Huile",
        barcode: "628102315001",
        name: "Huile de Palme Rouge 'Fouta'",
        producer: "Société AgroGuinée",
        lotNumber: "HP-2024-LOT-01A",
        status: "conforme",
        certification: "ONCQ-2024-001A",
        imageUrl: "https://via.placeholder.com/200x200/4caf50/ffffff?text=Produit+Conforme",
        qrData: "https://conseilsanteguinee.com/produit/628102315001"
    },
    {
        type: "Céréale",
        barcode: "9780201379624",
        name: "Fonio de Guinée",
        producer: "Coopérative Fonio Sahel",
        lotNumber: "FNG-2024-LOT-05B",
        status: "conforme",
        certification: "ONCQ-2024-002B",
        imageUrl: "https://via.placeholder.com/200x200/2ecc71/ffffff?text=Produit+Conforme",
        qrData: "https://conseilsanteguinee.com/produit/9780201379624"
    },
    {
        type: "Miel",
        barcode: "5449000000996",
        name: "Miel du Fouta",
        producer: "Apiculture du Fouta",
        lotNumber: "MDF-2024-LOT-03C",
        status: "conforme",
        certification: "ONCQ-2024-003C",
        imageUrl: "https://via.placeholder.com/200x200/e67e22/ffffff?text=Produit+Conforme",
        qrData: "https://conseilsanteguinee.com/produit/5449000000996"
    },
    {
        type: "Boisson",
        barcode: "9781234567890",
        name: "Jus de Gingembre",
        producer: "BioJus Guinée",
        lotNumber: "JGG-2024-LOT-12D",
        status: "non_conforme",
        reason: "Présence de contaminants",
        imageUrl: "https://via.placeholder.com/200x200/f44336/ffffff?text=Produit+Non+Conforme",
        qrData: "https://conseilsanteguinee.com/produit/non_conforme"
    },
    {
        type: "Assainisseur d'air",
        barcode: "6043000076488",
        name: "Nova Fresh (Textile Bleu)",
        producer: "Sivop, Sénégal",
        lotNumber: "NF-2023-05D",
        status: "non_conforme",
        reason: "Date d'expiration dépassée (01/2025)",
        imageUrl: "https://via.placeholder.com/200x200/f44336/ffffff?text=Produit+Expir%C3%A9",
        qrData: "https://conseilsanteguinee.com/produit/non_conforme"
    },
    {
        type: "Inconnu",
        barcode: "123456789012",
        name: "Produit Inconnu",
        producer: null,
        lotNumber: null,
        status: "inconnu",
        imageUrl: "https://via.placeholder.com/200x200/2196f3/ffffff?text=Statut+Inconnu",
        qrData: "https://conseilsanteguinee.com/produit/inconnu"
    }
];
