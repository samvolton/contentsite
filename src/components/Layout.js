import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

function Layout({ children }) {
  return (
    <div className="layout">
      <header className="header">
        <Link to="/" className="logo-link">
          <img src="/images/nudecenneti.png" alt="Nude Cenneti Logo" className="logo" />
        </Link>
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
      </footer>
    </div>
  );
}

export default Layout;