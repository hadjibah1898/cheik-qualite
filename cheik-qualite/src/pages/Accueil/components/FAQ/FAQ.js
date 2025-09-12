import React from 'react';
import './FAQ.css';

const FAQ = () => {
    const faqData = [
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