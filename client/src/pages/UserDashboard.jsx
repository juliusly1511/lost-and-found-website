import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const UserDashboard = () => {
  const [userItems, setUserItems] = useState([]);
  const [userClaims, setUserClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Fetch user's items
      const itemsResponse = await axios.get('/api/items');
      const userItems = itemsResponse.data.filter(item => 
        item.user_id === user.id
      );
      setUserItems(userItems);

      // Fetch user's claims
      const claimsResponse = await axios.get('/api/claims/my-claims');
      setUserClaims(claimsResponse.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/api/items/${itemId}`);
        setUserItems(userItems.filter(item => item.id !== itemId));
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px 0' }}>
      <h1>My Dashboard</h1>
      
      <div style={{ margin: '30px 0' }}>
        <Link to="/add-item" className="btn btn-primary">
          Report New Item
        </Link>
      </div>

      <div className="grid">
        <div className="card">
          <h3>My Reported Items ({userItems.length})</h3>
          {userItems.length === 0 ? (
            <p>No items reported yet.</p>
          ) : (
            userItems.map(item => (
              <div key={item.id} style={{ 
                border: '1px solid #ddd', 
                padding: '10px', 
                margin: '10px 0',
                borderRadius: '4px'
              }}>
                <h4>{item.title}</h4>
                <p>Type: {item.item_type}</p>
                <p>Status: {item.status}</p>
                <p>Date: {new Date(item.date_lost_or_found).toLocaleDateString()}</p>
                <button 
                  onClick={() => deleteItem(item.id)}
                  className="btn btn-danger"
                  style={{ padding: '5px 10px', fontSize: '14px' }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <h3>My Claims ({userClaims.length})</h3>
          {userClaims.length === 0 ? (
            <p>No claims submitted yet.</p>
          ) : (
            userClaims.map(claim => (
              <div key={claim.id} style={{ 
                border: '1px solid #ddd', 
                padding: '10px', 
                margin: '10px 0',
                borderRadius: '4px'
              }}>
                <h4>{claim.title}</h4>
                <p>Type: {claim.item_type}</p>
                <p>Status: <strong>{claim.status}</strong></p>
                <p>Submitted: {new Date(claim.created_at).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;