"use strict";

const crypto = require("crypto");
const { migrateSiteState } = require("../site-state");
const categoryIcons = require("../../../../shared/scripts/category-icons");

const STORE_SCHEMA_VERSION = 2;

function migrateStore(input) {
  const source = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const next = {
    ...source,
    schemaVersion: STORE_SCHEMA_VERSION,
    menuState: normalizeMenuState(source.menuState),
    menuUpdatedAt: source.menuUpdatedAt || null,
    recipeState: normalizeRecipeState(source.recipeState),
    recipeUpdatedAt: source.recipeUpdatedAt || null,
    siteState: migrateSiteState(source.siteState),
    siteUpdatedAt: source.siteUpdatedAt || null,
    siteRevisions: normalizeRevisions(source.siteRevisions),
    feedbackItems: normalizeArray(source.feedbackItems),
    feedbackUpdatedAt: source.feedbackUpdatedAt || null,
    recipeUsers: normalizeArray(source.recipeUsers),
    recipeAssignments: normalizeArray(source.recipeAssignments),
    recipeActivity: normalizeArray(source.recipeActivity),
    admin: normalizeAdmin(source.admin)
  };

  next.recipeCatalog = reconcileRecipeCatalog(next.recipeState, source.recipeCatalog);
  const linked = migrateMenuRecipeLinks(next.menuState, next.recipeCatalog, next.recipeState);
  next.menuState = linked.menuState;
  next.recipeLinkReview = linked.review;
  return next;
}

function normalizeMenuState(menuState) {
  const source = menuState && typeof menuState === "object" && !Array.isArray(menuState) ? menuState : {};
  return {
    ...source,
    settings: source.settings && typeof source.settings === "object" && !Array.isArray(source.settings) ? source.settings : {},
    categories: Array.isArray(source.categories)
      ? source.categories.map((category, categoryIndex) => normalizeMenuCategory(category, categoryIndex)).filter(Boolean)
      : []
  };
}

function normalizeMenuCategory(category, index) {
  if (!category || typeof category !== "object" || Array.isArray(category)) return null;
  const id = String(category.id || `category-${index + 1}`);
  return {
    ...category,
    id,
    name: String(category.name || `Kategori ${index + 1}`),
    active: category.active !== false,
    order: finiteNumber(category.order, index),
    iconKey: normalizeCategoryIconKey(category.iconKey || category.icon, category.name),
    icon: categoryIcons.getIconClass(normalizeCategoryIconKey(category.iconKey || category.icon, category.name)),
    products: Array.isArray(category.products)
      ? category.products.map((product, productIndex) => normalizeMenuProduct(product, id, productIndex)).filter(Boolean)
      : []
  };
}

function normalizeCategoryIconKey(value, categoryName) {
  const text = String(value || "").trim();
  if (text && categoryIcons.ICONS[text]) return text;
  return categoryIcons.inferIconKey(categoryName);
}

function normalizeMenuProduct(product, categoryId, index) {
  if (!product || typeof product !== "object" || Array.isArray(product)) return null;
  const details = product.details && typeof product.details === "object" && !Array.isArray(product.details)
    ? product.details
    : {};
  const manualContent = String(product.manualContent ?? details.ingredients ?? product.ingredients ?? "").trim();
  const hasExplicitContentMode = Object.prototype.hasOwnProperty.call(product, "contentMode");
  const mode = hasExplicitContentMode ? normalizeContentMode(product.contentMode, product.recipeId, manualContent) : (product.recipeId ? "recipe" : undefined);
  return {
    ...product,
    id: String(product.id || `${categoryId || "category"}-product-${index + 1}`),
    name: String(product.name || `Ürün ${index + 1}`),
    active: product.active !== false,
    order: finiteNumber(product.order, index),
    contentMode: mode,
    recipeId: mode === "recipe" ? String(product.recipeId || "") : String(product.recipeId || ""),
    recipeSize: String(product.recipeSize || ""),
    manualContent,
    details: {
      ...details,
      calories: String(details.calories ?? product.calories ?? ""),
      allergens: String(details.allergens ?? product.allergens ?? ""),
      ingredients: manualContent
    }
  };
}

function normalizeRecipeState(recipeState) {
  if (!recipeState || typeof recipeState !== "object" || Array.isArray(recipeState)) return {};
  const normalized = {};
  for (const [categoryName, products] of Object.entries(recipeState)) {
    if (!categoryName || !products || typeof products !== "object" || Array.isArray(products)) continue;
    const nextProducts = {};
    for (const [productName, sizes] of Object.entries(products)) {
      if (!productName || !sizes || typeof sizes !== "object" || Array.isArray(sizes)) continue;
      const nextSizes = {};
      for (const [sizeName, recipe] of Object.entries(sizes)) {
        if (!sizeName) continue;
        nextSizes[sizeName] = normalizeRecipeItem(recipe);
      }
      nextProducts[productName] = nextSizes;
    }
    normalized[categoryName] = nextProducts;
  }
  return normalized;
}

