import express from 'express';
import db from '../db/database.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

// GET /api/learning (Aggregated personalized learning path across user projects)
router.get('/', authRequired, (req, res) => {
  try {
    const userProjects = db.find('projects', p => p.user_id === req.user.id);
    const userProjectIds = userProjects.map(p => p.id);

    // Fetch AI insights for user's projects
    const insights = db.find('ai_insights', a => userProjectIds.includes(a.project_id));

    // Aggregate skill gaps
    const skillGapMap = new Map();
    const recommendationsList = [];

    insights.forEach(insight => {
      const project = userProjects.find(p => p.id === insight.project_id);
      const projTitle = project ? project.title : 'Your Project';

      // Aggregate gaps
      if (Array.isArray(insight.skill_gaps)) {
        insight.skill_gaps.forEach(gap => {
          if (!skillGapMap.has(gap)) {
            skillGapMap.set(gap, {
              skill: gap,
              detectedIn: [projTitle],
              count: 1
            });
          } else {
            const entry = skillGapMap.get(gap);
            if (!entry.detectedIn.includes(projTitle)) {
              entry.detectedIn.push(projTitle);
            }
            entry.count += 1;
          }
        });
      }

      // Aggregate recommendations
      if (Array.isArray(insight.learning_recommendations)) {
        insight.learning_recommendations.forEach(rec => {
          recommendationsList.push({
            ...rec,
            projectTitle: projTitle,
            projectId: insight.project_id
          });
        });
      }
    });

    // Provide default learning tracks if user has few projects
    const aggregatedGaps = Array.from(skillGapMap.values());
    if (aggregatedGaps.length === 0) {
      aggregatedGaps.push(
        {
          skill: 'Asynchronous Job Queues (BullMQ / Redis)',
          detectedIn: ['Community Standard Roadmap'],
          count: 1
        },
        {
          skill: 'REST API Resiliency & Error Handling',
          detectedIn: ['Community Standard Roadmap'],
          count: 1
        },
        {
          skill: 'WCAG Accessibility & Ergonomics',
          detectedIn: ['Community Standard Roadmap'],
          count: 1
        }
      );
    }

    // Curated learning pathways
    const pathways = [
      {
        id: 'track-backend-scale',
        title: 'Backend Scalability & Resilient APIs',
        category: 'Backend Engineering',
        progress: 65,
        totalModules: 4,
        completedModules: 2,
        description: 'Derived from peer feedback on concurrency, request latency, and job worker patterns.',
        concepts: [
          { name: 'REST API Design & Validation', status: 'completed', description: 'Centralized schema validation and error status codes' },
          { name: 'Database Indexing & Connections', status: 'completed', description: 'Postgres indexing, connection pools, and query optimization' },
          { name: 'Redis & Background Job Queues', status: 'in_progress', description: 'Offloading long tasks to asynchronous BullMQ workers' },
          { name: 'Rate Limiting & Token Buckets', status: 'pending', description: 'Protecting endpoints against DDoS and traffic spikes' }
        ]
      },
      {
        id: 'track-ui-ux-ergonomics',
        title: 'Accessible UI & Micro-interactions',
        category: 'Design & Frontend',
        progress: 40,
        totalModules: 4,
        completedModules: 1,
        description: 'Derived from peer feedback regarding keyboard navigation and touch target clarity.',
        concepts: [
          { name: 'Semantic HTML & ARIA Landmark Roles', status: 'completed', description: 'Ensuring screen readers parse layout hierarchies correctly' },
          { name: 'Touch Target Ergonomics (44px Minimums)', status: 'in_progress', description: 'Optimizing mobile buttons for cyclist and one-handed use' },
          { name: 'Focus Trapping & Keyboard Traversal', status: 'pending', description: 'Tabbing through modal dialogues smoothly' },
          { name: 'Reduced Motion Preferences', status: 'pending', description: 'Honoring system-level user vestibular preferences' }
        ]
      }
    ];

    res.json({
      activeFocus: req.user.currently_learning?.[0] || 'Backend Development',
      userGoals: req.user.currently_learning || [],
      skillGaps: aggregatedGaps,
      recommendations: recommendationsList.slice(0, 6),
      pathways,
      totalInsightsSynthesized: insights.length
    });
  } catch (err) {
    console.error('Error generating learning plan:', err);
    res.status(500).json({ error: 'Failed to retrieve learning path.' });
  }
});

export default router;
