import React from 'react';
import './PremiumModal.css';
import { useNavigate } from 'react-router-dom';

function PremiumModal({ content, onClose, isAuthenticated, isPremium }) {
  const navigate = useNavigate();

  if (isAuthenticated && isPremium) {
    return null;  
  }

  const goToPremium = () => {
    onClose();
    navigate('/premium');
  };

  const goToLogin = () => {
    onClose();
    navigate('/login');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Premium İçerik</h2>
        {!isAuthenticated && (
          <>
            <p>Bu içeriği görüntülemek için giriş yapmalısınız.</p>
            <button className="close-button" onClick={goToLogin}>Giriş Yap</button>
          </>
        )}
        {isAuthenticated && !isPremium && (
          <>
            <p>Bu içeriği sadece premium kullanıcılar görüntüleyebilir!</p>
            <button className="close-button" onClick={goToPremium}>Premium ol</button>
          </>
        )}
        {isAuthenticated && isPremium && content && (
          <>
            <p>Bu içeriği görüntüleyebilirsiniz.</p>
            {content.contentType.startsWith('image') && (
              <img src={`http://localhost:5000/files/${content.filename}`} alt={content.filename} />
            )}
            {content.contentType.startsWith('video') && (
              <video src={`http://localhost:5000/files/${content.filename}`} controls />
            )}
          </>
        )}
        <button className="close-button" onClick={onClose}>Kapat</button>
      </div>
    </div>
  );
}

export default PremiumModal;
