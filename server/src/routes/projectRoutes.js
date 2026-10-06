import express from 'express';
import db from '../db/database.js';
import { authRequired, optionalAuth } from '../middleware/auth.js';
import { analyzeProjectFeedback } from '../services/aiService.js';
import { getGitHubRepoMetadata } from '../services/githubService.js';

const router = express.Router();

// Helper to decorate project with stats and creator
function decorateProject(project) {
  const creator = db.findById('users', project.user_id) || {
    id: project.user_id,
    name: 'Student Builder',
    username: 'builder',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=builder'
  };

  const reviews = db.find('reviews', r => r.project_id === project.id);
  const reviewCount = reviews.length;
  const averageScore = reviewCount > 0
    ? Number((reviews.reduce((acc, r) => acc + (r.overall_score || 0), 0) / reviewCount).toFixed(1))
    : null;

  const aiInsight = db.findOne('ai_insights', a => a.project_id === project.id);

  return {
    ...project,
    creator: {
      id: creator.id,
      name: creator.name,
      username: creator.username,
      avatar: creator.avatar,
      college: creator.college,
      skills: creator.skills
    },
    reviewCount,
    averageScore,
    aiSummary: aiInsight ? aiInsight.summary : null
  };
}

// GET /api/projects
router.get('/', optionalAuth, (req, res) => {
  try {
    const { category, technology, skill, looking_for, search, sort } = req.query;
    let projects = db.find('projects');

    // Filter by search query
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      projects = projects.filter(p =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.short_description && p.short_description.toLowerCase().includes(q)) ||
        (p.problem && p.problem.toLowerCase().includes(q)) ||
        (p.solution && p.solution.toLowerCase().includes(q)) ||
        (Array.isArray(p.tech_stack) && p.tech_stack.some(t => t.toLowerCase().includes(q))) ||
        (Array.isArray(p.skills_used) && p.skills_used.some(s => s.toLowerCase().includes(q)))
      );
    }

    // Filter by category
    if (category && category !== 'All') {
      projects = projects.filter(p => p.category && p.category.toLowerCase().includes(category.toLowerCase()));
    }

    // Filter by technology
    if (technology) {
      projects = projects.filter(p =>
        Array.isArray(p.tech_stack) && p.tech_stack.some(t => t.toLowerCase() === technology.toLowerCase())
      );
    }

    // Filter by skill
    if (skill) {
      projects = projects.filter(p =>
        Array.isArray(p.skills_used) && p.skills_used.some(s => s.toLowerCase() === skill.toLowerCase())
      );
    }

    // Filter by collaboration need
    if (looking_for) {
      projects = projects.filter(p =>
        Array.isArray(p.collab_looking_for) && p.collab_looking_for.some(role => role.toLowerCase() === looking_for.toLowerCase())
      );
    }

    // Decorate with review counts and creator info
    let decorated = projects.map(decorateProject);

    // Sort projects
    if (sort === 'most_reviewed') {
      decorated.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (sort === 'highest_rated') {
      decorated.sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0));
    } else if (sort === 'looking_for_collabs') {
      decorated.sort((a, b) => (b.collab_looking_for?.length || 0) - (a.collab_looking_for?.length || 0));
    } else {
      // Default: newest first
      decorated.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    res.json(decorated);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to retrieve projects.' });
  }
});

// GET /api/projects/:id
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const project = db.findById('projects', req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const decorated = decorateProject(project);

    // Fetch peer reviews with reviewer data
    const reviews = db.find('reviews', r => r.project_id === project.id);
    const enrichedReviews = reviews.map(r => {
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

    // Fetch AI insights
    let aiInsight = db.findOne('ai_insights', a => a.project_id === project.id);

    // Fetch GitHub repository metadata if available
    let githubMeta = null;
    if (project.github_url) {
      githubMeta = await getGitHubRepoMetadata(project.github_url);
    }

    // Check if current user has reviewed or has an active collaboration
    let userHasReviewed = false;
    let existingCollab = null;
    if (req.user) {
      userHasReviewed = reviews.some(r => r.reviewer_id === req.user.id);
      existingCollab = db.findOne('collaborations', c =>
        c.project_id === project.id &&
        (c.sender_id === req.user.id || c.receiver_id === req.user.id)
      );
    }

    res.json({
      project: decorated,
      reviews: enrichedReviews,
      aiInsight,
      githubMeta,
      userHasReviewed,
      existingCollab
    });
  } catch (err) {
    console.error('Error fetching project detail:', err);
    res.status(500).json({ error: 'Failed to retrieve project details.' });
  }
});

