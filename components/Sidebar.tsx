import React, { useState } from 'react';
import { User, ChatSession } from '../types';
import { DatasetVisualizer } from './DatasetVisualizer';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  history: ChatSession[];
  currentSessionId: string | null;
  onLoadSession: (session: ChatSession) => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, onClose, user, history, currentSessionId, onLoadSession, onNewChat, onOpenSettings 
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'data'>('history');

  const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
    <aside 
      className={`fixed lg:static inset-y-0 left-0 z-30 w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden lg:border-none'
      } lg:flex lg:flex-col lg:w-80 shadow-2xl lg:shadow-none`}
    >
      <div className="h-full flex flex-col relative">
        
        {/* Mobile Close */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 lg:hidden z-50"
        >
          <XIcon />
        </button>

        {/* Tab Switcher */}
        <div className="flex p-4 gap-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
           <button 
             onClick={() => setActiveTab('history')}
             className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
               activeTab === 'history' 
                 ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300' 
                 : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
             }`}
           >
             Chat History
           </button>
           <button 
             onClick={() => setActiveTab('data')}
             className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
               activeTab === 'data' 
                 ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300' 
                 : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
             }`}
           >
             Knowledge Base
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          
          {/* History Tab */}
          <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'history' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
             <div className="h-full flex flex-col p-4 overflow-y-auto custom-scrollbar">
                
                <button 
                  onClick={onNewChat}
                  className="w-full mb-6 py-3 px-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-500 hover:text-indigo-500 dark:hover:border-indigo-400 dark:hover:text-indigo-400 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  New Conversation
                </button>

                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Recent Sessions</h3>
                  {history.length === 0 && (
                    <div className="text-center text-slate-400 text-sm py-8 italic">No history yet. Start chatting!</div>
                  )}
                  {history.slice().reverse().map((session) => (
                    <button
                      key={session.id}
                      onClick={() => onLoadSession(session)}
                      className={`w-full text-left p-3 rounded-lg transition-all border ${
                        currentSessionId === session.id
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-500/30'
                          : 'bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className={`font-medium text-sm truncate ${currentSessionId === session.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'}`}>
                        {session.title}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                         <span>{session.date.toLocaleDateString()}</span>
                         <span>{session.messages.length} msgs</span>
                      </div>
                    </button>
                  ))}
                </div>
             </div>
          </div>

          {/* Dataset Tab */}
          <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'data' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <DatasetVisualizer />
          </div>

        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
           <button 
             onClick={onOpenSettings}
             className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors group"
           >
              <div className="relative">
                {user.avatar ? (
                  <img src={user.avatar} alt="Me" className="w-10 h-10 rounded-full object-cover border-2 border-slate-300 dark:border-slate-600 group-hover:border-indigo-500 transition-colors" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="font-bold text-slate-800 dark:text-white truncate text-sm">{user.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400 group-hover:text-indigo-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.348 2.995a1.5 1.5 0 011.08 1.995l-.65 1.55a1.5 1.5 0 001.077 2.01l1.54.385a1.5 1.5 0 011.08 2.007l-.65 1.55a1.5 1.5 0 001.077 2.01l1.54.385a1.5 1.5 0 011.08 2.007l-.65 1.55a1.5 1.5 0 001.077 2.01l1.54.385a1.5 1.5 0 01.328 2.627l-1.397 1.12a1.5 1.5 0 00-.547 1.706l.39 1.62a1.5 1.5 0 01-1.313 1.838l-1.68.21a1.5 1.5 0 00-1.334 1.144l-.39 1.62a1.5 1.5 0 01-1.838 1.313l-1.68-.21a1.5 1.5 0 00-1.334 1.144l-.39 1.62a1.5 1.5 0 01-2.627.328l-1.12-1.397a1.5 1.5 0 00-1.706-.547l-1.62.39a1.5 1.5 0 01-1.838-1.313l-.21-1.68a1.5 1.5 0 00-1.144-1.334l-1.62-.39a1.5 1.5 0 01-1.313-1.838l.21-1.68a1.5 1.5 0 00-1.144-1.334l-1.62-.39a1.5 1.5 0 01-.328-2.627l1.397-1.12a1.5 1.5 0 00.547-1.706l-.39-1.62a1.5 1.5 0 011.313-1.838l1.68-.21a1.5 1.5 0 001.334-1.144l.39-1.62a1.5 1.5 0 011.838-1.313l1.68.21a1.5 1.5 0 001.334-1.144l.39-1.62h.001zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" />
              </svg>
           </button>
        </div>
      </div>
    </aside>
  );
};