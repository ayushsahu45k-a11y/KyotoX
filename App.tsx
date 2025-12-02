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
    setMessages(prev => [...prev]()
