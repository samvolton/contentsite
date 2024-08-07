import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    token: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    if (tokenFromUrl) {
      setFormData(prevState => ({ ...prevState, token: tokenFromUrl, email: queryParams.get('email') || '' }));
    }
  }, [location]);

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
    if (!formData.token) errors.token = 'Verification token is missing';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    try {
      const { confirmPassword, ...registerData } = formData;
      // eslint-disable-next-line no-unused-vars
      const data = await register(registerData);
      setMessage('Kayıt Başarılı!');
      // Redirect to login page or automatically log the user in
      navigate('/login');
    } catch (error) {
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
        <input
          type="hidden"
          name="token"
          value={formData.token}
        />
        <button type="submit" className="register-button" disabled={isSubmitting}>
          {isSubmitting ? 'Kaydediliyor...' : 'Kayıt Ol'}
        </button>
      </form>
      {message && <p className={message.includes('Başarılı') ? 'success-message' : 'error-message'}>{message}</p>}
    </div>
  );
}

export default Register;