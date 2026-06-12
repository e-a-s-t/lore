import fs from 'node:fs';
import { lorePath } from './paths.js';

const dirs = ['requirements', 'stories', 'adrs', 'tests', 'templates'];

export function initLore(root) {
  for (const dir of dirs) fs.mkdirSync(lorePath(root, dir), { recursive: true });

  const config = lorePath(root, 'lore.toml');
  if (!fs.existsSync(config)) {
    fs.writeFileSync(config, 'version = "0.1"\nroot = ".lore"\n');
  }

  const readme = lorePath(root, 'README.md');
  if (!fs.existsSync(readme)) {
    fs.writeFileSync(readme, '# Project Lore\n\nRequirements, stories, ADRs and tests for this repository.\n');
  }

  console.log('Created .lore/');
}
