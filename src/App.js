import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Anasayfa from './components/Anasayfa';
import BedavaIcerikler from './components/BedavaIcerikler';
import Foto from './components/Foto';
import Video from './components/Video';
import Premium from './components/Premium';
import Payment from './components/Payment';

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
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
