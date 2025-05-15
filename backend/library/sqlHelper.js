// backend/library/sqlHelper.js
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

export function sqlHelper (relPath) {
  const abs = join(__dirname, '..', 'sql', relPath);
  if (!existsSync(abs)) {
    throw new Error(`[sqlHelper] File not found: ${abs}`);
  }
  return readFileSync(abs, 'utf8');
}