// POST /api/projects (Create new project via 6-step wizard)
router.post('/', authRequired, async (req, res) => {
  try {
    const {
      title,
      short_description,
      category,
      problem,
      target_users,
      solution,
      real_world_impact,
      tech_stack,
      skills_used,
      ai_used,
      ai_details,
      difficulty,
      github_url,
      live_demo_url,
      screenshots,
      collab_looking_for,
      collab_can_help_with
    } = req.body;

    if (!title || !short_description || !problem || !solution) {
      return res.status(400).json({ error: 'Title, description, problem, and solution are required.' });
    }

    const newProject = {
      id: `proj-${Date.now()}`,
      user_id: req.user.id,
      title: title.trim(),
      short_description: short_description.trim(),
      category: category || 'Web Development',
      problem: problem.trim(),
      target_users: target_users || 'Students & peer developers',
      solution: solution.trim(),
      real_world_impact: real_world_impact || 'Early prototype stage',
      tech_stack: Array.isArray(tech_stack) ? tech_stack : (tech_stack ? tech_stack.split(',').map(s => s.trim()) : ['React']),
      skills_used: Array.isArray(skills_used) ? skills_used : (skills_used ? skills_used.split(',').map(s => s.trim()) : ['Frontend']),
      ai_used: ai_used ? 1 : 0,
      ai_details: ai_details || '',
      difficulty: difficulty || 'Intermediate',
      github_url: github_url || '',
      live_demo_url: live_demo_url || '',
      screenshots: Array.isArray(screenshots) && screenshots.length > 0 ? screenshots : [
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80'
      ],
      collab_looking_for: Array.isArray(collab_looking_for) ? collab_looking_for : [],
      collab_can_help_with: Array.isArray(collab_can_help_with) ? collab_can_help_with : []
    };

    db.insert('projects', newProject);

    // Check achievement: First Project
    const userProjects = db.find('projects', p => p.user_id === req.user.id);
    if (userProjects.length === 1) {
      const hasBadge = db.findOne('achievements', a => a.user_id === req.user.id && a.badge_key === 'first_project');
      if (!hasBadge) {
        db.insert('achievements', {
          id: `ach-${Date.now()}`,
          user_id: req.user.id,
          badge_key: 'first_project',
          title: 'First Project! 🚀',
          description: 'Published your first project on IdeaPeerCircle.',
          icon: 'Rocket'
        });
        db.insert('notifications', {
          id: `notif-${Date.now()}-badge`,
          user_id: req.user.id,
          type: 'achievement',
          title: 'Achievement Unlocked: First Project! 🚀',
          message: 'Congratulations on sharing your first project! Peers will soon review your work.',
          link: `/projects/${newProject.id}`,
          read: 0
        });
      }
    }

    // Automatically initialize initial AI synthesis
    try {
      const initialInsight = await analyzeProjectFeedback(newProject.id);
      db.insert('ai_insights', {
        id: `ai-${Date.now()}`,
        project_id: newProject.id,
        ...initialInsight
      });
    } catch (aiErr) {
      console.warn('Initial AI generation notice:', aiErr.message);
    }

    res.status(201).json(decorateProject(newProject));
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: 'Failed to create project.' });
  }
});

// PUT /api/projects/:id (Update project)
router.put('/:id', authRequired, (req, res) => {
  try {
    const project = db.findById('projects', req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    if (project.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Only the project creator can edit this project.' });
    }

    const updated = db.update('projects', project.id, req.body);
    res.json(decorateProject(updated));
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ error: 'Failed to update project.' });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', authRequired, (req, res) => {
  try {
    const project = db.findById('projects', req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    if (project.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Only the project creator can delete this project.' });
    }

    db.delete('projects', project.id);
    // Cleanup cascade
    const reviews = db.find('reviews', r => r.project_id === project.id);
    reviews.forEach(r => db.delete('reviews', r.id));
    const aiInsight = db.findOne('ai_insights', a => a.project_id === project.id);
    if (aiInsight) db.delete('ai_insights', aiInsight.id);

    res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ error: 'Failed to delete project.' });
  }
});

export default router;
