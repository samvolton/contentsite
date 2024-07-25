import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import './Payment.css';

function Payment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post('/api/create-subscription', {
        paymentMethodId: paymentMethod.id,
      });

      const { clientSecret } = data;

      const result = await stripe.confirmCardPayment(clientSecret);

      if (result.error) {
        setError(result.error.message);
      } else {
        // Subscription successful, update user status
        // Redirect to success page or update UI
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="payment">
      <h2>Premium Üyelik Ödemesi</h2>
      <form onSubmit={handleSubmit}>
        <CardElement />
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'İşleniyor...' : 'Ödeme Yap'}
        </button>
      </form>
    </div>
  );
}

export default Payment;