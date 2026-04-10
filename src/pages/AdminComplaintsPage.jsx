import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Plus, Trash2, Edit2, X, Eye, Sparkles } from 'lucide-react';

export default function AdminComplaintsPage() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    complaintId: '',
    userEmail: '',
    subject: '',
    description: '',
    propertyId: '',
    aiSummary: '',
    status: 'under work',
  });

  useEffect(() => {
    if (!isAdmin || !user) {
      navigate('/signin');
      return;
    }

    const stored = localStorage.getItem('admin-complaints');
    if (stored) {
      setComplaints(JSON.parse(stored));
    }
  }, [user, isAdmin, navigate]);

  const generateComplaintId = () => {
    return `CMP-${Date.now()}`;
  };

  const generateAISummary = (subject, description) => {
    // Simple AI summary generation (in real app, would call actual API)
    const combinedText = `${subject} ${description}`;
    const words = combinedText.split(' ').slice(0, 15).join(' ');
    return `Summary: ${words}...`;
  };

  const handleOpenModal = (complaint = null) => {
    if (complaint) {
      setEditingId(complaint.id);
      setFormData(complaint);
    } else {
      setEditingId(null);
      setFormData({
        complaintId: generateComplaintId(),
        userEmail: '',
        subject: '',
        description: '',
        propertyId: '',
        aiSummary: '',
        status: 'under work',
        propertyName: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      complaintId: generateComplaintId(),
      userEmail: '',
      subject: '',
      description: '',
      propertyId: '',
      propertyName: '',
      aiSummary: '',
      status: 'under work',
    });
  };

  const handleGenerateAISummary = () => {
    const summary = generateAISummary(formData.subject, formData.description);
    setFormData({ ...formData, aiSummary: summary });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      // Update existing complaint
      const updated = complaints.map(c =>
        c.id === editingId ? { ...formData, id: editingId } : c
      );
      setComplaints(updated);
      localStorage.setItem('admin-complaints', JSON.stringify(updated));
    } else {
      // Create new complaint
      const newComplaint = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updated = [...complaints, newComplaint];
      setComplaints(updated);
      localStorage.setItem('admin-complaints', JSON.stringify(updated));
    }

    handleCloseModal();
  };

  const handleDelete = (complaintId) => {
    if (confirm('Are you sure you want to delete this complaint?')) {
      const updated = complaints.filter(c => c.id !== complaintId);
      setComplaints(updated);
      localStorage.setItem('admin-complaints', JSON.stringify(updated));
      setViewingId(null);
    }
  };

  const handleStatusChange = (complaintId, newStatus) => {
    const updated = complaints.map(c =>
      c.id === complaintId ? { ...c, status: newStatus, updatedAt: new Date().toISOString() } : c
    );
    setComplaints(updated);
    localStorage.setItem('admin-complaints', JSON.stringify(updated));
  };

  const filteredComplaints = filter === 'all'
    ? complaints
    : complaints.filter(c => c.status === filter);

  const viewingComplaint = complaints.find(c => c.id === viewingId);

  const getStatusColor = (status) => {
    switch (status) {
      case 'solved':
        return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'under work':
        return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  const getCountByStatus = (status) => {
    return complaints.filter(c => c.status === status).length;
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Complaints Management</h1>
              <p className="text-slate-400">Manage user complaints with AI summaries and status tracking</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 font-semibold rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
              <p className="text-slate-400 text-sm font-medium">Total Complaints</p>
              <p className="text-2xl font-bold text-white mt-2">{complaints.length}</p>
            </div>
            <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
              <p className="text-yellow-400 text-sm font-medium">Under Work</p>
              <p className="text-2xl font-bold text-yellow-400 mt-2">{getCountByStatus('under work')}</p>
            </div>
            <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
              <p className="text-green-400 text-sm font-medium">Solved</p>
              <p className="text-2xl font-bold text-green-400 mt-2">{getCountByStatus('solved')}</p>
            </div>
            <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
              <p className="text-red-400 text-sm font-medium">Rejected</p>
              <p className="text-2xl font-bold text-red-400 mt-2">{getCountByStatus('rejected')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
          >
            <Plus size={20} />
            Add Complaint
          </button>

          <div className="flex gap-2">
            {['all', 'under work', 'solved', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Complaints List */}
        {filteredComplaints.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No complaints found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map(complaint => (
              <div
                key={complaint.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6 hover:border-slate-600 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{complaint.subject}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                        {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">
                      <span className="font-semibold text-slate-300">From:</span> {complaint.userEmail}
                    </p>
                    <p className="text-slate-400 text-sm">
                      <span className="font-semibold text-slate-300">Complaint ID:</span> {complaint.complaintId}
                    </p>
                      {complaint.propertyName && (
                        <p className="text-slate-400 text-sm">
                          <span className="font-semibold text-slate-300">Property:</span> {complaint.propertyName}
                        </p>
                      )}
                      {complaint.propertyId && (
                        <p className="text-slate-400 text-sm">
                          <span className="font-semibold text-slate-300">Property ID:</span> {complaint.propertyId}
                        </p>
                      )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewingId(complaint.id)}
                      className="p-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenModal(complaint)}
                      className="p-2 bg-yellow-600/10 hover:bg-yellow-600/20 text-yellow-400 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(complaint.id)}
                      className="p-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <p className="text-slate-300 mb-3">{complaint.description.substring(0, 100)}...</p>

                {complaint.aiSummary && (
                  <div className="bg-slate-900/50 rounded-lg p-3 mb-3 border border-slate-700">
                    <div className="flex items-start gap-2">
                      <Sparkles size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                      <p className="text-slate-300 text-sm">{complaint.aiSummary}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                  <select
                    value={complaint.status}
                    onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                    className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm font-medium border border-slate-600 hover:border-slate-500 focus:outline-none focus:border-blue-500"
                  >
                    <option value="under work">Under Work</option>
                    <option value="solved">Solved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <p className="text-slate-500 text-xs">
                    {new Date(complaint.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                {editingId ? 'Edit Complaint' : 'Add Complaint'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Complaint ID</label>
                  <input
                    type="text"
                    value={formData.complaintId}
                    disabled
                    className="w-full bg-slate-700 text-slate-400 rounded-lg px-4 py-2 border border-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">User Email *</label>
                  <input
                    type="email"
                    value={formData.userEmail}
                    onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                    className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Subject *</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:border-blue-500 outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Property ID</label>
                <input
                  type="text"
                  value={formData.propertyId}
                  onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-white font-semibold">AI Summary</label>
                  <button
                    type="button"
                    onClick={handleGenerateAISummary}
                    className="flex items-center gap-2 px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Sparkles size={16} />
                    Generate
                  </button>
                </div>
                <textarea
                  value={formData.aiSummary}
                  onChange={(e) => setFormData({ ...formData, aiSummary: e.target.value })}
                  rows="3"
                  placeholder="AI-generated summary will appear here..."
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:border-blue-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:border-blue-500 outline-none"
                  required
                >
                  <option value="under work">Under Work</option>
                  <option value="solved">Solved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-700">
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail View Modal */}
      {viewingComplaint && (
        <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Complaint Details</h2>
              <button
                onClick={() => setViewingId(null)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-slate-400 text-sm font-semibold mb-1">Complaint ID</h3>
                  <p className="text-white font-semibold">{viewingComplaint.complaintId}</p>
                </div>
                <div>
                  <h3 className="text-slate-400 text-sm font-semibold mb-1">Status</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(viewingComplaint.status)}`}>
                    {viewingComplaint.status.charAt(0).toUpperCase() + viewingComplaint.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <h3 className="text-slate-400 text-sm font-semibold mb-2">From</h3>
                <p className="text-white">{viewingComplaint.userEmail}</p>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <h3 className="text-slate-400 text-sm font-semibold mb-2">Subject</h3>
                <p className="text-white text-lg font-semibold">{viewingComplaint.subject}</p>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <h3 className="text-slate-400 text-sm font-semibold mb-2">Description</h3>
                <p className="text-slate-300 whitespace-pre-wrap">{viewingComplaint.description}</p>
              </div>

              {viewingComplaint.propertyId && (
                <div className="border-t border-slate-700 pt-4">
                  <h3 className="text-slate-400 text-sm font-semibold mb-2">Property ID</h3>
                  <p className="text-white">{viewingComplaint.propertyId}</p>

                              {viewingComplaint.propertyName && (
                                <div className="border-t border-slate-700 pt-4">
                                  <h3 className="text-slate-400 text-sm font-semibold mb-2">Property</h3>
                                  <p className="text-white">{viewingComplaint.propertyName}</p>
                                </div>
                              )}
                </div>
              )}

              {viewingComplaint.aiSummary && (
                <div className="border-t border-slate-700 pt-4 bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-start gap-2 mb-2">
                    <Sparkles size={18} className="text-purple-400 mt-0.5 flex-shrink-0" />
                    <h3 className="text-slate-300 text-sm font-semibold">AI Summary</h3>
                  </div>
                  <p className="text-slate-300">{viewingComplaint.aiSummary}</p>
                </div>
              )}

              <div className="border-t border-slate-700 pt-4">
                <h3 className="text-slate-400 text-sm font-semibold mb-2">Dates</h3>
                <p className="text-slate-400 text-sm">
                  Created: {new Date(viewingComplaint.createdAt).toLocaleString()}
                </p>
                <p className="text-slate-400 text-sm">
                  Updated: {new Date(viewingComplaint.updatedAt).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => handleOpenModal(viewingComplaint)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 font-semibold rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(viewingComplaint.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-semibold rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
                <button
                  onClick={() => setViewingId(null)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
