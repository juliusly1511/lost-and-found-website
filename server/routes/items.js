import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js'; // Fixed import path

const router = express.Router();

// Get all items with filters
router.get('/', async (req, res) => {
  try {
    const { type, category, status, page = 1, limit = 10 } = req.query;
    let query = 'SELECT * FROM items WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (type) {
      paramCount++;
      query += ` AND item_type = $${paramCount}`;
      params.push(type);
    }

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (paramCount + 1) + ' OFFSET $' + (paramCount + 2);
    params.push(limit, (page - 1) * limit);

    const items = await pool.query(query, params);
    res.json(items.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await pool.query(
      `SELECT i.*, u.username as user_username 
       FROM items i 
       LEFT JOIN users u ON i.user_id = u.id 
       WHERE i.id = $1`,
      [req.params.id]
    );
    
    if (item.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(item.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create item
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, location, date_lost_or_found, item_type, image_url } = req.body;
    
    const newItem = await pool.query(
      `INSERT INTO items 
       (title, description, category, location, date_lost_or_found, item_type, image_url, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [title, description, category, location, date_lost_or_found, item_type, image_url, req.user.id]
    );
    
    res.status(201).json(newItem.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update item
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, location, date_lost_or_found, status } = req.body;
    
    // Check if user owns the item or is admin
    const item = await pool.query('SELECT * FROM items WHERE id = $1', [req.params.id]);
    if (item.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    if (item.rows[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updatedItem = await pool.query(
      `UPDATE items SET 
       title = $1, description = $2, category = $3, location = $4, 
       date_lost_or_found = $5, status = $6, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $7 RETURNING *`,
      [title, description, category, location, date_lost_or_found, status, req.params.id]
    );
    
    res.json(updatedItem.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete item (admin only or owner)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await pool.query('SELECT * FROM items WHERE id = $1', [req.params.id]);
    if (item.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    if (item.rows[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await pool.query('DELETE FROM items WHERE id = $1', [req.params.id]);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const items = await pool.query(
      `SELECT i.*, u.username, u.email 
       FROM items i 
       JOIN users u ON i.user_id = u.id 
       ORDER BY i.created_at DESC`
    );
    res.json(items.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;