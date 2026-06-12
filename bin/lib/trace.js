function ids(values) {
  if (!Array.isArray(values)) return [];
  return values.filter(Boolean);
}

export function printTrace(all) {
  for (const req of all.requirements) {
    console.log(`\n${req.id} ${req.title}`);
    for (const adr of ids(req.related_adrs)) console.log(` ├─ ${adr}`);
    for (const story of ids(req.related_stories)) console.log(` ├─ ${story}`);
    for (const test of ids(req.related_tests)) console.log(` └─ ${test}`);
  }

  for (const feature of all.features || []) {
    console.log(`\n${feature.id} ${feature.title}`);
    for (const req of ids(feature.related_requirements)) console.log(` ├─ ${req}`);
    for (const adr of ids(feature.related_adrs)) console.log(` ├─ ${adr}`);
    for (const story of ids(feature.related_stories)) console.log(` ├─ ${story}`);
    for (const test of ids(feature.related_tests)) console.log(` └─ ${test}`);
  }
}
export function printGaps(all) {
  let gaps = 0;
  for (const req of all.requirements) {
    if (ids(req.related_adrs).length === 0) { console.log(`${req.id} has no ADR`); gaps++; }
    if (ids(req.related_stories).length === 0) { console.log(`${req.id} has no story`); gaps++; }
    if (ids(req.related_tests).length === 0) { console.log(`${req.id} has no test`); gaps++; }
  }
  if (gaps === 0) console.log('No obvious gaps found');
}
