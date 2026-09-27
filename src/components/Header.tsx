// src/components/Header.tsx - NivoraHR Top Navigation Header
'use client';

import React from 'react';
import { Sparkles, Plus, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onNewChat: () => void;
  hasMessages: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onNewChat, hasMessages }) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-brand-500 text-white shadow-sm shadow-brand-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900">NivoraHR</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <p className="hidden text-xs text-slate-500 sm:block">
              Your Intelligent HR & MBA Assistant
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 mr-2 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/70">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
            <span>Public • No Login Required</span>
          </div>

          <button
            onClick={onNewChat}
            disabled={!hasMessages}
            title="Start a new chat session"
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              hasMessages
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 shadow-sm cursor-pointer'
                : 'bg-slate-50 text-slate-400 border border-transparent cursor-not-allowed opacity-60'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </button>
        </div>
      </div>
    </header>
  );
};
