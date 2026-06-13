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

test('show prints compact output by default', () => {
  const root = makeRepo();
  const content = `---\nid: REQ-001\ntitle: Git Native\nstatus: Draft\nrelated_requirements: []\nrelated_adrs: []\nrelated_stories: []\nrelated_tests: []\n---\n\n# REQ-001 - Git Native\n\nBody line\n`;
  fs.writeFileSync(path.join(root, '.lore', 'requirements', 'REQ-001-git-native.md'), content);

  const result = runLore(root, ['show', 'REQ-001']);
  assert.equal(result.status, 0);
  assert.equal(result.stdout, 'REQ-001 - Git Native\n\nBody line\n');
});

test('show --raw prints stored markdown verbatim', () => {
  const root = makeRepo();
  const content = `---\nid: REQ-001\ntitle: Git Native\nstatus: Draft\nrelated_requirements: []\nrelated_adrs: []\nrelated_stories: []\nrelated_tests: []\n---\n\n# REQ-001 - Git Native\n\nBody line\n`;
  fs.writeFileSync(path.join(root, '.lore', 'requirements', 'REQ-001-git-native.md'), content);

  const result = runLore(root, ['show', 'REQ-001', '--raw']);
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
    result.stdout.match(/REQ-001 - Git Native|ADR-001 - Markdown|TEST-001 - Init/g),
    ['REQ-001 - Git Native', 'ADR-001 - Markdown', 'TEST-001 - Init'],
  );
  assert.ok(!result.stdout.includes('#'));
});

test('show raw supports multiple ids with clear boundaries', () => {
  const root = makeRepo();
  writeArtifact(root, 'requirements', 'REQ-001', 'Git Native');
  writeArtifact(root, 'adrs', 'ADR-001', 'Markdown');

  const result = runLore(root, ['show', 'REQ-001', 'ADR-001', '--raw']);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /id: REQ-001/);
  assert.match(result.stdout, /id: ADR-001/);
  assert.match(result.stdout, /\n---\n/);
  assert.ok(result.stdout.startsWith('---\nid: REQ-001'));
  assert.ok(result.stdout.includes('\n---\n---\n'));
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

test('show recursive prints a compact grouped context map', () => {
  const root = makeRepo();
  writeArtifact(root, 'requirements', 'REQ-001', 'Git Native', {
    related_adrs: ['ADR-001', 'ADR-002'],
    related_tests: ['TEST-001'],
  });
  writeArtifact(root, 'adrs', 'ADR-001', 'Markdown', {
    related_requirements: ['REQ-001'],
    related_stories: ['STORY-001'],
  });
  writeArtifact(root, 'adrs', 'ADR-002', 'Deterministic', {
    related_requirements: ['REQ-001'],
  });
  writeArtifact(root, 'stories', 'STORY-001', 'Inspect', {
    related_requirements: ['REQ-001'],
  });
  writeArtifact(root, 'tests', 'TEST-001', 'Init', {
    related_requirements: ['REQ-001'],
  });
  writeArtifact(root, 'features', 'FEATURE-001', 'Trace Map', {
    related_requirements: ['REQ-001'],
  });

  const result = runLore(root, ['show', 'REQ-001', '--recursive']);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /REQ-001 - Git Native/);
  assert.match(result.stdout, /Related:/);
  assert.match(result.stdout, /ADRs:\n- ADR-001 - Markdown \[Draft\]\n- ADR-002 - Deterministic \[Draft\]/);
  assert.match(result.stdout, /Stories:\n- STORY-001 - Inspect \[Draft\]/);
  assert.match(result.stdout, /Tests:\n- TEST-001 - Init \[Draft\]/);
  assert.match(result.stdout, /Features:\n- FEATURE-001 - Trace Map \[Draft\]/);
  assert.ok(!result.stdout.includes('# REQ-001 - Git Native'));
});

test('show recursive --full preserves current recursive output', () => {
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

  const result = runLore(root, ['show', 'REQ-001', '--recursive', '--full']);
  assert.equal(result.status, 0);
  assert.deepEqual(
    result.stdout.match(/REQ-001 - Git Native|ADR-001 - Markdown|STORY-001 - Inspect|TEST-001 - Init/g),
    ['REQ-001 - Git Native', 'ADR-001 - Markdown', 'STORY-001 - Inspect', 'TEST-001 - Init'],
  );
  assert.ok(!result.stdout.includes('Related:'));
});

test('show rejects raw with relations or recursive', () => {
  const root = makeRepo();
  writeArtifact(root, 'requirements', 'REQ-001', 'Git Native');

  const relations = runLore(root, ['show', 'REQ-001', '--raw', '--relations']);
  assert.equal(relations.status, 1);
  assert.match(relations.stderr, /--raw cannot be combined with --relations, --recursive, or --full/);

  const recursive = runLore(root, ['show', 'REQ-001', '--raw', '--recursive']);
  assert.equal(recursive.status, 1);
  assert.match(recursive.stderr, /--raw cannot be combined with --relations, --recursive, or --full/);
});
