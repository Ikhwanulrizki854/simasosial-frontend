import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function ActivityDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [jumlahDonasi, setJumlahDonasi] = useState(0); 
  
  // STATE PENTING: Untuk mencegah tombol diklik berkali-kali
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  // Ambil Data Kegiatan
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/activities/${id}`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Kegiatan tidak ditemukan');
        }
        const data = await response.json();
        setActivity(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [id]); 

  // FUNGSI DONASI (MIDTRANS)
  const handleDonasi = async () => {
    // Cek apakah sedang loading? Jika ya, berhenti.
    if (isPaymentLoading) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Anda harus login untuk berdonasi.');
      navigate('/login');
      return;
    }

    if (jumlahDonasi < 10000) {
      alert('Donasi minimal Rp 10.000');
      return;
    }

    // Mulai Loading
    setIsPaymentLoading(true);

    try {
      // Panggil API backend
      const response = await fetch('http://localhost:8000/api/create-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          activity_id: activity.id,
          jumlah: jumlahDonasi
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal membuat transaksi.');
      }

      // Buka Pop-up Midtrans
      if (window.snap) {
        window.snap.pay(data.token, {
          onSuccess: function(result){
            console.log('Success:', result);
            alert('Pembayaran Anda berhasil!');
            setIsPaymentLoading(false);
            window.location.reload(); 
          },
          onPending: function(result){
            console.log('Pending:', result);
            alert('Menunggu pembayaran Anda...');
            setIsPaymentLoading(false);
          },
          onError: function(result){
            console.log('Error:', result);
            alert('Pembayaran gagal.');
            setIsPaymentLoading(false);
          },
          onClose: function(){
            console.log('Popup ditutup.');
            setIsPaymentLoading(false); // Hidupkan tombol lagi jika ditutup
          }
        });
      } else {
        alert("Error: Midtrans Snap.js belum terload. Coba refresh halaman.");
        setIsPaymentLoading(false);
      }

    } catch (err) {
      console.error(err);
      alert(err.message);
      setIsPaymentLoading(false);
    }
  };

  // FUNGSI DAFTAR VOLUNTEER
  const handleRegisterVolunteer = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Anda harus login untuk mendaftar.');
      navigate('/login');
      return;
    }

    if (!window.confirm('Apakah Anda yakin ingin mendaftar di kegiatan ini?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/activities/${id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mendaftar.');
      }

      alert(data.message); 
      window.location.reload(); 

    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-5 text-center">Loading kegiatan...</div>;
  
  if (error) return (
    <div className="p-5 text-center">
      <div className="alert alert-danger">{error}</div>
      <Link to="/" className="btn btn-primary">Kembali ke Beranda</Link>
    </div>
  );
  
  if (!activity) return <div className="p-5 text-center">Kegiatan tidak ditemukan.</div>;

  return (
    <div>
      {/* Navbar Sederhana */}
      <nav className="navbar navbar-light bg-white shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to={localStorage.getItem('role') === 'admin' ? '/admin/dashboard' : '/'}>
            ← Kembali
          </Link>
          <span className="navbar-text">
            Detail Kegiatan
          </span>
        </div>
      </nav>

      <main className="container py-5">
        {/* Header Gambar */}
        <div className="row mb-4">
          <div className="col-12">
            <img 
              src={activity.gambar_url ? `http://localhost:8000/${activity.gambar_url}` : 'https://via.placeholder.com/1200x400?text=Gambar+Kegiatan'} 
              className="img-fluid rounded" 
              alt={activity.judul} 
              style={{ width: '100%', height: '400px', objectFit: 'cover' }} 
            />
          </div>
        </div>

        {/* Konten Utama */}
        <div className="row">
          {/* Kolom Kiri: Deskripsi */}
          <div className="col-lg-8">
            <span className={`badge mb-2 ${activity.tipe === 'donasi' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>
              {activity.tipe}
            </span>
            <h1 className="fw-bold">{activity.judul}</h1>
            <p className="lead text-muted">{activity.lokasi || 'Lokasi tidak ditentukan'}</p>
            
            <hr className="my-4" />
            
            <h4 className="fw-bold">Deskripsi</h4>
            <p>{activity.deskripsi || 'Tidak ada deskripsi untuk kegiatan ini.'}</p>
          </div>

          {/* Kolom Kanan: Tombol Aksi */}
          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body">
                
                {/* TIPE DONASI */}
                {activity.tipe === 'donasi' ? (
                  <div>
                    <h5 className="fw-bold">Donasi</h5>
                    <p className="text-muted">Terkumpul {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(activity.donasi_terkumpul)}</p>
                    <div className="progress mb-3">
                      <div 
                        className="progress-bar bg-warning" 
                        style={{ width: `${(activity.donasi_terkumpul / (activity.target_donasi || 1)) * 100}%` }}
                        role="progressbar"
                      ></div>
                    </div>

                    <hr />
                    <div className="mb-3">
                      <label htmlFor="jumlahDonasi" className="form-label fw-bold">Masukkan Jumlah Donasi (Rp)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        id="jumlahDonasi"
                        value={jumlahDonasi}
                        onChange={(e) => setJumlahDonasi(e.target.value)}
                        placeholder="Min. 10000"
                        disabled={isPaymentLoading} // Matikan input saat loading
                      />
                    </div>
                    <button 
                      className="btn btn-warning text-white w-100 fw-bold"
                      onClick={handleDonasi} 
                      disabled={isPaymentLoading} // Matikan tombol saat loading
                    >
                      {isPaymentLoading ? 'Memproses...' : 'Donasi Sekarang'}
                    </button>
                  </div>
                
                /* TIPE VOLUNTEER */
                ) : (
                  <div>
                    <h5 className="fw-bold">Relawan</h5>
                    <p className="text-muted">{activity.peserta_terdaftar} / {activity.target_peserta || '∞'} Peserta</p>
                    <div className="progress mb-3">
                      <div 
                        className="progress-bar bg-info" 
                        style={{ width: `${(activity.peserta_terdaftar / (activity.target_peserta || 1)) * 100}%` }}
                        role="progressbar"
                      ></div>
                    </div>
                    <button 
                      className="btn btn-info text-white w-100 fw-bold"
                      onClick={handleRegisterVolunteer}
                    >
                      Daftar Sekarang
                    </button>
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