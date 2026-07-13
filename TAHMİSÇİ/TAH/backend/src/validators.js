"use strict";
// Developer: Uzeyir | System Key: xandar | API validation marker

const MAX_STATE_BYTES = 7_500_000;
const MAX_STRING_LENGTH = 500_000;
const RESOURCE_KEY_PATTERN = /(url|href|src|image|video|maps|instagram|tiktok|whatsapp)$/i;

function validatePassword(password) {
  if (password.length < 10) return "Sifre en az 10 karakter olmali.";
  if (password.length > 72) return "Sifre en fazla 72 karakter olmali.";
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    return "Sifre en az bir harf ve bir rakam icermeli.";
  }
  return "";
}

function validateMenuState(menuState) {
  if (!menuState || typeof menuState !== "object" || Array.isArray(menuState)) {
    return "menuState nesnesi gerekli.";
  }

  const safetyError = validateSafeState(menuState, "menuState");
  if (safetyError) return safetyError;

  if (!Array.isArray(menuState.categories)) {
    return "menuState.categories dizi olmali.";
  }

  if (menuState.settings && typeof menuState.settings !== "object") {
    return "menuState.settings nesne olmali.";
  }

  for (const category of menuState.categories) {
    if (!category || typeof category !== "object") return "Her kategori nesne olmali.";
    if (!category.id || !category.name) return "Her kategoride id ve name olmali.";
    if (!Array.isArray(category.products)) return "Her kategoride products dizisi olmali.";

    for (const product of category.products) {
      if (!product || typeof product !== "object") return "Her urun nesne olmali.";
      if (!product.id || !product.name) return "Her urunde id ve name olmali.";
    }
  }

  return "";
}

function validateRecipeState(recipeState) {
  if (!recipeState || typeof recipeState !== "object" || Array.isArray(recipeState)) {
    return "recipeState nesnesi gerekli.";
  }

  const safetyError = validateSafeState(recipeState, "recipeState");
  if (safetyError) return safetyError;

  for (const [categoryName, products] of Object.entries(recipeState)) {
    if (!categoryName || typeof products !== "object" || Array.isArray(products) || products === null) {
      return "Her recete kategorisi urun nesnesi icermeli.";
    }

    for (const [productName, sizes] of Object.entries(products)) {
      if (!productName || typeof sizes !== "object" || Array.isArray(sizes) || sizes === null) {
        return "Her recete urunu olcu nesnesi icermeli.";
      }

      for (const [sizeName, recipe] of Object.entries(sizes)) {
        if (!sizeName) return "Her recete olcusunun adi olmali.";
        if (!isRecipeText(recipe)) return "Recete metni string veya { content, preparation } nesnesi olmali.";
      }
    }
  }

  return "";
}

function isRecipeText(recipe) {
  if (typeof recipe === "string") return true;
  if (!recipe || typeof recipe !== "object" || Array.isArray(recipe)) return false;
  const allowed = new Set(["content", "preparation", "recipe", "ingredients", "method", "steps", "description"]);
  return Object.entries(recipe).every(([key, value]) => allowed.has(key) && typeof value === "string");
}

function validateSiteState(siteState) {
  if (!siteState || typeof siteState !== "object" || Array.isArray(siteState)) {
    return "siteState nesnesi gerekli.";
  }

  const safetyError = validateSafeState(siteState, "siteState", 250000);
  if (safetyError) return safetyError;

  return "";
}

function validateSafeState(value, label, maxBytes = MAX_STATE_BYTES) {
  const encoded = JSON.stringify(value);
  if (Buffer.byteLength(encoded, "utf8") > maxBytes) return `${label} cok buyuk.`;

  const stack = [{ key: label, path: label, value }];
  while (stack.length) {
    const current = stack.pop();
    const currentValue = current.value;

    if (typeof currentValue === "string") {
      if (currentValue.length > MAX_STRING_LENGTH && !isLargeDataResource(currentValue)) {
        return `${current.path} metni cok uzun.`;
      }

      if (hasUnsafeMarkup(currentValue)) {
        return `${current.path} guvensiz script icerigi tasiyor.`;
      }

      if (RESOURCE_KEY_PATTERN.test(current.key) && !isSafeResource(currentValue)) {
        return `${current.path} guvenli olmayan kaynak adresi iceriyor.`;
      }
      continue;
    }

    if (!currentValue || typeof currentValue !== "object") continue;

    if (Array.isArray(currentValue)) {
      currentValue.forEach((item, index) => {
        stack.push({ key: String(index), path: `${current.path}[${index}]`, value: item });
      });
      continue;
    }

    for (const [key, item] of Object.entries(currentValue)) {
      stack.push({ key, path: `${current.path}.${key}`, value: item });
    }
  }

  return "";
}

function hasUnsafeMarkup(value) {
  return /<\s*\/?\s*script\b|on[a-z]+\s*=|javascript:/i.test(value);
}

function isSafeResource(value) {
  const text = String(value || "").trim();
  if (!text) return true;
  if (/[<>"'\\]/.test(text)) return false;
  if (/^media:[a-z0-9._-]+$/i.test(text)) return true;
  if (/^data:image\/(?:png|jpe?g|gif|webp);base64,/i.test(text)) return true;
  if (/^data:video\/[a-z0-9.+-]+;base64,/i.test(text)) return true;
  if (/^data:/i.test(text)) return false;

  try {
    const url = new URL(text, "https://tahmiscicoffee.local/");
    return ["http:", "https:", "mailto:", "tel:", "blob:"].includes(url.protocol);
  } catch (_error) {
    return false;
  }
}

function isLargeDataResource(value) {
  return /^data:(?:image\/(?:png|jpe?g|gif|webp)|video\/[a-z0-9.+-]+);base64,/i.test(String(value || ""));
}

module.exports = {
  validateMenuState,
  validateRecipeState,
  validateSiteState,
  validatePassword
};
