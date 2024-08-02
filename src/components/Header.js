import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import { AuthContext } from '../context/AuthContext';
import { logout } from '../services/authService';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, setUser, setIsPremium } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    setUser(null);
    setIsPremium(false);
    navigate('/');
  };

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
          {!isAuthenticated ? (
            <>
              <li className={location.pathname === '/login' ? 'active' : ''}>
                <Link to="/login">Giriş Yap</Link>
              </li>
              <li className={location.pathname === '/register' ? 'active' : ''}>
                <Link to="/register">Kayıt Ol</Link>
              </li>
            </>
          ) : (
            <li>
              <button onClick={handleLogout}>Çıkış Yap</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;