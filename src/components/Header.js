import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <nav>
        <ul className="nav-list">
          <li className={location.pathname === '/' ? 'active' : ''}>
            <Link to="/">Anasayfa</Link>
          </li>
          <li className={location.pathname === '/foto' ? 'active' : ''}>
            <Link to="/foto">Foto</Link>
          </li>
          <li className={location.pathname === '/video' ? 'active' : ''}>
            <Link to="/video">Video</Link>
          </li>
          <li className={location.pathname === '/icerik-kaldirma' ? 'active' : ''}>
            <Link to="/icerik-kaldirma">İçerik Kaldırma</Link>
          </li>
          <li className={location.pathname === '/premium' ? 'active' : ''}>
            <Link to="/premium">Premium</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;