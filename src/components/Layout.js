import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo-link">
            <img src="/images/nudecenneti.png" alt="Nude Cenneti Logo" className="logo" />
          </Link>
          <button className="menu-toggle" onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
          <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
            <ul>
              <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Ana Sayfa</Link></li>
              <li><Link to="/bedava-icerikler" className={location.pathname === '/bedava-icerikler' ? 'active' : ''}>Bedava İçerikler</Link></li>
              <li><Link to="/foto" className={location.pathname === '/foto' ? 'active' : ''}>Fotoğraflar</Link></li>
              <li><Link to="/video" className={location.pathname === '/video' ? 'active' : ''}>Videolar</Link></li>
              <li><Link to="/premium" className="premium-link">Premium</Link></li>
              <li><Link to="/register" className="auth-link">Kayıt Ol</Link></li>
              <li><Link to="/login" className="auth-link">Giriş</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="main-content">{children}</main>
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 Nude Cenneti. Tüm hakları saklıdır.</p>
          <nav className="footer-nav">
            <Link to="/hakkimizda">Hakkımızda</Link>
            <Link to="/gizlilik-politikasi">Gizlilik Politikası</Link>
            <Link to="/kullanim-sartlari">Kullanım Şartları</Link>
            <Link to="/iletisim">İletişim</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
