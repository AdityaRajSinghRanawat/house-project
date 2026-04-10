import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Users, Home, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isAdmin || !user) {
      navigate('/signin');
      return;
    }

    const stored = localStorage.getItem('reservations');
    if (stored) {
      const allReservations = JSON.parse(stored);
      setReservations(allReservations);

      // Calculate stats
      const pending = allReservations.filter(r => r.status === 'pending').length;
      const approved = allReservations.filter(r => r.status === 'approved').length;
      const rejected = allReservations.filter(r => r.status === 'rejected').length;
      setStats({ pending, approved, rejected });
    }
  }, [user, isAdmin, navigate]);

  const handleReservationAction = (reservationId, newStatus) => {
    const updated = reservations.map(res =>
      res.id === reservationId ? { ...res, status: newStatus } : res
    );
    setReservations(updated);
    localStorage.setItem('reservations', JSON.stringify(updated));

    // Update stats
    const pending = updated.filter(r => r.status === 'pending').length;
    const approved = updated.filter(r => r.status === 'approved').length;
    const rejected = updated.filter(r => r.status === 'rejected').length;
    setStats({ pending, approved, rejected });
  };

  const filteredReservations = filter === 'all'
    ? reservations
    : reservations.filter(r => r.status === filter);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm">Manage property reservations</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white font-semibold">{user?.email}</p>
              <p className="text-slate-400 text-xs">Administrator</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-semibold">Total Reservations</p>
                <p className="text-3xl font-bold text-white mt-2">{reservations.length}</p>
              </div>
              <Home size={32} className="text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-semibold">Pending</p>
                <p className="text-3xl font-bold text-yellow-400 mt-2">{stats.pending}</p>
              </div>
              <Clock size={32} className="text-yellow-500 opacity-20" />
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-semibold">Approved</p>
                <p className="text-3xl font-bold text-green-400 mt-2">{stats.approved}</p>
              </div>
              <CheckCircle size={32} className="text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-semibold">Rejected</p>
                <p className="text-3xl font-bold text-red-400 mt-2">{stats.rejected}</p>
              </div>
              <XCircle size={32} className="text-red-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all capitalize ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Reservations Table */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Property</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">User Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredReservations.length > 0 ? (
                  filteredReservations.map(reservation => (
                    <tr key={reservation.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-300">{reservation.propertyName}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{reservation.location}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{reservation.userName}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{reservation.userPhone}</td>
                      <td className="px-6 py-4 text-sm text-slate-300 font-semibold">
                        ₹{(reservation.price / 1000).toFixed(0)}k
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">{reservation.date}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            reservation.status === 'pending'
                              ? 'bg-yellow-500/10 text-yellow-400'
                              : reservation.status === 'approved'
                              ? 'bg-green-500/10 text-green-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}
                        >
                          {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        {reservation.status === 'pending' && (
                          <>
                            <button
                              onClick={() =>
                                handleReservationAction(reservation.id, 'approved')
                              }
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-semibold transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleReservationAction(reservation.id, 'rejected')
                              }
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {reservation.status !== 'pending' && (
                          <button
                            onClick={() =>
                              handleReservationAction(reservation.id, 'pending')
                            }
                            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-semibold transition-colors"
                          >
                            Reset
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <p className="text-slate-400">No reservations found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
