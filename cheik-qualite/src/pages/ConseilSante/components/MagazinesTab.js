import React from 'react';
import './MagazinesTab.css';
import magazinesData from '../../../data/magazinesData.js';

const MagazinesTab = () => {
  return (
    <div className="magazines-tab">
      <h2>Magazines de Santé</h2>
      <div className="magazines-list">
        {magazinesData.map((magazine) => (
          <div key={magazine.id} className="magazine-card">
            <img src={magazine.imageUrl} alt={magazine.title} className="magazine-image" />
            <h3>{magazine.title}</h3>
            <p>{magazine.description}</p>
            <a href={magazine.pdfUrl} target="_blank" rel="noopener noreferrer" className="magazine-link">
              Lire le magazine
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MagazinesTab;