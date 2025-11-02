import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [myActivities, setMyActivities] = useState([]); 
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
        const fetchDashboardStats = fetch('http://localhost:8000/api/dashboard-data', { headers });
        const fetchMyActivities = fetch('http://localhost:8000/api/my-activities', { headers });

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

  const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal tidak tersedia';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!dashboardData) {
    return <div className="text-center p-5">Loading data dashboard...</div>;
  }

  return (
    <div style={{ backgroundColor: '#f0f4f9' }}>
      
      <nav className="navbar navbar-light bg-white shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">
            SIMASOSIAL FST
          </a>
          <div className="d-flex">
            <button className="btn btn-link text-dark fs-5">
              <i className="bi bi-bell-fill"></i>
            </button>
            <button className="btn btn-link text-dark fs-5 ms-2">
              <i className="bi bi-person-circle"></i>
            </button>
          </div>
        </div>
      </nav>

      <main className="container py-5">
        
        <div className="card text-white border-0 mb-4" style={{ backgroundColor: '#0d47a1' }}>
          <div className="card-body p-4">
            <h2 className="fw-bold">Selamat Datang Kembali, {dashboardData.nama}!</h2>
            <p>Mari lanjutkan kontribusi Anda hari ini.</p>
          </div>
        </div>

        <div className="row">
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
          <div className="col-md-3 mb-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body d-flex align-items-center">
                <i className="bi bi-patch-check-fill fs-1 text-warning me-3"></i>
                <div>
                  <h5 className="card-title text-muted">Sertifikat</h5>
                  <h2 className="fw-bold">{dashboardData.sertifikat}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-5 mb-4">
            <div className="card shadow-sm border-0 bg-warning">
              <div className="card-body text-dark p-4">
                <h4 className="fw-bold"><i className="bi bi-bell-fill me-2"></i> Aktivitas Anda Berikutnya</h4>
                <div className="bg-light p-3 rounded mt-3">
                  <h5 className="fw-bold">FST Clean Up Day</h5>
                  <p className="mb-0"><i className="bi bi-calendar-fill me-2"></i> 30 Oktober 2025</p>
                  <p className="mb-0"><i className="bi bi-clock-fill me-2"></i> 08:00 WIB</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-7 mb-4">
            <div className="card shadow-sm border-0">
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

      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container text-center">
          <p className="text-white-50 small mb-0">
            © 2025 SIMASOSIAL FST. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;