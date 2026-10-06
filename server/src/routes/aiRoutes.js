import express from 'express';
import db from '../db/database.js';
import { optionalAuth } from '../middleware/auth.js';
import { analyzeProjectFeedback } from '../services/aiService.js';

const router = express.Router();

// POST /api/projects/:id/analyze (Run on-demand AI Learning Snapshot synthesis)
router.post('/projects/:id/analyze', optionalAuth, async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = db.findById('projects', projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const aiResult = await analyzeProjectFeedback(projectId);

    // Save or update in database
    const existing = db.findOne('ai_insights', a => a.project_id === projectId);
    let saved;
    if (existing) {
      saved = db.update('ai_insights', existing.id, aiResult);
    } else {
      saved = db.insert('ai_insights', {
        id: `ai-${Date.now()}`,
        project_id: projectId,
        ...aiResult
      });
    }

    // Notify project creator
    db.insert('notifications', {
      id: `notif-${Date.now()}`,
      user_id: project.user_id,
      type: 'ai_ready',
      title: 'AI Learning Snapshot Generated! 🤖',
      message: `Fresh AI synthesis and skill-gap recommendations are ready for "${project.title}".`,
      link: `/projects/${projectId}`,
      read: 0
    });

    res.json(saved);
  } catch (err) {
    console.error('AI analysis error:', err);
    res.status(500).json({ error: 'Failed to synthesize AI learning snapshot: ' + err.message });
  }
});

// GET /api/projects/:id/ai
router.get('/projects/:id/ai', (req, res) => {
  try {
    const projectId = req.params.id;
    const aiInsight = db.findOne('ai_insights', a => a.project_id === projectId);
    if (!aiInsight) {
      return res.status(404).json({ error: 'No AI snapshot found for this project yet.' });
    }
    res.json(aiInsight);
  } catch (err) {
    console.error('Error fetching AI insights:', err);
    res.status(500).json({ error: 'Failed to fetch AI insight.' });
  }
});

export default router;
