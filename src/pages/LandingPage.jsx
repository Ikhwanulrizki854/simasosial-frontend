import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Helper untuk format Rupiah
const formatCurrency = (number) => {
  if (!number) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    minimumFractionDigits: 0 
  }).format(number);
};

// Helper untuk hitung persentase progress
const getPercentage = (current, target) => {
  if (!target || target === 0) return 0;
  return Math.min(100, (current / target) * 100);
};


function LandingPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil data kegiatan publik (Top 6)
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://simasosial-backend.onrender.com/api/public-activities');
        if (!response.ok) throw new Error('Gagal memuat kegiatan');
        const data = await response.json();
        setActivities(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivities();
  }, []);

  return (
    <div>
      {/* Navbar Dinamis */}
      <Navbar />

      {/* Header */}
      <header className="py-5" style={{ 
        marginTop: '56px', 
        background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/gambar home.png') no-repeat center center`, 
        backgroundSize: 'cover' 
      }}>
        <div className="container text-center text-white py-5">
          <h1 
            className="display-4 fw-bold" 
            style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}
          >
            Inspirasi Beraksi, Kontribusi dari Hati untuk FST
          </h1>
          <p 
            className="lead" 
            style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)' }}
          >
            Platform kegiatan sosial mahasiswa Fakultas Sains dan Teknologi
          </p>
          
          <Link to="/kegiatan-publik" className="btn btn-warning text-white btn-lg fw-bold mt-3">
            Lihat Semua Kegiatan
          </Link>

        </div>
      </header>

      {/* Bagian Kegiatan Mendesak */}
      <section id="kegiatan" className="py-5 bg-white">
        <div className="container">
          <h2 className="text-center fw-bold mb-4" style={{ color: '#0d47a1' }}>Kegiatan Mendesak Saat Ini</h2>
          
          <div className="row">
            {loading ? (
              <div className="text-center w-100 py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Memuat kegiatan...</p>
              </div>
            ) : activities.length === 0 ? (
              <p className="text-center text-muted w-100 py-5">Belum ada kegiatan yang dipublikasikan.</p>
            ) : (
              activities.map(act => (
                <div key={act.id} className="col-lg-4 col-md-6 mb-4">
                  <div className="card shadow-sm border-0 h-100 hover-card">
                    <div className="position-relative">
                      <img 
                        src={act.gambar_url ? `https://simasosial-backend.onrender.com/${act.gambar_url}` : 'https://via.placeholder.com/400x200?text=Kegiatan'} 
                        className="card-img-top" 
                        alt={act.judul} 
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <span className={`position-absolute top-0 end-0 badge m-3 ${act.tipe === 'donasi' ? 'bg-warning text-dark' : 'bg-info text-white'}`}>
                        {act.tipe.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title fw-bold mb-1">{act.judul}</h5>
                      <p className="text-muted small mb-3">
                        <i className="bi bi-geo-alt me-1"></i> {act.lokasi || 'Online'}
                      </p>
                      
                      <div className="mt-auto">
                        {act.tipe === 'donasi' ? (
                          <div className="mb-3">
                             <div className="d-flex justify-content-between small mb-1">
                               <span>Terkumpul: <b>{formatCurrency(act.donasi_terkumpul)}</b></span>
                               <span className="text-muted">Target: {formatCurrency(act.target_donasi)}</span>
                             </div>
                             <div className="progress" style={{ height: '6px' }}>
                                <div className="progress-bar bg-warning" style={{ width: `${getPercentage(act.donasi_terkumpul, act.target_donasi)}%` }}></div>
                             </div>
                          </div>
                        ) : (
                          <div className="mb-3">
                             <div className="d-flex justify-content-between small mb-1">
                               <span>Relawan: <b>{act.peserta_terdaftar}</b></span>
                               <span className="text-muted">Kuota: {act.target_peserta}</span>
                             </div>
                             <div className="progress" style={{ height: '6px' }}>
                                <div className="progress-bar bg-info" style={{ width: `${getPercentage(act.peserta_terdaftar, act.target_peserta)}%` }}></div>
                             </div>
                          </div>
                        )}
                        
                        <Link to={`/kegiatan/${act.id}`} className="btn btn-primary w-100 fw-bold">
                          {act.tipe === 'donasi' ? 'Donasi Sekarang' : 'Daftar Sekarang'}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="text-center mt-4">
             <Link to="/kegiatan-publik" className="btn btn-outline-primary">Lihat Lebih Banyak</Link>
          </div>
        </div>
      </section>

      {/* ========================================
        FOOTER
        ========================================
      */}
      <footer className="py-5 mt-auto" style={{ backgroundColor: '#010962ff', color: '#ffffffff' }}>
        <div className="container text-center">
          <div className="row mb-4">
            
            {/* Kolom 1 */}
            <div className="col-md-4 mb-3">
              <h5 className="fw-bold text-uppercase mb-3">Tentang Kami</h5>
              <p className="small">
                Platform digital yang menghubungkan mahasiswa Fakultas Sains dan Teknologi dalam kegiatan sosial yang berdampak.
              </p>
            </div>
            
            {/* Kolom 2 */}
            <div className="col-md-4 mb-3">
              <h5 className="fw-bold text-uppercase mb-3">Kontak</h5>
              <ul className="list-unstyled small">
                <li className="mb-2"><i className="bi bi-envelope me-2"></i> simasosialfst@gmail.com</li>
                <li className="mb-2"><i className="bi bi-telephone me-2"></i> (0751) 123456</li>
                <li><i className="bi bi-geo-alt me-2"></i> UIN Imam Bonjol Padang</li>
              </ul>
            </div>
            
            {/* Kolom 3 */}
            <div className="col-md-4 mb-3">
              <h5 className="fw-bold text-uppercase mb-3">Sosial Media</h5>
              <div className="d-flex justify-content-center gap-3">
                <a href="#" className="fs-4" style={{ color: '#ffffffff' }}><i className="bi bi-instagram"></i></a>
                <a href="#" className="fs-4" style={{ color: '#ffffffff' }}><i className="bi bi-twitter"></i></a>
                <a href="#" className="fs-4" style={{ color: '#ffffffff' }}><i className="bi bi-youtube"></i></a>
              </div>
            </div>

          </div>
          
          <div className="pt-3" style={{ borderTop: '1px solid #bbdefb' }}>
            <p className="small mb-0">© 2025 SIMASOSIAL FST. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;