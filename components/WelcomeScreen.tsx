// src/components/WelcomeScreen.tsx - NivoraHR Hero & Quick Prompts
'use client';

import React from 'react';
import {
  BarChart3,
  GraduationCap,
  Scale,
  FileSpreadsheet,
  HelpCircle,
  Briefcase,
  Target,
  Sparkles,
  Zap,
} from 'lucide-react';

interface WelcomeScreenProps {
  onSelectPrompt: (promptText: string) => void;
}

const QUICK_PROMPTS = [
  {
    title: 'Explain HR Analytics',
    description: 'Metrics, turnover rates, cost-per-hire & predictive workforce models',
    icon: BarChart3,
    color: 'text-blue-600 bg-blue-50 border-blue-100',
  },
  {
    title: 'Help me prepare an MBA Project',
    description: 'Topic formulation, hypotheses, Likert scale surveys & methodology',
    icon: GraduationCap,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
  },
  {
    title: 'Explain Labour Laws',
    description: 'Factories Act, POSH, Industrial Disputes & statutory compliance',
    icon: Scale,
    color: 'text-amber-600 bg-amber-50 border-amber-100',
  },
  {
    title: 'Help with my Internship Report',
    description: 'Executive summaries, weekly logs, company profiles & HR observations',
    icon: FileSpreadsheet,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  },
  {
    title: 'Give me HR Viva Questions',
    description: 'Top viva questions with structured, confident academic model answers',
    icon: HelpCircle,
    color: 'text-rose-600 bg-rose-50 border-rose-100',
  },
  {
    title: 'Explain Performance Management',
    description: 'KPIs, OKRs, 360-degree appraisal & Bell curve forced distribution',
    icon: Target,
    color: 'text-cyan-600 bg-cyan-50 border-cyan-100',
  },
  {
    title: 'Create an HR Questionnaire',
    description: 'Construct 5-point Likert survey scales for MBA research projects',
    icon: FileSpreadsheet,
    color: 'text-teal-600 bg-teal-50 border-teal-100',
  },
  {
    title: 'Help me prepare for an HR Interview',
    description: 'Behavioural questions, STAR method, scenario answers & resume tips',
    icon: Briefcase,
    color: 'text-purple-600 bg-purple-50 border-purple-100',
  },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectPrompt }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center sm:py-12">
      {/* Badge */}
      <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 border border-brand-200/80 shadow-xs">
        <Sparkles className="h-3.5 w-3.5 text-brand-600" />
        <span>Your Intelligent HR & MBA Assistant</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        Hi! I&apos;m NivoraHR <span className="inline-block animate-wave origin-bottom-right">👋</span>
      </h1>

      {/* Subtitle */}
      <p className="mt-3 max-w-xl text-sm sm:text-base text-slate-600 leading-relaxed">
        Your intelligent HR &amp; MBA assistant. Ask me anything about HR, MBA projects, labour laws, internships, assignments, reports, or viva preparation.
      </p>

      {/* Feature Highlights Pills */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 font-medium border border-slate-200 shadow-2xs">
          <Zap className="h-3 w-3 text-amber-500" /> Real-time Streaming
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 font-medium border border-slate-200 shadow-2xs">
          🎓 MBA Academic Calibration (2/5/10/15 Marks)
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 font-medium border border-slate-200 shadow-2xs">
          🌐 English, Tamil & Tanglish
        </span>
      </div>

      {/* Quick Prompts Grid */}
      <div className="mt-8 w-full max-w-3xl">
        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-3 text-left">
          Suggested Topics & Quick Prompts
        </p>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-2">
          {QUICK_PROMPTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => onSelectPrompt(item.title)}
                className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 text-left transition-all hover:border-brand-300 hover:bg-brand-50/30 hover:shadow-xs active:scale-[0.99] cursor-pointer"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${item.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 group-hover:text-brand-700 transition-colors">
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
