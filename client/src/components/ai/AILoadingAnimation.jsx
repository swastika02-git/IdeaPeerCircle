import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, BookOpen, Users, Cpu } from 'lucide-react';

export default function AILoadingAnimation() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Reading the project…', desc: 'Parsing problem statement, technologies, and target users', icon: Brain },
    { title: 'Connecting the feedback…', desc: 'Synthesizing qualitative peer critiques with skill weighting', icon: Users },
    { title: 'Finding your learning gaps…', desc: 'Detecting architectural bottlenecks and missing proficiencies', icon: Cpu },
    { title: 'Building your learning snapshot…', desc: 'Curating actionable next steps and mentor recommendations', icon: BookOpen }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 900);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-8 sm:p-12 rounded-3xl bg-[#FDFAF0] border border-cerulean/50 shadow-warm text-center max-w-lg mx-auto my-6 animate-fadeIn">
      {/* Central Pulsing Brain / Sparkle Emblem */}
      <div className="relative inline-flex items-center justify-center mb-6">
        <div className="w-20 h-20 rounded-3xl bg-cerulean/30 border-2 border-cerulean flex items-center justify-center text-sceptre animate-pulseSubtle">
          <Sparkles className="w-10 h-10 text-sceptre animate-spin" style={{ animationDuration: '6s' }} />
        </div>
        <div className="absolute -inset-2 rounded-3xl border border-dashed border-sceptre/30 animate-spin" style={{ animationDuration: '20s' }} />
      </div>

      <div className="space-y-2 mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-sceptre font-heading">
          AI Learning Mentor
        </span>
        <h3 className="text-xl sm:text-2xl font-bold font-heading text-soil">
          {steps[currentStep].title}
        </h3>
        <p className="text-xs text-soil/70 max-w-xs mx-auto">
          {steps[currentStep].desc}
        </p>
      </div>

      {/* 4-Stage Progress Dots */}
      <div className="flex items-center justify-center gap-3">
        {steps.map((s, idx) => (
          <div
            key={s.title}
            className={`h-2 rounded-full transition-all duration-500 ${
              idx === currentStep
                ? 'w-10 bg-sceptre'
                : idx < currentStep
                ? 'w-4 bg-cerulean-dark'
                : 'w-2 bg-soil/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