function normalizeRecipeItem(recipe) {
  if (recipe && typeof recipe === "object" && !Array.isArray(recipe)) {
    return {
      ...recipe,
      content: String(recipe.content ?? recipe.recipe ?? recipe.ingredients ?? "").trim(),
      preparation: String(recipe.preparation ?? recipe.method ?? recipe.steps ?? recipe.description ?? "").trim(),
      note: String(recipe.note ?? recipe.productNote ?? "").trim(),
      active: recipe.active !== false,
      order: finiteNumber(recipe.order, 0)
    };
  }
  return String(recipe || "");
}

function reconcileRecipeCatalog(recipeState, existing) {
  const records = Array.isArray(existing) ? existing.filter(isCatalogRecord).map((item) => ({ ...item })) : [];
  const claimed = new Set();
  const result = [];

  for (const [category, products] of Object.entries(recipeState || {})) {
    for (const product of Object.keys(products || {})) {
      const exact = records.find((item) => !claimed.has(item.id) && item.category === category && item.product === product);
      const record = exact || {
        id: stableRecipeId(category, product),
        category,
        product,
        createdAt: new Date(0).toISOString()
      };
      claimed.add(record.id);
      result.push({
        ...record,
        id: String(record.id),
        category,
        product,
        updatedAt: record.updatedAt || null
      });
    }
  }
  return result;
}

function migrateMenuRecipeLinks(menuState, recipeCatalog, recipeState) {
  const nameIndex = new Map();
  recipeCatalog.forEach((record) => {
    const key = normalizeName(record.product);
    if (!nameIndex.has(key)) nameIndex.set(key, []);
    nameIndex.get(key).push(record);
  });

  const validRecipeIds = new Set(recipeCatalog.map((item) => item.id));
  const review = [];
  const categories = menuState.categories.map((category) => ({
    ...category,
    products: category.products.map((product) => {
      const next = { ...product };
      if (next.recipeId && validRecipeIds.has(next.recipeId)) {
        next.contentMode = next.contentMode || "recipe";
        next.recipeLinkStatus = "linked";
        return next;
      }

      if (!next.recipeId && next.contentMode === undefined) {
        const candidates = nameIndex.get(normalizeName(next.name)) || [];
        if (candidates.length === 1) {
          next.recipeId = candidates[0].id;
          next.contentMode = "recipe";
          next.recipeSize = chooseRecipeSize(recipeState, candidates[0]);
          next.recipeLinkStatus = "linked";
          return next;
        }
      }

      if (next.contentMode === "recipe" && !validRecipeIds.has(next.recipeId)) {
        next.contentMode = next.manualContent ? "manual" : "hidden";
      }
      if (!next.contentMode) next.contentMode = next.manualContent ? "manual" : "hidden";
      next.recipeLinkStatus = "needs-review";
      review.push({
        productId: next.id,
        categoryId: category.id,
        productName: next.name,
        reason: (nameIndex.get(normalizeName(next.name)) || []).length > 1 ? "ambiguous" : "not-found"
      });
      return next;
    })
  }));
  return { menuState: { ...menuState, categories }, review };
}

function chooseRecipeSize(recipeState, record, preferredSize = "") {
  const sizes = recipeState?.[record.category]?.[record.product] || {};
  const activeEntries = Object.entries(sizes).filter(([, value]) => normalizeRecipeItem(value).active !== false);
  if (!activeEntries.length) return "";
  const preferred = [preferredSize, "Standart", "16 oz"].filter(Boolean);
  for (const name of preferred) {
    const match = activeEntries.find(([size]) => normalizeName(size) === normalizeName(name));
    if (match) return match[0];
  }
  activeEntries.sort(([, first], [, second]) => finiteNumber(normalizeRecipeItem(first).order, 0) - finiteNumber(normalizeRecipeItem(second).order, 0));
  return activeEntries[0][0];
}

function stableRecipeId(category, product) {
  return `recipe-${crypto.createHash("sha256").update(`${category}\u0000${product}`, "utf8").digest("hex").slice(0, 20)}`;
}

function normalizeContentMode(mode, recipeId, manualContent) {
  if (["recipe", "manual", "hidden", "not-required"].includes(mode)) return mode;
  if (recipeId) return "recipe";
  return manualContent ? "manual" : "hidden";
}

function normalizeAdmin(admin) {
  const source = admin && typeof admin === "object" && !Array.isArray(admin) ? admin : {};
  return {
    ...source,
    passwordHash: String(source.passwordHash || ""),
    recipePasswordHash: String(source.recipePasswordHash || source.passwordHash || ""),
    updatedAt: source.updatedAt || null,
    recipeUpdatedAt: source.recipeUpdatedAt || source.updatedAt || null
  };
}

function normalizeRevisions(items) {
  return normalizeArray(items).slice(-10);
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function isCatalogRecord(item) {
  return Boolean(item && typeof item === "object" && item.id && item.category && item.product);
}

function normalizeName(value) {
  return String(value || "")
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function finiteNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

module.exports = {
  STORE_SCHEMA_VERSION,
  chooseRecipeSize,
  migrateMenuRecipeLinks,
  migrateStore,
  normalizeMenuState,
  normalizeRecipeItem,
  normalizeRecipeState,
  reconcileRecipeCatalog,
  stableRecipeId
};
