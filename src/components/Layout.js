import React from 'react';
import Header from './Header';

function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <p>&copy; 2024 Your App Name. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Layout;