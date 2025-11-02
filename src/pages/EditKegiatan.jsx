import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

function EditKegiatan() {
  // Ambil ID dari URL
  const { id } = useParams();
  const navigate = useNavigate();

  // State untuk data form
  const [judul, setJudul] = useState('');
  const [tipe, setTipe] = useState('donasi');
  const [deskripsi, setDeskripsi] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [targetDonasi, setTargetDonasi] = useState(0);
  const [targetPeserta, setTargetPeserta] = useState(0);
  const [gambar, setGambar] = useState(null);
  const [gambarLama, setGambarLama] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Ambil data kegiatan yang ada saat halaman dimuat
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/activities/${id}`);
        if (!response.ok) throw new Error('Gagal mengambil data kegiatan.');
        
        const data = await response.json();
        
        // Isi semua state dengan data yang ada
        setJudul(data.judul);
        setTipe(data.tipe);
        setDeskripsi(data.deskripsi || '');
        setLokasi(data.lokasi || '');
        // Format tanggal YYYY-MM-DD
        setTanggalMulai(data.tanggal_mulai ? new Date(data.tanggal_mulai).toISOString().split('T')[0] : '');
        setTargetDonasi(data.target_donasi || 0);
        setTargetPeserta(data.target_peserta || 0);
        setGambarLama(data.gambar_url || '');

      } catch (err) {
        setError(err.message);
      }
    };
    fetchActivity();
  }, [id]);

  const handleFileChange = (e) => {
    setGambar(e.target.files[0]);
  };

  // 2. Fungsi submit untuk UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
      // 3. Kirim ke API Endpoint UPDATE (PUT)
      const response = await fetch(`http://localhost:8000/api/admin/activities/${id}`, {
        method: 'PUT', // Gunakan PUT untuk update
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Gagal mengupdate data.');
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
      <h1 className="fw-bold mb-4">Edit Kegiatan</h1>
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            
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

            {/* Tampilkan gambar lama */}
            {gambarLama && !gambar && (
              <div className="mb-3">
                <label className="form-label fw-bold">Gambar Saat Ini:</label>
                <img src={`http://localhost:8000/${gambarLama}`} alt="Gambar Lama" style={{ width: '200px', display: 'block' }} />
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
        </div>
      </div>
    </div>
  );
}

export default EditKegiatan;