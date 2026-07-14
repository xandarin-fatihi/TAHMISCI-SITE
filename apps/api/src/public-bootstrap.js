"use strict";

const crypto = require("crypto");
const { chooseRecipeSize, normalizeRecipeItem } = require("./store/migrations");
const { migrateSiteState } = require("./site-state");

function buildPublicBootstrap(storeData) {
  const data = storeData && typeof storeData === "object" ? storeData : {};
  const recipeCatalog = Array.isArray(data.recipeCatalog) ? data.recipeCatalog : [];
  const catalogById = new Map(recipeCatalog.map((record) => [record.id, record]));
  const menuSettings = data.menuState?.settings && typeof data.menuState.settings === "object"
    ? data.menuState.settings
    : {};
  const siteState = migrateSiteState(data.siteState);
  const hiddenCategoryIds = new Set(siteState.menuSection?.hiddenCategoryIds || []);

  const categories = (data.menuState?.categories || [])
    .filter((category) => category && category.active !== false && !hiddenCategoryIds.has(category.id))
    .sort(byOrder)
    .map((category) => {
      const products = (category.products || [])
        .filter((product) => product && product.active !== false)
        .filter((product) => siteState.menuSection?.soldOutMode !== "hide" || !isSoldOut(product))
        .sort(byOrder)
        .map((product) => publicProduct(product, category, data.recipeState || {}, catalogById));
      return {
        id: String(category.id),
        name: String(category.name || ""),
        order: numberOr(category.order, 0),
        icon: String(category.icon || ""),
        image: resource(category.imageUrl || category.image || category.style?.imageUrl || category.style?.image),
        productCount: products.length,
        products
      };
    });

  const products = categories.flatMap((category) => category.products);
  const timestamps = [data.menuUpdatedAt, data.recipeUpdatedAt, data.siteUpdatedAt].filter(Boolean).sort();
  const updatedAt = timestamps[timestamps.length - 1] || null;
  const versionSource = JSON.stringify({
    updatedAt,
    menuUpdatedAt: data.menuUpdatedAt || null,
    recipeUpdatedAt: data.recipeUpdatedAt || null,
    siteUpdatedAt: data.siteUpdatedAt || null,
    productCount: products.length
  });

  return {
    schemaVersion: 1,
    version: crypto.createHash("sha256").update(versionSource).digest("hex").slice(0, 16),
    updatedAt,
    siteState,
    menu: {
      settings: publicMenuSettings(menuSettings),
      categoryCount: categories.length,
      productCount: products.length,
      categories,
      products
    }
  };
}

function publicProduct(product, category, recipeState, catalogById) {
  const content = resolvePublicContent(product, recipeState, catalogById);
  const variants = normalizeVariants(product);
  const prices = normalizePrices(product.prices);
  const basePrice = firstPrice(prices, variants);
  return {
    id: String(product.id),
    categoryId: String(category.id),
    categoryName: String(category.name || ""),
    name: String(product.name || ""),
    description: String(product.desc || product.description || ""),
    image: resource(product.imageUrl || product.image || product.img),
    imageOverlay: numberOr(product.imageOverlay, 0),
    priceMode: String(product.priceMode || "standard"),
    prices,
    variants,
    basePrice,
    priceLabel: priceLabel(prices, variants),
    calories: String(product.details?.calories ?? product.calories ?? ""),
    allergens: String(product.details?.allergens ?? product.allergens ?? ""),
    content,
    popular: Boolean(product.popular),
    stock: isSoldOut(product) ? "sold-out" : "active",
    kind: String(product.kind || ""),
    temperature: String(product.temperature || ""),
    order: numberOr(product.order, 0)
  };
}

function resolvePublicContent(product, recipeState, catalogById) {
  const mode = ["recipe", "manual", "hidden"].includes(product.contentMode)
    ? product.contentMode
    : (product.recipeId ? "recipe" : (product.manualContent || product.details?.ingredients ? "manual" : "hidden"));
  if (mode === "hidden") return "";
  const manual = String(product.manualContent ?? product.details?.ingredients ?? product.ingredients ?? "").trim();
  if (mode === "manual") return manual;

  const record = catalogById.get(product.recipeId);
  if (!record) return manual;
  const sizes = recipeState?.[record.category]?.[record.product];
  if (!sizes || typeof sizes !== "object") return manual;
  const sizeName = chooseRecipeSize(recipeState, record, product.recipeSize);
  const recipe = normalizeRecipeItem(sizes[sizeName]);
  if (recipe && typeof recipe === "object" && recipe.active === false) return manual;
  const content = typeof recipe === "string" ? recipe : recipe?.content;
  return String(content || manual || "").trim();
}

function publicMenuSettings(settings) {
  return {
    menuUpdateDate: String(settings.menuUpdateDate || ""),
    fonts: settings.fonts && typeof settings.fonts === "object" ? settings.fonts : {},
    typography: settings.typography && typeof settings.typography === "object" ? settings.typography : {}
  };
}

function normalizeVariants(product) {
  if (!Array.isArray(product.variants)) return [];
  return product.variants
    .map((variant) => ({
      name: String(variant?.name || "").trim(),
      price: numberOr(variant?.price, null)
    }))
    .filter((variant) => variant.name || variant.price !== null);
}

function normalizePrices(value) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const result = {};
  for (const [key, item] of Object.entries(source)) {
    const number = numberOr(item, null);
    if (number !== null) result[key] = number;
  }
  return result;
}

function firstPrice(prices, variants) {
  const values = [...Object.values(prices), ...variants.map((variant) => variant.price)]
    .filter((value) => Number.isFinite(value) && value > 0);
  return values.length ? Math.min(...values) : 0;
}

function priceLabel(prices, variants) {
  const values = [...Object.values(prices), ...variants.map((variant) => variant.price)]
    .filter((value) => Number.isFinite(value) && value > 0)
    .sort((first, second) => first - second);
  if (!values.length) return "";
  const format = (value) => `₺${Number(value).toLocaleString("tr-TR")}`;
  return values[0] === values[values.length - 1] ? format(values[0]) : `${format(values[0])} - ${format(values[values.length - 1])}`;
}

function resource(value) {
  const text = String(value || "").trim();
  if (!text || /^data:/i.test(text) || /^blob:/i.test(text)) return "";
  return text;
}

function isSoldOut(product) {
  return product.stock === "sold-out" || product.soldOut === true;
}

function byOrder(first, second) {
  return numberOr(first.order, 0) - numberOr(second.order, 0);
}

function numberOr(value, fallback) {
  if (value === "" || value === null || value === undefined) return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

module.exports = {
  buildPublicBootstrap,
  resolvePublicContent
};
