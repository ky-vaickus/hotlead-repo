export enum AgentType {
  SALES = 'SALES',
  RECRUITING = 'RECRUITING',
}

export interface Candidate {
  id: string;
  name: string;
  title: string;
  company?: string;
  location?: string;
  experience?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  requiresAuth?: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  candidates: Candidate[];
}