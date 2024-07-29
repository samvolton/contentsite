import React from 'react';
import './PremiumModal.css';
import { useNavigate } from 'react-router-dom';

function PremiumModal({ content, onClose }) {
  const navigate = useNavigate();

  const goToPremium = () => {
    onClose();
    navigate('/premium');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Premium İçerik</h2>
        <p>Bu içeriği sadece premium kullanıcılar görüntüleyebilir!</p>
        <button className="close-button" onClick={goToPremium}>Premium ol</button>
        <button className="close-button" onClick={onClose}>Kapat</button>
      </div>
    </div>
  );
}

export default PremiumModal;
