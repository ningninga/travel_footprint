import React from 'react';
import './imagemodal.css';

export default function ImageModal({ showModal, imageSrc, hideModal }) {
    if (!showModal) {
      return null;
    }
  
    return (
      <div className="imageModal" onClick={hideModal}>
        <img src={imageSrc} alt="Enlarged" />
      </div>
    );
  };