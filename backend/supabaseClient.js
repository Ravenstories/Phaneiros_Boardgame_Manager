import { createClient } from '@supabase/supabase-js';
import { sqlHelper } from './library/sqlHelper.js';
import { config } from './config.js';
import * as logger from './library/logger.js';

let schema = 'public';

export const supabase = createClient(
  config.supabaseUrl,
  config.supabaseKey,
  { schema }
);
