import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Reads an .sql file from backend/sql/… and returns its text.
 * Usage: const query = sql('territory/get_all_tiles.sql');
 */
export function sqlHelper (relativePath) {
  return readFileSync(join(__dirname, '..', 'sql', relativePath), 'utf8');
}
