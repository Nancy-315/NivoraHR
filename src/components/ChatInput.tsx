// src/components/ChatInput.tsx - NivoraHR Chat Input Component
'use client';

import React, { useRef, useEffect } from 'react';
import { Send, StopCircle, CornerDownLeft } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  isLoading: boolean;
  onStop?: () => void;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSubmit,
  isLoading,
  onStop,
  placeholder = 'Ask NivoraHR anything about MBA HR, projects, labour laws, viva questions...',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className="w-full border-t border-slate-200/80 bg-white/95 backdrop-blur-md p-3 sm:p-4">
      <div className="mx-auto max-w-4xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isLoading && input.trim()) {
              onSubmit(e);
            }
          }}
          className="relative flex items-end gap-2 rounded-2xl border border-slate-300 bg-white p-2 shadow-xs transition-all focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 max-h-[180px] resize-none border-0 bg-transparent px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 leading-relaxed"
          />

          <div className="flex items-center gap-1.5 pb-1 pr-1">
            {isLoading && onStop ? (
              <button
                type="button"
                onClick={onStop}
                title="Stop response"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
              >
                <StopCircle className="h-5 w-5 text-rose-600" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                title="Send message (Enter)"
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all cursor-pointer ${
                  input.trim() && !isLoading
                    ? 'bg-brand-600 text-white shadow-xs hover:bg-brand-700 active:scale-95'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>

        {/* Footer Hint */}
        <div className="mt-2 flex items-center justify-between px-2 text-[11px] text-slate-400">
          <span className="hidden sm:inline-flex items-center gap-1">
            Press <kbd className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px] text-slate-500 border border-slate-200">Enter</kbd> to send, <kbd className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10px] text-slate-500 border border-slate-200">Shift + Enter</kbd> for new line
          </span>
          <span className="text-[11px] text-slate-400 ml-auto">
            NivoraHR is designed for educational & academic guidance.
          </span>
        </div>
      </div>
    </div>
  );
};
