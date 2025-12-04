import { User, ChatSession, Theme } from '../types';

const STORAGE_KEYS = {
  USER: 'app_user',
  HISTORY: 'app_chat_history',
  THEME: 'app_theme',
};

export const saveUser = (user: User) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const saveHistory = (history: ChatSession[]) => {
  // Convert dates back to strings for storage
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
};

export const getHistory = (): ChatSession[] => {
  const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
  if (!data) return [];
  const parsed = JSON.parse(data);
  // Revive dates
  return parsed.map((session: any) => ({
    ...session,
    date: new Date(session.date),
    messages: session.messages.map((m: any) => ({
      ...m,
      timestamp: new Date(m.timestamp)
    }))
  }));
};

export const saveTheme = (theme: Theme) => {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
};

export const getTheme = (): Theme => {
  return (localStorage.getItem(STORAGE_KEYS.THEME) as Theme) || 'default';
};

export const clearSession = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
}
