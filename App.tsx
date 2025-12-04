import React, { useState, useEffect, useRef } from 'react';
import { APP_DATASET } from './constants';
import { initializeChat, sendMessageToGemini } from './services/geminiService';
import { Message, Role, User, Theme, ChatSession } from './types';
import { ChatMessage } from './components/ChatMessage';
import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { SettingsModal } from './components/SettingsModal';
import { v4 as uuidv4 } from 'uuid';
import * as Storage from './services/storageService';

// Icons
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [theme, setTheme] = useState<Theme>('default');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = Storage.getUser();
    if (savedUser) setUser(savedUser);

    const savedHistory = Storage.getHistory();
    setChatHistory(savedHistory);

    const savedTheme = Storage.getTheme();
    setTheme(savedTheme);

    initializeChat();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');

    if (theme === 'dark') root.classList.add('dark');
    else if (theme === 'light') root.classList.add('light');
    else root.classList.add('dark');
  }, [theme]);

  useEffect(() => {
    if (currentSessionId && messages.length > 0) {
      setChatHistory(prev => {
        const existingIndex = prev.findIndex(s => s.id === currentSessionId);
        const title = messages.find(m => m.role === Role.USER)?.text.slice(0, 30) + "..." || "New Conversation";

        let newHistory;
        if (existingIndex >= 0) {
          newHistory = [...prev];
          newHistory[existingIndex] = { ...newHistory[existingIndex], messages, title };
        } else {
          newHistory = [...prev, { id: currentSessionId, title, messages, date: new Date() }];
        }

        Storage.saveHistory(newHistory);
        return newHistory;
      });
    }
  }, [messages, currentSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    Storage.saveUser(userData);
    startNewChat(userData.name);
  };

  const handleLogout = () => {
    Storage.clearSession();
    setUser(null);
    setMessages([]);
    setChatHistory([]);
    setCurrentSessionId(null);
    setIsSettingsOpen(false);
  };

  const startNewChat = (userName?: string) => {
    const newId = uuidv4();
    setCurrentSessionId(newId);
    const greeting = `Hello ${userName || user?.name || 'Explorer'}! How are you today? I am ready to assist with ${APP_DATASET.productName} or any other topic.`;

    setMessages([
      {
        id: uuidv4(),
        role: Role.MODEL,
        text: greeting,
        timestamp: new Date(),
      },
    ]);

    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const loadSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    Storage.saveUser(updatedUser);
  };

  const handleUpdateTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    Storage.saveTheme(newTheme);
  };

  // ✅ Updated handleSend to properly call backend via geminiService
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');

    const newUserMsg: Message = {
      id: uuidv4(),
      role: Role.USER,
      text: userText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(userText); // Calls Render backend
      const newBotMsg: Message = {
        id: uuidv4(),
        role: Role.MODEL,
        text: responseText || "⚠️ No response from backend.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newBotMsg]);
    } catch (error) {
      console.error("Failed to get response", error);
      const newBotMsg: Message = {
        id: uuidv4(),
        role: Role.MODEL,
        text: "⚠️ Server not responding. Check backend logs.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newBotMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="flex h-full w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 overflow-hidden font-sans transition-colors duration-300">

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        currentTheme={theme}
        onUpdateUser={handleUpdateUser}
        onUpdateTheme={handleUpdateTheme}
        onLogout={handleLogout}
      />

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
        history={chatHistory}
        currentSessionId={currentSessionId}
        onLoadSession={loadSession}
        onNewChat={() => startNewChat()}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="flex-1 flex flex-col h-full relative bg-white/50 dark:bg-slate-900/50">

        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
            >
              <MenuIcon />
            </button>

            <div>
              <h1 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">
                {APP_DATASET.productName}
              </h1>

              <div className="flex items-center gap-2 text-xs text-indigo-500 dark:text-indigo-400 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Connected
              </div>
            </div>
          </div>

          <div className="hidden md:block text-xs text-slate-400 dark:text-slate-500">
            Experience-Ai-with-Ayush
          </div>

        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-12 py-6 custom-scrollbar">
          <div className="max-w-4xl mx-auto w-full">
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} user={user} />
            ))}

            {isLoading && (
              <div className="flex w-full justify-start mb-6 animate-pulse">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                   <div className="px-5 py-4 rounded-2xl rounded-tl-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 flex items-center gap-1.5 shadow-sm">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                   </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 md:p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto relative flex items-end gap-3">
            <div className="flex-1 relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${APP_DATASET.productName}...`}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 rounded-2xl px-6 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border border-transparent focus:border-indigo-500/30 shadow-inner"
                disabled={isLoading}
                autoFocus
              />
            </div>

            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className={`p-4 rounded-2xl flex items-center justify-center shadow-lg ${
                isLoading || !input.trim()
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-105 active:scale-95'
              }`}
            >
              <SendIcon />
            </button>

          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
