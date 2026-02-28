import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [allItems, setAllItems] = useState([]);
  const [allClaims, setAllClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [itemsResponse, claimsResponse] = await Promise.all([
        axios.get('/api/items/admin/all'),
        axios.get('/api/claims/admin/all')
      ]);
      
      setAllItems(itemsResponse.data);
      setAllClaims(claimsResponse.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateItemStatus = async (itemId, newStatus) => {
    try {
      await axios.put(`/api/items/${itemId}`, { status: newStatus });
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  const updateClaimStatus = async (claimId, newStatus) => {
    try {
      await axios.put(`/api/claims/${claimId}/status`, { status: newStatus });
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error updating claim status:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px 0' }}>
      <h1>Admin Dashboard</h1>

      <div className="grid">
        <div className="card">
          <h3>All Items ({allItems.length})</h3>
          {allItems.map(item => (
            <div key={item.id} style={{ 
              border: '1px solid #ddd', 
              padding: '10px', 
              margin: '10px 0',
              borderRadius: '4px'
            }}>
              <h4>{item.title}</h4>
              <p>Reported by: {item.username}</p>
              <p>Type: {item.item_type}</p>
              <p>Status: 
                <select 
                  value={item.status} 
                  onChange={(e) => updateItemStatus(item.id, e.target.value)}
                  style={{ marginLeft: '10px' }}
                >
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                  <option value="archived">Archived</option>
                </select>
              </p>
              <p>Date: {new Date(item.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>All Claims ({allClaims.length})</h3>
          {allClaims.map(claim => (
            <div key={claim.id} style={{ 
              border: '1px solid #ddd', 
              padding: '10px', 
              margin: '10px 0',
              borderRadius: '4px'
            }}>
              <h4>Claim for: {claim.title}</h4>
              <p>Claimant: {claim.claimant_username}</p>
              <p>Item Owner: {claim.item_owner_username}</p>
              <p>Status: 
                <select 
                  value={claim.status} 
                  onChange={(e) => updateClaimStatus(claim.id, e.target.value)}
                  style={{ marginLeft: '10px' }}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </p>
              <p>Description: {claim.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;