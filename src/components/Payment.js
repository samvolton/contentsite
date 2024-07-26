import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.css';

function Payment() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { amount } = location.state || {};

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to your backend to process the payment
    // For now, we'll just log the details and navigate back to the home page
    console.log('Payment submitted:', { name, email, amount });
    navigate('/');
  };

  return (
    <div className="payment">
      <h2>Ödeme Bilgileri</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Ad Soyad:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">E-posta:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Ödeme Tutarı: {amount} TRY</label>
        </div>
        <div className="form-group">
          <h3>Papara Hesap Bilgileri:</h3>
          <p>Hesap Numarası: 1234567890</p>
          <p>Hesap Adı: Your Company Name</p>
        </div>
        <button type="submit" className="submit-button">Ödemeyi Tamamla</button>
      </form>
    </div>
  );
}

export default Payment;