import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Fungsi helper untuk format tanggal
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Fungsi helper untuk format Rupiah
const formatCurrency = (number) => {
  if (number === 0 || !number) return '-';
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    minimumFractionDigits: 0 
  }).format(number);
};

function ManajemenKegiatan() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Tendang jika tidak ada token
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/admin/activities', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            navigate('/login');
          }
          throw new Error('Gagal mengambil data kegiatan');
        }

        const data = await response.json();
        setActivities(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchActivities();
  }, [navigate]);

  if (loading) return <div className="text-center p-5">Loading data kegiatan...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const handleDelete = async (id, judul) => {
    // Tampilkan konfirmasi
    if (!window.confirm(`Apakah Anda yakin ingin menghapus kegiatan "${judul}"? Tindakan ini tidak bisa dibatalkan.`)) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8000/api/admin/activities/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus kegiatan.');
      }

      // Jika sukses, hapus item dari state (tabel) secara lokal
      setActivities(prevActivities => prevActivities.filter(act => act.id !== id));

    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center p-5">Loading data kegiatan...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Manajemen Kegiatan</h1>
        <Link to="/admin/kegiatan/baru" className="btn btn-primary btn-lg">
          <i className="bi bi-plus-circle-fill me-2"></i>
          Tambah Kegiatan Baru
        </Link>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">Judul Kegiatan</th>
                <th scope="col">Jenis</th>
                <th scope="col">Detail (Target)</th>
                <th scope="col">Status</th>
                <th scope="col">Tanggal</th>
                <th scope="col">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {activities.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">Belum ada data kegiatan.</td>
                </tr>
              ) : (
                activities.map(act => (
                  <tr key={act.id}>
                    <td className="fw-bold">{act.judul}</td>
                    <td>
                      <span className={`badge ${act.tipe === 'donasi' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>
                        {act.tipe}
                      </span>
                    </td>
                    <td>
                      {act.tipe === 'donasi' 
                        ? formatCurrency(act.target_donasi)
                        : `${act.peserta_terdaftar}/${act.target_peserta} Peserta`
                      }
                    </td>
                    <td>
                      <span className={`badge ${act.status === 'published' ? 'bg-success' : 'bg-secondary'}`}>
                        {act.status}
                      </span>
                    </td>
                    <td>{formatDate(act.tanggal_mulai)}</td>
                    <td>
                      <Link 
                        to={`/admin/kegiatan/edit/${act.id}`} 
                        className="btn btn-sm btn-outline-secondary me-2" 
                        title="Edit"
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </Link>
                      
                      <button 
                        className="btn btn-sm btn-outline-danger" 
                        title="Hapus"
                        onClick={() => handleDelete(act.id, act.judul)}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManajemenKegiatan;