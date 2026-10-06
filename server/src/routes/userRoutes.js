import express from 'express';
import db from '../db/database.js';

const router = express.Router();

function sanitizeUser(user) {
  if (!user) return null;
  const { password_hash, ...rest } = user;
  return rest;
}

// GET /api/users (Search and list users)
router.get('/', (req, res) => {
  try {
    const { search, skill } = req.query;
    let users = db.find('users');

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      users = users.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        (u.college && u.college.toLowerCase().includes(q)) ||
        (Array.isArray(u.skills) && u.skills.some(s => s.toLowerCase().includes(q))) ||
        (Array.isArray(u.interests) && u.interests.some(i => i.toLowerCase().includes(q)))
      );
    }

    if (skill) {
      users = users.filter(u =>
        Array.isArray(u.skills) && u.skills.some(s => s.toLowerCase() === skill.toLowerCase())
      );
    }

    res.json(users.map(sanitizeUser));
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to search users.' });
  }
});

// GET /api/users/:id (Comprehensive portfolio profile)
router.get('/:id', (req, res) => {
  try {
    const user = db.findById('users', req.params.id) || db.findOne('users', u => u.username === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // User's projects
    const projects = db.find('projects', p => p.user_id === user.id);
    const enrichedProjects = projects.map(p => {
      const reviews = db.find('reviews', r => r.project_id === p.id);
      const avg = reviews.length > 0
        ? Number((reviews.reduce((acc, r) => acc + (r.overall_score || 0), 0) / reviews.length).toFixed(1))
        : null;
      return {
        ...p,
        reviewCount: reviews.length,
        averageScore: avg
      };
    });

    // Reviews given by user
    const givenReviews = db.find('reviews', r => r.reviewer_id === user.id);

    // Reviews received on user's projects
    const projectIds = projects.map(p => p.id);
    const receivedReviews = db.find('reviews', r => projectIds.includes(r.project_id));

    // Achievements unlocked
    const achievements = db.find('achievements', a => a.user_id === user.id);

    // Collaborations participated
    const collabs = db.find('collaborations', c =>
      (c.sender_id === user.id || c.receiver_id === user.id) && c.status === 'accepted'
    );

    res.json({
      user: sanitizeUser(user),
      projects: enrichedProjects,
      stats: {
        totalProjects: projects.length,
        reviewsReceived: receivedReviews.length,
        reviewsGiven: givenReviews.length,
        collaborationsActive: collabs.length,
        achievementsUnlocked: achievements.length
      },
      achievements
    });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Failed to retrieve user profile.' });
  }
});

export default router;
