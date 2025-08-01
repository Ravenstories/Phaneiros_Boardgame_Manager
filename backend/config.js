import 'dotenv/config';

export const config = {
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 3000,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY,
};

if (!config.jwtSecret) {
  throw new Error('JWT_SECRET environment variable must be set');
}