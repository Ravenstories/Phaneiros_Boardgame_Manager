import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

let schema = 'public';

export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, { schema: schema });


