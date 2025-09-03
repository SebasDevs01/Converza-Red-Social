import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://supabase.com/dashboard/project/egzkajdoxeqcqftfckgk';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnemthamRveGVxY3FmdGZja2drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NTU2NzksImV4cCI6MjA3MjQzMTY3OX0.Gr6SNc8IS8W3eG1nJKKek7TO5qyaDoB7JXG9u_reOmA';

export const supabase = createClient(supabaseUrl, supabaseKey);