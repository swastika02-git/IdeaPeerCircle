import db from '../db/database.js';

/**
 * Intelligent Smart Review Weighting & AI Synthesis Engine
 * Analyzes project specs, peer reviews, reviewer domain skills, and creator learning goals.
 */
export async function analyzeProjectFeedback(projectId) {
  const project = db.findById('projects', projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  const creator = db.findById('users', project.user_id);
  const reviews = db.find('reviews', r => r.project_id === projectId);
  const reviewers = reviews.map(r => ({
    review: r,
    user: db.findById('users', r.reviewer_id) || { name: 'Anonymous Peer', skills: [] }
  }));

  // Attempt real Gemini API call if key is available
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const geminiResult = await callGeminiAPI(apiKey, project, creator, reviewers);
      if (isValidAIResponse(geminiResult)) {
        return geminiResult;
      }
    } catch (apiErr) {
      console.warn('Gemini API request encountered an error, falling back to heuristic engine:', apiErr.message);
    }
  }

  // Graceful intelligent heuristic synthesis engine
  return generateHeuristicSynthesis(project, creator, reviewers);
}

/**
 * Calls Google Gemini REST API securely on backend
 */
async function callGeminiAPI(apiKey, project, creator, reviewers) {
  const prompt = `
You are an expert AI Learning Mentor for students in "IdeaPeerCircle".
Analyze this student project and its peer reviews to produce structured, actionable learning recommendations.

Project Details:
- Title: ${project.title}
- Category: ${project.category}
- Problem: ${project.problem}
- Solution: ${project.solution}
- Tech Stack: ${(project.tech_stack || []).join(', ')}
- Skills Used: ${(project.skills_used || []).join(', ')}
- Creator Learning Goals: ${(creator?.currently_learning || []).join(', ')}

Peer Reviews (${reviewers.length} reviews):
${reviewers.map((r, i) => `
Reviewer #${i + 1} (${r.user.name}, Skills: ${(r.user.skills || []).join(', ')}):
Scores: ${JSON.stringify(r.review.scores)}
Well Done: "${r.review.well_done}"
Area to Strengthen: "${r.review.to_improve}"
Recommended to Learn: "${r.review.recommend_learn}"
`).join('\n')}

Reviewer Weighting Note: Give higher weight to technical feedback from reviewers who have backend/database skills, and higher weight to UI feedback from reviewers with UI/UX skills.

Output ONLY a valid JSON object strictly matching this schema with no markdown wrapping or markdown ticks:
{
  "summary": "2-3 sentences summarizing project strengths and primary learning vector",
  "strengths": ["string", "string", "string"],
  "areasToImprove": ["string", "string", "string"],
  "skillGaps": ["string", "string", "string"],
  "learningRecommendations": [
    { "title": "string", "reason": "string", "action": "string" }
  ],
  "projectImprovements": ["string", "string"],
  "collaborationNeeds": ["string", "string"],
  "feedback_synthesis": {
    "reviewCount": ${reviewers.length},
    "liked": "What reviewers consistently appreciated",
    "commonConcern": "Common constructive critique identified",
    "uniqueSuggestion": "Notable specific suggestion from an expert reviewer",
    "takeaway": "Key punchy AI takeaway statement"
  }
}
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API HTTP ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini API');

  return JSON.parse(text);
}

/**
 * Intelligent Heuristic Synthesis Engine with Smart Reviewer Skill Weighting
 */
function generateHeuristicSynthesis(project, creator, reviewers) {
  const reviewCount = reviewers.length;

  // Calculate weighted dimension scores
  const scoreTotals = {
    ui_ux: { sum: 0, count: 0 },
    technical: { sum: 0, count: 0 },
    innovation: { sum: 0, count: 0 },
    ai: { sum: 0, count: 0 },
    usefulness: { sum: 0, count: 0 },
    problem_solving: { sum: 0, count: 0 }
  };

  reviewers.forEach(({ review, user }) => {
    const userSkills = (user.skills || []).map(s => s.toLowerCase());

    // Compute skill weights
    const isUiExpert = userSkills.some(s => s.includes('ui') || s.includes('ux') || s.includes('figma') || s.includes('design'));
    const isBackendExpert = userSkills.some(s => s.includes('backend') || s.includes('node') || s.includes('sql') || s.includes('system') || s.includes('algorithm'));

    const uiWeight = isUiExpert ? 1.5 : 1.0;
    const techWeight = isBackendExpert ? 1.5 : 1.0;

    if (review.scores) {
      if (review.scores.ui_ux) {
        scoreTotals.ui_ux.sum += review.scores.ui_ux * uiWeight;
        scoreTotals.ui_ux.count += uiWeight;
      }
      if (review.scores.technical) {
        scoreTotals.technical.sum += review.scores.technical * techWeight;
        scoreTotals.technical.count += techWeight;
      }
      if (review.scores.innovation) {
        scoreTotals.innovation.sum += review.scores.innovation;
        scoreTotals.innovation.count += 1;
      }
      if (review.scores.ai) {
        scoreTotals.ai.sum += review.scores.ai;
        scoreTotals.ai.count += 1;
      }
      if (review.scores.usefulness) {
        scoreTotals.usefulness.sum += review.scores.usefulness;
        scoreTotals.usefulness.count += 1;
      }
      if (review.scores.problem_solving) {
        scoreTotals.problem_solving.sum += review.scores.problem_solving;
        scoreTotals.problem_solving.count += 1;
      }
    }
  });

  const avgScores = {};
  for (const [key, { sum, count }] of Object.entries(scoreTotals)) {
    avgScores[key] = count > 0 ? (sum / count).toFixed(1) : '8.0';
  }

  // Extract positive quotes and areas to strengthen
  const positiveSnippets = reviewers.map(r => r.review.well_done).filter(Boolean);
  const improveSnippets = reviewers.map(r => r.review.to_improve).filter(Boolean);
  const recommendSnippets = reviewers.map(r => r.review.recommend_learn).filter(Boolean);

  const strengths = [
    positiveSnippets[0] || `Clear, intuitive approach to ${project.category.toLowerCase()} problem solving.`,
    `Strong engagement in practical ${project.tech_stack?.slice(0, 2).join(' and ') || 'modern'} implementation.`,
    positiveSnippets[1] || 'Thoughtful attention to user flow and real-world student utility.'
  ];

  const areasToImprove = [
    improveSnippets[0] || 'System error handling and edge-case resilience.',
    improveSnippets[1] || 'Architectural modularity and performance tuning.',
    'Test coverage and user accessibility standards.'
  ];

  // Derive skill gaps based on feedback comments and tech stack
  const skillGaps = [];
  const textToScan = (improveSnippets.join(' ') + ' ' + recommendSnippets.join(' ')).toLowerCase();

  if (textToScan.includes('queue') || textToScan.includes('redis') || textToScan.includes('async')) {
    skillGaps.push('Asynchronous Job Queueing (BullMQ / Redis)');
  }
  if (textToScan.includes('api') || textToScan.includes('rest') || textToScan.includes('rate-limit') || textToScan.includes('error')) {
    skillGaps.push('Robust REST API Architecture & Rate Limiting');
  }
  if (textToScan.includes('accessib') || textToScan.includes('aria') || textToScan.includes('screen reader') || textToScan.includes('touch')) {
    skillGaps.push('WCAG Accessibility & Ergonomic Design');
  }
  if (textToScan.includes('cluster') || textToScan.includes('algorithm') || textToScan.includes('scale')) {
    skillGaps.push('Scalable Similarity Search & Clustering');
  }
  if (textToScan.includes('cache') || textToScan.includes('database') || textToScan.includes('index')) {
    skillGaps.push('Database Indexing & Caching Strategies');
  }

  // Ensure at least 3 relevant skill gaps
  if (skillGaps.length < 3) {
    skillGaps.push('Automated Integration Testing & CI/CD');
    skillGaps.push('State Management & Modular Architecture');
    skillGaps.push('Production Monitoring & Telemetry');
  }

  const learningRecommendations = skillGaps.slice(0, 3).map((gap, i) => {
    let reason = 'Reviewers noted this area will improve project stability and scale.';
    let action = 'Build a focused micro-module or prototype solving this specific bottleneck.';

    if (gap.includes('Queue')) {
      reason = 'Prevent synchronous request timeouts during peak traffic bursts.';
      action = 'Implement a background worker queue using Redis and Express.';
    } else if (gap.includes('REST API')) {
      reason = 'Multiple peers suggested hardening server-side validation and HTTP error status codes.';
      action = 'Add centralized error middleware and schema validation with Zod or Joi.';
    } else if (gap.includes('Accessibility')) {
      reason = 'Ensures mobile touch targets and assistive devices can navigate effortlessly.';
      action = 'Audit with axe-core and verify minimum 44px tap targets.';
    } else if (gap.includes('Similarity')) {
      reason = 'Reduces computational complexity from O(N^2) to sub-linear lookups.';
      action = 'Explore vector embeddings or nearest-neighbor indexing.';
    }

    return {
      title: gap,
      reason,
      action
    };
  });

  const projectImprovements = [
    'Implement progressive disclosure to reduce visual data density on mobile screens.',
    'Add comprehensive client-side retry handling for intermittent network dropouts.',
    'Include automated seed scripts and developer documentation for easier community contributions.'
  ];

  const collaborationNeeds = (project.collab_looking_for && project.collab_looking_for.length > 0)
    ? project.collab_looking_for.map(role => `A peer skilled in ${role} to help accelerate feature velocity.`)
    : [
        'A Backend engineer to optimize data indexing and concurrency.',
        'A UI/UX designer to polish mobile interactions.'
      ];

  const feedback_synthesis = {
    reviewCount: Math.max(reviewCount, 1),
    liked: positiveSnippets[0] || 'Your problem statement and clean UI execution were consistently appreciated.',
    commonConcern: improveSnippets[0] || 'Peers recommended focusing on server resilience and data flow clarity.',
    uniqueSuggestion: recommendSnippets[0] || 'Explore caching frequently accessed data to boost responsiveness.',
    takeaway: `Your project shows excellent potential in ${project.category}. Pairing your strengths with dedicated focus on ${skillGaps[0] || 'backend engineering'} will take it to production grade.`
  };

  const summary = `${project.title} demonstrates strong clarity of vision and problem solving. Peer reviews emphasize solid execution, with key growth opportunities centered around ${skillGaps[0] || 'architectural scalability'} and ${skillGaps[1] || 'system optimization'}.`;

  return {
    summary,
    strengths,
    areasToImprove,
    skillGaps: skillGaps.slice(0, 4),
    learningRecommendations,
    projectImprovements,
    collaborationNeeds,
    feedback_synthesis
  };
}

/**
 * Validates that an AI output adheres to required JSON schema
 */
function isValidAIResponse(obj) {
  if (!obj || typeof obj !== 'object') return false;
  return (
    typeof obj.summary === 'string' &&
    Array.isArray(obj.strengths) &&
    Array.isArray(obj.areasToImprove) &&
    Array.isArray(obj.skillGaps) &&
    Array.isArray(obj.learningRecommendations)
  );
}
