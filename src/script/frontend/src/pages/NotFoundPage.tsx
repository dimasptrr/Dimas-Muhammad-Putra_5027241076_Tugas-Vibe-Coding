// frontend/src/pages/NotFoundPage.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>404 - Halaman Tidak Ditemukan</h2>
      <p>Alamat yang Anda cari tidak ada.</p>
      {/* Link ke halaman utama */}
      <Link to="/">Kembali ke Dashboard</Link>
    </div>
  );
};

// WAJIB ADA untuk mengatasi error ts(1192) di main.tsx
export default NotFoundPage;