import express from 'express';
import db from '../db/database.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

// GET /api/collaborations (User's sent and received requests)
router.get('/', authRequired, (req, res) => {
  try {
    const currentUserId = req.user.id;
    const collabs = db.find('collaborations', c =>
      c.sender_id === currentUserId || c.receiver_id === currentUserId
    );

    const enriched = collabs.map(c => {
      const project = db.findById('projects', c.project_id) || { title: 'Unknown Project' };
      const sender = db.findById('users', c.sender_id) || { name: 'Student Peer' };
      const receiver = db.findById('users', c.receiver_id) || { name: 'Student Peer' };

      return {
        ...c,
        project: {
          id: project.id,
          title: project.title,
          category: project.category
        },
        sender: {
          id: sender.id,
          name: sender.name,
          username: sender.username,
          avatar: sender.avatar,
          college: sender.college,
          skills: sender.skills
        },
        receiver: {
          id: receiver.id,
          name: receiver.name,
          username: receiver.username,
          avatar: receiver.avatar,
          college: receiver.college,
          skills: receiver.skills
        },
        isSender: c.sender_id === currentUserId
      };
    });

    res.json(enriched);
  } catch (err) {
    console.error('Error fetching collaborations:', err);
    res.status(500).json({ error: 'Failed to retrieve collaboration requests.' });
  }
});

// GET /api/collaborations/matches (Smart complementary skill matchmaking)
router.get('/matches', authRequired, (req, res) => {
  try {
    const currentUser = req.user;
    const myHelp = (currentUser.can_help_with || []).map(s => s.toLowerCase());
    const myLearn = (currentUser.currently_learning || []).map(s => s.toLowerCase());
    const myInterests = (currentUser.interests || []).map(s => s.toLowerCase());

    const otherUsers = db.find('users', u => u.id !== currentUser.id);

    const matches = otherUsers.map(peer => {
      const peerHelp = (peer.can_help_with || []).map(s => s.toLowerCase());
      const peerLearn = (peer.currently_learning || []).map(s => s.toLowerCase());
      const peerInterests = (peer.interests || []).map(s => s.toLowerCase());

      // Find overlap:
      // Can I teach them what they want to learn?
      const iCanTeachThem = myHelp.filter(s =>
        peerLearn.some(p => p.includes(s) || s.includes(p))
      );

      // Can they teach me what I want to learn?
      const theyCanTeachMe = peerHelp.filter(s =>
        myLearn.some(m => m.includes(s) || s.includes(m))
      );

      // Overlapping interests
      const sharedInterests = myInterests.filter(i =>
        peerInterests.some(p => p.includes(i) || i.includes(p))
      );

      // Calculate matching affinity score
      let matchScore = 70;
      if (theyCanTeachMe.length > 0) matchScore += 15;
      if (iCanTeachThem.length > 0) matchScore += 10;
      if (sharedInterests.length > 0) matchScore += 5;
      matchScore = Math.min(99, matchScore);

      // Formulate human reason
      let reason = 'Complementary skill profiles and overlapping project domains.';
      if (theyCanTeachMe.length > 0 && iCanTeachThem.length > 0) {
        reason = `Great match! ${peer.name} can help you with ${theyCanTeachMe.join(', ')} while you can help them with ${iCanTeachThem.join(', ')}.`;
      } else if (theyCanTeachMe.length > 0) {
        reason = `${peer.name} has strong skills in ${theyCanTeachMe.join(', ')} which aligns with your current learning goals.`;
      } else if (iCanTeachThem.length > 0) {
        reason = `You have strong skills in ${iCanTeachThem.join(', ')} which ${peer.name} is looking to master.`;
      }

      // Fetch their active projects
      const peerProjects = db.find('projects', p => p.user_id === peer.id).map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        collab_looking_for: p.collab_looking_for
      }));

      return {
        user: {
          id: peer.id,
          name: peer.name,
          username: peer.username,
          avatar: peer.avatar,
          college: peer.college,
          bio: peer.bio,
          skills: peer.skills,
          can_help_with: peer.can_help_with,
          currently_learning: peer.currently_learning,
          interests: peer.interests
        },
        matchScore,
        reason,
        iCanTeachThem,
        theyCanTeachMe,
        sharedInterests,
        projects: peerProjects
      };
    });

    // Sort by match score descending
    matches.sort((a, b) => b.matchScore - a.matchScore);

    res.json(matches);
  } catch (err) {
    console.error('Error computing collaboration matches:', err);
    res.status(500).json({ error: 'Failed to generate collaboration matches.' });
  }
});

