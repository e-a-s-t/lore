import express from "express";
import fs from "fs";
import path from "path";
import { readAllItems } from "./store.js";

export function startUi(root, port) {
  const app = express();

  app.get("/api/lore", async (_req, res) => {
    res.json(await readAllItems(root));
  });

  app.use(express.static(path.join(import.meta.dirname, "ui")));

  app.listen(port, () => console.log(`lore ui: http://localhost:${port}`));
}
