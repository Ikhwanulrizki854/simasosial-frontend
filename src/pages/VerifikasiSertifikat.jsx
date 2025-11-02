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
      {/* Navbar Sederhana (mirip LandingPage) */}
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
    </div>
  );
}

export default VerifikasiSertifikat;