import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Layers,
  Code2,
  Globe,
  Users,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import api from '../../api/client';
import { fireSparkles } from '../brand/SparkleEffect';

const CATEGORIES = [
  'EdTech / AI',
  'Sustainability / Mobility',
  'Mental Health / Community',
  'Developer Tools / Learning',
  'Marketplace / Campus Utility',
  'Healthcare / Bio',
  'Creative / Media'
];

const COLLAB_OPTIONS = [
  'Frontend',
  'Backend',
  'AI/ML',
  'UI/UX',
  'Database',
  'Testing',
  'Deployment',
  'Documentation'
];

export default function ProjectCreateWizard({ isOpen, onClose, onProjectCreated }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    category: 'EdTech / AI',
    problem: '',
    target_users: '',
    solution: '',
    real_world_impact: '',
    tech_stack: ['React', 'Node.js'],
    skills_used: ['Frontend', 'REST APIs'],
    ai_used: true,
    ai_details: '',
    difficulty: 'Intermediate',
    github_url: '',
    live_demo_url: '',
    screenshot_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    collab_looking_for: ['Backend', 'Database'],
    collab_can_help_with: ['Frontend', 'UI/UX']
  });

  const [tempTech, setTempTech] = useState('');
  const [tempSkill, setTempSkill] = useState('');

  if (!isOpen) return null;

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!formData.title.trim()) {
        setError('Please enter a project title.');
        return;
      }
      if (!formData.short_description.trim()) {
        setError('Please provide a short description for cards.');
        return;
      }
    } else if (step === 2) {
      if (!formData.problem.trim() || !formData.solution.trim()) {
        setError('Please specify both the problem and your solution.');
        return;
      }
    }
    setStep(prev => Math.min(6, prev + 1));
  };

  const handleBack = () => {
    setError(null);
    setStep(prev => Math.max(1, prev - 1));
  };

  const toggleCollabLooking = (role) => {
    setFormData(prev => ({
      ...prev,
      collab_looking_for: prev.collab_looking_for.includes(role)
        ? prev.collab_looking_for.filter(r => r !== role)
        : [...prev.collab_looking_for, role]
    }));
  };

  const toggleCollabCanHelp = (role) => {
    setFormData(prev => ({
      ...prev,
      collab_can_help_with: prev.collab_can_help_with.includes(role)
        ? prev.collab_can_help_with.filter(r => r !== role)
        : [...prev.collab_can_help_with, role]
    }));
  };

  const addTech = () => {
    if (tempTech.trim() && !formData.tech_stack.includes(tempTech.trim())) {
      setFormData(prev => ({ ...prev, tech_stack: [...prev.tech_stack, tempTech.trim()] }));
      setTempTech('');
    }
  };

  const removeTech = (item) => {
    setFormData(prev => ({ ...prev, tech_stack: prev.tech_stack.filter(t => t !== item) }));
  };

  const addSkill = () => {
    if (tempSkill.trim() && !formData.skills_used.includes(tempSkill.trim())) {
      setFormData(prev => ({ ...prev, skills_used: [...prev.skills_used, tempSkill.trim()] }));
      setTempSkill('');
    }
  };

  const removeSkill = (item) => {
    setFormData(prev => ({ ...prev, skills_used: prev.skills_used.filter(s => s !== item) }));
  };

  const handlePublish = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        screenshots: [formData.screenshot_url]
      };
      const created = await api.createProject(payload);
      fireSparkles();
      onProjectCreated(created);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to publish project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-java/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#FDFAF0] rounded-3xl shadow-lift border border-soil/20 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Progress Steps */}
        <div className="p-5 sm:p-6 border-b border-soil/10 bg-cream-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sceptre font-heading">
              Step {step} of 6
            </span>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-soil mt-0.5">
              {step === 1 && 'Project Basics'}
              {step === 2 && 'Problem & Solution'}
              {step === 3 && 'Technology & Skills'}
              {step === 4 && 'Links & Visuals'}
              {step === 5 && 'Collaboration Needs'}
              {step === 6 && 'Review & Publish'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-soil/60 hover:text-sceptre hover:bg-soil/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-soil/10 h-1.5">
          <div
            className="bg-sceptre h-1.5 transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-100/80 border border-red-300 text-sceptre text-xs font-semibold">
              {error}
            </div>
          )}

          {/* STEP 1: BASICS */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1.5 font-heading">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. StudyBuddy AI, CampusCare, GreenRoute"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-soil/20 text-sm text-java focus:outline-none focus:border-sceptre"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1.5 font-heading">
                  Short Description * (appears on cards)
                </label>
                <textarea
                  rows={2}
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="A clear 1-2 sentence pitch explaining what you built..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-soil/20 text-sm text-java focus:outline-none focus:border-sceptre"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1.5 font-heading">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-soil/20 text-sm text-java focus:outline-none focus:border-sceptre"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: PROBLEM & SOLUTION */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1.5 font-heading">
                  What Problem Are You Solving? *
                </label>
                <textarea
                  rows={3}
                  value={formData.problem}
                  onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                  placeholder="Explain the real issue students or users face today..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-soil/20 text-sm text-java focus:outline-none focus:border-sceptre"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1.5 font-heading">
                  Target Users
                </label>
                <input
                  type="text"
                  value={formData.target_users}
                  onChange={(e) => setFormData({ ...formData, target_users: e.target.value })}
                  placeholder="e.g. Undergrads taking STEM problem sets, campus commuters"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-soil/20 text-sm text-java focus:outline-none focus:border-sceptre"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1.5 font-heading">
                  Your Solution *
                </label>
                <textarea
                  rows={3}
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  placeholder="How does your project uniquely solve this problem?"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-soil/20 text-sm text-java focus:outline-none focus:border-sceptre"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1.5 font-heading">
                  Real-World Impact
                </label>
                <input
                  type="text"
                  value={formData.real_world_impact}
                  onChange={(e) => setFormData({ ...formData, real_world_impact: e.target.value })}
                  placeholder="e.g. Tested with 80 students, saved 120 lbs of CO2, etc."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-soil/20 text-sm text-java focus:outline-none focus:border-sceptre"
                />
              </div>
            </div>
          )}

          {/* STEP 3: TECHNOLOGY */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1.5 font-heading">
                  Tech Stack (Press Enter or click +)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tempTech}
                    onChange={(e) => setTempTech(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                    placeholder="e.g. React, Next.js, FastAPI, PostgreSQL"
                    className="flex-1 px-4 py-2 rounded-xl bg-white border border-soil/20 text-sm text-java focus:outline-none focus:border-sceptre"
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    className="px-4 py-2 bg-cerulean text-java font-bold rounded-xl text-sm hover:bg-cerulean-dark"
                  >
                    + Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.tech_stack.map(t => (
                    <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-soil/10 text-soil text-xs font-medium">
                      {t}
                      <button onClick={() => removeTech(t)} className="hover:text-sceptre">&times;</button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1.5 font-heading">
                  Skills Used
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tempSkill}
                    onChange={(e) => setTempSkill(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                    placeholder="e.g. Frontend, WebRTC, Accessibility"
                    className="flex-1 px-4 py-2 rounded-xl bg-white border border-soil/20 text-sm text-java focus:outline-none focus:border-sceptre"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-cerulean text-java font-bold rounded-xl text-sm hover:bg-cerulean-dark"
                  >
                    + Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.skills_used.map(s => (
                    <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cerulean/30 text-soil text-xs font-medium">
                      {s}
                      <button onClick={() => removeSkill(s)} className="hover:text-sceptre">&times;</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Used Toggle */}
              <div className="p-4 rounded-2xl bg-white border border-soil/15 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-heading font-bold text-sm text-soil flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Does this project use AI?
                    </p>
                    <p className="text-xs text-soil/60">Enables AI review dimension & smart capability tagging</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.ai_used}
                    onChange={(e) => setFormData({ ...formData, ai_used: e.target.checked })}
                    className="w-5 h-5 accent-sceptre cursor-pointer"
                  />
                </div>
                {formData.ai_used && (
                  <input
                    type="text"
                    value={formData.ai_details}
                    onChange={(e) => setFormData({ ...formData, ai_details: e.target.value })}
                    placeholder="Briefly describe AI usage (e.g., embeddings, Gemini, CV barcode scanner)"
                    className="w-full mt-2 px-3 py-2 rounded-xl bg-cream-50 border border-soil/20 text-xs text-java focus:outline-none"
                  />
                )}
              </div>
            </div>
          )}

          {/* STEP 4: LINKS & MEDIA */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1.5 font-heading">
                  GitHub Repository URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  placeholder="https://github.com/username/project"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-soil/20 text-sm text-java focus:outline-none focus:border-sceptre"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1.5 font-heading">
                  Live Demo URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.live_demo_url}
                  onChange={(e) => setFormData({ ...formData, live_demo_url: e.target.value })}
                  placeholder="https://yourproject.demo.app"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-soil/20 text-sm text-java focus:outline-none focus:border-sceptre"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1.5 font-heading">
                  Screenshot Image URL
                </label>
                <input
                  type="url"
                  value={formData.screenshot_url}
                  onChange={(e) => setFormData({ ...formData, screenshot_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-soil/20 text-sm text-java focus:outline-none focus:border-sceptre"
                />
                <div className="mt-2 rounded-xl overflow-hidden h-36 border border-soil/15 bg-soil/5">
                  <img
                    src={formData.screenshot_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80'; }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: COLLABORATION */}
          {step === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1 font-heading">
                  What kind of help are you looking for?
                </label>
                <p className="text-xs text-soil/60 mb-2">Select areas where peer collaborators could join forces:</p>
                <div className="flex flex-wrap gap-2">
                  {COLLAB_OPTIONS.map(role => {
                    const selected = formData.collab_looking_for.includes(role);
                    return (
                      <button
                        type="button"
                        key={role}
                        onClick={() => toggleCollabLooking(role)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          selected
                            ? 'bg-sceptre text-cream shadow-sm scale-105'
                            : 'bg-white border border-soil/20 text-soil hover:bg-soil/5'
                        }`}
                      >
                        {role} {selected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-soil uppercase tracking-wider mb-1 font-heading">
                  What can you help others with in return?
                </label>
                <p className="text-xs text-soil/60 mb-2">Offer your strengths to support complementary peer builders:</p>
                <div className="flex flex-wrap gap-2">
                  {COLLAB_OPTIONS.map(role => {
                    const selected = formData.collab_can_help_with.includes(role);
                    return (
                      <button
                        type="button"
                        key={role}
                        onClick={() => toggleCollabCanHelp(role)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          selected
                            ? 'bg-cerulean-dark text-java shadow-sm scale-105'
                            : 'bg-white border border-soil/20 text-soil hover:bg-soil/5'
                        }`}
                      >
                        {role} {selected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: PREVIEW & PUBLISH */}
          {step === 6 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-white border border-soil/20 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cerulean/40 text-soil">
                      {formData.category}
                    </span>
                    <h3 className="text-lg font-bold font-heading text-soil mt-1">{formData.title}</h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-cream text-soil font-bold border border-soil/15">
                    {formData.difficulty}
                  </span>
                </div>

                <p className="text-xs text-soil/80 leading-relaxed">{formData.short_description}</p>

                <div className="pt-2 border-t border-soil/10 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-bold text-soil block">Problem:</span>
                    <p className="text-soil/70 line-clamp-2">{formData.problem}</p>
                  </div>
                  <div>
                    <span className="font-bold text-soil block">Solution:</span>
                    <p className="text-soil/70 line-clamp-2">{formData.solution}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-soil/10 flex flex-wrap gap-1">
                  {formData.tech_stack.map(t => (
                    <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-soil/10 text-soil font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-cerulean/25 border border-cerulean/40 text-xs text-soil flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sceptre shrink-0" />
                <span>Publishing will immediately trigger initial AI project analysis and unlock peer review capabilities!</span>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-soil/10 bg-cream-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-soil hover:bg-soil/5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 6 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-sceptre hover:bg-sceptre-dark text-cream font-heading font-bold text-xs sm:text-sm shadow-warm transition-transform active:scale-95"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sceptre hover:bg-sceptre-dark text-cream font-heading font-bold text-xs sm:text-sm shadow-warm transition-transform active:scale-95 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-cream border-t-transparent rounded-full animate-spin" />
                  <span>Publishing & Initializing AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Publish Project to Circle</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
