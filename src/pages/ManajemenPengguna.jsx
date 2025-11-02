import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ManajemenPengguna() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); 
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.clear(); // Hapus semua jika tidak valid
            navigate('/login');
          }
          throw new Error('Gagal mengambil data pengguna');
        }

        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  // 1. FUNGSI BARU UNTUK UBAH ROLE
  const handleRoleChange = async (user) => {
    const newRole = user.role === 'admin' ? 'mahasiswa' : 'admin';
    
    if (!window.confirm(`Apakah Anda yakin ingin mengubah role "${user.nama_lengkap}" menjadi "${newRole}"?`)) {
      return;
    }

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengupdate role.');
      }

      // Jika sukses, update data di frontend (state)
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === user.id ? { ...u, role: newRole } : u
        )
      );

    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center p-5">Loading data pengguna...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Manajemen Data Pengguna</h1>
        {/* Nanti kita bisa tambah tombol Export CSV di sini sesuai mockup */}
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">Mahasiswa</th>
                <th scope="col">Kontak</th>
                <th scope="col">Jurusan</th>
                <th scope="col">Angkatan</th>
                <th scope="col">Role</th>
                <th scope="col">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">Belum ada data pengguna.</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="fw-bold">{user.nama_lengkap}</div>
                      <div className="small text-muted">{user.nim}</div>
                    </td>
                    <td>
                      <div className="small">{user.email}</div>
                      <div className="small text-muted">{user.no_telepon || 'No. HP Kosong'}</div>
                    </td>
                    <td>{user.jurusan}</td>
                    <td>{user.angkatan}</td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-secondary me-2" 
                        title="Ubah Role"
                        onClick={() => handleRoleChange(user)}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManajemenPengguna;