import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import './Layout.css';

function Layout({ children }) {
  const location = useLocation();
  const { isAuthenticated, logout, isPremium, loading } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo-link">
            <img src="/images/nudecenneti.png" alt="Nude Cenneti Logo" className="logo" />
          </Link>
          <nav className="nav">
            <ul>
              <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Ana Sayfa</Link></li>
              <li><Link to="/foto" className={location.pathname === '/foto' ? 'active' : ''}>Fotoğraflar</Link></li>
              <li><Link to="/video" className={location.pathname === '/video' ? 'active' : ''}>Videolar</Link></li>
              <li><Link to="/premium" className="premium-link">Premium</Link></li>
              {!isAuthenticated ? (
                <>
                  <li><Link to="/register" className="auth-link">Kayıt Ol</Link></li>
                  <li><Link to="/login" className="auth-link">Giriş</Link></li>
                </>
              ) : (
                <>
                  <li><span className="user-status">{isPremium ? 'PREMIUM ÜYE' : ''}</span></li>
                  <li><button onClick={handleLogout} className="auth-link logout-button">Çıkış Yap</button></li>
                </>
              )}
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