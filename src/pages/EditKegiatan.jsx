import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2'; // Opsional, jika tidak ada pakai alert biasa

function EditKegiatan() {
  const { id: activityId } = useParams();
  const navigate = useNavigate();

  // State Form
  const [activeTab, setActiveTab] = useState('detail');
  const [judul, setJudul] = useState('');
  const [tipe, setTipe] = useState('donasi');
  const [deskripsi, setDeskripsi] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [targetDonasi, setTargetDonasi] = useState(0);
  const [targetPeserta, setTargetPeserta] = useState(0);
  const [jamKontribusi, setJamKontribusi] = useState(0);
  const [gambar, setGambar] = useState(null);
  const [gambarLama, setGambarLama] = useState('');

  // State Peserta
  const [participants, setParticipants] = useState([]);
  const [loadingPeserta, setLoadingPeserta] = useState(false);
  const [exportingPeserta, setExportingPeserta] = useState(false); // State tombol export

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch Detail Kegiatan
  const fetchActivityDetails = async () => {
    try {
      const response = await fetch(`https://simasosial-backend.onrender.com/api/activities/${activityId}`);
      if (!response.ok) throw new Error('Gagal mengambil data kegiatan.');
      const data = await response.json();
      
      setJudul(data.judul);
      setTipe(data.tipe);
      setDeskripsi(data.deskripsi || '');
      setLokasi(data.lokasi || '');
      setTanggalMulai(data.tanggal_mulai ? new Date(data.tanggal_mulai).toISOString().split('T')[0] : '');
      setTargetDonasi(data.target_donasi || 0);
      setTargetPeserta(data.target_peserta || 0);
      setJamKontribusi(data.jam_kontribusi || 0);
      setGambarLama(data.gambar_url || '');
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch Daftar Peserta
  const fetchParticipants = async () => {
    setLoadingPeserta(true);
    setError('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`https://simasosial-backend.onrender.com/api/admin/activities/${activityId}/participants`, {
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

  useEffect(() => {
    if (activeTab === 'detail') fetchActivityDetails();
    else if (activeTab === 'peserta') fetchParticipants();
  }, [activityId, activeTab]);

  const handleFileChange = (e) => setGambar(e.target.files[0]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('tipe', tipe);
    formData.append('deskripsi', deskripsi);
    formData.append('lokasi', lokasi);
    formData.append('tanggal_mulai', tanggalMulai);
    formData.append('target_donasi', tipe === 'donasi' ? targetDonasi : 0);
    formData.append('target_peserta', tipe === 'volunteer' ? targetPeserta : 0);
    formData.append('jam_kontribusi', jamKontribusi);
    if (gambar) formData.append('gambar', gambar);

    try {
      const response = await fetch(`https://simasosial-backend.onrender.com/api/admin/activities/${activityId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (!response.ok) throw new Error('Gagal update');
      
      alert('Berhasil diupdate!'); // Ganti dengan Swal jika sudah install
      setTimeout(() => navigate('/admin/manajemen-kegiatan'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (registration_id, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`https://simasosial-backend.onrender.com/api/admin/participants/${registration_id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ newStatus })
      });
      setParticipants(prev => prev.map(p => p.registration_id === registration_id ? { ...p, status_kehadiran: newStatus } : p));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGenerateCertificates = async () => {
    if (!window.confirm('Terbitkan sertifikat untuk peserta yang Hadir?')) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`https://simasosial-backend.onrender.com/api/admin/activities/${activityId}/generate-certificates`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert(data.message);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- FUNGSI EXPORT EXCEL PESERTA (DIPERBAIKI) ---
  const handleExportExcelParticipants = async () => {
    setExportingPeserta(true);
    const token = localStorage.getItem('token');
    try {
      // Memanggil endpoint Excel yang baru dibuat di server.js
      const response = await fetch(`https://simasosial-backend.onrender.com/api/admin/activities/${activityId}/export-participants-excel`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Gagal export Excel');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Peserta_Kegiatan_${activityId}.xlsx`); // File Excel
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert('Gagal Export: ' + err.message);
    } finally {
      setExportingPeserta(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Edit Kegiatan</h1>
        <Link to="/admin/manajemen-kegiatan" className="btn btn-outline-secondary">Kembali</Link>
      </div>
      
      <ul className="nav nav-tabs nav-fill mb-4">
        <li className="nav-item">
          <button className={`nav-link fs-5 ${activeTab === 'detail' ? 'active' : ''}`} onClick={() => setActiveTab('detail')}>Detail Kegiatan</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link fs-5 ${activeTab === 'peserta' ? 'active' : ''}`} onClick={() => setActiveTab('peserta')}>Peserta & Sertifikat</button>
        </li>
      </ul>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          
          {activeTab === 'detail' && (
            <form onSubmit={handleEditSubmit}>
              <div className="mb-3"><label className="fw-bold">Judul</label><input type="text" className="form-control" value={judul} onChange={e => setJudul(e.target.value)} required /></div>
              <div className="mb-3"><label className="fw-bold">Tipe</label><select className="form-select" value={tipe} onChange={e => setTipe(e.target.value)}><option value="donasi">Donasi</option><option value="volunteer">Volunteer</option></select></div>
              <div className="mb-3"><label className="fw-bold">Deskripsi</label><textarea className="form-control" rows="4" value={deskripsi} onChange={e => setDeskripsi(e.target.value)}></textarea></div>
              <div className="row">
                <div className="col-md-6 mb-3"><label className="fw-bold">Lokasi</label><input type="text" className="form-control" value={lokasi} onChange={e => setLokasi(e.target.value)} /></div>
                <div className="col-md-6 mb-3"><label className="fw-bold">Tanggal</label><input type="date" className="form-control" value={tanggalMulai} onChange={e => setTanggalMulai(e.target.value)} required /></div>
              </div>
              {tipe === 'donasi' ? (
                <div className="mb-3"><label className="fw-bold">Target Dana</label><input type="number" className="form-control" value={targetDonasi} onChange={e => setTargetDonasi(e.target.value)} /></div>
              ) : (
                <div className="row">
                  <div className="col-md-6 mb-3"><label className="fw-bold">Target Peserta</label><input type="number" className="form-control" value={targetPeserta} onChange={e => setTargetPeserta(e.target.value)} /></div>
                  <div className="col-md-6 mb-3"><label className="fw-bold">Jam Kontribusi</label><input type="number" step="0.5" className="form-control" value={jamKontribusi} onChange={e => setJamKontribusi(e.target.value)} /></div>
                </div>
              )}
              <div className="mb-3"><label className="fw-bold">Gambar Baru</label><input type="file" className="form-control" onChange={handleFileChange} /></div>
              <button type="submit" className="btn btn-primary float-end" disabled={loading}>Simpan Perubahan</button>
            </form>
          )}

          {activeTab === 'peserta' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold">Daftar Peserta</h4>
                <div>
                  {/* TOMBOL EXPORT EXCEL (HIJAU) */}
                  <button className="btn btn-success me-2" onClick={handleExportExcelParticipants} disabled={exportingPeserta || participants.length === 0}>
                    {exportingPeserta ? 'Loading...' : <><i className="bi bi-file-earmark-excel me-2"></i> Export Excel</>}
                  </button>

                  <button className="btn btn-primary" onClick={handleGenerateCertificates} disabled={loading}>
                    <i className="bi bi-patch-check-fill me-2"></i> Terbitkan Sertifikat
                  </button>
                </div>
              </div>
              
              <table className="table table-hover">
                <thead className="table-light"><tr><th>Nama</th><th>NIM</th><th>Email</th><th>Status</th></tr></thead>
                <tbody>
                  {participants.map(p => (
                    <tr key={p.registration_id}>
                      <td>{p.nama_lengkap}</td><td>{p.nim}</td><td>{p.email}</td>
                      <td>
                        <select className="form-select form-select-sm" value={p.status_kehadiran} onChange={e => handleStatusChange(p.registration_id, e.target.value)}>
                          <option value="terdaftar">Terdaftar</option><option value="hadir">Hadir</option><option value="absen">Absen</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditKegiatan;