import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Komponen helper untuk format tanggal
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

function VerifikasiSertifikat() {
  const [kode, setKode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sertifikat, setSertifikat] = useState(null); // State untuk hasil

  const handleVerifikasi = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSertifikat(null);

    if (!kode) {
      setError('Kode unik tidak boleh kosong.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/verify-certificate/${kode}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verifikasi gagal.');
      }

      setSertifikat(data); // Simpan hasil yang valid
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Navbar Sederhana */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            SIMASOSIAL FST
          </Link>
          <div className="navbar-nav ms-auto">
            <Link to="/login" className="btn btn-warning text-white btn-sm px-3">Login/Daftar</Link>
          </div>
        </div>
      </nav>

      {/* Konten Utama */}
      <main className="container d-flex justify-content-center" style={{ minHeight: '80vh', paddingTop: '5rem' }}>
        <div className="col-12 col-md-6">
          <div className="text-center">
            <i className="bi bi-patch-check-fill" style={{ fontSize: '4rem', color: '#0d6efd' }}></i>
            <h1 className="fw-bold mt-3">Verifikasi Sertifikat Digital</h1>
            <p className="lead text-muted">
              Masukkan kode unik yang tertera pada sertifikat digital Anda untuk memverifikasi keasliannya.
            </p>
          </div>

          {/* Form Verifikasi */}
          <form onSubmit={handleVerifikasi} className="card shadow-sm border-0 my-4">
            <div className="card-body p-4">
              <div className="input-group input-group-lg">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Contoh: 8f8e5b9c-..." 
                  value={kode}
                  onChange={(e) => setKode(e.target.value)}
                />
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    'Verifikasi'
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Hasil Verifikasi */}
          {error && (
            <div className="alert alert-danger text-center">
              <h4 className="alert-heading">Verifikasi Gagal!</h4>
              <p>{error}</p>
            </div>
          )}
          
          {sertifikat && (
            <div className="alert alert-success text-center">
              <h4 className="alert-heading">Sertifikat Valid!</h4>
              <p className="mb-0">Diterbitkan untuk:</p>
              <h5 className="fw-bold">{sertifikat.nama_lengkap}</h5>
              <p className="mb-0">Atas partisipasi dalam kegiatan:</p>
              <h5 className="fw-bold">{sertifikat.nama_kegiatan}</h5>
              <hr />
              <small>Diterbitkan pada: {formatDate(sertifikat.tanggal_terbit)}</small>
            </div>
          )}

        </div>
      </main>
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

export default VerifikasiSertifikat;