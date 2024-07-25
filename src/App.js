import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Anasayfa from './components/Anasayfa';
import Foto from './components/Foto';
import Video from './components/Video';
import IcerikKaldirma from './components/IcerikKaldirma';
import Premium from './components/Premium';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Anasayfa />} />
          <Route path="/foto" element={<Foto />} />
          <Route path="/video" element={<Video />} />
          <Route path="/icerik-kaldirma" element={<IcerikKaldirma />} />
          <Route path="/premium" element={<Premium />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;