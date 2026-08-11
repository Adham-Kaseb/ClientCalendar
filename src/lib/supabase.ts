import { createClient } from '@supabase/supabase-js';
import { DailyLog, Comment, NotificationItem } from '../types/database';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://jwqifstyevjpdbqunlpl.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cWlmc3R5ZXZqcGRicXVubHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MDIyMDIsImV4cCI6MjEwMTk3ODIwMn0.em91WQyAlw0-MCA6rQXfr76_lTHSG2UoN6Y4AcCYZA0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const INITIAL_DEMO_LOGS: DailyLog[] = [];
export const INITIAL_DEMO_COMMENTS: Comment[] = [];
export const INITIAL_DEMO_NOTIFICATIONS: NotificationItem[] = [];
