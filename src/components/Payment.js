import React, { useState } from 'react';
import axios from '../api/axios';
import './Payment.css';

function Payment() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState(300);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await axios.post('/auth/initiate-payment', { email, amount });
      console.log('Server response:', response.data);
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error details:', error);
      if (error.response) {
        setMessage(`Error: ${error.response.data.error || 'An unknown error occurred'}`);
      } else if (error.request) {
        setMessage('No response received from the server. Please try again.');
      } else {
        setMessage('An error occurred while sending the request. Please try again.');
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="payment">
      <h1>Ödeme Bilgileri</h1>
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
          <br />
          <p><strong>Lütfen önce ödemeyi yapın, ardından formu doldurun ve "ÖDEMEYİ TAMAMLA" butonuna tıklayın. Ödemeniz yönetici tarafından onaylandıktan sonra hesap oluşturma maili alacaksınız.</strong></p>
        </div>
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'İşleniyor...' : 'Ödemeyi Tamamladım Ve Hesap Oluşturma Mailini Almaya Hazırım!'}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Payment;