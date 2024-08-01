import React, { useState } from 'react';
import { register } from '../services/authService';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    try {
      const { confirmPassword, ...registerData } = formData;
      const data = await register(registerData);
      setMessage('Kayıt Başarılı!');
      console.log('Registration successful:', data);
      // Optionally, you can automatically log the user in here
      // or redirect them to the login page
    } catch (error) {
      console.error('Registration error:', error);
      setMessage(error.message || 'Kayıt Başarısız. Lütfen tekrar deneyin!');
      setErrors(error.errors || {});
    }
    setIsSubmitting(false);
  };

  return (
    <div className="register">
      <h1>Kayıt Ol</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">E-posta</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Şifre</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Şifreyi Onayla</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </div>
        <button type="submit" className="register-button" disabled={isSubmitting}>
          {isSubmitting ? 'Kaydediliyor...' : 'Kayıt Ol'}
        </button>
      </form>
      {message && <p className={message.includes('Başarılı') ? 'success-message' : 'error-message'}>{message}</p>}
    </div>
  );
}

export default Register;