import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Pengaturan() {
  const [activeTab, setActiveTab] = useState('profil');
  const navigate = useNavigate();

  // State untuk form Profil
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [telepon, setTelepon] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Ambil data profil saat ini
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:8000/api/admin/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Gagal memuat profil');
        const data = await res.json();
        setNama(data.nama_lengkap);
        setEmail(data.email);
        setTelepon(data.no_telepon || '');
      } catch (err) {
        setError(err.message);
        if (err.message.includes('Token')) navigate('/login');
      }
    };
    
    if (activeTab === 'profil') {
      fetchProfile();
    }
  }, [activeTab, navigate]);

  // Handle submit update profil
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch('http://localhost:8000/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nama_lengkap: nama,
          email: email,
          no_telepon: telepon,
          password_baru: passwordBaru || null // Kirim null jika kosong
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal update');

      setSuccess(data.message);
      setPasswordBaru(''); // Kosongkan field password
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="fw-bold mb-4">Pengaturan</h1>
      {/* Navigasi Tab */}
      <ul className="nav nav-tabs nav-fill mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link fs-5 ${activeTab === 'profil' ? 'active' : ''}`}
            onClick={() => setActiveTab('profil')}
          >
            Profil Admin
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link fs-5 ${activeTab === 'database' ? 'active' : ''}`}
            onClick={() => setActiveTab('database')}
          >
            Database
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link fs-5 ${activeTab === 'email' ? 'active' : ''}`}
            onClick={() => setActiveTab('email')}
          >
            Email
          </button>
        </li>
      </ul>

      {/* Konten Tab */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">

          {/* Tab 1: Profil Admin */}
          {activeTab === 'profil' && (
            <form onSubmit={handleProfileSubmit}>
              <h4 className="fw-bold mb-3">Informasi Profil Admin</h4>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <div className="mb-3">
                <label htmlFor="nama" className="form-label">Nama Lengkap</label>
                <input type="text" className="form-control" id="nama" value={nama} onChange={(e) => setNama(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="telepon" className="form-label">No. Telephone</label>
                <input type="tel" className="form-control" id="telepon" value={telepon} onChange={(e) => setTelepon(e.target.value)} />
              </div>
              <hr className="my-4" />
              <h5 className="fw-bold">Ganti Password</h5>
              <div className="mb-3">
                <label htmlFor="passwordBaru" className="form-label">Password Baru</label>
                <input type="password" className="form-control" id="passwordBaru" value={passwordBaru} onChange={(e) => setPasswordBaru(e.target.value)} placeholder="(Kosongkan jika tidak ingin ganti)" />
              </div>
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          )}

          {/* Tab 2: Database (Placeholder) */}
          {activeTab === 'database' && (
            <div>
              <h4 className="fw-bold mb-3">Manajemen Database</h4>
              <p>Fitur backup dan export (sesuai mockup [cite: 223]) akan dibuat di sini.</p>
              <button className="btn btn-primary me-2">Backup Database</button>
              <button className="btn btn-secondary">Export Data (CSV)</button>
            </div>
          )}

          {/* Tab 3: Email (Placeholder) */}
          {activeTab === 'email' && (
            <div>
              <h4 className="fw-bold mb-3">Konfigurasi Email</h4>
              <p>Pengaturan template email (sesuai mockup [cite: 224]) akan dibuat di sini.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Pengaturan;