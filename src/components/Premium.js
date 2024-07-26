import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Premium.css';

function Premium() {
  const navigate = useNavigate();

  const handleSubscribe = (amount) => {
    navigate('/payment', { state: { amount } });
  };

  return (
    <div className="premium">
      <h1>Premium Üyelik</h1>
      <p>Premium üyelik ile tüm fotoğraf ve videolara sınırsız erişim kazanın!</p>
      <div className="premium-features">
        <h2>Premium Üyelik Avantajları:</h2>
        <ul>
          <li>Tüm fotoğraf ve videolara tam erişim</li>
          <li>Reklamsız deneyim</li>
          <li>Yüksek çözünürlüklü indirme seçeneği</li>
          <li>Özel içeriklere erken erişim</li>
        </ul>
      </div>
      <div className="pricing">
        <h2>Fiyatlandırma:</h2>
        <div className="price-options">
          <div className="price-option">
            <h3>1 Aylık Plan</h3>
            <p className="price">300 TRY</p>
            <button onClick={() => handleSubscribe(300)} className="subscribe-button">Abone Ol</button>
          </div>
          <div className="price-option">
            <h3>6 Aylık Plan</h3>
            <p className="price">1500 TRY</p>
            <button onClick={() => handleSubscribe(1500)} className="subscribe-button">Abone Ol</button>
          </div>
          <div className="price-option">
            <h3>12 Aylık Plan</h3>
            <p className="price">3000 TRY</p>
            <button onClick={() => handleSubscribe(3000)} className="subscribe-button">Abone Ol</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Premium;