// POST /api/collaborations (Send request)
router.post('/', authRequired, (req, res) => {
  try {
    const { project_id, receiver_id, skill_offered, skill_wanted, message } = req.body;

    if (!project_id || !receiver_id || !skill_offered) {
      return res.status(400).json({ error: 'Project, recipient, and skill offered are required.' });
    }

    if (receiver_id === req.user.id) {
      return res.status(400).json({ error: 'You cannot send a collaboration offer to yourself.' });
    }

    const project = db.findById('projects', project_id);
    if (!project) return res.status(404).json({ error: 'Project not found.' });

    // Check existing request
    const existing = db.findOne('collaborations', c =>
      c.project_id === project_id &&
      c.sender_id === req.user.id &&
      c.status === 'pending'
    );
    if (existing) {
      return res.status(400).json({ error: 'A collaboration request is already pending for this project.' });
    }

    const newCollab = {
      id: `collab-${Date.now()}`,
      project_id,
      sender_id: req.user.id,
      receiver_id,
      skill_offered,
      skill_wanted: skill_wanted || '',
      message: message || `Hi! I would love to collaborate on ${project.title}.`,
      status: 'pending'
    };

    db.insert('collaborations', newCollab);

    // Notify recipient
    db.insert('notifications', {
      id: `notif-${Date.now()}`,
      user_id: receiver_id,
      type: 'collab_request',
      title: 'New Collaboration Invitation 🤝',
      message: `${req.user.name} offered to help with ${skill_offered} on "${project.title}".`,
      link: '/collaborate',
      read: 0
    });

    res.status(201).json(newCollab);
  } catch (err) {
    console.error('Error creating collaboration request:', err);
    res.status(500).json({ error: 'Failed to send collaboration request.' });
  }
});

// PUT /api/collaborations/:id (Update request status: accepted, declined, cancelled)
router.put('/:id', authRequired, (req, res) => {
  try {
    const { status } = req.body;
    const collab = db.findById('collaborations', req.params.id);

    if (!collab) return res.status(404).json({ error: 'Collaboration request not found.' });

    // Permissions check
    if (status === 'cancelled' && collab.sender_id !== req.user.id) {
      return res.status(403).json({ error: 'Only the sender can cancel this request.' });
    }
    if ((status === 'accepted' || status === 'declined') && collab.receiver_id !== req.user.id) {
      return res.status(403).json({ error: 'Only the project recipient can respond to this request.' });
    }

    const updated = db.update('collaborations', collab.id, { status });

    // If accepted, notify sender and check achievements
    if (status === 'accepted') {
      const project = db.findById('projects', collab.project_id);
      db.insert('notifications', {
        id: `notif-${Date.now()}`,
        user_id: collab.sender_id,
        type: 'collab_accepted',
        title: 'Collaboration Invitation Accepted! 🎉',
        message: `${req.user.name} accepted your offer to collaborate on "${project?.title || 'the project'}". Let the building begin!`,
        link: '/collaborate',
        read: 0
      });

      // Award Community Builder achievement if first accepted collab
      const hasBadge = db.findOne('achievements', a => a.user_id === collab.sender_id && a.badge_key === 'community_builder');
      if (!hasBadge) {
        db.insert('achievements', {
          id: `ach-${Date.now()}-cb`,
          user_id: collab.sender_id,
          badge_key: 'community_builder',
          title: 'Community Builder 🤝',
          description: 'Successfully partnered on a peer collaboration project.',
          icon: 'Users'
        });
      }
    }

    res.json(updated);
  } catch (err) {
    console.error('Error updating collaboration status:', err);
    res.status(500).json({ error: 'Failed to update collaboration.' });
  }
});

export default router;
