import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Link to="/" className="navbar-brand">
            Lost & Found
          </Link>
          
          <ul className="navbar-nav">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/items">Browse Items</Link></li>
            
            {user ? (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/add-item">Report Item</Link></li>
                {user.role === 'admin' && (
                  <li><Link to="/admin">Admin</Link></li>
                )}
                <li>
                  <span style={{ color: 'white', marginRight: '10px' }}>
                    Hello, {user.username}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="btn btn-primary"
                    style={{ padding: '5px 10px' }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;