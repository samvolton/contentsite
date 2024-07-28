import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

function Layout({ children }) {
  return (
    <div className="layout">
      <header className="header">
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <img src="/images/nudecenneti.png" alt="Nude Cenneti Logo" className="logo" />
          </Link>
          <div className="hamburger-menu" id="hamburger-menu">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
        <nav className="nav">
          <ul>
            <li><Link to="/">Ana Sayfa</Link></li>
            <li><Link to="/bedava-icerikler">Bedava İçerikler</Link></li>
            <li><Link to="/foto">Fotoğraflar</Link></li>
            <li><Link to="/video">Videolar</Link></li>
            <li><Link to="/premium">Premium</Link></li>
          </ul>
        </nav>
      </header>
      <main className="main-content">{children}</main>
      <footer className="footer">
        <p>&copy; 2024 Nude Cenneti. Tüm hakları saklıdır.</p>
        <div className="social-links">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
