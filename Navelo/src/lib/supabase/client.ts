import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mfylwwshsgdrmukwqxnm.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1meWx3d3Noc2dkcm11a3dxeG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxOTI4MDYsImV4cCI6MjA5ODc2ODgwNn0.DsBuWAdXoblqyB8c4snE_xNKib5NGPwdlWDz9xYUS8c';

export const supabase = createClient(supabaseUrl, supabaseKey);
