import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function makeRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lore-show-'));
  for (const dir of ['requirements', 'stories', 'adrs', 'tests', 'features']) {
    fs.mkdirSync(path.join(root, '.lore', dir), { recursive: true });
  }
  return root;
}

function writeArtifact(root, type, id, title, fields = {}, body = `# ${id} - ${title}\n\n${title} body\n`) {
  const file = path.join(root, '.lore', type, `${id}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`);
  const fm = {
    id,
    title,
    status: 'Draft',
    related_requirements: [],
    related_adrs: [],
    related_stories: [],
    related_tests: [],
    ...fields,
  };
  const frontmatter = [
    '---',
    `id: ${fm.id}`,
    `title: ${fm.title}`,
    `status: ${fm.status}`,
    `related_requirements: ${formatArray(fm.related_requirements)}`,
    `related_adrs: ${formatArray(fm.related_adrs)}`,
    `related_stories: ${formatArray(fm.related_stories)}`,
    `related_tests: ${formatArray(fm.related_tests)}`,
    '---',
    '',
    body,
  ].join('\n');
  fs.writeFileSync(file, frontmatter);
  return file;
}

function formatArray(values) {
  if (!Array.isArray(values) || values.length === 0) return '[]';
  return `\n${values.map((value) => `  - ${value}`).join('\n')}`;
}

function runLore(root, args) {
  return spawnSync('node', [path.join(process.cwd(), 'bin', 'lore.js'), ...args], {
    cwd: root,
    encoding: 'utf8',
  });
}

test('show prints a single artifact verbatim', () => {
  const root = makeRepo();
  const content = `---\nid: REQ-001\ntitle: Git Native\nstatus: Draft\nrelated_requirements: []\nrelated_adrs: []\nrelated_stories: []\nrelated_tests: []\n---\n\n# REQ-001 - Git Native\n\nBody line\n`;
  fs.writeFileSync(path.join(root, '.lore', 'requirements', 'REQ-001-git-native.md'), content);

  const result = runLore(root, ['show', 'REQ-001']);
  assert.equal(result.status, 0);
  assert.equal(result.stdout, content);
});

test('show preserves order and boundaries for multiple ids', () => {
  const root = makeRepo();
  writeArtifact(root, 'requirements', 'REQ-001', 'Git Native');
  writeArtifact(root, 'adrs', 'ADR-001', 'Markdown');
  writeArtifact(root, 'tests', 'TEST-001', 'Init');

  const result = runLore(root, ['show', 'REQ-001', 'ADR-001', 'TEST-001']);
  assert.equal(result.status, 0);
  assert.deepEqual(
    result.stdout.match(/id: (REQ-001|ADR-001|TEST-001)/g),
    ['id: REQ-001', 'id: ADR-001', 'id: TEST-001'],
  );
  assert.ok(result.stdout.includes('REQ-001 - Git Native') && result.stdout.includes('ADR-001 - Markdown') && result.stdout.includes('TEST-001 - Init'));
});

test('show reports missing ids but still prints existing artifacts', () => {
  const root = makeRepo();
  writeArtifact(root, 'requirements', 'REQ-001', 'Git Native');

  const result = runLore(root, ['show', 'REQ-001', 'ADR-404']);
  assert.equal(result.status, 1);
  assert.match(result.stdout, /REQ-001 - Git Native/);
  assert.match(result.stderr, /missing artifact ADR-404/);
});

test('show relations prints direct incoming and outgoing relations', () => {
  const root = makeRepo();
  writeArtifact(root, 'requirements', 'REQ-001', 'Git Native', {
    related_adrs: ['ADR-001'],
    related_tests: ['TEST-404'],
  });
  writeArtifact(root, 'adrs', 'ADR-001', 'Markdown', {
    related_requirements: ['REQ-001'],
  });
  writeArtifact(root, 'tests', 'TEST-001', 'Init', {
    related_requirements: ['REQ-001'],
  });

  const result = runLore(root, ['show', 'REQ-001', '--relations']);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Relations:/);
  assert.match(result.stdout, /-> related_adrs: ADR-001/);
  assert.match(result.stdout, /-> related_tests: TEST-404 \[missing\]/);
  assert.match(result.stdout, /<- related_requirements: ADR-001/);
  assert.match(result.stdout, /<- related_requirements: TEST-001/);
});

test('show recursive expands artifacts once in deterministic order', () => {
  const root = makeRepo();
  writeArtifact(root, 'requirements', 'REQ-001', 'Git Native', {
    related_adrs: ['ADR-001'],
    related_tests: ['TEST-001'],
  });
  writeArtifact(root, 'adrs', 'ADR-001', 'Markdown', {
    related_requirements: ['REQ-001'],
    related_stories: ['STORY-001'],
  });
  writeArtifact(root, 'stories', 'STORY-001', 'Inspect', {
    related_requirements: ['REQ-001'],
  });
  writeArtifact(root, 'tests', 'TEST-001', 'Init', {
    related_requirements: ['REQ-001'],
  });

  const result = runLore(root, ['show', 'REQ-001', '--recursive']);
  assert.equal(result.status, 0);
  assert.deepEqual(
    result.stdout.match(/id: (REQ-001|ADR-001|STORY-001|TEST-001)/g),
    ['id: REQ-001', 'id: ADR-001', 'id: STORY-001', 'id: TEST-001'],
  );
});
