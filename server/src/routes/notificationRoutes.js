import express from 'express';
import db from '../db/database.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

// GET /api/notifications
router.get('/', authRequired, (req, res) => {
  try {
    const notifs = db.find('notifications', n => n.user_id === req.user.id);
    notifs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(notifs);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Failed to retrieve notifications.' });
  }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', authRequired, (req, res) => {
  try {
    const notif = db.findById('notifications', req.params.id);
    if (!notif) return res.status(404).json({ error: 'Notification not found.' });
    if (notif.user_id !== req.user.id) return res.status(403).json({ error: 'Unauthorized.' });

    const updated = db.update('notifications', notif.id, { read: 1 });
    res.json(updated);
  } catch (err) {
    console.error('Error updating notification:', err);
    res.status(500).json({ error: 'Failed to update notification.' });
  }
});

// PUT /api/notifications/read-all
router.put('/read-all', authRequired, (req, res) => {
  try {
    const notifs = db.find('notifications', n => n.user_id === req.user.id && n.read === 0);
    notifs.forEach(n => db.update('notifications', n.id, { read: 1 }));
    res.json({ success: true, count: notifs.length });
  } catch (err) {
    console.error('Error clearing notifications:', err);
    res.status(500).json({ error: 'Failed to mark notifications as read.' });
  }
});

export default router;
