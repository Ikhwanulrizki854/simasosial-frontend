import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">
            SIMASOSIAL FST
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <a className="nav-link active" href="#">Beranda</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Kegiatan</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Verifikasi Sertifikat</a>
              </li>
              <li className="nav-item ms-3">
                <Link to="/login" className="btn btn-warning text-white btn-sm px-3">Login/Daftar</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="py-5" style={{ 
        marginTop: '56px', 
        background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/gambar home.png') no-repeat center center`, 
        backgroundSize: 'cover' 
      }}>
        <div className="container text-center text-white py-5">
          <h1 
            className="display-4 fw-bold" 
            style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}
          >
            Inspirasi Beraksi, Kontribusi dari Hati untuk FST
          </h1>
          <p 
            className="lead" 
            style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)' }}
          >
            Platform kegiatan sosial mahasiswa Fakultas Sains dan Teknologi
          </p>
          <a href="#kegiatan" className="btn btn-warning text-white btn-lg fw-bold">Lihat Semua Kegiatan</a>
        </div>
      </header>

      {/* Kegiatan Mendesak */}
      <section id="kegiatan" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-4">Kegiatan Mendesak Saat Ini</h2>
          <div className="row">
            {/* Card 1: Donasi (Contoh) */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card shadow-sm border-0">
                <img src="https://i0.wp.com/bpbd.babelprov.go.id/wp-content/uploads/2018/06/banjir.jpg?fit=1024%2C768&ssl=1" className="card-img-top" alt="Donasi Banjir" />
                <div className="card-body">
                  <span className="badge bg-warning text-dark mb-2">Donasi</span>
                  <h5 className="card-title fw-bold">Donasi untuk Korban Banjir Padang</h5>
                  <p className="card-text text-muted">Terkumpul Rp 750.000</p>
                  <div className="progress mb-3" style={{ height: '5px' }}>
                    <div className="progress-bar bg-warning" role="progressbar" style={{ width: '75%' }}></div>
                  </div>
                  <Link to="#" className="btn btn-primary w-100">Donasi Sekarang</Link>
                </div>
              </div>
            </div>
            {/* Card 2: Volunteer (Contoh) */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card shadow-sm border-0">
                <img src="https://assets-a1.kompasiana.com/items/album/2023/05/05/messageimage-1683300321014-6455200c08a8b5309923eb42.jpg" className="card-img-top" alt="Relawan Mengajar" />
                <div className="card-body">
                  <span className="badge bg-info text-dark mb-2">Volunteer</span>
                  <h5 className="card-title fw-bold">Relawan Mengajar di Panti Asuhan</h5>
                  <p className="card-text text-muted">15/25 Peserta</p>
                  <div className="progress mb-3" style={{ height: '5px' }}>
                    <div className="progress-bar bg-info" role="progressbar" style={{ width: '60%' }}></div>
                  </div>
                  <Link to="#" className="btn btn-primary w-100">Daftar Sekarang</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h5 className="fw-bold">SIMASOSIAL FST</h5>
              <p className="text-white-50">Platform kegiatan sosial mahasiswa Fakultas Sains dan Teknologi.</p>
            </div>
            <div className="col-md-4">
              <h5 className="fw-bold">Kontak</h5>
              <ul className="list-unstyled text-white-50">
                <li>Email: simasosialfst@gmail.com</li>
                <li>Telp: (0751) 123456</li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5 className="fw-bold">Ikuti Kami</h5>
              <a href="#" className="text-white me-2">Instagram</a>
              <a href="#" className="text-white me-2">Twitter</a>
              <a href="#" className="text-white">YouTube</a>
            </div>
          </div>
          <hr className="bg-secondary" />
          <p className="text-center text-white-50 small mb-0">
            © 2025 SIMASOSIAL FST. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;