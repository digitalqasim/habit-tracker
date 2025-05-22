import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qupnsbtywkuccuoavymb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1cG5zYnR5d2t1Y2N1b2F2eW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MDA4NDYsImV4cCI6MjA2MzQ3Njg0Nn0.1177QVU4JyQdF7YkT2VcCGiy8_a6TBalhVCiDrwZSKM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 