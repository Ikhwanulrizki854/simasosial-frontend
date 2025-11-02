import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function ActivityDetail() {
  const { id } = useParams(); 
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/activities/${id}`);
        
        if (!response.ok) {
          throw new Error('Kegiatan tidak ditemukan');
        }
        
        const data = await response.json();
        setActivity(data);
        setLoading(false);

      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id]); 

  if (loading) return <div className="p-5 text-center">Loading kegiatan...</div>;
  if (error) return <div className="p-5 alert alert-danger">{error}</div>;
  if (!activity) return <div className="p-5 text-center">Kegiatan tidak ditemukan.</div>;

  return (
    <div>
      <nav className="navbar navbar-light bg-white shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/dashboard">
            ← Kembali ke Dashboard
          </Link>
          <span className="navbar-text">
            Detail Kegiatan
          </span>
        </div>
      </nav>

      <main className="container py-5">
        <div className="row mb-4">
          <div className="col-12">
            <img 
              src={activity.gambar_url || 'https://via.placeholder.com/1200x400?text=Gambar+Kegiatan'} 
              className="img-fluid rounded" 
              alt={activity.judul} 
              style={{ width: '100%', height: '400px', objectFit: 'cover' }} 
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            <span className={`badge ${activity.tipe === 'donasi' ? 'bg-warning' : 'bg-info'} mb-2`}>
              {activity.tipe === 'donasi' ? 'Donasi' : 'Volunteer'}
            </span>
            <h1 className="fw-bold">{activity.judul}</h1>
            <p className="lead text-muted">{activity.lokasi || 'Lokasi tidak ditentukan'}</p>
            
            <hr className="my-4" />
            
            <h4 className="fw-bold">Deskripsi</h4>
            <p>{activity.deskripsi || 'Tidak ada deskripsi untuk kegiatan ini.'}</p>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body">
                {activity.tipe === 'donasi' ? (
                  <div>
                    <h5 className="fw-bold">Donasi</h5>
                    <p className="text-muted">Terkumpul {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(activity.donasi_terkumpul)}</p>
                    <div className="progress mb-3">
                      <div className="progress-bar bg-warning" style={{ width: `${(activity.donasi_terkumpul / activity.target_donasi) * 100}%` }}></div>
                    </div>
                    <button className="btn btn-warning text-white w-100 fw-bold">Donasi Sekarang</button>
                  </div>
                ) : (
                  <div>
                    <h5 className="fw-bold">Relawan</h5>
                    <p className="text-muted">{activity.peserta_terdaftar} / {activity.target_peserta || '∞'} Peserta</p>
                    <div className="progress mb-3">
                      <div className="progress-bar bg-info" style={{ width: `${(activity.peserta_terdaftar / activity.target_peserta) * 100}%` }}></div>
                    </div>
                    <button className="btn btn-info text-white w-100 fw-bold">Daftar Sekarang</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ActivityDetail;