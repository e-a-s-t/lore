import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const TYPES = ["requirements", "stories", "adrs", "tests"];

const REQUIRED_FIELDS = [
  "id",
  "title",
  "status",
  "related_requirements",
  "related_adrs",
  "related_stories",
  "related_tests",
];

const RELATION_FIELDS = [
  "related_requirements",
  "related_adrs",
  "related_stories",
  "related_tests",
];

export function validateLore(cwd) {
  const root = path.join(cwd, ".lore");
  const errors = [];
  const ids = new Map();
  const artifacts = [];

  if (!fs.existsSync(root)) {
    return { errors: [{ file: ".lore", message: "Missing .lore directory" }] };
  }

  for (const type of TYPES) {
    const dir = path.join(root, type);

    if (!fs.existsSync(dir)) {
      errors.push({ file: `.lore/${type}`, message: "Missing directory" });
      continue;
    }

    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
      const fullPath = path.join(dir, file);
      const relPath = path.relative(cwd, fullPath);
      const text = fs.readFileSync(fullPath, "utf8");

      const rawFrontmatter = extractFrontmatter(text);
      const raw = parseRawLoreFrontmatter(rawFrontmatter);

      let parsed;
      try {
        parsed = matter(text);
      } catch (err) {
        errors.push({
          file: relPath,
          message: `Invalid frontmatter: ${err.message}`,
        });
        continue;
      }

      for (const field of REQUIRED_FIELDS) {
        if (!(field in raw)) {
          errors.push({
            file: relPath,
            message: `Missing required field: ${field}`,
          });
        }
      }

      const id = raw.id ?? "";

      if (!id) {
        errors.push({ file: relPath, message: "Missing required field: id" });
      } else if (ids.has(id)) {
        errors.push({
          file: relPath,
          message: `Duplicate id: ${id} also used in ${ids.get(id)}`,
        });
      } else {
        ids.set(id, relPath);
      }

      checkMarkdown(relPath, parsed.content, errors);

      artifacts.push({
        file: relPath,
        id,
        related_requirements: raw.related_requirements ?? [],
        related_adrs: raw.related_adrs ?? [],
        related_stories: raw.related_stories ?? [],
        related_tests: raw.related_tests ?? [],
      });
    }
  }

  for (const artifact of artifacts) {
    for (const field of RELATION_FIELDS) {
      for (const refId of artifact[field] ?? []) {
        if (!ids.has(refId)) {
          errors.push({
            file: artifact.file,
            message: `Broken reference in ${field}: ${refId}`,
          });
        }
      }
    }
  }

  return { errors };
}

function extractFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : "";
}

function parseRawLoreFrontmatter(frontmatter) {
  const result = {};
  const lines = frontmatter.split(/\r?\n/);

  let currentArrayField = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    const scalar = trimmed.match(/^([a-zA-Z_]+):\s*(.*?)\s*$/);
    if (scalar) {
      const [, key, value] = scalar;

      currentArrayField = null;

      if (value === "[]") {
        result[key] = [];
        continue;
      }

      if (value === "") {
        result[key] = [];
        currentArrayField = key;
        continue;
      }

      result[key] = stripQuotes(value);
      continue;
    }

    const arrayItem = trimmed.match(/^-\s+(.+?)\s*$/);
    if (arrayItem && currentArrayField) {
      result[currentArrayField].push(stripQuotes(arrayItem[1]));
    }
  }

  return result;
}

function stripQuotes(value) {
  return String(value).trim().replace(/^["']/, "").replace(/["']$/, "").trim();
}

function checkMarkdown(file, content, errors) {
  const lines = content.split("\n");
  let fenceCount = 0;

  lines.forEach((line, index) => {
    const lineNo = index + 1;

    if (line.trim().startsWith("```")) fenceCount++;

    if (line.includes("- []")) {
      errors.push({
        file,
        line: lineNo,
        message: "Invalid checkbox syntax. Use '- [ ]' instead of '- []'",
      });
    }

    if (line.includes("-[ ]")) {
      errors.push({
        file,
        line: lineNo,
        message: "Invalid checkbox syntax. Use '- [ ]'",
      });
    }
  });

  if (fenceCount % 2 !== 0) {
    errors.push({
      file,
      message: "Unbalanced markdown code fence",
    });
  }
}
