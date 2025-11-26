import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';

function ProfilSaya() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [telepon, setTelepon] = useState('');
  const [nim, setNim] = useState(''); // Read only
  const [jurusan, setJurusan] = useState(''); // Read only
  const [passwordBaru, setPasswordBaru] = useState('');
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:8000/api/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Gagal memuat profil');
        const data = await res.json();
        
        setNama(data.nama_lengkap);
        setEmail(data.email);
        setTelepon(data.no_telepon || '');
        setNim(data.nim);
        setJurusan(data.jurusan);
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch('http://localhost:8000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nama_lengkap: nama,
          email: email,
          no_telepon: telepon,
          password_baru: passwordBaru || null
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      Swal.fire('Sukses', data.message, 'success');
      setPasswordBaru(''); // Reset password field
    } catch (err) {
      Swal.fire('Gagal', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f0f4f9', minHeight: '100vh' }}>
      <Navbar />
      
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm border-0">
              <div className="card-body p-5">
                <h2 className="fw-bold mb-4 text-center">Profil Saya</h2>
                
                <form onSubmit={handleSubmit}>
                  {/* Data Tidak Bisa Di Edit */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                       <label className="form-label text-muted small">NIM</label>
                       <input type="text" className="form-control bg-light" value={nim} disabled />
                    </div>
                    <div className="col-md-6">
                       <label className="form-label text-muted small">Jurusan</label>
                       <input type="text" className="form-control bg-light" value={jurusan} disabled />
                    </div>
                  </div>

                  <hr className="my-4"/>

                  {/* Data Bisa Diedit */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Nama Lengkap</label>
                    <input type="text" className="form-control" value={nama} onChange={(e) => setNama(e.target.value)} required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Email</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">No. WhatsApp / Telepon</label>
                    <input type="text" className="form-control" value={telepon} onChange={(e) => setTelepon(e.target.value)} placeholder="08xxxxxxxx" />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold">Ganti Password (Opsional)</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      value={passwordBaru} 
                      onChange={(e) => setPasswordBaru(e.target.value)} 
                      placeholder="Kosongkan jika tidak ingin mengganti password" 
                    />
                  </div>

                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                      {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
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

export default ProfilSaya;