export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
}

export interface User {
  name: string;
  email: string;
  age?: string;
  avatar?: string; // Base64 string for image
}

export type Theme = 'dark' | 'light' | 'default';

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  date: Date;
}

export interface SystemStat {
  name: string;
  value: number;
  unit: string;
  fullMark: number;
}

export interface DatasetSection {
  title: string;
  content: string | Record<string, any>;
}

export interface KnowledgeBase {
  productName: string;
  version: string;
  description: string;
  stats: SystemStat[];
  features: Record<string, string>;
  troubleshooting: Array<{ problem: string; solution: string }>;
  faq: Array<{ question: string; answer: string }>;
}