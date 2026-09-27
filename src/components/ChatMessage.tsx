// src/components/ChatMessage.tsx - NivoraHR Message Bubble Component
'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '@/types/chat';
import { Sparkles, User, Copy, Check, RotateCcw, AlertTriangle } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  onRetry?: () => void;
  isLast?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRetry, isLast }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isStreaming = Boolean(message.isStreaming);
  const isError = Boolean(message.error);

  const handleCopy = async () => {
    if (!message.content) return;
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  if (isUser) {
    return (
      <div className="flex w-full justify-end px-4 py-3">
        <div className="flex max-w-[85%] sm:max-w-[75%] items-start gap-2.5 flex-row-reverse">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-white shadow-xs">
            <User className="h-4 w-4" />
          </div>
          <div className="rounded-2xl rounded-tr-sm bg-brand-600 px-4 py-2.5 text-white shadow-xs text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  // Assistant / Error view
  return (
    <div className="flex w-full justify-start px-4 py-3">
      <div className="flex w-full max-w-full sm:max-w-3xl items-start gap-3">
        {/* Assistant Avatar */}
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white shadow-xs ${
            isError
              ? 'bg-rose-600'
              : 'bg-gradient-to-tr from-brand-700 via-brand-600 to-brand-500'
          }`}
        >
          {isError ? <AlertTriangle className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
        </div>

        {/* Message Container */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-800">NivoraHR</span>
            {isStreaming && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full animate-pulse border border-brand-200/60">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                Thinking & generating...
              </span>
            )}
          </div>

          <div
            className={`rounded-2xl rounded-tl-sm border p-4 text-sm text-slate-800 shadow-2xs ${
              isError
                ? 'border-rose-200 bg-rose-50/70 text-rose-900'
                : 'border-slate-200/90 bg-white'
            }`}
          >
            {isError ? (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-rose-800 font-medium">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{message.content}</span>
                </div>
                {onRetry && (
                  <div>
                    <button
                      onClick={onRetry}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 active:scale-95 transition-all cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Try Again</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Content Rendering */}
                {message.content ? (
                  <div className="markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 py-1 text-slate-500 text-xs">
                    <span className="inline-block h-2 w-2 rounded-full bg-brand-500 animate-ping" />
                    <span>NivoraHR is thinking...</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Action Footer (Copy, Timestamp) */}
          {!isError && message.content && (
            <div className="mt-1.5 flex items-center justify-between px-1">
              <span className="text-[11px] text-slate-400">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopy}
                  title="Copy complete response to clipboard"
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-medium text-[11px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span className="text-[11px]">Copy</span>
                    </>
                  )}
                </button>

                {isLast && !isStreaming && onRetry && (
                  <button
                    onClick={onRetry}
                    title="Regenerate this response"
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span className="text-[11px]">Retry</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
