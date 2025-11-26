import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [myActivities, setMyActivities] = useState([]); 
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Helper untuk format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal tidak tersedia';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      try {
        // Ambil data statistik
        const fetchDashboardStats = fetch('http://localhost:8000/api/dashboard-data', { headers });
        
        // Ambil daftar kegiatan terdaftar
        const fetchMyActivities = fetch('http://localhost:8000/api/my-activities', { headers });

        // Jalankan keduanya bersamaan
        const [statsRes, activitiesRes] = await Promise.all([fetchDashboardStats, fetchMyActivities]);

        if (!statsRes.ok) throw new Error('Gagal mengambil data dashboard');
        const statsData = await statsRes.json();
        setDashboardData(statsData);

        if (!activitiesRes.ok) throw new Error('Gagal mengambil data kegiatan');
        const activitiesData = await activitiesRes.json();
        setMyActivities(activitiesData); 

      } catch (err) {
        console.error(err);
        setError(err.message);
        if (err.message.includes('Token')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [navigate]);

  // Tampilkan loading dengan SPINNER
  if (!dashboardData) {
    return (
      <>
        <Navbar />
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
           <div className="text-center">
              <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Memuat data dashboard...</p>
           </div>
        </div>
      </>
    );
  }
  
  // Tampilkan error jika ada
  if (error) {
    return (
      <>
        <Navbar />
        <div className="alert alert-danger">{error}</div>
      </>
    );
  }

  return (
    <div style={{ backgroundColor: '#f0f4f9', minHeight: '100vh' }}>
      
      {/* Navbar Dinamis */}
      <Navbar />

      <main className="container py-5">
        
        {/* Kartu Selamat Datang */}
        <div className="card text-white border-0 mb-4" style={{ backgroundColor: '#0d47a1' }}>
          <div className="card-body p-4">
            <h2 className="fw-bold">Selamat Datang Kembali, {dashboardData.nama}!</h2>
            <p>Mari lanjutkan kontribusi Anda hari ini.</p>
          </div>
        </div>

        {/* Grid Statistik */}
        <div className="row">
          {/* Total Kegiatan */}
          <div className="col-md-3 mb-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body d-flex align-items-center">
                <i className="bi bi-calendar-event fs-1 text-primary me-3"></i>
                <div>
                  <h5 className="card-title text-muted">Total Kegiatan</h5>
                  <h2 className="fw-bold">{dashboardData.totalKegiatan}</h2>
                </div>
              </div>
            </div>
          </div>
          {/* Jam Kontribusi */}
          <div className="col-md-3 mb-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body d-flex align-items-center">
                <i className="bi bi-clock-history fs-1 text-success me-3"></i>
                <div>
                  <h5 className="card-title text-muted">Jam Kontribusi</h5>
                  <h2 className="fw-bold">{dashboardData.jamKontribusi}</h2> 
                </div>
              </div>
            </div>
          </div>
          {/* Total Donasi */}
          <div className="col-md-3 mb-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body d-flex align-items-center">
                <i className="bi bi-cash-coin fs-1 text-danger me-3"></i>
                <div>
                  <h5 className="card-title text-muted">Total Donasi</h5>
                  <h2 className="fw-bold">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(dashboardData.totalDonasi)}
                  </h2>
                </div>
              </div>
            </div>
          </div>
          {/* Sertifikat */}
          <div className="col-md-3 mb-4">
            <Link to="/sertifikat-saya" className="text-decoration-none">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body d-flex align-items-center">
                  <i className="bi bi-patch-check-fill fs-1 text-warning me-3"></i>
                  <div>
                    <h5 className="card-title text-muted">Sertifikat</h5>
                    <h2 className="fw-bold text-dark">{dashboardData.sertifikat}</h2>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Aktivitas & Kegiatan Terdaftar */}
        <div className="row">
          {/* Aktivitas Berikutnya */}
          <div className="col-md-5 mb-4">
            <div className="card shadow-sm border-0 bg-warning h-100">
              <div className="card-body text-dark p-4">
                <h4 className="fw-bold"><i className="bi bi-bell-fill me-2"></i> Aktivitas Anda Berikutnya</h4>
                
                {dashboardData.nextActivity ? (
                  <div className="bg-light p-3 rounded mt-3">
                    <h5 className="fw-bold">{dashboardData.nextActivity.judul}</h5>
                    <p className="mb-0">
                      <i className="bi bi-calendar-fill me-2"></i> 
                      {formatDate(dashboardData.nextActivity.tanggal_mulai)}
                    </p>
                    <p className="mb-0">
                      <i className="bi bi-geo-alt-fill me-2"></i> 
                      {dashboardData.nextActivity.lokasi || 'Lokasi belum diatur'}
                    </p>
                  </div>
                ) : (
                  <div className="bg-light p-3 rounded mt-3">
                    <h5 className="fw-bold">Tidak ada aktivitas terdekat.</h5>
                    <p className="mb-0">Cek halaman kegiatan untuk mendaftar!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Kegiatan Terdaftar */}
          <div className="col-md-7 mb-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-3">Kegiatan Terdaftar</h4>
                
                {myActivities.length === 0 ? (
                  <p className="text-muted">Anda belum terdaftar di kegiatan apapun.</p>
                ) : (
                  myActivities.map(activity => (
                    <div key={activity.id} className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h5 className="fw-bold mb-0">{activity.judul}</h5>
                        <small className="text-muted">
                          {formatDate(activity.tanggal_mulai)} | 
                          <span className={activity.tipe === 'donasi' ? 'text-success' : 'text-info'}>
                            {activity.tipe === 'donasi' ? ' Donasi' : ' Volunteer'}
                          </span>
                        </small>
                      </div>
                      <Link to={`/kegiatan/${activity.id}`} className="btn btn-outline-primary btn-sm">Detail</Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
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

export default Dashboard;