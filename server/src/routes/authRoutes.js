import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../db/database.js';
import { signToken, authRequired } from '../middleware/auth.js';

const router = express.Router();

// Helper to remove password_hash from user object
function sanitizeUser(user) {
  if (!user) return null;
  const { password_hash, ...rest } = user;
  return rest;
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password, college, bio, avatar, skills, currently_learning, can_help_with, interests } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: 'Name, username, email, and password are required.' });
    }

    const existingEmail = db.findOne('users', u => u.email.toLowerCase() === email.toLowerCase());
    if (existingEmail) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const existingUsername = db.findOne('users', u => u.username.toLowerCase() === username.toLowerCase());
    if (existingUsername) {
      return res.status(400).json({ error: 'This username is already taken.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password_hash,
      college: college || 'University Student',
      bio: bio || 'Passionate student builder and peer learner on IdeaPeerCircle.',
      avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : ['React', 'JavaScript']),
      currently_learning: Array.isArray(currently_learning) ? currently_learning : (currently_learning ? currently_learning.split(',').map(s => s.trim()) : ['Backend', 'AI']),
      can_help_with: Array.isArray(can_help_with) ? can_help_with : (can_help_with ? can_help_with.split(',').map(s => s.trim()) : ['Frontend']),
      interests: Array.isArray(interests) ? interests : (interests ? interests.split(',').map(s => s.trim()) : ['EdTech', 'Open Source'])
    };

    db.insert('users', newUser);
    const token = signToken(newUser);

    // Initial welcome notification
    db.insert('notifications', {
      id: `notif-${Date.now()}`,
      user_id: newUser.id,
      type: 'achievement',
      title: 'Welcome to IdeaPeerCircle! 🌟',
      message: 'Explore peer projects or showcase what you built to begin your learning loop.',
      link: '/explore',
      read: 0
    });

    res.status(201).json({
      user: sanitizeUser(newUser),
      token
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: 'Email/username and password are required.' });
    }

    const cleanInput = emailOrUsername.toLowerCase().trim();
    const user = db.findOne('users', u => u.email.toLowerCase() === cleanInput || u.username.toLowerCase() === cleanInput);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials. Password incorrect.' });
    }

    const token = signToken(user);
    res.json({
      user: sanitizeUser(user),
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// POST /api/auth/demo-switch (Quick 1-click switch for hackathon judging!)
router.post('/demo-switch', (req, res) => {
  const { username } = req.body;
  const targetUsername = (username || 'alexchen').toLowerCase();
  const user = db.findOne('users', u => u.username === targetUsername);

  if (!user) {
    return res.status(404).json({ error: `Demo user "${targetUsername}" not found.` });
  }

  const token = signToken(user);
  res.json({
    user: sanitizeUser(user),
    token
  });
});

// GET /api/auth/me
router.get('/me', authRequired, (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

// PUT /api/auth/profile
router.put('/profile', authRequired, (req, res) => {
  try {
    const { name, college, bio, avatar, skills, currently_learning, can_help_with, interests } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (college !== undefined) updates.college = college;
    if (bio !== undefined) updates.bio = bio;
    if (avatar) updates.avatar = avatar;
    if (skills) updates.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (currently_learning) updates.currently_learning = Array.isArray(currently_learning) ? currently_learning : currently_learning.split(',').map(s => s.trim());
    if (can_help_with) updates.can_help_with = Array.isArray(can_help_with) ? can_help_with : can_help_with.split(',').map(s => s.trim());
    if (interests) updates.interests = Array.isArray(interests) ? interests : interests.split(',').map(s => s.trim());

    const updatedUser = db.update('users', req.user.id, updates);
    res.json({ user: sanitizeUser(updatedUser) });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

export default router;
