import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const formatCurrency = (number) => {
  if (!number) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

const getPercentage = (current, target) => {
  if (!target || target === 0) return 0;
  return Math.min(100, (current / target) * 100);
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
};

function KatalogKegiatan() {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipe, setFilterTipe] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('https://simasosial-backend.onrender.com/api/all-activities');
        if (!response.ok) throw new Error('Gagal memuat kegiatan');
        const data = await response.json();
        setActivities(data);
        setFilteredActivities(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  // Logika Filter
  useEffect(() => {
    const results = activities.filter(act => {
      const matchSearch = act.judul.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTipe = filterTipe ? act.tipe === filterTipe : true;
      return matchSearch && matchTipe;
    });
    setFilteredActivities(results);
  }, [searchTerm, filterTipe, activities]);

  return (
    <div style={{ backgroundColor: '#f0f4f9', minHeight: '100vh' }}>
      <Navbar />
      
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="fw-bold display-5">Daftar Kegiatan</h1>
          <p className="text-muted lead">Temukan kegiatan sosial yang sesuai dengan minat Anda.</p>
        </div>

        {/* Filter Bar */}
        <div className="row justify-content-center mb-5">
          <div className="col-md-8">
            <div className="card border-0 shadow-sm p-2">
              <div className="row g-2">
                <div className="col-md-8">
                   <input 
                    type="text" 
                    className="form-control form-control-lg border-0" 
                    placeholder="Cari kegiatan..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>
                <div className="col-md-4">
                   <select 
                    className="form-select form-select-lg border-0 bg-light"
                    value={filterTipe}
                    onChange={(e) => setFilterTipe(e.target.value)}
                   >
                     <option value="">Semua Jenis</option>
                     <option value="donasi">Donasi</option>
                     <option value="volunteer">Volunteer</option>
                   </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* List Kegiatan */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Memuat kegiatan...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-search fs-1 text-muted"></i>
            <h3 className="mt-3 text-muted">Tidak ada kegiatan ditemukan.</h3>
          </div>
        ) : (
          <div className="row">
            {filteredActivities.map(act => (
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
                      <i className="bi bi-calendar-event me-1"></i> {formatDate(act.tanggal_mulai)}
                      <span className="mx-2">•</span>
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
                      
                      <Link to={`/kegiatan/${act.id}`} className="btn btn-outline-primary w-100 fw-bold">
                        Lihat Detail
                      </Link>
                    </div>
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

export default KatalogKegiatan;