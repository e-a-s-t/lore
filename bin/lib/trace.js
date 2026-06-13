const RELATION_FIELDS = [
  'related_requirements',
  'related_adrs',
  'related_stories',
  'related_tests',
];

function ids(values) {
  if (!Array.isArray(values)) return [];
  return values.filter(Boolean);
}

export function outgoingRelationIds(item) {
  return RELATION_FIELDS.flatMap((field) =>
    ids(item[field]).map((id) => ({ direction: 'outgoing', field, id })),
  );
}

export function incomingRelationIds(item, allItems) {
  const items = Array.isArray(allItems) ? allItems : [];
  return items.flatMap((source) =>
    RELATION_FIELDS.flatMap((field) =>
      ids(source[field]).includes(item.id)
        ? [{ direction: 'incoming', field, id: source.id }]
        : [],
    ),
  );
}

export function directRelations(item, allItems) {
  return [...outgoingRelationIds(item), ...incomingRelationIds(item, allItems)];
}

export function recursiveRelations(item, findItem, allItems = []) {
  const seen = new Set();
  const order = [];

  function nextIds(current) {
    const outgoing = outgoingRelationIds(current).map((rel) => rel.id);
    const incoming = incomingRelationIds(current, allItems).map((rel) => rel.id);
    return [...outgoing, ...incoming];
  }

  function visit(current) {
    if (!current || seen.has(current.id)) return;
    seen.add(current.id);
    order.push(current);

    for (const id of nextIds(current)) visit(findItem(id));
  }

  visit(item);
  return order;
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
