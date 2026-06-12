export function renderTemplate(type, item) {
  const base = `---\nid: ${item.id}\ntitle: ${item.title}\nstatus: Draft\nrelated_requirements: []\nrelated_adrs: []\nrelated_stories: []\nrelated_tests: []\n---\n\n# ${item.id} - ${item.title}\n`;

  if (type === 'requirements') return `${base}\n## Requirement\n\nTBD\n\n## Rationale\n\nTBD\n\n## Acceptance Criteria\n\n- [ ] TBD\n`;
  if (type === 'stories') return `${base}\n## User Story\n\nAs a ...\nI want ...\nSo that ...\n\n## Acceptance Criteria\n\n- [ ] TBD\n`;
  if (type === 'adrs') return `${base}\n## Context\n\nTBD\n\n## Decision\n\nTBD\n\n## Consequences\n\nTBD\n\n## Alternatives Considered\n\n- TBD\n`;
  if (type === 'tests') return `${base}\n## Test Case\n\nTBD\n\n## Expected Result\n\nTBD\n`;
  throw new Error(`Unknown type: ${type}`);
}
