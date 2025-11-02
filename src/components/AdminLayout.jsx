import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';

// CSS Sederhana untuk Sidebar
const styles = `
  .admin-layout {
    display: flex;
    min-height: 100vh;
  }
  .admin-sidebar {
    width: 280px;
    background-color: #0d47a1; /* Biru tua */
    color: white;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
  }
  .admin-sidebar .navbar-brand {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    margin-bottom: 1.5rem;
  }
  .admin-sidebar .nav-link {
    color: #e0e0e0;
    font-size: 1.1rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
  }
  .admin-sidebar .nav-link i {
    margin-right: 0.75rem;
    font-size: 1.3rem;
  }
  .admin-sidebar .nav-link:hover {
    background-color: #1565c0; /* Biru lebih muda */
  }
  .admin-sidebar .nav-link.active {
    background-color: #1976d2; /* Biru aktif */
    color: white;
    font-weight: bold;
  }
  .admin-sidebar .logout-btn {
    margin-top: auto;
  }
  .admin-content {
    flex-grow: 1;
    background-color: #f4f7fa;
    padding: 2rem;
  }
`;

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Hapus data login dari local storage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // Arahkan kembali ke halaman login
    navigate('/login');
  };

  return (
    <>
      <style>{styles}</style>
      <div className="admin-layout">
        {/* Sidebar Sesuai Mockup */}
        <nav className="admin-sidebar">
          <Link className="navbar-brand" to="/admin/dashboard">
            SIMASOSIAL FST
            <span className="d-block fs-6 fw-normal">Admin Panel</span>
          </Link>

          <ul className="nav flex-column">
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/dashboard">
                <i className="bi bi-speedometer2"></i>
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/manajemen-kegiatan">
                <i className="bi bi-calendar-event-fill"></i>
                Manajemen Kegiatan
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/manajemen-pengguna">
                <i className="bi bi-people-fill"></i>
                Manajemen Pengguna
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/pengaturan">
                <i className="bi bi-gear-fill"></i>
                Pengaturan
              </NavLink>
            </li>
          </ul>

          <button 
            className="btn btn-danger logout-btn" 
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-left me-2"></i>
            Logout
          </button>
        </nav>

        {/* Konten Halaman (Dashboard, dll) */}
        <main className="admin-content">
          <Outlet /> {/* <-- Halaman akan dirender di sini */}
        </main>
      </div>
    </>
  );
}

export default AdminLayout;