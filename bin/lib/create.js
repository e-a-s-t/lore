import fs from 'node:fs';
import path from 'node:path';
import slugify from 'slugify';
import { initLore } from './init.js';
import { lorePath, TYPE_PREFIX } from './paths.js';
import { renderTemplate } from './templates.js';

function nextId(root, type) {
  const prefix = TYPE_PREFIX[type];
  const dir = lorePath(root, type);
  const existing = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  const max = existing
    .map((name) => name.match(new RegExp(`^${prefix}-(\\d+)`, 'i')))
    .filter(Boolean)
    .map((match) => Number(match[1]))
    .reduce((a, b) => Math.max(a, b), 0);
  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
}

export function createItem(root, type, title, explicitId) {
  if (!title) throw new Error('title is required');
  initLore(root);
  const id = explicitId || nextId(root, type);
  const slug = slugify(title, { lower: true, strict: true });
  const file = path.join(lorePath(root, type), `${id}-${slug}.md`);
  const content = renderTemplate(type, { id, title });
  fs.writeFileSync(file, content, { flag: 'wx' });
  console.log(file);
}
