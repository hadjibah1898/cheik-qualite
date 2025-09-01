
import React from 'react';
import './Unauthorized.css';

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <h1>Accès Non Autorisé</h1>
      <p>Vous n'avez pas la permission d'accéder à cette page.</p>
      <p>Veuillez contacter l'administrateur si vous pensez qu'il s'agit d'une erreur.</p>
    </div>
  );
};

export default Unauthorized;
