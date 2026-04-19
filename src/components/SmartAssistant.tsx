import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, X, Send, Sparkles, ChevronDown, RotateCcw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Simple markdown-like renderer for bold text and links
function renderContent(text: string, onNavigate: (path: string) => void) {
  // Split by bold markers and internal links
  const parts = text.split(/(\*\*[^*]+\*\*|→\s*\/[a-z-/]+)/g);
  return parts.map((part, i) => {
    // Bold text
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-slate-100">{part.slice(2, -2)}</strong>;
    }
    // Internal navigation link (e.g. "→ /learn")
    const linkMatch = part.match(/→\s*(\/[a-z-/]+)/);
    if (linkMatch) {
      return (
        <button
          key={i}
          onClick={() => onNavigate(linkMatch[1])}
          className="inline text-violet-300 hover:text-violet-200 underline underline-offset-2 transition-colors"
        >
          → {linkMatch[1]}
        </button>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

const GREETING = "👋 Hey there! I'm **SwapBot**, your AI assistant. I can help you navigate the platform, find skills, understand features, or answer any questions. What would you like to know?";

const QUICK_PROMPTS = [
  "How do I find a skill to learn?",
  "How does matching work?",
  "How do I schedule a session?",
  "What are the premium features?",
];

const SmartAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'greeting',
      role: 'assistant',
      content: GREETING,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Animate the fab button in after a short delay
  useEffect(() => {
    const timer = setTimeout(() => setHasAnimatedIn(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  const handleNavigate = useCallback((path: string) => {
    navigate(path);
    setIsOpen(false);
  }, [navigate]);

  const sendMessage = async (text?: string) => {
    const messageText = (text || input).trim();
    if (!messageText || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Build history for context (exclude greeting)
      const history = messages
        .filter(m => m.id !== 'greeting')
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: messageText, history }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || data.message || "I'm having trouble thinking right now. Please try again!",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMsg]);

      // If chat is minimized, increment unread
      if (isMinimized) {
        setUnreadCount(c => c + 1);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Oops! I couldn't connect to my brain. Check your internet connection and try again. 🔌",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'greeting',
        role: 'assistant',
        content: GREETING,
        timestamp: new Date(),
      },
    ]);
    setUnreadCount(0);
  };

  const toggleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
      setUnreadCount(0);
    } else {
      setIsOpen(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(m => !m);
    if (isMinimized) setUnreadCount(0);
  };

  // Time formatting
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* ── Chat Window ────────────────────────────────────────────────── */}
      <div
        className={`fixed bottom-24 right-5 z-50 transition-all duration-300 ease-out
          ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}
        `}
        style={{ width: '380px', maxWidth: 'calc(100vw - 40px)' }}
      >
        <div
          className="rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/10"
          style={{
            height: isMinimized ? '60px' : '520px',
            maxHeight: 'calc(100vh - 140px)',
            background: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
            transition: 'height 0.3s ease',
          }}
        >
          {/* ── Header ───────────────────────────────────────────────── */}
          <div
            className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none flex-shrink-0"
            onClick={toggleMinimize}
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm">SwapBot</p>
              <p className="text-white/60 text-xs">AI Assistant • Online</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={e => { e.stopPropagation(); resetChat(); }}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                title="Reset chat"
              >
                <RotateCcw className="w-3.5 h-3.5 text-white/80" />
              </button>
              <button
                onClick={e => { e.stopPropagation(); toggleMinimize(); }}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <ChevronDown className={`w-4 h-4 text-white/80 transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); setIsOpen(false); }}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white/80" />
              </button>
            </div>
          </div>

          {/* ── Messages Area ───────────────────────────────────────── */}
          {!isMinimized && (
            <>
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(255,255,255,0.1) transparent',
                }}
              >
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-1' : 'order-1'}`}>
                      {/* Avatar for assistant */}
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-1.5 mb-1">
                          <div className="w-5 h-5 rounded-md flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                            <Bot className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-[10px] text-white/40 font-medium">SwapBot</span>
                        </div>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'text-white rounded-br-md'
                            : 'bg-white/8 text-white/90 rounded-bl-md border border-white/5'
                        }`}
                        style={
                          msg.role === 'user'
                            ? { background: 'linear-gradient(135deg, #667eea, #764ba2)' }
                            : {}
                        }
                      >
                        <p className="whitespace-pre-wrap">
                          {msg.role === 'assistant'
                            ? renderContent(msg.content, handleNavigate)
                            : msg.content}
                        </p>
                      </div>
                      <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-right text-white/30' : 'text-white/30'}`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/8 rounded-2xl rounded-bl-md px-4 py-3 border border-white/5">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* ── Quick Prompts (only show at start) ─────────────── */}
              {messages.length <= 1 && !isTyping && (
                <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(prompt)}
                      className="text-xs px-3 py-1.5 rounded-full bg-white/8 text-white/70 hover:bg-white/15 hover:text-white transition-all border border-white/5"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* ── Input Area ──────────────────────────────────────── */}
              <div className="px-4 pb-4 pt-2 flex-shrink-0">
                <div className="flex gap-2 items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={isAuthenticated ? "Ask me anything..." : "Log in to chat with me..."}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    disabled={isTyping || !isAuthenticated}
                    maxLength={1000}
                    className="flex-1 px-4 py-2.5 bg-white/8 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 outline-none focus:border-violet-400/50 focus:bg-white/10 disabled:opacity-40 transition-all"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={isTyping || !input.trim() || !isAuthenticated}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-30 transition-all hover:scale-105 active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-white/20 text-center mt-2">
                  Powered by Gemini AI • SwapLearnThrive
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Floating Action Button ─────────────────────────────────── */}
      <button
        onClick={toggleOpen}
        className={`fixed bottom-6 right-5 z-50 w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95 group
          ${hasAnimatedIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          ${isOpen ? 'rotate-0' : 'rotate-0'}
        `}
        style={{
          background: isOpen
            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
            : 'linear-gradient(135deg, #667eea, #764ba2)',
          boxShadow: isOpen
            ? '0 8px 32px rgba(239, 68, 68, 0.4)'
            : '0 8px 32px rgba(102, 126, 234, 0.4)',
        }}
        title={isOpen ? 'Close assistant' : 'Open SwapBot assistant'}
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform" />
        ) : (
          <>
            <Bot className="w-6 h-6 transition-transform group-hover:scale-110" />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-2xl animate-ping opacity-20"
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }} />
          </>
        )}

        {/* Unread badge */}
        {unreadCount > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg">
            {unreadCount}
          </span>
        )}
      </button>
    </>
  );
};

export default SmartAssistant;
