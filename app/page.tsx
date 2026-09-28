// src/app/page.tsx - NivoraHR Main Chat Interface
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message } from '@/types/chat';
import { Header } from '@/components/Header';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'end',
    });
  }, []);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, scrollToBottom]);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.role === 'assistant' && last.isStreaming) {
          return prev.map((m, idx) =>
            idx === prev.length - 1 ? { ...m, isStreaming: false } : m
          );
        }
        return prev;
      });
    }
  };

  const handleNewChat = () => {
    handleStop();
    setMessages([]);
    setInput('');
  };

  const executeChat = async (userPromptText: string, customHistory?: Message[]) => {
    const trimmed = userPromptText.trim();
    if (!trimmed || isLoading) return;

    handleStop();

    // 1. Construct user message
    const userMessage: Message = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };

    // 2. Base history for this request
    const currentList = customHistory ? customHistory : messages;
    const updatedMessages = [...currentList, userMessage];

    // 3. Construct assistant placeholder
    const assistantId = `ast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const assistantMessage: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    setMessages([...updatedMessages, assistantMessage]);
    setInput('');
    setIsLoading(true);

    // Prepare lightweight conversation history for the API
    const historyPayload = updatedMessages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({ messages: historyPayload }),
      });

      if (!response.ok) {
        let errMessage = 'Unable to connect right now. Please try again.';
        try {
          const errData = await response.json();
          if (errData?.error) {
            errMessage = errData.error;
          }
        } catch {
          // Fallback to default message
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? {
                  ...msg,
                  content: errMessage,
                  isStreaming: false,
                  error: true,
                }
              : msg
          )
        );
        setIsLoading(false);
        return;
      }

      // Read streaming text response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('ReadableStream not supported on this browser.');
      }

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? {
                  ...msg,
                  content: accumulated,
                }
              : msg
          )
        );
      }

      // Streaming completed successfully
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                isStreaming: false,
              }
            : msg
        )
      );
    } catch (err: unknown) {
      const error = err as Error;
      if (error?.name === 'AbortError') {
        // User voluntarily stopped generation
        return;
      }

      console.error('[NivoraHR Chat Client Error]', err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content: 'Connection problem. Please try again.',
                isStreaming: false,
                error: true,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleRetry = () => {
    if (messages.length === 0 || isLoading) return;

    // Find the last user message
    let lastUserIdx = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserIdx = i;
        break;
      }
    }

    if (lastUserIdx === -1) return;

    const lastUserPrompt = messages[lastUserIdx].content;
    // Strip everything from the last user message onwards
    const historyBefore = messages.slice(0, lastUserIdx);
    executeChat(lastUserPrompt, historyBefore);
  };

  return (
    <div className="flex h-screen flex-col bg-slate-50 text-slate-900">
      {/* Top Header */}
      <Header onNewChat={handleNewChat} hasMessages={messages.length > 0} />

      {/* Main Conversation Stream */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto flex h-full max-w-4xl flex-col">
          {messages.length === 0 ? (
            <div className="my-auto">
              <WelcomeScreen onSelectPrompt={(prompt) => executeChat(prompt)} />
            </div>
          ) : (
            <div className="py-4">
              {messages.map((msg, index) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  isLast={index === messages.length - 1}
                  onRetry={handleRetry}
                />
              ))}
              <div ref={messagesEndRef} className="h-6" />
            </div>
          )}
        </div>
      </main>

      {/* Bottom Sticky Chat Input */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={() => executeChat(input)}
        isLoading={isLoading}
        onStop={handleStop}
      />
    </div>
  );
}
