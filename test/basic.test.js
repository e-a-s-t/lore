import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { initLore } from '../src/init.js';
import { createItem } from '../src/create.js';
import { readItems } from '../src/store.js';

test('init creates .lore directories', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lore-'));
  initLore(root);
  assert.equal(fs.existsSync(path.join(root, '.lore', 'requirements')), true);
});

test('create requirement writes markdown', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lore-'));
  createItem(root, 'requirements', 'Audit logging');
  const items = readItems(root, 'requirements');
  assert.equal(items.length, 1);
  assert.equal(items[0].id, 'REQ-001');
});
