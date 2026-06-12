import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import slugify from 'slugify';
import { initLore } from './init.js';
import { lorePath } from './paths.js';

export async function importRequirementsCsv(root, csvFile) {
  initLore(root);
  const input = fs.readFileSync(csvFile, 'utf8');
  const rows = parse(input, { columns: true, skip_empty_lines: true, trim: true });

  for (const row of rows) {
    const id = row.id || row.ID || row.requirement_id;
    const title = row.title || row.Title || row.name || 'Untitled requirement';
    const description = row.description || row.Description || row.requirement || 'TBD';
    if (!id) throw new Error(`Missing id for requirement: ${title}`);

    const slug = slugify(title, { lower: true, strict: true });
    const file = path.join(lorePath(root, 'requirements'), `${id}-${slug}.md`);
    const content = `---\nid: ${id}\ntitle: ${title}\nstatus: ${row.status || row.Status || 'Draft'}\npriority: ${row.priority || row.Priority || 'Medium'}\nsource: ${row.source || row.Source || 'CSV'}\nrelated_adrs: []\nrelated_stories: []\nrelated_tests: []\n---\n\n# ${id} - ${title}\n\n## Requirement\n\n${description}\n\n## Rationale\n\nTBD\n\n## Acceptance Criteria\n\n- [ ] TBD\n`;
    fs.writeFileSync(file, content);
    console.log(file);
  }
}
