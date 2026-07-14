"use strict";

const fs = require("fs/promises");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");
const categoryIcons = require("../../../../shared/scripts/category-icons");

async function seedStoreIfEmpty(store, projectRoot) {
  const current = await store.read();
  const needsMenu = !Array.isArray(current.menuState?.categories) || current.menuState.categories.length === 0;
  const needsRecipes = !current.recipeState || Object.keys(current.recipeState).length === 0;
  if (!needsMenu && !needsRecipes) return { seeded: false, menu: false, recipes: false };

  const defaults = await loadDefaults(projectRoot);
  const updatedAt = new Date().toISOString();
  await store.update((data) => {
    if (needsMenu && defaults.menuState.categories.length) {
      data.menuState = defaults.menuState;
      data.menuUpdatedAt = data.menuUpdatedAt || updatedAt;
    }
    if (needsRecipes && Object.keys(defaults.recipeState).length) {
      data.recipeState = defaults.recipeState;
      data.recipeUpdatedAt = data.recipeUpdatedAt || updatedAt;
    }
    return data;
  });
  return { seeded: true, menu: needsMenu, recipes: needsRecipes };
}

async function loadDefaults(projectRoot) {
  const seedsRoot = await resolveSeedsRoot(projectRoot);
  const [menu, recipeState] = await Promise.all([
    readJsonSeed(path.join(seedsRoot, "menu.json"), () => evaluateBrowserData(path.join(seedsRoot, "menu-data.js"), "MENU")),
    readJsonSeed(path.join(seedsRoot, "recipes.json"), () => evaluateBrowserData(path.join(seedsRoot, "recipe-data.js"), "DEFAULT_RECIPE_DATA"))
  ]);
  return { menuState: legacyMenuToState(menu), recipeState };
}

async function resolveSeedsRoot(projectRoot) {
  let current = path.resolve(projectRoot);
  for (let depth = 0; depth < 4; depth += 1) {
    const candidate = path.join(current, "data", "seeds");
    try {
      await fs.access(candidate);
      return candidate;
    } catch (_error) {
      const parent = path.dirname(current);
      if (parent === current) break;
      current = parent;
    }
  }
  return path.join(path.resolve(projectRoot), "data", "seeds");
}

async function readJsonSeed(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT" && typeof fallback === "function") return fallback();
    throw error;
  }
}

async function evaluateBrowserData(filePath, key) {
  const source = await fs.readFile(filePath, "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox, { filename: filePath, timeout: 2000 });
  const value = sandbox.window[key];
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${path.basename(filePath)} icinde window.${key} bulunamadi.`);
  }
  return JSON.parse(JSON.stringify(value));
}

function legacyMenuToState(menu) {
  const categories = Object.entries(menu || {}).map(([categoryName, groups], categoryIndex) => {
    const categoryId = stableId("category", categoryName);
    const products = [];
    Object.entries(groups || {}).forEach(([groupName, items]) => {
      (Array.isArray(items) ? items : []).forEach((item, productIndex) => {
        const variants = Array.isArray(item.variants)
          ? item.variants.map((variant) => ({ name: String(variant.name || "").trim(), price: price(variant.price) }))
          : [];
        const standard = price(item.price);
        const details = item.details && typeof item.details === "object" ? item.details : {};
        const ingredients = String(item.manualContent || details.ingredients || item.ingredients || "").trim();
        products.push({
          id: stableId(categoryId, `${groupName}\u0000${item.name || productIndex}`),
          name: String(item.name || "Ürün"),
          desc: String(item.desc || groupName || ""),
          active: true,
          stock: "active",
          image: String(item.img || item.image || ""),
          imageUrl: "",
          imageOverlay: 0,
          priceMode: variants.length ? "variants" : "standard",
          prices: standard === null ? {} : { standard },
          variants,
          popular: false,
          kind: "drink",
          temperature: "none",
          order: products.length,
          manualContent: ingredients,
          details: {
            calories: String(details.calories || item.calories || "").trim(),
            allergens: String(details.allergens || item.allergens || "").trim(),
            ingredients
          }
        });
      });
    });
    return {
      id: categoryId,
      name: categoryName,
      active: true,
      order: categoryIndex,
      color: "",
      iconKey: categoryIcons.inferIconKey(categoryName),
      icon: categoryIcons.getIconClass(categoryIcons.inferIconKey(categoryName)),
      image: "",
      style: {},
      products
    };
  });
  return { settings: {}, categories };
}

function stableId(prefix, value) {
  return `${prefix}-${crypto.createHash("sha256").update(String(value), "utf8").digest("hex").slice(0, 16)}`;
}

function price(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

module.exports = { legacyMenuToState, loadDefaults, seedStoreIfEmpty };
