import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Helper untuk format 'time ago'
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " tahun lalu";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " bulan lalu";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " hari lalu";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " jam lalu";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " menit lalu";
  return Math.floor(seconds) + " detik lalu";
};

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Ambil Notifikasi (jika login)
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (token && role) {
      setIsLoggedIn(true);
      setUserRole(role);

      // Hanya mahasiswa yang punya notifikasi
      if (role === 'mahasiswa') {
        fetchNotifications();
      }
    }
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/my-notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Gagal ambil notif');
      const data = await res.json();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error(err.message);
    }
  };

  // Tandai Dibaca saat Dropdown Dibuka
  const handleNotifClick = async () => {
    if (unreadCount > 0) {
      try {
        await fetch('http://localhost:8000/api/notifications/mark-read', {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setUnreadCount(0); // Langsung nol-kan di frontend
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/'); 
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        
        {/* BAGIAN LOGO  */}
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <img 
            src="/Logo.png" 
            alt="Logo" 
            width="40" 
            height="40" 
            className="d-inline-block align-text-top me-2" 
            onError={(e) => e.target.style.display = 'none'} // Sembunyikan jika gambar tidak ada
          />
          SIMASOSIAL FST
        </Link>
        {/* AKHIR BAGIAN LOGO */}

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            
            {/* Link Publik */}
            <li className="nav-item">
              <Link className="nav-link" to="/">Beranda</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/kegiatan-publik">Kegiatan</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/verifikasi">Verifikasi Sertifikat</Link>
            </li>
            
            {/* LOGIKA LOGIN/PROFIL */}
            {isLoggedIn ? (
              <>
                {/* Tampilkan Lonceng HANYA untuk Mahasiswa */}
                {userRole === 'mahasiswa' && (
                  <li className="nav-item dropdown ms-2">
                    <a 
                      className="nav-link" 
                      href="#" 
                      id="notifDropdown" 
                      role="button" 
                      data-bs-toggle="dropdown" 
                      aria-expanded="false"
                      onClick={handleNotifClick} // <-- Tandai dibaca saat diklik
                    >
                      <i className="bi bi-bell-fill fs-4 position-relative">
                        {/* Titik Merah Notifikasi */}
                        {unreadCount > 0 && (
                          <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
                            <span className="visually-hidden">New alerts</span>
                          </span>
                        )}
                      </i>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="notifDropdown" style={{width: '350px'}}>
                      {notifications.length === 0 ? (
                        <li className="dropdown-item text-muted">Tidak ada notifikasi.</li>
                      ) : (
                        notifications.map(notif => (
                          <li key={notif.id}>
                            <Link to={notif.link_url} className={`dropdown-item ${notif.status_baca === 'belum_dibaca' ? 'fw-bold' : ''}`}>
                              <p className="mb-0 small">{notif.pesan}</p>
                              <small className="text-muted">{timeAgo(notif.created_at)}</small>
                            </Link>
                          </li>
                        ))
                      )}
                    </ul>
                  </li>
                )}

                {/* Dropdown Profil */}
                <li className="nav-item dropdown ms-2">
                  <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="bi bi-person-circle fs-4"></i>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li>
                      <Link 
                        className="dropdown-item" 
                        to={userRole === 'admin' ? '/admin/dashboard' : '/dashboard'}
                      >
                        Dashboard Saya
                      </Link>
                    </li>
                    
                    {/* MENU BARU UNTUK MAHASISWA */}
                    {userRole === 'mahasiswa' && (
                        <li>
                          <Link className="dropdown-item" to="/profil">
                            Profil Saya
                          </Link>
                        </li>
                    )}

                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              // JIKA BELUM LOGIN
              <li className="nav-item ms-3">
                <Link to="/login" className="btn btn-warning text-white btn-sm px-3">Login/Daftar</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;