// import React, { useState } from 'react';
// import './NutritionalAssessment.css'; // Assuming a new CSS file for this component

// const NutritionalAssessment = () => {
//     const [nutritionalData, setNutritionalData] = useState({
//         sugars: '',
//         salt: '',
//         fat: '',
//         iron: '',
//         // Add other relevant nutrients as needed
//     });

//     const [assessmentResults, setAssessmentResults] = useState(null);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setNutritionalData(prevData => ({
//             ...prevData,
//             [name]: parseFloat(value) || '', // Convert to number, or keep empty string
//         }));
//     };

//     const assessProduct = () => {
//         const { sugars, salt, fat, iron } = nutritionalData;
//         const results = {};

//         // Assessment for Diabetics (simplified: focus on sugars)
//         if (typeof sugars === 'number') {
//             if (sugars < 5) { // e.g., <5g/100g is good
//                 results.diabetic = { status: 'recommended', message: 'Faible en sucres, potentiellement bon pour les diabétiques.' };
//             } else if (sugars >= 5 && sugars < 15) {
//                 results.diabetic = { status: 'moderate', message: 'Teneur modérée en sucres, à consommer avec modération.' };
//             } else {
//                 results.diabetic = { status: 'not-recommended', message: 'Riche en sucres, déconseillé pour les diabétiques.' };
//             }
//         } else {
//             results.diabetic = { status: 'unknown', message: 'Donnée sur les sucres manquante.' };
//         }

//         // Assessment for Hypertension (simplified: focus on salt)
//         if (typeof salt === 'number') {
//             if (salt < 0.3) { // e.g., <0.3g/100g is good
//                 results.hypertension = { status: 'recommended', message: 'Faible en sel, potentiellement bon pour l\'hypertension.' };
//             } else if (salt >= 0.3 && salt < 1.5) {
//                 results.hypertension = { status: 'moderate', message: 'Teneur modérée en sel, à consommer avec modération.' };
//             } else {
//                 results.hypertension = { status: 'not-recommended', message: 'Riche en sel, déconseillé pour l\'hypertension.' };
//             }
//         } else {
//             results.hypertension = { status: 'unknown', message: 'Donnée sur le sel manquante.' };
//         }

//         // Assessment for Drepanocytosis (simplified: focus on iron - consult medical advice for real guidelines)
//         // NOTE: Iron intake for drepanocytosis is complex and requires medical advice.
//         // This is a highly simplified example.
//         if (typeof iron === 'number') {
//             if (iron >= 0.002 && iron < 0.008) { // Example range for 'recommended'
//                 results.drepanocytosis = { status: 'recommended', message: 'Teneur en fer équilibrée.' };
//             } else if (iron < 0.002 || iron >= 0.008) {
//                 results.drepanocytosis = { status: 'moderate', message: 'Teneur en fer à surveiller.' };
//             } else {
//                 results.drepanocytosis = { status: 'not-recommended', message: 'Teneur en fer potentiellement problématique.' };
//             }
//         } else {
//             results.drepanocytosis = { status: 'unknown', message: 'Donnée sur le fer manquante.' };
//         }

//         setAssessmentResults(results);
//     };

//     return (
//         <div className="nutritional-assessment-container">
//             <h2>Évaluer un Produit par ses Données Nutritionnelles</h2>
//             <p className="disclaimer">
//                 <i className="fas fa-info-circle"></i> Ces évaluations sont basées sur des seuils généraux et ne remplacent en aucun cas un avis médical ou diététique professionnel. Consultez toujours un spécialiste pour des recommandations personnalisées.
//             </p>
//             <div className="input-form">
//                 <div className="form-group">
//                     <label htmlFor="sugars">Sucres (g pour 100g):</label>
//                     <input type="number" id="sugars" name="sugars" value={nutritionalData.sugars} onChange={handleChange} placeholder="Ex: 5.2" />
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="salt">Sel (g pour 100g):</label>
//                     <input type="number" id="salt" name="salt" value={nutritionalData.salt} onChange={handleChange} placeholder="Ex: 0.8" />
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="fat">Matières Grasses (g pour 100g):</label>
//                     <input type="number" id="fat" name="fat" value={nutritionalData.fat} onChange={handleChange} placeholder="Ex: 10.5" />
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="iron">Fer (mg pour 100g):</label>
//                     <input type="number" id="iron" name="iron" value={nutritionalData.iron} onChange={handleChange} placeholder="Ex: 0.005" />
//                 </div>
//                 {/* Add more input fields for other nutrients as needed */}
//                 <button onClick={assessProduct} className="assess-button">Évaluer le Produit</button>
//             </div>

//             {assessmentResults && (
//                 <div className="assessment-results">
//                     <h3>Résultats de l\'évaluation :</h3>
//                     <div className="result-item">
//                         <h4>Diabète:</h4>
//                         <p className={`status-${assessmentResults.diabetic.status}`}>{assessmentResults.diabetic.message}</p>
//                     </div>
//                     <div className="result-item">
//                         <h4>Hypertension:</h4>
//                         <p className={`status-${assessmentResults.hypertension.status}`}>{assessmentResults.hypertension.message}</p>
//                     </div>
//                     <div className="result-item">
//                         <h4>Drépanocytose:</h4>
//                         <p className={`status-${assessmentResults.drepanocytosis.status}`}>{assessmentResults.drepanocytosis.message}</p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default NutritionalAssessment;
