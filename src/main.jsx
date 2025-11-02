import React from 'react';
import ReactDOM from 'react-dom/client';

// Impor CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

// Impor Router
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Impor Halaman (Pages)
import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ActivityDetail from './pages/ActivityDetail.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ManajemenKegiatan from './pages/ManajemenKegiatan.jsx';
import BuatKegiatan from './pages/BuatKegiatan.jsx';
import EditKegiatan from './pages/EditKegiatan.jsx';
import ManajemenPengguna from './pages/ManajemenPengguna.jsx';
import Pengaturan from './pages/Pengaturan.jsx';


// Impor Komponen (Guards)
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import AdminProtectedRoute from './components/AdminProtectedRoute.jsx';

// Definisikan rute/halaman kita
const router = createBrowserRouter([
  // Rute Publik
  {
    path: "/",
    element: <LandingPage />, 
  },
  {
    path: "/login", 
    element: <Login />,
  },
  {
    path: "/register", 
    element: <Register />,
  },
  
  // Rute untuk MAHASISWA (Perlu login)
  {
    element: <ProtectedRoute />,
    children: [
      { 
        path: "/dashboard", 
        element: <Dashboard />,
      },
      { 
        path: "/kegiatan/:id", 
        element: <ActivityDetail />,
      }
      // Tambahkan rute mahasiswa lain di sini
    ]
  },
  
  // Rute untuk ADMIN (Perlu login & role 'admin')
  {
    // Rute untuk ADMIN
    element: <AdminProtectedRoute />,
    children: [
      {
        element: <AdminLayout />, 
        children: [
          { path: "/admin/dashboard", element: <AdminDashboard /> },
          { path: "/admin/manajemen-kegiatan", element: <ManajemenKegiatan /> },
          { 
            path: "/admin/kegiatan/baru", 
            element: <BuatKegiatan /> 
          },
          { 
            path: "/admin/kegiatan/edit/:id", 
            element: <EditKegiatan /> 
          },
          { 
            path: "/admin/manajemen-pengguna", 
            element: <ManajemenPengguna /> 
          },
          { 
            path: "/admin/pengaturan", 
            element: <Pengaturan /> 
          },
        ]
      }
    ]
  },
]);

// Render aplikasinya
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);