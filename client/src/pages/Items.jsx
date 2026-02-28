import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    status: 'active'
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const fetchItems = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);

      const response = await axios.get(`/api/items?${params}`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitClaim = async (itemId) => {
    const description = prompt('Please describe why you believe this item is yours:');
    if (description) {
      try {
        await axios.post('/api/claims', {
          item_id: itemId,
          description: description
        });
        alert('Claim submitted successfully!');
      } catch (error) {
        alert('Error submitting claim: ' + (error.response?.data?.message || 'Unknown error'));
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px 0' }}>
      <h1>Browse Items</h1>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>Filters</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <select 
            value={filters.type} 
            onChange={(e) => setFilters({...filters, type: e.target.value})}
            className="form-control"
            style={{ width: 'auto' }}
          >
            <option value="">All Types</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>

          <select 
            value={filters.category} 
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="form-control"
            style={{ width: 'auto' }}
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="documents">Documents</option>
            <option value="jewelry">Jewelry</option>
            <option value="other">Other</option>
          </select>

          <select 
            value={filters.status} 
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="form-control"
            style={{ width: 'auto' }}
          >
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid">
        {items.length === 0 ? (
          <p>No items found matching your criteria.</p>
        ) : (
          items.map(item => (
            <div key={item.id} className="card">
              <h3>{item.title}</h3>
              <p><strong>Type:</strong> {item.item_type}</p>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Location:</strong> {item.location}</p>
              <p><strong>Date:</strong> {new Date(item.date_lost_or_found).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {item.status}</p>
              <p>{item.description}</p>
              
              {user && user.id !== item.user_id && item.status === 'active' && (
                <button 
                  onClick={() => submitClaim(item.id)}
                  className="btn btn-primary"
                  style={{ marginTop: '10px' }}
                >
                  Claim This Item
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Items;