import React from 'react';

const ImageLightbox = ({ src, alt, onClose }) => {
  if (!src) return null;
  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Fermer">×</button>
        <img src={src} alt={alt} />
      </div>
    </div>
  );
};

export default ImageLightbox;
