"use strict";

const fs = require("fs/promises");
const path = require("path");
const bcrypt = require("bcryptjs");
const { migrateStore } = require("./migrations");

function createFileStore(filePath, options = {}) {
  let writeQueue = Promise.resolve();
  const bcryptRounds = Number(options.bcryptRounds || 12);
  const defaultPanelPassword = String(options.defaultPanelPassword || "");
  const defaultRecipePassword = String(options.defaultRecipePassword || defaultPanelPassword || "");

  return {
    async ensure() {
      await fs.mkdir(path.dirname(filePath), { recursive: true });

      try {
        await fs.access(filePath);
      } catch (_error) {
        if (!defaultPanelPassword) {
          throw new Error("Ilk admin sifresi icin DEFAULT_PANEL_PASSWORD ortam degiskeni zorunludur.");
        }

        const passwordHash = await bcrypt.hash(defaultPanelPassword, bcryptRounds);
        const recipePasswordHash = defaultRecipePassword === defaultPanelPassword
          ? passwordHash
          : await bcrypt.hash(defaultRecipePassword, bcryptRounds);
        await writeJson(defaultStore(passwordHash, recipePasswordHash));
      }

      const raw = await readRaw();
      const data = normalizeStore(raw);
      if (JSON.stringify(raw) !== JSON.stringify(data)) {
        await writeJson(data);
      }

      if (!data.admin || !data.admin.passwordHash) {
        if (!defaultPanelPassword) {
          throw new Error("Eksik admin hash'i onarmak icin DEFAULT_PANEL_PASSWORD ortam degiskeni zorunludur.");
        }

        data.admin = {
          ...(data.admin || {}),
          passwordHash: await bcrypt.hash(defaultPanelPassword, bcryptRounds),
          recipePasswordHash: defaultRecipePassword
            ? await bcrypt.hash(defaultRecipePassword, bcryptRounds)
            : "",
          updatedAt: new Date().toISOString()
        };
        await writeJson(normalizeStore(data));
      }

      if (!data.admin.recipePasswordHash) {
        data.admin.recipePasswordHash = data.admin.passwordHash;
        data.admin.recipeUpdatedAt = data.admin.updatedAt || new Date().toISOString();
        await writeJson(normalizeStore(data));
      }
    },

    async read() {
      try {
        return normalizeStore(await readRaw());
      } catch (error) {
        error.message = `Store dosyasi okunamadi: ${error.message}`;
        throw error;
      }
    },

    async update(mutator) {
      const nextWrite = writeQueue.catch(() => {}).then(async () => {
        const current = await this.read();
        const next = normalizeStore(await mutator(current));
        await writeJson(next);
        return next;
      });

      writeQueue = nextWrite.catch(() => {});
      return nextWrite;
    },

    filePath
  };

  async function readRaw() {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content);
  }

  async function writeJson(data) {
    const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tmpPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    await fs.rename(tmpPath, filePath);
  }
}

function normalizeStore(data) {
  return migrateStore(data);
}

function defaultStore(passwordHash, recipePasswordHash) {
  return normalizeStore({
    schemaVersion: 2,
    menuState: { settings: {}, categories: [] },
    menuUpdatedAt: null,
    recipeState: {},
    recipeUpdatedAt: null,
    recipeCatalog: [],
    recipeLinkReview: [],
    recipeUsers: [],
    recipeAssignments: [],
    recipeActivity: [],
    siteState: {},
    siteUpdatedAt: null,
    siteRevisions: [],
    feedbackItems: [],
    feedbackUpdatedAt: null,
    admin: {
      passwordHash,
      recipePasswordHash: recipePasswordHash || passwordHash,
      updatedAt: new Date().toISOString(),
      recipeUpdatedAt: new Date().toISOString()
    }
  });
}

module.exports = { createFileStore, defaultStore, normalizeStore };
