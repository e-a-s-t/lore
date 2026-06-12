#!/usr/bin/env node
import { Command } from "commander";
import { initLore } from "./lib/init.js";
import { createItem } from "./lib/create.js";
import { importRequirementsCsv } from "./lib/import.js";
import { listItems, readAllItems } from "./lib/store.js";
import { printTrace, printGaps } from "./lib/trace.js";
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
