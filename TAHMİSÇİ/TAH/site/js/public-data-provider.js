(function () {
  "use strict";

  const API_URL = "/api/public/bootstrap";
  const EVENTS_URL = "/api/public/events";
  const state = {
    bootstrap: null,
    eventSource: null,
    reconnectTimer: null,
    reconnectDelay: 3000,
    stopped: false
  };

  const provider = {
    ready: null,
    load,
    retry: load,
    getBootstrap: () => state.bootstrap,
    getCategories: () => mapCatalog(state.bootstrap).categories,
    getProducts: () => mapCatalog(state.bootstrap).products,
    apply: applyBootstrap,
    connectEvents
  };

  window.TahmisciPublicData = provider;
  provider.ready = load();

  async function load() {
    hideError();
    try {
      const response = await fetch(API_URL, { headers: { Accept: "application/json" }, cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      if (!payload.ok || !payload.siteState || !payload.menu) throw new Error("Eksik bootstrap verisi");
      applyBootstrap(payload, "initial");
      connectEvents();
      return payload;
    } catch (error) {
      showError();
      document.dispatchEvent(new CustomEvent("publicBootstrapError", { detail: { error } }));
      throw error;
    }
  }

  function applyBootstrap(payload, reason) {
    if (!payload || !payload.siteState || !payload.menu) return;
    state.bootstrap = payload;
    const mapped = mapCatalog(payload);
    window.MenuCategories = mapped.categories;
    window.MenuProducts = mapped.products;
    window.TahmisciCatalog = { categories: mapped.categories, products: mapped.products, source: "public-bootstrap" };
    applyHero(payload.siteState, mapped.products);
    applySiteContent(payload.siteState, payload.menu);
    hideError();
    const eventName = reason === "initial" ? "publicBootstrapLoaded" : "publicBootstrapUpdated";
    window.dispatchEvent(new CustomEvent(eventName, { detail: { payload, reason } }));
    document.dispatchEvent(new CustomEvent("menuProductsLoaded", { detail: { products: mapped.products } }));
  }

  function connectEvents() {
    if (new URLSearchParams(window.location.search).has("preview")) return;
    if (!window.EventSource || state.eventSource || state.stopped) return;
    clearTimeout(state.reconnectTimer);
    const source = new EventSource(EVENTS_URL);
    state.eventSource = source;
    source.addEventListener("bootstrap", (event) => {
      try {
        const payload = JSON.parse(event.data || "{}");
        state.reconnectDelay = 3000;
        applyBootstrap(payload, payload.reason || "event");
      } catch (error) {
        console.error("Canlı site verisi okunamadı:", error);
      }
    });
    source.onerror = () => {
      source.close();
      if (state.eventSource === source) state.eventSource = null;
      if (state.stopped) return;
      state.reconnectTimer = window.setTimeout(connectEvents, state.reconnectDelay);
      state.reconnectDelay = Math.min(state.reconnectDelay * 1.8, 30000);
    };
  }

  function mapCatalog(payload) {
    const menuSettings = payload?.siteState?.menuSection || {};
    const hiddenCategories = new Set(menuSettings.hiddenCategoryIds || []);
    const rawCategories = (payload?.menu?.categories || []).filter((category) => !hiddenCategories.has(String(category.id)));
    const categoryIds = new Map(rawCategories.map((category, index) => [String(category.id), index + 1]));
    let productIndex = 0;
    const products = [];
    const categories = [{ id: "all", name: text("Tümü", "All"), icon: "fas fa-layer-group", subcategories: [] }];
    rawCategories.forEach((category) => {
      const numericId = categoryIds.get(String(category.id));
      categories.push({
        id: numericId,
        sourceId: String(category.id),
        name: category.name,
        icon: category.icon || "fas fa-mug-hot",
        image: category.image || "",
        productCount: category.productCount || (category.products || []).length,
        subcategories: []
      });
      (category.products || []).filter((product) => !(menuSettings.soldOutMode === "hide" && product.stock === "sold-out")).forEach((product) => {
        productIndex += 1;
        products.push({
          id: productIndex,
          sourceId: String(product.id),
          category: numericId,
          parentCategory: numericId,
          categoryName: category.name,
          parentCategoryName: category.name,
          name: product.name,
          description: product.description || "",
          content: menuSettings.showContent === false ? "" : product.content || "",
          ingredients: menuSettings.showContent === false ? "" : product.content || "",
          image: product.image || "",
          image_source: product.image ? "product" : "",
          priceMode: product.priceMode,
          prices: product.prices || {},
          variants: product.variants || [],
          basePrice: Number(product.basePrice || 0),
          price: Number(product.basePrice || 0),
          priceLabel: product.priceLabel || "",
          products_branches_calories: menuSettings.showCalories === false ? "" : calorieValue(product.calories),
          products_branches_calories_unit: menuSettings.showCalories === false ? "" : calorieUnit(product.calories),
          calories: menuSettings.showCalories === false ? "" : product.calories || "",
          allergens: menuSettings.showAllergens === false ? "" : product.allergens || "",
          nutrition: [
            menuSettings.showContent === false ? null : { name: "İçerik", value: product.content || "" },
            menuSettings.showAllergens === false ? null : { name: "Alerjen", value: product.allergens || "" }
          ].filter((item) => item && item.value),
          popular: Boolean(product.popular),
          badge: product.popular ? "popular" : "",
          stock: product.stock || "active",
          kind: product.kind || "",
          temperature: product.temperature || "",
          order: Number(product.order || 0)
        });
      });
    });
    return { categories, products };
  }

  function applyHero(siteState, products) {
    if (!window.APP_CONFIG) return;
    const hero = siteState.hero || {};
    const language = currentLanguage();
    const slides = (hero.slides || [])
      .filter((slide) => slide && slide.visible !== false)
      .sort((first, second) => Number(first.order || 0) - Number(second.order || 0))
      .map((slide) => ({
        id: slide.id,
        brand: localized(hero.brand, language),
        title: localized(slide.title, language),
        description: localized(slide.description, language),
        buttonText: localized(slide.buttonText, language),
        buttonUrl: slide.buttonUrl || "#menu",
        buttonIcon: slide.buttonIcon || "fas fa-mug-hot",
        secondaryButtonText: localized(hero.secondaryButtonText, language),
        secondaryButtonUrl: hero.secondaryButtonUrl || "#about",
        backgroundImage: slide.backgroundImage || hero.media?.detail || ""
      }));
    window.APP_CONFIG.hero = {
      ...(window.APP_CONFIG.hero || {}),
      slides,
      mediaType: hero.mediaType === "image" ? "image" : "video",
      media: { ...(hero.media || {}) },
      autoplay: hero.autoplay !== false,
      autoplayInterval: Number(hero.autoplayInterval || 6000),
      transitionSpeed: 600
    };
    window.APP_CONFIG.demo = window.APP_CONFIG.demo || {};
    window.APP_CONFIG.demo.products = window.APP_CONFIG.demo.products || {};
    const featured = siteState.featuredProducts || {};
    const selectedIds = new Set(featured.productIds || []);
    const selected = featured.source === "manual" && selectedIds.size
      ? products.filter((product) => selectedIds.has(product.sourceId))
      : products.filter((product) => product.popular);
    window.APP_CONFIG.demo.products.items = selected.slice(0, 12);
  }

  function applySiteContent(site, menu) {
    const language = currentLanguage();
    const setText = (selector, value) => {
      const element = document.querySelector(selector);
      if (element) element.textContent = localized(value, language);
    };
    const setVisible = (selector, visible) => {
      const element = document.querySelector(selector);
      if (element) element.hidden = visible === false;
    };

    setVisible("#header", site.header?.visible);
    document.querySelectorAll('#header a[href="#contact"], #mobileContactBtn').forEach((element) => {
      element.hidden = site.header?.contactVisible === false;
    });
    setVisible(".hero-section", site.hero?.visible);
    setVisible('[data-section="popular-products"]', site.featuredProducts?.visible);
    setVisible("#menu", site.menuSection?.visible);
    setVisible("#about", site.about?.visible);
    setVisible("#qr-menu", site.qrMenu?.visible);
    setVisible("#contact", site.contact?.visible);
    setVisible(".footer", site.footer?.visible);

    setText('[data-section="popular-products"] .section-title', site.featuredProducts?.title);
    setText("#menu .menu-eyebrow", site.menuSection?.eyebrow);
    setText("#menuTitle", site.menuSection?.title);
    const menuDescription = localized(site.menuSection?.description, language);
    const menuDescriptionElement = document.querySelector("#menu .menu-catalog-heading p");
    if (menuDescriptionElement) menuDescriptionElement.textContent = menuDescription || menuSummary(menu);
    const search = document.querySelector("#menu .search-control");
    const sort = document.querySelector("#menu .sort-control");
    if (search) search.hidden = site.menuSection?.showSearch === false;
    if (sort) sort.hidden = site.menuSection?.showSorting === false;

    setText("#about .section-title", site.about?.title);
    setText("#about .about-description", site.about?.description);
    const aboutImage = document.querySelector("#about .about-company-image img");
    if (aboutImage && site.about?.image) {
      aboutImage.src = site.about.image;
      aboutImage.alt = localized(site.about.imageAlt, language);
    }
    document.querySelectorAll("#about .about-feature").forEach((element, index) => {
      const feature = site.about?.features?.[index];
      if (!feature) return;
      const icon = element.querySelector("i");
      const label = element.querySelector("span");
      let detail = element.querySelector("small");
      if (icon) icon.className = feature.icon || "fas fa-circle";
      if (label) label.textContent = localized(feature.title, language);
      const detailText = localized(feature.text, language);
      if (detailText && !detail) {
        detail = document.createElement("small");
        element.appendChild(detail);
      }
      if (detail) {
        detail.textContent = detailText;
        detail.hidden = !detailText;
      }
    });
    const aboutButton = document.querySelector("#about .btn");
    if (aboutButton) {
      aboutButton.href = site.about?.buttonUrl || "#menu";
      const label = aboutButton.querySelector("span") || aboutButton;
      label.textContent = localized(site.about?.buttonText, language);
    }

    setText("#qr-menu h2", site.qrMenu?.title);
    setText("#qr-menu .qr-menu-text p", site.qrMenu?.description);
    const qrLink = document.querySelector("#qr-menu .qr-code-link");
    const qrTarget = absolute(site.qrMenu?.targetUrl || "/qr-menu/");
    if (qrLink) qrLink.href = qrTarget;
    const qrImage = document.querySelector("#qr-menu .qr-code img");
    if (qrImage) qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(qrTarget)}`;
    setText("#qr-menu .btn", site.qrMenu?.buttonText);

    applyContact(site.contact || {}, language);
    applyFooter(site, language);
    applySeo(site.seo || {}, language);
    applySectionOrder(site.sectionOrder || []);
  }

  function applyContact(contact, language) {
    const section = document.querySelector("#contact");
    if (!section) return;
    const cards = section.querySelectorAll(".tahmisci-contact-card");
    const title = section.querySelector(".section-title");
    if (title) title.textContent = contact.businessName || "Tahmisçi Coffee & Roastery";
    if (cards[0]) cards[0].querySelector("p").textContent = localized(contact.address, language);
    if (cards[1]) {
      cards[1].href = `tel:${phoneHref(contact.phone)}`;
      cards[1].querySelector("p").textContent = contact.phone || "";
    }
    if (cards[2]) {
      cards[2].href = contact.instagram || "#";
      cards[2].querySelector("p").textContent = socialHandle(contact.instagram, "@tahmiscicoffee");
    }
    if (cards[3]) {
      cards[3].href = contact.tiktok || "#";
      cards[3].querySelector("p").textContent = socialHandle(contact.tiktok, "@tahmiscicoffee");
    }
    const mapButton = section.querySelector(".tahmisci-map-btn");
    if (mapButton) mapButton.href = contact.mapsUrl || "#";
    const frame = section.querySelector("iframe");
    if (frame && contact.mapEmbedUrl) frame.src = contact.mapEmbedUrl;
    let details = section.querySelector(".contact-managed-details");
    if (!details) {
      details = document.createElement("div");
      details.className = "contact-managed-details";
      section.querySelector(".container")?.appendChild(details);
    }
    details.innerHTML = [
      localized(contact.hours, language) && `<span>${escapeHtml(localized(contact.hours, language))}</span>`,
      contact.email && `<a href="mailto:${escapeAttribute(contact.email)}">${escapeHtml(contact.email)}</a>`,
      contact.whatsapp && `<a href="https://wa.me/${escapeAttribute(phoneHref(contact.whatsapp))}">WhatsApp</a>`
    ].filter(Boolean).join("");
  }

  function applyFooter(site, language) {
    const footer = document.querySelector(".footer");
    if (!footer) return;
    const contact = site.contact || {};
    const footerState = site.footer || {};
    const description = footer.querySelector(".footer-description");
    if (description) description.textContent = localized(footerState.description, language);
    const links = footer.querySelector(".footer-links");
    if (links) links.innerHTML = (footerState.quickLinks || []).map((item) => `<li><a href="${escapeAttribute(item.url || "#")}">${escapeHtml(localized(item.label, language))}</a></li>`).join("");
    const social = footer.querySelector(".social-links");
    if (social) {
      const items = [
        contact.instagram && { url: contact.instagram, icon: "fab fa-instagram", label: "Instagram" },
        contact.tiktok && { url: contact.tiktok, icon: "fab fa-tiktok", label: "TikTok" },
        ...(contact.socialLinks || [])
      ].filter(Boolean);
      social.innerHTML = items.map((item) => `<a class="social-link" href="${escapeAttribute(item.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeAttribute(item.label || "Sosyal medya")}"><i class="${escapeAttribute(item.icon || "fas fa-link")}"></i></a>`).join("");
    }
    const contactSection = footer.querySelector(".footer-section:last-of-type");
    if (contactSection) {
      const title = contactSection.querySelector(".footer-title");
      contactSection.innerHTML = "";
      if (title) contactSection.appendChild(title);
      contactSection.insertAdjacentHTML("beforeend", `<p>${escapeHtml(localized(contact.address, language))}</p>${contact.phone ? `<a href="tel:${escapeAttribute(phoneHref(contact.phone))}">${escapeHtml(contact.phone)}</a>` : ""}`);
    }
    const copyright = footer.querySelector(".footer-bottom-copyright");
    if (copyright) copyright.textContent = localized(footerState.copyright, language).replace("{year}", String(new Date().getFullYear()));
    const bottomLinks = footer.querySelector(".footer-bottom-links");
    if (bottomLinks) bottomLinks.innerHTML = (footerState.bottomLinks || []).map((item) => `<a href="${escapeAttribute(item.url || "#")}">${escapeHtml(localized(item.label, language))}</a>`).join("");
  }

  function applySeo(seo, language) {
    const title = localized(seo.title, language);
    if (title) document.title = title;
    setMeta("name", "description", localized(seo.description, language));
    setMeta("name", "keywords", seo.keywords || "");
    setMeta("property", "og:title", localized(seo.ogTitle, language));
    setMeta("property", "og:description", localized(seo.ogDescription, language));
    setMeta("property", "og:image", seo.ogImage || "");
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    if (seo.canonicalUrl) canonical.href = seo.canonicalUrl;
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon && seo.favicon) favicon.href = seo.favicon;
  }

  function applySectionOrder(order) {
    const main = document.querySelector("main");
    if (!main || !Array.isArray(order)) return;
    const selectors = {
      hero: ".hero-section",
      featuredProducts: '[data-section="popular-products"]',
      menuSection: "#menu",
      about: "#about",
      qrMenu: "#qr-menu",
      contact: "#contact"
    };
    order.forEach((key) => {
      const element = main.querySelector(selectors[key]);
      if (element) main.appendChild(element);
    });
  }

  function showError() {
    let box = document.getElementById("publicDataError");
    if (!box) {
      box = document.createElement("div");
      box.id = "publicDataError";
      box.className = "public-data-error";
      box.innerHTML = `<p>${escapeHtml(text("Menü şu anda yüklenemiyor.", "The menu is currently unavailable."))}</p><button type="button">${escapeHtml(text("Tekrar Dene", "Try Again"))}</button>`;
      box.querySelector("button").addEventListener("click", () => {
        provider.ready = load();
        provider.ready.catch(() => {});
      });
      (document.querySelector("#menu .menu-catalog-heading") || document.body).appendChild(box);
    }
    box.hidden = false;
    const loading = document.getElementById("loadingState");
    if (loading) loading.style.display = "none";
  }

  function hideError() {
    const box = document.getElementById("publicDataError");
    if (box) box.hidden = true;
  }

  function menuSummary(menu) {
    const categories = Number(menu?.categoryCount || 0);
    const products = Number(menu?.productCount || 0);
    return currentLanguage() === "en" ? `${categories} categories and ${products} products` : `${categories} kategori ve ${products} ürün`;
  }

  function localized(value, language) {
    if (value && typeof value === "object" && !Array.isArray(value)) return String(value[language] || value.tr || value.en || "");
    return String(value || "");
  }

  function currentLanguage() {
    return window.I18N?.getPreferredLanguage?.() || localStorage.getItem("site_language") || "tr";
  }

  function text(tr, en) {
    return currentLanguage() === "en" ? en : tr;
  }

  function absolute(value) {
    try { return new URL(String(value || ""), window.location.origin).toString(); } catch (_error) { return window.location.origin; }
  }

  function phoneHref(value) {
    const digits = String(value || "").replace(/[^+\d]/g, "");
    return digits.startsWith("+") ? digits : `+90${digits.replace(/^0/, "")}`;
  }

  function calorieValue(value) {
    const match = String(value || "").match(/[\d.,]+/);
    return match ? match[0].replace(",", ".") : "";
  }

  function calorieUnit(value) {
    const unit = String(value || "").replace(/[\d.,\s]/g, "").trim();
    return unit || "kcal";
  }

  function socialHandle(value, fallback) {
    try {
      const path = new URL(value).pathname.split("/").filter(Boolean).pop();
      return path ? `@${path}` : fallback;
    } catch (_error) { return fallback; }
  }

  function setMeta(attribute, key, content) {
    const element = document.querySelector(`meta[${attribute}="${key}"]`);
    if (element && content) element.setAttribute("content", content);
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, "&#96;");
  }

  window.addEventListener("languageChanged", () => {
    if (state.bootstrap) applyBootstrap(state.bootstrap, "language");
  });

  window.addEventListener("beforeunload", () => {
    state.stopped = true;
    clearTimeout(state.reconnectTimer);
    state.eventSource?.close();
  }, { once: true });
})();
