// Developer: Uzeyir | System Key: xandar | Source integrity marker
(function () {
  "use strict";

  const STORAGE_KEY = "tahmisci.recipe.state.v1";
  const LEGACY_STORAGE_KEY = "tahmisRecipeMenuData";
  const BACKEND_URL_KEY = "tahmisci.backend.url";
  const BACKEND_TOKEN_KEY = "tahmisci.backend.panel.token";
  const RECIPE_ACCESS_KEY = "tahmisci.recipe.local.access";
  const LOCAL_RECIPE_PIN = "2135";
  const THEME_KEY = "tahmisci.menu.theme";
  const CHANNEL_NAME = "tahmisci-recipe-updates";
  const CATEGORY_NAMES = {
    Demlemeler: "Demlemeler",
    Espresso: "Espresso Bazlılar",
    Matcha: "Matcha Serisi",
    Aromali: "Aromalı Latteler",
    Sicak: "İmza Sıcak",
    Soguk: "İmza Soğuk",
    Hazirlik: "Hazırlık"
  };

  const state = {
    data: {},
    activeCategory: "all",
    search: "",
    entries: [],
    suggestions: [],
    channel: null,
    eventSource: null
  };

  const els = {};

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    cacheElements();
    state.data = loadRecipes();
    applyStoredTheme();
    bindEvents();
    renderAll();
    setupLiveUpdates();
    await hydrateRecipesFromBackend();
  }

  function cacheElements() {
    [
      "recipeGate", "recipeGateForm", "recipeGatePassword", "recipeGateError",
      "recipeTabs", "recipeGrid", "recipeEmpty", "recipeSearch", "recipeSuggestions", "recipeModal",
      "recipeModalCategory", "recipeModalTitle", "recipeModalSize", "recipeModalSteps",
      "recipeModeIcon"
    ].forEach((id) => {
      els[id] = document.getElementById(id);
    });
  }

  function bindEvents() {
    if (els.recipeGateForm) {
      els.recipeGateForm.addEventListener("submit", handleRecipeGateSubmit);
    }

    applyRecipeAccessState();

    document.addEventListener("click", (event) => {
      const actionTarget = event.target.closest("[data-action]");
      if (actionTarget) {
        const action = actionTarget.dataset.action;
        if (action === "theme") toggleTheme();
        if (action === "close-recipe") closeRecipeModal();
        return;
      }

      const tab = event.target.closest("[data-recipe-tab]");
      if (tab) {
        state.activeCategory = tab.dataset.recipeTab || "all";
        renderAll();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const sizeButton = event.target.closest("[data-recipe-size-index]");
      if (sizeButton) {
        const entry = state.entries[Number(sizeButton.dataset.recipeIndex)];
        const size = entry && entry.sizes[Number(sizeButton.dataset.recipeSizeIndex)];
        openRecipeModal(entry, size);
        hideSuggestions();
        return;
      }

      const card = event.target.closest("[data-recipe-index]");
      if (card) {
        openRecipeModal(state.entries[Number(card.dataset.recipeIndex)]);
        hideSuggestions();
        return;
      }

      const suggestion = event.target.closest("[data-recipe-suggestion]");
      if (suggestion) {
        const entry = state.suggestions[Number(suggestion.dataset.recipeSuggestion)];
        if (!entry) return;
        state.activeCategory = entry.category || "all";
        state.search = entry.product;
        if (els.recipeSearch) els.recipeSearch.value = entry.product;
        renderAll();
        hideSuggestions();
        openRecipeModal(entry);
        return;
      }

      if (event.target === els.recipeModal) closeRecipeModal();
      if (els.recipeSuggestions && !event.target.closest(".recipe-search")) hideSuggestions();
    });

    if (els.recipeSearch) {
      els.recipeSearch.addEventListener("input", () => {
        state.search = els.recipeSearch.value.trim();
        renderAll();
        renderSuggestions();
      });
      els.recipeSearch.addEventListener("focus", renderSuggestions);
      els.recipeSearch.addEventListener("keydown", (event) => {
        if (event.key === "Escape") hideSuggestions();
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeRecipeModal();
        hideSuggestions();
      }
    });
  }

  async function handleRecipeGateSubmit(event) {
    event.preventDefault();
    const password = (els.recipeGatePassword && els.recipeGatePassword.value || "").trim();
    const result = await validateRecipePassword(password);

    if (result.ok) {
      safeSessionSet(RECIPE_ACCESS_KEY, "ok");
      if (els.recipeGateError) els.recipeGateError.hidden = true;
      if (els.recipeGatePassword) els.recipeGatePassword.value = "";
      applyRecipeAccessState();
      return;
    }

    if (els.recipeGateError) {
      els.recipeGateError.textContent = result.message || "Şifre hatalı. Lütfen tekrar deneyin.";
      els.recipeGateError.hidden = false;
    }
    if (els.recipeGatePassword) {
      els.recipeGatePassword.value = "";
      els.recipeGatePassword.focus();
    }
  }

  async function validateRecipePassword(password) {
    if (password === LOCAL_RECIPE_PIN) return { ok: true };
    return { ok: false, message: "PIN hatali. Local recete PIN kodunu tekrar deneyin." };
  }

  async function loginBackend(password) {
    try {
      const response = await fetch(`${backendBaseUrl()}/api/admin/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      if (response.status === 401) return "denied";
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok === false) return "denied";
      if (result.token) safeSessionSet(BACKEND_TOKEN_KEY, result.token);
      return "ok";
    } catch (error) {
      return "unavailable";
    }
  }

  async function verifyBackendSession() {
    if (!backendBaseUrl() || !window.fetch) return false;

    try {
      const response = await fetch(`${backendBaseUrl()}/api/admin/me`, {
        credentials: "include",
        headers: bearerHeaders()
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  function applyRecipeAccessState() {
    const unlocked = safeSessionGet(RECIPE_ACCESS_KEY) === "ok";
    document.body.classList.toggle("recipe-locked", !unlocked);
    if (els.recipeGate) els.recipeGate.hidden = unlocked;
    if (!unlocked && els.recipeGatePassword) {
      window.setTimeout(() => els.recipeGatePassword.focus(), 60);
    }
  }

  function setupLiveUpdates() {
    window.addEventListener("storage", (event) => {
      if (event.key === STORAGE_KEY || event.key === LEGACY_STORAGE_KEY) refreshFromStorage();
    });

    if ("BroadcastChannel" in window) {
      state.channel = new BroadcastChannel(CHANNEL_NAME);
      state.channel.addEventListener("message", (event) => {
        if (event.data && event.data.type === "recipes-updated") refreshFromStorage();
      });
    }

    setupBackendRecipeEvents();
  }

  function refreshFromStorage() {
    state.data = loadRecipes();
    if (state.activeCategory !== "all" && !groupedRecipes(state.activeCategory).length) {
      state.activeCategory = "all";
    }
    renderAll();
  }

  function loadRecipes() {
    return normalizeRecipeData(
      readJSON(STORAGE_KEY)
      || readJSON(LEGACY_STORAGE_KEY)
      || clone(window.DEFAULT_RECIPE_DATA || {})
    );
  }

  async function hydrateRecipesFromBackend() {
    const baseUrl = backendBaseUrl();
    if (!baseUrl || !window.fetch) return;

    try {
      const result = await backendRequest("/api/recipes");
      if (!hasRecipeContent(result.recipeState)) return;
      state.data = normalizeRecipeData(result.recipeState);
      saveRecipesLocal();
      if (state.activeCategory !== "all" && !groupedRecipes(state.activeCategory).length) {
        state.activeCategory = "all";
      }
      renderAll();
    } catch (error) {}
  }

  function setupBackendRecipeEvents() {
    const baseUrl = backendBaseUrl();
    if (!baseUrl || !window.EventSource || state.eventSource) return;

    state.eventSource = new EventSource(`${baseUrl}/api/recipes/events`);
    state.eventSource.addEventListener("recipes", (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (!hasRecipeContent(payload.recipeState)) return;
        state.data = normalizeRecipeData(payload.recipeState);
        saveRecipesLocal();
        if (state.activeCategory !== "all" && !groupedRecipes(state.activeCategory).length) {
          state.activeCategory = "all";
        }
        renderAll();
      } catch (error) {}
    });
  }

  function backendBaseUrl() {
    const queryValue = (() => {
      try {
        return new URLSearchParams(window.location.search).get("backend") || "";
      } catch (error) {
        return "";
      }
    })();
    if (queryValue) safeLocalSet(BACKEND_URL_KEY, queryValue);

    const explicit = window.TAHMISCI_BACKEND_URL
      || queryValue
      || safeLocalGet(BACKEND_URL_KEY)
      || "";
    if (explicit) return String(explicit).replace(/\/+$/, "");

    if (window.location.protocol === "http:" || window.location.protocol === "https:") {
      return window.location.origin;
    }

    return "";
  }

  async function backendRequest(path) {
    const response = await fetch(`${backendBaseUrl()}${path}`, {
      credentials: "include",
      headers: bearerHeaders()
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.ok === false) throw new Error(result.message || "Backend istegi basarisiz.");
    return result;
  }

  function bearerHeaders() {
    const token = safeSessionGet(BACKEND_TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  function hasRecipeContent(recipeState) {
    if (!recipeState || typeof recipeState !== "object" || Array.isArray(recipeState)) return false;
    return Object.keys(recipeState).some((category) => {
      const products = recipeState[category];
      return products && typeof products === "object" && Object.keys(products).length;
    });
  }

  function saveRecipesLocal() {
    const json = JSON.stringify(state.data);
    safeLocalSet(STORAGE_KEY, json);
    safeLocalSet(LEGACY_STORAGE_KEY, json);
  }

  function normalizeRecipeData(raw) {
    const data = raw && typeof raw === "object" ? raw : {};
    const normalized = {};
    Object.keys(data).forEach((category) => {
      const products = data[category];
      if (!products || typeof products !== "object") return;
      normalized[category] = {};
      Object.keys(products).forEach((product) => {
        const sizes = products[product];
        if (!sizes || typeof sizes !== "object") return;
        normalized[category][product] = {};
        Object.keys(sizes).forEach((size) => {
          normalized[category][product][size] = String(sizes[size] || "");
        });
      });
    });
    return normalized;
  }

  function renderAll() {
    renderTabs();
    renderRecipes();
  }

  function renderTabs() {
    const allCount = flattenRecipes().length;
    els.recipeTabs.innerHTML = "";
    els.recipeTabs.appendChild(makeTab("Tümü", "all", allCount));
    recipeCategoryNames().forEach((category) => {
      const count = groupedRecipes(category).length;
      if (count === 0) return;
      els.recipeTabs.appendChild(makeTab(displayCategory(category), category, count));
    });
  }

  function recipeCategoryNames() {
    return Object.keys(state.data || {});
  }

  function makeTab(label, id, count) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `recipe-tab${state.activeCategory === id ? " active" : ""}`;
    button.dataset.recipeTab = id;
    button.innerHTML = `${escapeHTML(label)} <small>${count}</small>`;
    return button;
  }

  function renderRecipes() {
    const q = normalizeText(state.search);
    state.entries = groupedRecipes(state.activeCategory)
      .filter((entry) => !q || normalizeText(entry.searchBlob).includes(q));

    els.recipeGrid.innerHTML = "";
    els.recipeEmpty.hidden = state.entries.length !== 0;

    state.entries.forEach((entry, index) => {
      els.recipeGrid.appendChild(buildRecipeCard(entry, index));
    });
  }

  function buildRecipeCard(entry, index) {
    const card = document.createElement("article");
    card.className = "recipe-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.dataset.recipeIndex = String(index);
    card.innerHTML = `
      <div>
        <p class="recipe-card-kicker">${escapeHTML(displayCategory(entry.category))}</p>
        <h2>${escapeHTML(entry.product)}</h2>
      </div>
      <div class="recipe-size-options" aria-label="${escapeAttribute(entry.product)} ölçüleri">
        ${entry.sizes.map((sizeItem, sizeIndex) => `
          <button class="size-badge" type="button" data-recipe-index="${index}" data-recipe-size-index="${sizeIndex}">
            ${escapeHTML(sizeItem.size)}
          </button>
        `).join("")}
      </div>
      <div class="recipe-card-footer">
        <span>${entry.sizes.length} ölçü</span>
        <span class="open-label">Detay</span>
      </div>
    `;
    return card;
  }

  function openRecipeModal(entry, sizeItem) {
    if (!entry) return;
    const selectedSize = sizeItem || entry.sizes && entry.sizes[0] || entry;
    els.recipeModalCategory.textContent = displayCategory(entry.category);
    els.recipeModalTitle.textContent = entry.product;
    els.recipeModalSize.textContent = selectedSize.size;
    els.recipeModalSteps.innerHTML = splitRecipe(selectedSize.recipe)
      .map((step) => `<li>${escapeHTML(step)}</li>`)
      .join("");
    els.recipeModal.classList.add("is-open");
    els.recipeModal.setAttribute("aria-hidden", "false");
  }

  function closeRecipeModal() {
    els.recipeModal.classList.remove("is-open");
    els.recipeModal.setAttribute("aria-hidden", "true");
  }

  function flattenRecipes(categoryFilter) {
    const entries = [];
    Object.keys(state.data).forEach((category) => {
      if (categoryFilter && category !== categoryFilter) return;
      Object.keys(state.data[category] || {}).forEach((product) => {
        const sizes = Object.keys(state.data[category][product] || {}).map((size) => ({
          size,
          recipe: state.data[category][product][size]
        }));
        if (!sizes.length) return;
        entries.push({
          category,
          product,
          sizes,
          searchBlob: `${category} ${product} ${sizes.map((item) => `${item.size} ${item.recipe}`).join(" ")}`
        });
      });
    });
    return entries;
  }

  function groupedRecipes(groupId) {
    const entries = flattenRecipes();
    if (!groupId || groupId === "all") return entries;
    return entries.filter((entry) => entry.category === groupId);
  }

  function renderSuggestions() {
    if (!els.recipeSuggestions) return;
    const q = normalizeText(state.search || (els.recipeSearch && els.recipeSearch.value) || "");
    if (!q) {
      hideSuggestions();
      return;
    }

    state.suggestions = flattenRecipes()
      .filter((entry) => normalizeText(entry.searchBlob).includes(q))
      .slice(0, 8);

    els.recipeSuggestions.hidden = false;
    if (!state.suggestions.length) {
      els.recipeSuggestions.innerHTML = `<div class="recipe-suggestion-item"><strong>Sonuç bulunamadı</strong><span>Başka bir ürün veya ölçü deneyin.</span></div>`;
      return;
    }

    els.recipeSuggestions.innerHTML = state.suggestions.map((entry, index) => `
      <button class="recipe-suggestion-item" type="button" data-recipe-suggestion="${index}">
        <strong>${escapeHTML(entry.product)}</strong>
        <span>${entry.sizes.length} ölçü · ${escapeHTML(displayCategory(entry.category))}</span>
      </button>
    `).join("");
  }

  function hideSuggestions() {
    if (!els.recipeSuggestions) return;
    els.recipeSuggestions.hidden = true;
    els.recipeSuggestions.innerHTML = "";
    state.suggestions = [];
  }

  function splitRecipe(value) {
    const text = String(value || "").trim();
    if (!text) return ["Reçete bilgisi henüz girilmedi."];
    const parts = text
      .split(/\n+|\s+[–-]\s+|\s+\+\s+/g)
      .map((item) => item.trim())
      .filter(Boolean);
    return parts.length ? parts : [text];
  }

  function displayCategory(category) {
    return CATEGORY_NAMES[category] || category;
  }

  function applyStoredTheme() {
    if (safeLocalGet(THEME_KEY) === "dark") document.body.classList.add("dark-mode");
    updateThemeIcon();
  }

  function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    safeLocalSet(THEME_KEY, document.body.classList.contains("dark-mode") ? "dark" : "light");
    updateThemeIcon();
  }

  function updateThemeIcon() {
    if (!els.recipeModeIcon) return;
    els.recipeModeIcon.src = document.body.classList.contains("dark-mode")
      ? "https://cdn-icons-png.flaticon.com/512/606/606807.png"
      : "https://cdn-icons-png.flaticon.com/512/702/702471.png";
  }

  function readJSON(key) {
    const text = safeLocalGet(key);
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch (error) {
      return null;
    }
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeText(text) {
    return String(text || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ı/g, "i")
      .replace(/İ/g, "I")
      .toUpperCase();
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHTML(value).replace(/`/g, "&#096;");
  }

  function safeLocalGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return "";
    }
  }

  function safeLocalSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {}
  }

  function safeSessionGet(key) {
    try {
      return window.sessionStorage.getItem(key);
    } catch (error) {
      return "";
    }
  }

  function safeSessionSet(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch (error) {}
  }
})();
