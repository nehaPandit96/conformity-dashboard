
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../src/styles/Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token from localStorage and navigate to login
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-brand">Compliance Dashboard</h1>
        <div className="navbar-user">
          <button onClick={handleLogout} className="navbar-logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
