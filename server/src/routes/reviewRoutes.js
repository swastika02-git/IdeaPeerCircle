import express from 'express';
import db from '../db/database.js';
import { authRequired } from '../middleware/auth.js';
import { analyzeProjectFeedback } from '../services/aiService.js';

const router = express.Router({ mergeParams: true });

// GET /api/projects/:id/reviews
router.get('/', (req, res) => {
  try {
    const projectId = req.params.id;
    const reviews = db.find('reviews', r => r.project_id === projectId);

    const enriched = reviews.map(r => {
      const reviewer = db.findById('users', r.reviewer_id) || {
        name: 'Peer Reviewer',
        username: 'peer',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=peer',
        skills: []
      };
      return {
        ...r,
        reviewer: {
          id: reviewer.id,
          name: reviewer.name,
          username: reviewer.username,
          avatar: reviewer.avatar,
          skills: reviewer.skills
        }
      };
    });

    res.json(enriched);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Failed to retrieve reviews.' });
  }
});

// POST /api/projects/:id/reviews (Submit peer review)
router.post('/', authRequired, async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = db.findById('projects', projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    if (project.user_id === req.user.id) {
      return res.status(400).json({ error: 'You cannot review your own project. Invite peers to review it!' });
    }

    // Check duplicate review
    const existing = db.findOne('reviews', r => r.project_id === projectId && r.reviewer_id === req.user.id);
    if (existing) {
      return res.status(400).json({ error: 'You have already submitted peer feedback for this project.' });
    }

    const {
      scores, // { ui_ux, technical, innovation, ai, usefulness, problem_solving }
      well_done,
      to_improve,
      recommend_learn
    } = req.body;

    if (!well_done || !to_improve || !recommend_learn) {
      return res.status(400).json({ error: 'Please provide constructive feedback for all review prompts.' });
    }

    const cleanScores = {
      ui_ux: Math.min(10, Math.max(1, Number(scores?.ui_ux || 8))),
      technical: Math.min(10, Math.max(1, Number(scores?.technical || 8))),
      innovation: Math.min(10, Math.max(1, Number(scores?.innovation || 8))),
      ai: Math.min(10, Math.max(1, Number(scores?.ai || 7))),
      usefulness: Math.min(10, Math.max(1, Number(scores?.usefulness || 8))),
      problem_solving: Math.min(10, Math.max(1, Number(scores?.problem_solving || 8)))
    };

    const overallScore = Number(
      (
        (cleanScores.ui_ux +
          cleanScores.technical +
          cleanScores.innovation +
          cleanScores.ai +
          cleanScores.usefulness +
          cleanScores.problem_solving) /
        6
      ).toFixed(1)
    );

    const newReview = {
      id: `rev-${Date.now()}`,
      project_id: projectId,
      reviewer_id: req.user.id,
      scores: cleanScores,
      overall_score: overallScore,
      well_done: well_done.trim(),
      to_improve: to_improve.trim(),
      recommend_learn: recommend_learn.trim(),
      created_at: new Date().toISOString()
    };

    db.insert('reviews', newReview);

    // Notify project creator
    db.insert('notifications', {
      id: `notif-${Date.now()}`,
      user_id: project.user_id,
      type: 'review',
      title: 'New Peer Feedback Received! 💬',
      message: `${req.user.name} reviewed "${project.title}" across 6 dimensions.`,
      link: `/projects/${projectId}`,
      read: 0
    });

    // Check achievement for reviewer: Helpful Reviewer
    const userReviews = db.find('reviews', r => r.reviewer_id === req.user.id);
    if (userReviews.length === 1) {
      const hasReviewBadge = db.findOne('achievements', a => a.user_id === req.user.id && a.badge_key === 'helpful_reviewer');
      if (!hasReviewBadge) {
        db.insert('achievements', {
          id: `ach-${Date.now()}-rev`,
          user_id: req.user.id,
          badge_key: 'helpful_reviewer',
          title: 'Helpful Reviewer 💬',
          description: 'Provided constructive peer feedback across 6 dimensions.',
          icon: 'MessageSquareHeart'
        });
      }
    }

    // Check achievement for project owner: Feedback Champion (if 3+ reviews)
    const projectReviews = db.find('reviews', r => r.project_id === projectId);
    if (projectReviews.length >= 3) {
      const hasFeedbackChamp = db.findOne('achievements', a => a.user_id === project.user_id && a.badge_key === 'feedback_champion');
      if (!hasFeedbackChamp) {
        db.insert('achievements', {
          id: `ach-${Date.now()}-champ`,
          user_id: project.user_id,
          badge_key: 'feedback_champion',
          title: 'Feedback Champion 🏆',
          description: 'Earned 3+ peer reviews on your project.',
          icon: 'Award'
        });
      }
    }

    // Automatically trigger AI synthesis update
    let updatedInsight = null;
    try {
      updatedInsight = await analyzeProjectFeedback(projectId);
      const existingAI = db.findOne('ai_insights', a => a.project_id === projectId);
      if (existingAI) {
        db.update('ai_insights', existingAI.id, updatedInsight);
      } else {
        db.insert('ai_insights', {
          id: `ai-${Date.now()}`,
          project_id: projectId,
          ...updatedInsight
        });
      }
    } catch (aiErr) {
      console.warn('AI synthesis auto-update error:', aiErr.message);
    }

    res.status(201).json({
      review: {
        ...newReview,
        reviewer: {
          id: req.user.id,
          name: req.user.name,
          username: req.user.username,
          avatar: req.user.avatar,
          skills: req.user.skills
        }
      },
      aiInsight: updatedInsight
    });
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ error: 'Failed to submit review.' });
  }
});

export default router;
