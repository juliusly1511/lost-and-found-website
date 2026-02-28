import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: '40px 0', textAlign: 'center' }}>
      <h1>Welcome to Lost & Found</h1>
      <p style={{ fontSize: '1.2rem', margin: '20px 0' }}>
        Find your lost items or help others find theirs
      </p>
      
      <div style={{ margin: '40px 0' }}>
        {!user ? (
          <div>
            <Link to="/register" className="btn btn-primary" style={{ marginRight: '10px' }}>
              Get Started
            </Link>
            <Link to="/items" className="btn btn-primary">
              Browse Items
            </Link>
          </div>
        ) : (
          <div>
            <Link to="/add-item" className="btn btn-primary" style={{ marginRight: '10px' }}>
              Report Lost/Found Item
            </Link>
            <Link to="/items" className="btn btn-primary">
              Browse Items
            </Link>
          </div>
        )}
      </div>

      <div className="grid" style={{ marginTop: '40px' }}>
        <div className="card">
          <h3>Lost Something?</h3>
          <p>Report your lost item and get notified when it's found</p>
        </div>
        <div className="card">
          <h3>Found Something?</h3>
          <p>Help reunite lost items with their owners</p>
        </div>
        <div className="card">
          <h3>Easy to Use</h3>
          <p>Simple interface to report and search for items</p>
        </div>
      </div>
    </div>
  );
};

export default Home;