import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Helper Format Rupiah
const formatCurrency = (number) => {
  if (!number) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

// Helper Format Tanggal
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }

      try {
        const response = await fetch('http://localhost:8000/api/admin/dashboard-stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Gagal mengambil data statistik');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error(err);
        // Swal.fire('Error', 'Gagal memuat dashboard', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  if (loading) return <div className="p-5 text-center">Loading Dashboard...</div>;
  if (!stats) return <div className="p-5 text-center text-danger">Gagal memuat data.</div>;

  return (
    <div>
      <h2 className="fw-bold mb-4">Dashboard Admin</h2>

      {/* KARTU STATISTIK */}
      <div className="row mb-4">
        
        {/* Total Kegiatan */}
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100 border-start border-4 border-primary">
            <div className="card-body">
              <div className="text-muted small text-uppercase fw-bold">Kegiatan Aktif</div>
              <div className="fs-2 fw-bold text-primary">{stats.totalKegiatan}</div>
              <div className="small text-muted">Program sedang berjalan</div>
            </div>
          </div>
        </div>

        {/* Total Mahasiswa */}
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100 border-start border-4 border-success">
            <div className="card-body">
              <div className="text-muted small text-uppercase fw-bold">Total Relawan</div>
              <div className="fs-2 fw-bold text-success">{stats.totalUser}</div>
              <div className="small text-muted">Mahasiswa terdaftar</div>
            </div>
          </div>
        </div>

        {/* Donasi Pending */}
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100 border-start border-4 border-warning">
            <div className="card-body">
              <div className="text-muted small text-uppercase fw-bold">Donasi Pending</div>
              <div className="fs-2 fw-bold text-warning">{stats.donasiPending}</div>
              <div className="small text-muted">Menunggu pembayaran</div>
            </div>
          </div>
        </div>

        {/* Total Uang Donasi */}
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100 border-start border-4 border-info">
            <div className="card-body">
              <div className="text-muted small text-uppercase fw-bold">Total Donasi</div>
              <div className="fs-3 fw-bold text-info">{formatCurrency(stats.totalUangDonasi)}</div>
              <div className="small text-muted">Dana terkumpul (Verified)</div>
            </div>
          </div>
        </div>
      </div>

      {/* TABEL DONASI TERBARU */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 fw-bold">Transaksi Donasi Terbaru</h5>
        </div>
        <div className="card-body p-0">
          <table className="table table-striped mb-0">
            <thead className="table-light">
              <tr>
                <th>Donatur</th>
                <th>Kegiatan</th>
                <th>Jumlah</th>
                <th>Status</th>
                <th>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {stats.donasiTerbaru.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-3">Belum ada transaksi.</td></tr>
              ) : (
                stats.donasiTerbaru.map(donasi => (
                  <tr key={donasi.id}>
                    <td className="fw-bold">{donasi.nama_lengkap}</td>
                    <td><small>{donasi.nama_kegiatan}</small></td>
                    <td>{formatCurrency(donasi.jumlah)}</td>
                    <td>
                      <span className={`badge ${
                        donasi.status_donasi === 'terverifikasi' ? 'bg-success' : 
                        donasi.status_donasi === 'pending' ? 'bg-warning text-dark' : 'bg-danger'
                      }`}>
                        {donasi.status_donasi}
                      </span>
                    </td>
                    <td className="small text-muted">{formatDate(donasi.tanggal_donasi)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="card-footer bg-white text-center">
          <small className="text-muted">Menampilkan 5 transaksi terakhir</small>
        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;