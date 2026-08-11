export type UserRole = 'executor' | 'client';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface Deliverable {
  title: string;
  status: 'done' | 'in_progress' | 'pending';
  link?: string;
}

export interface DailyLog {
  id: string;
  log_date: string; // YYYY-MM-DD
  title: string;
  summary: string;
  hours_spent: number;
  progress_percentage: number;
  status: 'completed' | 'in_progress' | 'delayed' | 'pending_review';
  deliverables: Deliverable[];
  notes?: string;
  created_by_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Comment {
  id: string;
  log_id: string;
  author_name: string;
  author_role: UserRole;
  content: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  recipient_role: UserRole;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar_url?: string;
}
