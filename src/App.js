import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Anasayfa from './components/Anasayfa';
import BedavaIcerikler from './components/BedavaIcerikler';
import Foto from './components/Foto';
import Video from './components/Video';
import Premium from './components/Premium';
import Payment from './components/Payment';
import Hakkimizda from './components/Hakkimizda';
import GizlilikPolitikasi from './components/GizlilikPolitikasi';
import KullanimSartlari from './components/KullanimSartlari';
import Iletisim from './components/Iletisim';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Anasayfa />} />
          <Route path="/bedava-icerikler" element={<BedavaIcerikler />} />
          <Route path="/foto" element={<Foto />} />
          <Route path="/video" element={<Video />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/hakkimizda" element={<Hakkimizda />} />
          <Route path="/gizlilik-politikasi" element={<GizlilikPolitikasi />} />
          <Route path="/kullanim-sartlari" element={<KullanimSartlari />} />
          <Route path="/iletisim" element={<Iletisim />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login/>} />

        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
