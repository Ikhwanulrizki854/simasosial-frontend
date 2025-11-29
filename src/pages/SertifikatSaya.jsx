import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function SertifikatSaya() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCertificates = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('https://simasosial-backend.onrender.com/api/my-certificates', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setCertificates(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [navigate]);

  // Helper format tanggal
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <div style={{ backgroundColor: '#f0f4f9', minHeight: '100vh' }}>
      <Navbar />
      
      <div className="container py-5">
        <h2 className="fw-bold mb-4">Sertifikat Saya</h2>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : certificates.length === 0 ? (
          <div className="alert alert-info">Anda belum memiliki sertifikat.</div>
        ) : (
          <div className="row">
            {certificates.map((cert) => (
              <div key={cert.id} className="col-md-6 mb-4">
                <div className="card shadow-sm border-0">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="fw-bold mb-1">{cert.nama_kegiatan}</h5>
                      <p className="text-muted mb-0 small">
                        Terbit: {formatDate(cert.tanggal_terbit)}
                      </p>
                      <span className="badge bg-success mt-2">Terverifikasi</span>
                    </div>
                    
                    {/* Tombol Lihat Sertifikat */}
                    <Link 
                      to={`/sertifikat/view/${cert.kode_unik}`} 
                      className="btn btn-primary"
                    >
                      <i className="bi bi-file-earmark-pdf me-2"></i>
                      Lihat & Download
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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

export default SertifikatSaya;