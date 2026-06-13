import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { lorePath } from './paths.js';

export const TYPES = ['requirements', 'stories', 'adrs', 'tests', 'features'];
export const TYPE_PREFIXES = {
  REQ: 'requirements',
  STORY: 'stories',
  ADR: 'adrs',
  TEST: 'tests',
  FEATURE: 'features',
};

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

export function readArtifactFile(file) {
  const text = fs.readFileSync(file, 'utf8');
  const parsed = matter(text);

  return {
    file,
    text,
    body: parsed.content.trim(),
    ...parsed.data,
  };
}

export function typeForId(id) {
  const prefix = String(id).split('-')[0];
  return TYPE_PREFIXES[prefix] || null;
}

export function readArtifact(root, id) {
  const type = typeForId(id);
  if (!type) return null;

  const dir = lorePath(root, type);
  if (!fs.existsSync(dir)) return null;

  for (const file of fs.readdirSync(dir).filter((name) => name.endsWith('.md'))) {
    const fullPath = path.join(dir, file);
    const artifact = readArtifactFile(fullPath);
    if (artifact.id === id) return artifact;
  }

  return null;
}

export function readAllArtifacts(root) {
  return TYPES.flatMap((type) => readItems(root, type).map((item) => ({
    ...item,
    text: fs.readFileSync(item.file, 'utf8'),
  })));
}

export function listItems(root, type) {
  for (const item of readItems(root, type)) {
    console.log(`${item.id || '-'} ${item.title || ''} [${item.status || 'Unknown'}]`);
  }
}

export async function readAllItems(root) {
  return Object.fromEntries(TYPES.map((type) => [type, readItems(root, type)]));
}
