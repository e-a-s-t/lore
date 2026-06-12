export const relationFields = [
  "related_requirements",
  "related_stories",
  "related_adrs",
  "related_tests",
];

export function outgoingRelations(item, findItem) {
  return relationFields.flatMap((field) =>
    (item[field] || []).map((id) => ({
      field,
      id,
      target: findItem(id),
    })),
  );
}

export function incomingRelations(item, allItems) {
  return allItems.flatMap((source) =>
    relationFields.flatMap((field) =>
      (source[field] || []).includes(item.id) ? [{ field, source }] : [],
    ),
  );
}
