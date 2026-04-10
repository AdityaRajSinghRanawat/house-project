import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import ComplaintsPage from './pages/ComplaintsPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminComplaintsPage from './pages/AdminComplaintsPage';
import UserDashboard from './pages/UserDashboard';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';

// Initialize demo users
function initializeDemoUsers() {
  const users = JSON.parse(localStorage.getItem('aura-users') || '[]');
  if (users.length === 0) {
    localStorage.setItem(
      'aura-users',
      JSON.stringify([
        {
          id: 1,
          email: 'admin@aura.com',
          phone: '9876543210',
          password: 'admin123',
          isAdmin: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          email: 'user@aura.com',
          phone: '9876543211',
          password: 'user123',
          isAdmin: false,
          createdAt: new Date().toISOString(),
        },
      ])
    );
  }
}

function App() {
  useEffect(() => {
    initializeDemoUsers();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/complaints" element={<AdminComplaintsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
