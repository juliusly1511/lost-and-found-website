import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Submit claim
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { item_id, description } = req.body;
    
    const claim = await pool.query(
      'INSERT INTO claims (item_id, claimant_id, description) VALUES ($1, $2, $3) RETURNING *',
      [item_id, req.user.id, description]
    );
    
    res.status(201).json(claim.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's claims
router.get('/my-claims', authenticateToken, async (req, res) => {
  try {
    const claims = await pool.query(
      `SELECT c.*, i.title, i.description as item_description, i.item_type 
       FROM claims c 
       JOIN items i ON c.item_id = i.id 
       WHERE c.claimant_id = $1 
       ORDER BY c.created_at DESC`,
      [req.user.id]
    );
    res.json(claims.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all claims
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const claims = await pool.query(
      `SELECT c.*, i.title, i.item_type, u.username as claimant_username, 
              u2.username as item_owner_username
       FROM claims c 
       JOIN items i ON c.item_id = i.id 
       JOIN users u ON c.claimant_id = u.id 
       JOIN users u2 ON i.user_id = u2.id 
       ORDER BY c.created_at DESC`
    );
    res.json(claims.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update claim status
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    const updatedClaim = await pool.query(
      'UPDATE claims SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    
    res.json(updatedClaim.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;