import React, { useState } from 'react';
import './IcerikKaldirma.css';

function IcerikKaldirma() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contentUrl: '',
    reason: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send this data to your backend
    alert('Talebiniz alındı. En kısa sürede incelenecektir.');
    setFormData({ name: '', email: '', contentUrl: '', reason: '', description: '' });
  };

  return (
    <div className="icerik-kaldirma">
      <h1>İçerik Kaldırma Talebi</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Adınız Soyadınız</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">E-posta Adresiniz</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="contentUrl">Kaldırılacak İçerik URL'si</label>
          <input type="url" id="contentUrl" name="contentUrl" value={formData.contentUrl} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="reason">Kaldırma Sebebi</label>
          <select id="reason" name="reason" value={formData.reason} onChange={handleChange} required>
            <option value="">Seçiniz</option>
            <option value="copyright">Telif Hakkı İhlali</option>
            <option value="privacy">Gizlilik İhlali</option>
            <option value="inappropriate">Uygunsuz İçerik</option>
            <option value="other">Diğer</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="description">Açıklama</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} required></textarea>
        </div>
        <button type="submit" className="submit-button">Talebi Gönder</button>
      </form>
    </div>
  );
}

export default IcerikKaldirma;