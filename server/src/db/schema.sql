-- IdeaPeerCircle Relational Database Schema
-- Compatible with PostgreSQL (Supabase) and SQLite

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  college TEXT,
  bio TEXT,
  avatar TEXT,
  skills TEXT, -- JSON array of strings
  currently_learning TEXT, -- JSON array of strings
  can_help_with TEXT, -- JSON array of strings
  interests TEXT, -- JSON array of strings
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  category TEXT NOT NULL,
  problem TEXT NOT NULL,
  target_users TEXT NOT NULL,
  solution TEXT NOT NULL,
  real_world_impact TEXT NOT NULL,
  tech_stack TEXT NOT NULL, -- JSON array of strings
  skills_used TEXT NOT NULL, -- JSON array of strings
  ai_used INTEGER DEFAULT 0, -- Boolean (1 = true, 0 = false)
  ai_details TEXT,
  difficulty TEXT DEFAULT 'Intermediate',
  github_url TEXT,
  live_demo_url TEXT,
  screenshots TEXT, -- JSON array of URLs
  collab_looking_for TEXT, -- JSON array of roles/skills
  collab_can_help_with TEXT, -- JSON array of roles/skills
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  reviewer_id TEXT NOT NULL,
  scores TEXT NOT NULL, -- JSON: { ui_ux, technical, innovation, ai, usefulness, problem_solving }
  overall_score REAL NOT NULL,
  well_done TEXT NOT NULL,
  to_improve TEXT NOT NULL,
  recommend_learn TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ai_insights (
  id TEXT PRIMARY KEY,
  project_id TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  strengths TEXT NOT NULL, -- JSON array of strings
  areas_to_improve TEXT NOT NULL, -- JSON array of strings
  skill_gaps TEXT NOT NULL, -- JSON array of strings
  learning_recommendations TEXT NOT NULL, -- JSON array of objects: [{ title, reason, action }]
  project_improvements TEXT NOT NULL, -- JSON array of strings
  collaboration_needs TEXT NOT NULL, -- JSON array of strings
  feedback_synthesis TEXT, -- JSON: { reviewCount, liked, commonConcern, uniqueSuggestion, takeaway }
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS collaborations (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  skill_offered TEXT NOT NULL,
  skill_wanted TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending', -- pending, accepted, declined, cancelled
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL, -- review, ai_ready, collab_request, collab_accepted, achievement
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  badge_key TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
