"use strict";
// Developer: Uzeyir | System Key: xandar | API validation marker

const MAX_STATE_BYTES = 7_500_000;
const MAX_SITE_STATE_BYTES = 750_000;
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

  const safetyError = validateSafeState(menuState, "menuState", MAX_STATE_BYTES, { allowEmbeddedMedia: false });
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
      if (product.contentMode && !["recipe", "manual", "hidden"].includes(product.contentMode)) {
        return "Urun contentMode recipe, manual veya hidden olmali.";
      }
    }
  }

  return "";
}

function validateRecipeState(recipeState) {
  if (!recipeState || typeof recipeState !== "object" || Array.isArray(recipeState)) {
    return "recipeState nesnesi gerekli.";
  }

  const safetyError = validateSafeState(recipeState, "recipeState", MAX_STATE_BYTES, { allowEmbeddedMedia: false });
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
  const stringFields = new Set(["content", "preparation", "recipe", "ingredients", "method", "steps", "description", "note", "productNote"]);
  const booleanFields = new Set(["active"]);
  const numberFields = new Set(["order"]);
  return Object.entries(recipe).every(([key, value]) => (
    (stringFields.has(key) && typeof value === "string")
    || (booleanFields.has(key) && typeof value === "boolean")
    || (numberFields.has(key) && Number.isFinite(Number(value)))
  ));
}

function validateSiteState(siteState) {
  if (!siteState || typeof siteState !== "object" || Array.isArray(siteState)) {
    return "siteState nesnesi gerekli.";
  }

  const safetyError = validateSafeState(siteState, "siteState", MAX_SITE_STATE_BYTES, { allowEmbeddedMedia: false });
  if (safetyError) return safetyError;

  if (siteState.schemaVersion !== undefined && (!Number.isInteger(siteState.schemaVersion) || siteState.schemaVersion < 1)) {
    return "siteState.schemaVersion pozitif tam sayi olmali.";
  }
  if (siteState.sectionOrder !== undefined && !Array.isArray(siteState.sectionOrder)) {
    return "siteState.sectionOrder dizi olmali.";
  }
  for (const key of ["global", "header", "hero", "featuredProducts", "menuSection", "about", "qrMenu", "contact", "footer", "seo"]) {
    if (siteState[key] !== undefined && (!siteState[key] || typeof siteState[key] !== "object" || Array.isArray(siteState[key]))) {
      return `siteState.${key} nesne olmali.`;
    }
  }

  const hero = siteState.hero || {};
  if (hero.mediaType !== undefined && !["image", "video"].includes(hero.mediaType)) {
    return "siteState.hero.mediaType image veya video olmali.";
  }
  if (hero.overlay !== undefined && (!Number.isFinite(hero.overlay) || hero.overlay < 0 || hero.overlay > 0.85)) {
    return "siteState.hero.overlay 0 ile 0.85 arasinda sayi olmali.";
  }
  if (hero.autoplayInterval !== undefined && (!Number.isInteger(hero.autoplayInterval) || hero.autoplayInterval < 2000)) {
    return "siteState.hero.autoplayInterval en az 2000 olan tam sayi olmali.";
  }
  for (const [path, value] of [
    ["header.visible", siteState.header?.visible],
    ["header.contactVisible", siteState.header?.contactVisible],
    ["hero.visible", hero.visible],
    ["hero.autoplay", hero.autoplay],
    ["hero.sliderEnabled", hero.sliderEnabled],
    ["featuredProducts.visible", siteState.featuredProducts?.visible],
    ["menuSection.visible", siteState.menuSection?.visible],
    ["about.visible", siteState.about?.visible],
    ["qrMenu.visible", siteState.qrMenu?.visible],
    ["contact.visible", siteState.contact?.visible],
    ["footer.visible", siteState.footer?.visible]
  ]) {
    if (value !== undefined && typeof value !== "boolean") return `siteState.${path} boolean olmali.`;
  }
  const navigation = siteState.header?.navigation;
  if (navigation !== undefined) {
    if (!Array.isArray(navigation)) return "siteState.header.navigation dizi olmali.";
    for (const item of navigation) {
      if (!item || typeof item !== "object" || Array.isArray(item)) return "Her header navigation kaydi nesne olmali.";
      if (item.visible !== undefined && typeof item.visible !== "boolean") return "Header navigation visible boolean olmali.";
      if (item.order !== undefined && !Number.isFinite(Number(item.order))) return "Header navigation sirasi sayi olmali.";
    }
  }
  for (const slide of Array.isArray(hero.slides) ? hero.slides : []) {
    if (slide.order !== undefined && !Number.isFinite(slide.order)) return "Hero slayt sirasi sayi olmali.";
    if (slide.visible !== undefined && typeof slide.visible !== "boolean") return "Hero slayt aktifligi boolean olmali.";
  }

  return "";
}

function validateRecipeCatalog(recipeCatalog, recipeState) {
  if (!Array.isArray(recipeCatalog)) return "recipeCatalog dizi olmali.";
  const ids = new Set();
  for (const record of recipeCatalog) {
    if (!record || typeof record !== "object" || !record.id || !record.category || !record.product) {
      return "Her recipeCatalog kaydinda id, category ve product olmali.";
    }
    if (ids.has(record.id)) return "recipeCatalog kimlikleri benzersiz olmali.";
    ids.add(record.id);
    if (!recipeState?.[record.category]?.[record.product]) {
      return `recipeCatalog kaydi bulunamayan receteye isaret ediyor: ${record.id}`;
    }
  }
  return validateSafeState(recipeCatalog, "recipeCatalog", 1_000_000, { allowEmbeddedMedia: false });
}

function validateSafeState(value, label, maxBytes = MAX_STATE_BYTES, options = {}) {
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

      if (!options.allowEmbeddedMedia && /^data:(?:image|video)\//i.test(currentValue)) {
        return `${current.path} gomulu medya iceremez; /media yolu kullanin.`;
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
  return /<\s*\/?\s*[a-z][^>]*>|on[a-z]+\s*=|javascript:/i.test(value);
}

function isSafeResource(value) {
  const text = String(value || "").trim();
  if (!text) return true;
  if (/[<>"'\\]/.test(text)) return false;
  if (/^media:[a-z0-9._-]+$/i.test(text)) return true;
  if (/^data:/i.test(text)) return false;

  try {
    const url = new URL(text, "https://tahmiscicoffee.local/");
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol);
  } catch (_error) {
    return false;
  }
}

function isLargeDataResource(value) {
  return /^data:(?:image\/(?:png|jpe?g|gif|webp)|video\/[a-z0-9.+-]+);base64,/i.test(String(value || ""));
}

module.exports = {
  validateMenuState,
  validateRecipeCatalog,
  validateRecipeState,
  validateSiteState,
  validatePassword,
  validateSafeState
};
