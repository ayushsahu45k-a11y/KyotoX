import React, { useState, useRef } from 'react';
import { User, Theme } from '../types';

interface SettingsModalProps {
  user: User;
  currentTheme: Theme;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (user: User) => void;
  onUpdateTheme: (theme: Theme) => void;
  onLogout: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  user, currentTheme, isOpen, onClose, onUpdateUser, onUpdateTheme, onLogout
}) => {
  const [formData, setFormData] = useState<User>(user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdateUser(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Account Settings</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
             <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
               {formData.avatar ? (
                 <img src={formData.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 dark:border-slate-700 shadow-lg" />
               ) : (
                 <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {formData.name.charAt(0).toUpperCase()}
                 </div>
               )}
               <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                   <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zJM18.75 10.5h.008v.008h-.008V10.5z" />
                 </svg>
               </div>
               <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
             </div>
             <p className="text-xs text-slate-500 mt-2">Click to upload photo</p>
          </div>

          {/* User Fields */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Display Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full mt-1 bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-4 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Age</label>
              <input 
                type="number" 
                value={formData.age || ''}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="w-full mt-1 bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-4 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Years"
              />
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Interface Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {(['light', 'dark', 'default'] as Theme[]).map((theme) => (
                <button
                  key={theme}
                  onClick={() => onUpdateTheme(theme)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                    currentTheme === theme
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                  }`}
                >
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-between border-t border-slate-200 dark:border-slate-800">
           <button 
             onClick={onLogout}
             className="text-red-500 hover:text-red-600 text-sm font-semibold px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
           >
             Log Out
           </button>
           <button 
             onClick={handleSave}
             className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-6 py-2 rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
           >
             Save Changes
           </button>
        </div>

      </div>
    </div>
  );
};