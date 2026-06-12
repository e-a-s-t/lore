import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { lorePath } from './paths.js';

export const TYPES = ['requirements', 'stories', 'adrs', 'tests', 'features'];

export function readItems(root, type) {
  const dir = lorePath(root, type);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const fullPath = path.join(dir, file);
      const parsed = matter(fs.readFileSync(fullPath, 'utf8'));
      return {
        type,
        file: fullPath,
        body: parsed.content.trim(),
        ...parsed.data,
      };
    })
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
}

export function listItems(root, type) {
  for (const item of readItems(root, type)) {
    console.log(`${item.id || '-'} ${item.title || ''} [${item.status || 'Unknown'}]`);
  }
}

export async function readAllItems(root) {
  return Object.fromEntries(TYPES.map((type) => [type, readItems(root, type)]));
}
