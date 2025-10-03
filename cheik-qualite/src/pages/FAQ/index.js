import React from 'react';
import './FAQ.css'; // Assuming FAQ.css will be moved or copied to src/pages/FAQ/

const FAQ = () => {
    const faqData = [
        {
            question: 'Qu\'est-ce que QSL Guinée ?',
            answer: 'QSL Guinée est une plateforme dédiée à la promotion de la Qualité, de la Santé et des produits Locaux en Guinée. Nous aidons les consommateurs à vérifier la conformité des produits et soutenons les producteurs locaux certifiés.'
        },
        {
            question: 'Comment publier un produit local ?',
            answer: "Pour publier un produit local, vous devez d'abord vous inscrire en tant que producteur sur notre plateforme. Une fois votre compte validé, vous aurez accès à un formulaire de soumission de produit où vous pourrez renseigner les détails de votre produit, ajouter des photos et le soumettre pour vérification."
        },
        {
            question: 'Comment certifier mon produit ?',
            answer: "La certification de votre produit se fait après une série de contrôles de qualité par nos agents. Vous devez soumettre une demande de certification via votre espace producteur. Un agent prendra ensuite contact avec vous pour planifier une visite et des prélèvements si nécessaire."
        },
        {
            question: 'Comment vérifier si mon produit est conforme ou pas ?',
            answer: "Vous pouvez vérifier la conformité de votre produit en consultant son statut dans votre espace producteur. Si le produit est certifié, un certificat numérique sera disponible. Les consommateurs peuvent également vérifier la conformité d'un produit en scannant son code QR sur notre application."
        },
        {
            question: 'Comment devenir agent QSL Guinée ?',
            answer: 'Pour devenir agent, vous devez postuler via la section "Devenir Agent" sur notre site. Après examen de votre candidature et une formation, vous pourrez rejoindre notre équipe pour aider à la vérification et à la promotion des produits.'
        },
        {
            question: 'Que faire si je trouve un produit non conforme ?',
            answer: 'Si vous suspectez un produit d\'être non conforme, vous pouvez le signaler via notre application en fournissant les détails et des preuves (photos). Nos équipes enquêteront sur le signalement.'
        },
        {
            question: 'Les conseils santé sont-ils fiables ?',
            answer: 'Oui, tous nos conseils santé sont élaborés par des professionnels de la santé et sont basés sur des informations scientifiques et des recommandations officielles pour vous garantir des informations fiables et pertinentes.'
        },
        {
            question: 'L\'utilisation de l\'application est-elle gratuite ?',
            answer: 'Oui, l\'application QSL Guinée est entièrement gratuite pour les consommateurs. Des frais peuvent s\'appliquer pour les services de certification et de publication de produits pour les producteurs.'
        }
    ];

    return (
        <section className="section-box faq-section" id="faq">
            <h2 className="section-title">Questions Fréquemment Posées</h2>
            <div className="faq-content">
                {faqData.map((item, index) => (
                    <div className="faq-item" key={index}>
                        <h3 className="faq-question">{item.question}</h3>
                        <p className="faq-answer">{item.answer}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQ;
