import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function BuatKegiatan() {
  // State untuk data form
  const [judul, setJudul] = useState('');
  const [tipe, setTipe] = useState('donasi'); 
  const [deskripsi, setDeskripsi] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [targetDonasi, setTargetDonasi] = useState(0);
  const [targetPeserta, setTargetPeserta] = useState(0);
  const [gambar, setGambar] = useState(null); // <-- 1. STATE BARU UNTUK FILE

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 2. Fungsi untuk menangani perubahan file
  const handleFileChange = (e) => {
    setGambar(e.target.files[0]); // Ambil file pertama
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    
    // 3. KITA UBAH: Kirim sebagai FormData, bukan JSON
    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('tipe', tipe);
    formData.append('deskripsi', deskripsi);
    formData.append('lokasi', lokasi);
    formData.append('tanggal_mulai', tanggalMulai);
    formData.append('target_donasi', tipe === 'donasi' ? targetDonasi : 0);
    formData.append('target_peserta', tipe === 'volunteer' ? targetPeserta : 0);
    
    if (gambar) {
      formData.append('gambar', gambar); // <-- Tambahkan file ke FormData
    }

    try {
      const response = await fetch('http://localhost:8000/api/admin/activities', {
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/json', <-- HAPUS INI, FormData menanganinya
          'Authorization': `Bearer ${token}`
        },
        body: formData // <-- 4. Kirim FormData
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan data. Pastikan semua field wajib terisi.');
      }

      setLoading(false);
      navigate('/admin/manajemen-kegiatan');

    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Buat Kegiatan Baru</h1>
        <Link to="/admin/manajemen-kegiatan" className="btn btn-outline-secondary">
          Batal
        </Link>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="mb-3">
              <label htmlFor="judul" className="form-label fw-bold">Judul Kegiatan*</label>
              <input 
                type="text" 
                className="form-control" 
                id="judul"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                required 
              />
            </div>

            <div className="mb-3">
              <label htmlFor="tipe" className="form-label fw-bold">Jenis Kegiatan*</label>
              <select 
                className="form-select" 
                id="tipe"
                value={tipe}
                onChange={(e) => setTipe(e.target.value)}
                required
              >
                <option value="donasi">Donasi</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>
            
            <div className="mb-3">
              <label htmlFor="deskripsi" className="form-label fw-bold">Deskripsi</label>
              <textarea 
                className="form-control" 
                id="deskripsi" 
                rows="5"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
              ></textarea>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="lokasi" className="form-label fw-bold">Lokasi</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="lokasi"
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="tanggalMulai" className="form-label fw-bold">Tanggal Mulai*</label>
                <input 
                  type="date" 
                  className="form-control" 
                  id="tanggalMulai"
                  value={tanggalMulai}
                  onChange={(e) => setTanggalMulai(e.target.value)}
                  required 
                />
              </div>
            </div>

            {/* 5. TAMBAHKAN FIELD UPLOAD GAMBAR */}
            <div className="mb-3">
              <label htmlFor="gambar" className="form-label fw-bold">Upload Gambar Kegiatan</label>
              <input 
                type="file" 
                className="form-control" 
                id="gambar"
                onChange={handleFileChange} 
              />
            </div>
            
            {/* Tampilkan field target berdasarkan Tipe */}
            {tipe === 'donasi' ? (
              <div className="mb-3">
                <label htmlFor="targetDonasi" className="form-label fw-bold">Target Dana (Rp)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  id="targetDonasi"
                  value={targetDonasi}
                  onChange={(e) => setTargetDonasi(e.target.value)}
                  placeholder="Contoh: 5000000"
                />
              </div>
            ) : (
              <div className="mb-3">
                <label htmlFor="targetPeserta" className="form-label fw-bold">Target Peserta</label>
                <input 
                  type="number" 
                  className="form-control" 
                  id="targetPeserta"
                  value={targetPeserta}
                  onChange={(e) => setTargetPeserta(e.target.value)}
                  placeholder="Contoh: 50"
                />
              </div>
            )}
            
            <div className="d-flex justify-content-end">
              <Link to="/admin/manajemen-kegiatan" className="btn btn-outline-secondary me-2">
                Batal
              </Link>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Kegiatan'}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}

export default BuatKegiatan;