import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddItem = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    date_lost_or_found: '',
    item_type: 'lost',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/items', formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Error creating item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto' }}>
      <div className="card">
        <h2>Report Lost or Found Item</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Type:</label>
            <select
              name="item_type"
              value={formData.item_type}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="lost">Lost Item</option>
              <option value="found">Found Item</option>
            </select>
          </div>

          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              placeholder="Brief description of the item"
              required
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              rows="4"
              placeholder="Detailed description of the item..."
              required
            />
          </div>

          <div className="form-group">
            <label>Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select Category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="documents">Documents</option>
              <option value="jewelry">Jewelry</option>
              <option value="keys">Keys</option>
              <option value="bag">Bag/Wallet</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-control"
              placeholder="Where was it lost/found?"
              required
            />
          </div>

          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              name="date_lost_or_found"
              value={formData.date_lost_or_found}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Image URL (optional):</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="form-control"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Submitting...' : 'Report Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;