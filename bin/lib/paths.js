import path from "node:path";

export const LORE_DIR = ".lore";

export const TYPE_PREFIX = {
  requirements: "REQ",
  stories: "STORY",
  adrs: "ADR",
  tests: "TEST",
};

export function lorePath(root, ...parts) {
  return path.join(root, LORE_DIR, ...parts);
}
