#!/usr/bin/env node
import { Command } from "commander";
import { initLore } from "./lib/init.js";
import { createItem } from "./lib/create.js";
import { importRequirementsCsv } from "./lib/import.js";
import { listItems, readAllItems, readAllArtifacts } from "./lib/store.js";
import { printTrace, printGaps, directRelations, recursiveRelations } from "./lib/trace.js";
import { startUi } from "./lib/ui.js";
import pkg from "../package.json" with { type: "json" };

const program = new Command();

program
  .name("lore")
  .description("Git-native project memory")
  .version(pkg.version);

program
  .command("init")
  .description("create .lore structure")
  .action(() => initLore(process.cwd()));

program
  .command("req")
  .argument("<action>", "new|list")
  .argument("[title]", "requirement title")
  .option("-i, --id <id>", "explicit id")
  .description("manage requirements")
  .action(async (action, title, options) => {
    if (action === "new")
      return createItem(process.cwd(), "requirements", title, options.id);
    if (action === "list") return listItems(process.cwd(), "requirements");
    throw new Error(`Unknown req action: ${action}`);
  });

program
  .command("validate")
  .description("Validate .lore artifacts")
  .action(async () => {
    const { validateLore } = await import("./lib/validate.js");
    const result = validateLore(process.cwd());

    if (result.errors.length === 0) {
      console.log("✓ lore is valid");
      process.exit(0);
    }

    console.error("✗ lore validation failed\n");

    for (const error of result.errors) {
      console.error(`${error.file}:${error.line ?? "?"} ${error.message}`);
    }

    process.exit(1);
  });

program
  .command("story")
  .argument("<action>", "new|list")
  .argument("[title]", "story title")
  .option("-i, --id <id>", "explicit id")
  .description("manage user stories")
  .action(async (action, title, options) => {
    if (action === "new")
      return createItem(process.cwd(), "stories", title, options.id);
    if (action === "list") return listItems(process.cwd(), "stories");
    throw new Error(`Unknown story action: ${action}`);
  });

program
  .command("adr")
  .argument("<action>", "new|list")
  .argument("[title]", "ADR title")
  .option("-i, --id <id>", "explicit id")
  .description("manage ADRs")
  .action(async (action, title, options) => {
    if (action === "new")
      return createItem(process.cwd(), "adrs", title, options.id);
    if (action === "list") return listItems(process.cwd(), "adrs");
    throw new Error(`Unknown adr action: ${action}`);
  });

program
  .command("test")
  .argument("<action>", "new|list")
  .argument("[title]", "test case title")
  .option("-i, --id <id>", "explicit id")
  .description("manage test cases")
  .action(async (action, title, options) => {
    if (action === "new")
      return createItem(process.cwd(), "tests", title, options.id);
    if (action === "list") return listItems(process.cwd(), "tests");
    throw new Error(`Unknown test action: ${action}`);
  });

program
  .command("import")
  .argument("<type>", "requirements")
  .argument("<file>", "CSV file")
  .description("import external data")
  .action(async (type, file) => {
    if (type !== "requirements")
      throw new Error(
        "Only requirements import is implemented in this scaffold",
      );
    await importRequirementsCsv(process.cwd(), file);
  });

program
  .command("feature")
  .argument("<action>", "new|list")
  .argument("[title]", "feature title")
  .option("-i, --id <id>", "explicit id")
  .description("manage features")
  .action(async (action, title, options) => {
    if (action === "new")
      return createItem(process.cwd(), "features", title, options.id);
    if (action === "list") return listItems(process.cwd(), "features");
    throw new Error(`Unknown feature action: ${action}`);
  });

program
  .command("show")
  .argument("<id...>", "artifact id(s)")
  .option("--relations", "show direct relations")
  .option("--recursive", "expand related artifacts recursively")
  .description("show artifacts by id")
  .action(async (ids, options) => {
    const root = process.cwd();
    const allArtifacts = readAllArtifacts(root);
    const byId = new Map(allArtifacts.map((artifact) => [artifact.id, artifact]));
    const missing = [];
    const printed = new Set();

    function emitArtifact(artifact) {
      if (!artifact || printed.has(artifact.id)) return;
      printed.add(artifact.id);
      console.log(artifact.text.trimEnd());
    }

    function emitRelations(artifact) {
      const relations = directRelations(artifact, allArtifacts);

      if (relations.length === 0) {
        console.log('Relations: none');
        return;
      }

      console.log('Relations:');
      for (const rel of relations) {
        const marker = byId.has(rel.id) ? rel.id : `${rel.id} [missing]`;
        const prefix = rel.direction === 'incoming' ? '<-' : '->';
        console.log(`${prefix} ${rel.field}: ${marker}`);
      }
    }

    function emitRecursive(start) {
      for (const artifact of recursiveRelations(start, (id) => byId.get(id), allArtifacts)) {
        emitArtifact(artifact);
      }
    }

    for (let index = 0; index < ids.length; index++) {
      const id = ids[index];
      const artifact = byId.get(id);
      if (!artifact) {
        missing.push(id);
        console.error(`lore show: missing artifact ${id}`);
        continue;
      }

      if (options.recursive) {
        emitRecursive(artifact);
      } else {
        emitArtifact(artifact);
      }

      if (options.relations) {
        emitRelations(artifact);
      }

      if (index < ids.length - 1) console.log('---');
    }

    if (missing.length > 0) process.exitCode = 1;
  });

program
  .command("trace")
  .description("show requirement traceability")
  .action(async () => printTrace(await readAllItems(process.cwd())));

program
  .command("gaps")
  .description("show missing links")
  .action(async () => printGaps(await readAllItems(process.cwd())));

program
  .command("ui")
  .option("-p, --port <port>", "port", "8080")
  .description("start local lore browser")
  .action(async (options) => startUi(process.cwd(), Number(options.port)));

program.parseAsync(process.argv).catch((err) => {
  console.error(`lore: ${err.message}`);
  process.exit(1);
});
