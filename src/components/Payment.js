import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

function Payment() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState(300); // Default to 1 Aylık
  const navigate = useNavigate();

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
          <label htmlFor="subscription">Abonelik Planı:</label>
          <select
            id="subscription"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            required
          >
            <option value={300}>1 Aylık - 300 TRY</option>
            <option value={1500}>6 Aylık - 1500 TRY</option>
            <option value={3000}>12 Aylık - 3000 TRY</option>
          </select>
        </div>
        <div className="form-group">
          <h3>Papara Hesap Bilgileri:</h3>
          <p><strong>Papara Hesap Numarası:</strong> 1982400478</p>
          <p><strong>Hesap IBAN Numarası:</strong> TR39 0082 9000 0949 1982 4004 78</p>
          <p><strong>Ödemenizi Sağlarken Açıklamaya Hiçbir Şey Yazmayınız!</strong></p>
          <br></br>
          <p><strong>Ödemeyi YAPMADAN formu DOLDURMANIZ hiçbir işe YARAMAYACAKTIR. Lütfen ÖDEME yaptıktan sonra "ÖDEMEYİ TAMAMLA" butonuna tıklayınız.</strong></p>
        </div>
        <button type="submit" className="submit-button">Ödemeyi Tamamladım Ve Hesap Oluşturma Mailini Almaya Hazırım!</button>
      </form>
    </div>
  );
}

export default Payment;
