import React from 'react';
import { Link } from 'react-router-dom';
import './Premium.css';

function Premium() {
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
            <h3>Aylık Plan</h3>
            <p className="price">₺29.99 / ay</p>
            <Link to="/payment" className="subscribe-button">Abone Ol</Link>
          </div>
          <div className="price-option">
            <h3>Yıllık Plan</h3>
            <p className="price">₺299.99 / yıl</p>
            <p className="savings">(%17 tasarruf)</p>
            <Link to="/payment" className="subscribe-button">Abone Ol</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Premium;