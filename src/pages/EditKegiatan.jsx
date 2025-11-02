import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

function EditKegiatan() {
  // Ambil ID dari URL
  const { id: activityId } = useParams();
  const navigate = useNavigate();

  // State untuk Tab
  const [activeTab, setActiveTab] = useState('detail'); // 'detail' atau 'peserta'
  
  // State untuk Form Edit (Tab 1)
  const [judul, setJudul] = useState('');
  const [tipe, setTipe] = useState('donasi');
  const [deskripsi, setDeskripsi] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [targetDonasi, setTargetDonasi] = useState(0);
  const [targetPeserta, setTargetPeserta] = useState(0);
  const [gambar, setGambar] = useState(null); // File gambar baru
  const [gambarLama, setGambarLama] = useState(''); // URL gambar lama

  // State untuk Peserta (Tab 2)
  const [participants, setParticipants] = useState([]);
  const [loadingPeserta, setLoadingPeserta] = useState(false);

  // State global (untuk loading & pesan)
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Fungsi untuk mengambil data utama kegiatan (Form Edit)
  const fetchActivityDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/activities/${activityId}`);
      if (!response.ok) throw new Error('Gagal mengambil data kegiatan.');
      const data = await response.json();
      
      setJudul(data.judul);
      setTipe(data.tipe);
      setDeskripsi(data.deskripsi || '');
      setLokasi(data.lokasi || '');
      setTanggalMulai(data.tanggal_mulai ? new Date(data.tanggal_mulai).toISOString().split('T')[0] : '');
      setTargetDonasi(data.target_donasi || 0);
      setTargetPeserta(data.target_peserta || 0);
      setGambarLama(data.gambar_url || '');

    } catch (err) {
      setError(err.message);
    }
  };

  // Fungsi untuk mengambil data peserta
  const fetchParticipants = async () => {
    setLoadingPeserta(true);
    setError(''); // Bersihkan error lama
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:8000/api/admin/activities/${activityId}/participants`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Gagal memuat peserta');
      const data = await res.json();
      setParticipants(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingPeserta(false);
    }
  };

  // useEffect utama untuk memuat data berdasarkan tab
  useEffect(() => {
    if (activeTab === 'detail') {
      fetchActivityDetails();
    } else if (activeTab === 'peserta') {
      fetchParticipants();
    }
  }, [activityId, activeTab]); // Dijalankan ulang jika ID atau tab berubah

  // Handler untuk perubahan file gambar
  const handleFileChange = (e) => {
    setGambar(e.target.files[0]);
  };

  // Handler untuk submit form edit (Tab 1)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('tipe', tipe);
    formData.append('deskripsi', deskripsi);
    formData.append('lokasi', lokasi);
    formData.append('tanggal_mulai', tanggalMulai);
    formData.append('target_donasi', tipe === 'donasi' ? targetDonasi : 0);
    formData.append('target_peserta', tipe === 'volunteer' ? targetPeserta : 0);
    
    if (gambar) {
      formData.append('gambar', gambar); // Kirim gambar baru jika ada
    }

    try {
      const response = await fetch(`http://localhost:8000/api/admin/activities/${activityId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengupdate data.');
      }
      
      setLoading(false);
      setSuccess('Data kegiatan berhasil diupdate!');
      // Opsional: kembali ke halaman manajemen setelah bbrp detik
      setTimeout(() => {
        navigate('/admin/manajemen-kegiatan');
      }, 1500);

    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  // Handler untuk update status kehadiran (Tab 2)
  const handleStatusChange = async (registration_id, newStatus) => {
    const token = localStorage.getItem('token');
    setError('');
    try {
      const res = await fetch(`http://localhost:8000/api/admin/participants/${registration_id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newStatus })
      });
      if (!res.ok) throw new Error('Gagal update status');
      
      setParticipants(prev => 
        prev.map(p => 
          p.registration_id === registration_id ? { ...p, status_kehadiran: newStatus } : p
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Handler untuk TERBITKAN SERTIFIKAT (Tab 2)
  const handleGenerateCertificates = async () => {
    if (!window.confirm('Anda yakin ingin menerbitkan sertifikat untuk semua peserta yang ditandai "Hadir"? (Peserta yang sudah punya tidak akan dibuatkan lagi)')) {
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:8000/api/admin/activities/${activityId}/generate-certificates`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal menerbitkan sertifikat.');
      
      setSuccess(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="fw-bold mb-4">Edit Kegiatan: {judul}</h1>
      
      <ul className="nav nav-tabs nav-fill mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link fs-5 ${activeTab === 'detail' ? 'active' : ''}`}
            onClick={() => setActiveTab('detail')}
          >
            Detail Kegiatan
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link fs-5 ${activeTab === 'peserta' ? 'active' : ''}`}
            onClick={() => setActiveTab('peserta')}
          >
            Peserta & Sertifikat
          </button>
        </li>
      </ul>

      {error && <div className="alert alert-danger" onClick={() => setError('')}>{error} (klik untuk tutup)</div>}
      {success && <div className="alert alert-success" onClick={() => setSuccess('')}>{success} (klik untuk tutup)</div>}

      <div className="card shadow-sm border-0">
        <div className="card-body p-4">

          {/* =======================
              TAB 1: FORM EDIT DETAIL
              ======================= */}
          {activeTab === 'detail' && (
            <form onSubmit={handleEditSubmit}>
              
              <div className="mb-3">
                <label htmlFor="judul" className="form-label fw-bold">Judul Kegiatan*</label>
                <input type="text" className="form-control" id="judul" value={judul} onChange={(e) => setJudul(e.target.value)} required />
              </div>

              <div className="mb-3">
                <label htmlFor="tipe" className="form-label fw-bold">Jenis Kegiatan*</label>
                <select className="form-select" id="tipe" value={tipe} onChange={(e) => setTipe(e.target.value)} required>
                  <option value="donasi">Donasi</option>
                  <option value="volunteer">Volunteer</option>
                </select>
              </div>
              
              <div className="mb-3">
                <label htmlFor="deskripsi" className="form-label fw-bold">Deskripsi</label>
                <textarea className="form-control" id="deskripsi" rows="5" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)}></textarea>
              </div>

              {gambarLama && !gambar && (
                <div className="mb-3">
                  <label className="form-label fw-bold">Gambar Saat Ini:</label>
                  <img src={`http://localhost:8000/${gambarLama}`} alt="Gambar Lama" style={{ width: '200px', display: 'block', borderRadius: '8px' }} />
                </div>
              )}
              
              <div className="mb-3">
                <label htmlFor="gambar" className="form-label fw-bold">Upload Gambar Baru (Opsional)</label>
                <input type="file" className="form-control" id="gambar" onChange={handleFileChange} />
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="lokasi" className="form-label fw-bold">Lokasi</label>
                  <input type="text" className="form-control" id="lokasi" value={lokasi} onChange={(e) => setLokasi(e.target.value)} />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="tanggalMulai" className="form-label fw-bold">Tanggal Mulai*</label>
                  <input type="date" className="form-control" id="tanggalMulai" value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)} required />
                </div>
              </div>
              
              {tipe === 'donasi' ? (
                <div className="mb-3">
                  <label htmlFor="targetDonasi" className="form-label fw-bold">Target Dana (Rp)</label>
                  <input type="number" className="form-control" id="targetDonasi" value={targetDonasi} onChange={(e) => setTargetDonasi(e.target.value)} />
                </div>
              ) : (
                <div className="mb-3">
                  <label htmlFor="targetPeserta" className="form-label fw-bold">Target Peserta</label>
                  <input type="number" className="form-control" id="targetPeserta" value={targetPeserta} onChange={(e) => setTargetPeserta(e.target.value)} />
                </div>
              )}
              
              <div className="d-flex justify-content-end">
                <Link to="/admin/manajemen-kegiatan" className="btn btn-outline-secondary me-2">
                  Batal
                </Link>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          )}

          {/* ===============================
              TAB 2: PESERTA & SERTIFIKAT
              =============================== */}
          {activeTab === 'peserta' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold">Daftar Peserta</h4>
                <button 
                  className="btn btn-success" 
                  onClick={handleGenerateCertificates}
                  disabled={loading}
                >
                  <i className="bi bi-patch-check-fill me-2"></i>
                  {loading ? 'Memproses...' : 'Terbitkan Sertifikat (untuk yg Hadir)'}
                </button>
              </div>

              {loadingPeserta ? (
                <p>Loading peserta...</p>
              ) : (
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Nama Peserta</th>
                      <th>NIM</th>
                      <th>Email</th>
                      <th>Status Kehadiran</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.length === 0 ? (
                      <tr><td colSpan="4" className="text-center text-muted">Belum ada peserta terdaftar.</td></tr>
                    ) : (
                      participants.map(p => (
                        <tr key={p.registration_id}>
                          <td className="fw-bold">{p.nama_lengkap}</td>
                          <td>{p.nim}</td>
                          <td>{p.email}</td>
                          <td>
                            <select 
                              className="form-select form-select-sm"
                              value={p.status_kehadiran}
                              onChange={(e) => handleStatusChange(p.registration_id, e.target.value)}
                            >
                              <option value="terdaftar">Terdaftar</option>
                              <option value="hadir">Hadir</option>
                              <option value="absen">Absen</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditKegiatan;