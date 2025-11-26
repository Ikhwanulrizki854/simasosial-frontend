import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function ManajemenPengguna() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  // State Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJurusan, setFilterJurusan] = useState(''); 
  const [filterRole, setFilterRole] = useState('');       
  const [filterAngkatan, setFilterAngkatan] = useState('');
  
  // State Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false); // <-- State Loading Export
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    try {
      const response = await fetch('http://localhost:8000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Gagal mengambil data pengguna');
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data); 
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
      if (err.message.includes('Token')) { localStorage.clear(); navigate('/login'); }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [navigate]);

  // FUNGSI BARU: EXPORT EXCEL
  const handleExportExcel = async () => {
    setExporting(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8000/api/admin/users/export-excel', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Gagal export Excel');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Data_Pengguna_SIMASOSIAL.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      const Toast = Swal.mixin({
        toast: true, position: 'top-end', showConfirmButton: false, timer: 3000
      });
      Toast.fire({ icon: 'success', title: 'Excel berhasil diunduh' });

    } catch (err) {
      Swal.fire('Gagal', err.message, 'error');
    } finally {
      setExporting(false);
    }
  };

  // LOGIKA FILTER
  useEffect(() => {
    const results = users.filter(user => {
      const matchSearch = 
        user.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.nim && user.nim.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchJurusan = filterJurusan ? user.jurusan === filterJurusan : true;
      const matchRole = filterRole ? user.role === filterRole : true;
      const matchAngkatan = filterAngkatan ? user.angkatan === filterAngkatan : true;

      return matchSearch && matchJurusan && matchRole && matchAngkatan;
    });

    setFilteredUsers(results);
    setCurrentPage(1); 
  }, [searchTerm, filterJurusan, filterRole, filterAngkatan, users]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle Role Change
  const handleRoleChange = async (user) => {
    const newRole = user.role === 'admin' ? 'mahasiswa' : 'admin';
    const result = await Swal.fire({
      title: 'Ubah Role?',
      html: `Ubah role <b>${user.nama_lengkap}</b> menjadi <b>${newRole.toUpperCase()}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Ubah!'
    });

    if (!result.isConfirmed) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8000/api/admin/users/${user.id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newRole })
      });

      if (!response.ok) throw new Error('Gagal update role.');

      const updatedUsers = users.map(u => u.id === user.id ? { ...u, role: newRole } : u);
      setUsers(updatedUsers);
      Swal.fire('Berhasil!', `Role berhasil diubah.`, 'success');
    } catch (err) {
      Swal.fire('Gagal', err.message, 'error');
    }
  };

  const daftarJurusan = [...new Set(users.map(u => u.jurusan).filter(j => j))];
  const daftarAngkatan = [...new Set(users.map(u => u.angkatan).filter(a => a))].sort();

  if (loading) return <div className="text-center p-5">Loading data pengguna...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Manajemen Data Pengguna</h1>
        
        {/* TOMBOL EXPORT EXCEL */}
        <button 
          className="btn btn-success" 
          onClick={handleExportExcel} 
          disabled={exporting}
        >
          {exporting ? 'Downloading...' : <><i className="bi bi-file-earmark-excel me-2"></i> Export Excel</>}
        </button>
      </div>

      {/* BAR FILTER */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
                <input 
                  type="text" 
                  className="form-control border-start-0" 
                  placeholder="Cari Nama / NIM..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={filterJurusan} onChange={(e) => setFilterJurusan(e.target.value)}>
                <option value="">Semua Jurusan</option>
                {daftarJurusan.map((jurusan, index) => <option key={index} value={jurusan}>{jurusan}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <select className="form-select" value={filterAngkatan} onChange={(e) => setFilterAngkatan(e.target.value)}>
                <option value="">Semua BP</option>
                {daftarAngkatan.map((angkatan, index) => <option key={index} value={angkatan}>{angkatan}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                <option value="">Semua Role</option>
                <option value="mahasiswa">Mahasiswa</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* TABEL DATA */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Mahasiswa</th>
                <th>Kontak</th>
                <th>Jurusan</th>
                <th>BP</th>
                <th>Role</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr><td colSpan="6" className="text-center text-muted py-4">Data tidak ditemukan.</td></tr>
              ) : (
                currentItems.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="fw-bold">{user.nama_lengkap}</div>
                      <div className="small text-muted">{user.nim}</div>
                    </td>
                    <td>
                      <div className="small">{user.email}</div>
                      <div className="small text-muted">{user.no_telepon || '-'}</div>
                    </td>
                    <td>{user.jurusan}</td>
                    <td>{user.angkatan}</td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary" title="Ubah Role" onClick={() => handleRoleChange(user)}>
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {/* Footer Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted small">
              Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredUsers.length)} dari {filteredUsers.length} pengguna
            </div>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => paginate(i + 1)}>{i + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
                </li>
              </ul>
            </nav>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ManajemenPengguna;