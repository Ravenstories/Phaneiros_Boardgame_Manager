import { createClient } from '@supabase/supabase-js';
import { sqlHelper } from './librarys/sqlHelper.js';
import 'dotenv/config';

let schema = 'public';

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  { schema }
);

async function runMigrations() {
  const migrations = [sqlHelper('users/create.sql')];
  for (const sql of migrations) {
    const { error } = await supabase.rpc('exec_sql', { sql_text: sql, params: {} });
    if (error) console.error('[migration error]', error);
  }
}

if (process.env.NODE_ENV !== 'test') {
  runMigrations();
}