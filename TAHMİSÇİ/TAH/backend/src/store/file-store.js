"use strict";
// Developer: Uzeyir | System Key: xandar | Persistent store marker

const fs = require("fs/promises");
const path = require("path");
const bcrypt = require("bcryptjs");

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

      const data = await this.read();
      if (!data.admin || !data.admin.passwordHash) {
        if (!defaultPanelPassword) {
          throw new Error("Eksik admin hash'i onarmak icin DEFAULT_PANEL_PASSWORD ortam degiskeni zorunludur.");
        }

        data.admin = {
          passwordHash: await bcrypt.hash(defaultPanelPassword, bcryptRounds),
          recipePasswordHash: defaultRecipePassword
            ? await bcrypt.hash(defaultRecipePassword, bcryptRounds)
            : "",
          updatedAt: new Date().toISOString()
        };
        await writeJson(data);
      }

      if (!data.admin.recipePasswordHash) {
        data.admin.recipePasswordHash = data.admin.passwordHash;
        data.admin.recipeUpdatedAt = data.admin.updatedAt || new Date().toISOString();
        await writeJson(data);
      }
    },

    async read() {
      try {
        const content = await fs.readFile(filePath, "utf8");
        return normalizeStore(JSON.parse(content));
      } catch (error) {
        error.message = `Store dosyasi okunamadi: ${error.message}`;
        throw error;
      }
    },

    async update(mutator) {
      const nextWrite = writeQueue.catch(() => {}).then(async () => {
        const current = await this.read();
        const next = normalizeStore(mutator(current));
        await writeJson(next);
        return next;
      });

      writeQueue = nextWrite.catch(() => {});
      return nextWrite;
    }
  };

  async function writeJson(data) {
    const tmpPath = `${filePath}.tmp`;
    await fs.writeFile(tmpPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    await fs.rename(tmpPath, filePath);
  }
}

function normalizeStore(data) {
  return {
    menuState: normalizeMenuState(data && data.menuState),
    menuUpdatedAt: data && data.menuUpdatedAt || null,
    recipeState: normalizeRecipeState(data && data.recipeState),
    recipeUpdatedAt: data && data.recipeUpdatedAt || null,
    siteState: normalizeSiteState(data && data.siteState),
    siteUpdatedAt: data && data.siteUpdatedAt || null,
    feedbackItems: normalizeFeedbackItems(data && data.feedbackItems),
    feedbackUpdatedAt: data && data.feedbackUpdatedAt || null,
    admin: {
      passwordHash: data && data.admin && data.admin.passwordHash || "",
      recipePasswordHash: data && data.admin && (data.admin.recipePasswordHash || data.admin.passwordHash) || "",
      updatedAt: data && data.admin && data.admin.updatedAt || null,
      recipeUpdatedAt: data && data.admin && (data.admin.recipeUpdatedAt || data.admin.updatedAt) || null
    }
  };
}

function normalizeSiteState(siteState) {
  if (!siteState || typeof siteState !== "object" || Array.isArray(siteState)) {
    return {};
  }

  return siteState;
}

function normalizeMenuState(menuState) {
  if (!menuState || typeof menuState !== "object") {
    return {
      settings: {},
      categories: []
    };
  }

  return {
    settings: menuState.settings && typeof menuState.settings === "object" ? menuState.settings : {},
    categories: Array.isArray(menuState.categories) ? menuState.categories : []
  };
}

function normalizeRecipeState(recipeState) {
  if (!recipeState || typeof recipeState !== "object" || Array.isArray(recipeState)) {
    return {};
  }

  const normalized = {};
  for (const [categoryName, products] of Object.entries(recipeState)) {
    if (!categoryName || !products || typeof products !== "object" || Array.isArray(products)) continue;
    normalized[categoryName] = {};

    for (const [productName, sizes] of Object.entries(products)) {
      if (!productName || !sizes || typeof sizes !== "object" || Array.isArray(sizes)) continue;
      normalized[categoryName][productName] = {};

      for (const [sizeName, recipe] of Object.entries(sizes)) {
        if (!sizeName) continue;
        normalized[categoryName][productName][sizeName] = normalizeRecipeItem(recipe);
      }
    }
  }

  return normalized;
}

function normalizeRecipeItem(recipe) {
  if (recipe && typeof recipe === "object" && !Array.isArray(recipe)) {
    const content = String(recipe.content || recipe.recipe || recipe.ingredients || "").trim();
    const preparation = String(recipe.preparation || recipe.method || recipe.steps || recipe.description || "").trim();
    return preparation ? { content, preparation } : content;
  }

  return String(recipe || "");
}

function normalizeFeedbackItems(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      const source = item && typeof item === "object" ? item : {};
      const id = String(source.id || "").trim();
      const createdAt = String(source.createdAt || "").trim();
      const type = normalizeFeedbackType(source.type);
      const text = String(source.text || "").trim().slice(0, 1200);
      const favorite = String(source.favorite || source.favoriteDrink || "").trim().slice(0, 120);
      const rating = Math.max(0, Math.min(5, Number(source.rating || 0) || 0));
      if (!id || (!text && !favorite && !rating)) return null;
      return {
        id,
        createdAt: createdAt || new Date().toISOString(),
        type,
        text,
        favorite,
        rating
      };
    })
    .filter(Boolean)
    .slice(-1000);
}

function normalizeFeedbackType(type) {
  const value = String(type || "").toLowerCase().trim();
  if (value === "sikayet" || value === "şikayet") return "sikayet";
  if (value === "oneri" || value === "öneri") return "oneri";
  if (value === "favori" || value === "favorite") return "favori";
  if (value === "puanlama" || value === "rating") return "puanlama";
  return "istek";
}

function defaultStore(passwordHash, recipePasswordHash) {
  return {
    menuState: {
      settings: {},
      categories: []
    },
    menuUpdatedAt: null,
    recipeState: {},
    recipeUpdatedAt: null,
    siteState: {},
    siteUpdatedAt: null,
    feedbackItems: [],
    feedbackUpdatedAt: null,
    admin: {
      passwordHash,
      recipePasswordHash: recipePasswordHash || passwordHash,
      updatedAt: new Date().toISOString(),
      recipeUpdatedAt: new Date().toISOString()
    }
  };
}

module.exports = { createFileStore };
