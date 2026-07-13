(function () {
  "use strict";
  // Developer: Uzeyir | System Key: xandar | Local panel hardening marker

  const STORAGE_KEY = "tahmisci.menu.state.v1";
  const SITE_STORAGE_KEY = "tahmisci.site.state.v1";
  const FEEDBACK_STORAGE_KEY = "tahmisci.feedback.items.v1";
  const RECIPE_STORAGE_KEY = "tahmisci.recipe.state.v1";
  const LEGACY_RECIPE_STORAGE_KEY = "tahmisRecipeMenuData";
  const BACKEND_URL_KEY = "tahmisci.backend.url";
  const BACKEND_TOKEN_KEY = "tahmisci.backend.panel.token";
  const AUTH_KEY = "tahmisci.panel.local.auth";
  const LOCAL_PANEL_PIN = "2135";
  const PANEL_THEME_KEY = "tahmisci.panel.theme";
  const PANEL_LAYOUT_KEY = "tahmisci.panel.layout";
  const CUSTOM_DEFAULT_KEY = "tahmisci.menu.customDefault.v1";
  const CHANNEL_NAME = "tahmisci-menu-updates";
  const RECIPE_CHANNEL_NAME = "tahmisci-recipe-updates";
  const SITE_CHANNEL_NAME = "tahmisci-site-updates";
  const MEDIA_DB_NAME = "tahmisci.media.v1";
  const MEDIA_STORE_NAME = "files";
  const MEDIA_REF_PREFIX = "media:";
  const DESIGN_PRESET_VERSION = "tahmisci-20260522a";
  const SITE_DESIGN_VERSION = "site-20260523a";
  const BRAND_TITLE_FONT = '"Magnolia Script", "Dancing Script", cursive';
  const BRAND_BODY_FONT = '"Tahmisci Poppins", Poppins, Arial, sans-serif';
  const LIGHT_LOGO = "Tahmisçi_Logo/Logolar/Koyu_Yeşil_Logo/PNG_Logo.png";
  const DEFAULT_PRODUCT_IMAGE = "../../Tahmisçi_Logo/3D_Mockups/Yeşil_Baskı/Yeşil_Baskı_Mockup_1.jpg";
  const SECTION_TITLES = {
    overview: "Genel bakış",
    menu: "Menü düzenleme",
    banner: "BANNER düzenleme",
    category: "Kategori düzenleme",
    product: "Ürün düzenleme",
    recipe: "Reçete Düzenleme",
    feedback: "Dilek & şikayet",
    settings: "Ayarlar"
  };
  const PREMIUM_SITE_PALETTE = {
    backgroundColor: "#010302",
    backgroundSoftColor: "#031108",
    accentColor: "#E4F2C9",
    accentColorDeep: "#062817",
    accentColorTwo: "#9FCF7B",
    brownColor: "#D8C49C",
    textColor: "#FAFFF5",
    mutedColor: "#C9D8BF",
    surfaceColor: "#07170F",
    lineColor: "rgba(228,242,201,0.22)",
    shadowColor: "0 22px 52px rgba(0, 0, 0, 0.34)"
  };
  const SITE_ICON_OPTIONS = [
    ["instagram", "Instagram", "IG"],
    ["tiktok", "TikTok", "TT"],
    ["whatsapp", "WhatsApp", "WA"],
    ["mail", "E-posta", "@"],
    ["phone", "Telefon", "TEL"],
    ["map", "Konum", "PIN"],
    ["web", "Web", "WEB"]
  ];
  const memoryStore = {};
  const FONT_OPTIONS = [
    ["Tahmisci Magnolia", BRAND_TITLE_FONT],
    ["Tahmisci Poppins", BRAND_BODY_FONT],
    ["Montserrat", '"Montserrat", Arial, sans-serif'],
    ["Poppins", '"Poppins", Arial, sans-serif'],
    ["Roboto", '"Roboto", Arial, sans-serif'],
    ["Open Sans", '"Open Sans", Arial, sans-serif'],
    ["Lato", '"Lato", Arial, sans-serif'],
    ["Raleway", '"Raleway", Arial, sans-serif'],
    ["Playfair Display", '"Playfair Display", Georgia, serif'],
    ["Playfair Display SC", '"Playfair Display SC", Georgia, serif'],
    ["Vidaloka", '"Vidaloka", Georgia, serif'],
    ["Merriweather", '"Merriweather", Georgia, serif'],
    ["Oswald", '"Oswald", Arial, sans-serif'],
    ["Bebas Neue", '"Bebas Neue", Arial, sans-serif'],
    ["Pacifico", '"Pacifico", cursive'],
    ["Dancing Script", '"Dancing Script", cursive'],
    ["Great Vibes", '"Great Vibes", cursive'],
    ["Cinzel", '"Cinzel", Georgia, serif'],
    ["Cormorant Garamond", '"Cormorant Garamond", Georgia, serif'],
    ["Libre Baskerville", '"Libre Baskerville", Georgia, serif'],
    ["Nunito", '"Nunito", Arial, sans-serif'],
    ["Quicksand", '"Quicksand", Arial, sans-serif'],
    ["Source Sans 3", '"Source Sans 3", Arial, sans-serif'],
    ["Inter", '"Inter", Arial, sans-serif'],
    ["Rubik", '"Rubik", Arial, sans-serif'],
    ["Work Sans", '"Work Sans", Arial, sans-serif'],
    ["Josefin Sans", '"Josefin Sans", Arial, sans-serif'],
    ["Caveat", '"Caveat", cursive'],
    ["Lobster", '"Lobster", cursive'],
    ["Abril Fatface", '"Abril Fatface", Georgia, serif'],
    ["DM Sans", '"DM Sans", Arial, sans-serif'],
    ["Manrope", '"Manrope", Arial, sans-serif']
  ];

  const DEFAULT_SETTINGS = {
    designPresetVersion: DESIGN_PRESET_VERSION,
    bgColor: "#F3FAEF",
    darkBgColor: "#526B55",
    accentColor: "#2F6A45",
    textColor: "#243C2C",
    buttonTextColor: "#FFFFFF",
    cardColor: "rgba(232,243,222,0.82)",
    productCardColor: "#FFFFFF",
    categoryCardColor: "#E0EDD7",
    socialIconColor: "#2F6A45",
    socialIconSize: 30,
    menuBackgroundImage: "",
    menuBackground: {
      type: "gradient",
      image: "",
      imageUrl: "",
      gradientStart: "#F3FAEF",
      gradientEnd: "#D7EACD",
      gradientAngle: 160,
      overlay: 0.15
    },
    fonts: {
      title: BRAND_BODY_FONT,
      category: BRAND_BODY_FONT,
      product: BRAND_BODY_FONT
    },
    typography: {
      menuTitle: 36,
      categoryTitle: 24,
      productTitle: 13,
      productDesc: 10,
      productIngredients: 10,
      productPrice: 10
    },
    bottomActions: {
      popular: {
        type: "gradient",
        color: "#2F6A45",
        image: "",
        imageUrl: "",
        gradientStart: "#2F6A45",
        gradientEnd: "#79A66A",
        gradientAngle: 145,
        overlay: 0.12
      },
      suggest: {
        type: "gradient",
        color: "#2F6A45",
        image: "",
        imageUrl: "",
        gradientStart: "#2F6A45",
        gradientEnd: "#79A66A",
        gradientAngle: 145,
        overlay: 0.12
      }
    },
    banner: {
      mode: "random",
      title: "TAHMİSÇİ",
      subtitle: "Öne çıkan lezzetler",
      video: "",
      videoUrl: "",
      videos: [],
      images: [],
      productIds: []
    },
    menuUpdateDate: ""
  };

  const DEFAULT_SITE_SETTINGS = {
    designVersion: SITE_DESIGN_VERSION,
    heroKicker: "Dört kuşak kahve zanaati",
    heroTitle: "TAHMİSÇİ Coffee & Roastery",
    heroSubtitle: "Torbalı'nın köklü kahve hafızasını yeni nesil demleme teknikleri, ferah bir roastery atmosferi ve canlı dijital menü deneyimiyle buluşturuyoruz.",
    storyTitle: "1926'dan bugüne kavrulan bir aile hikayesi",
    storyText: "Hüseyin Tünaydın'ın zeytin odununda kavurduğu kahveyle başlayan Tahmisçi geleneği, bugün espresso kültürü, dünya kahveleri, tatlılar ve özel reçetelerle Torbalı'da yeniden hayat buluyor.",
    storyPointOneTitle: "1926",
    storyPointOneText: "Kahve zanaatının ailede başladığı yıl",
    storyPointTwoTitle: "4. kuşak",
    storyPointTwoText: "Gelenekten modern roastery kültürüne",
    storyPointThreeTitle: "130 kişi",
    storyPointThreeText: "İki katlı ferah buluşma alanı",
    menuTitle: "Canlı Menü",
    menuIntro: "Bu alan PDF değildir; dijital menü panelindeki kategori, ürün, fiyat, içerik, alerjen ve enerji bilgileriyle aynı veriyi kullanır.",
    visitTitle: "Sadık İleri Bulvarı'nda kahve molası",
    visitText: "260 m² büyüklüğündeki iki katlı mekanımızda kahve, tatlı ve roastery deneyimini rahat bir atmosferde sunuyoruz.",
    contactTitle: "Günün kahvesi, duyurular ve hızlı iletişim",
    address: "Sadık İleri Bulvarı No: 42/B, Torbalı / İzmir",
    hours: "Çalışma saatlerini panelden güncelleyin",
    phone: "",
    email: "",
    whatsapp: "",
    instagram: "https://www.instagram.com/tahmiscicoffee?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    tiktok: "https://www.tiktok.com/@tahmiscicoffee",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sad%C4%B1k%20%C4%B0leri%20Bulvar%C4%B1%20No%3A%2042%2FB%20Torbal%C4%B1%20%C4%B0zmir",
    heroImageUrl: "Tahmisçi_Logo/Logolar/Ana_Logo/PNG_Logo.png",
    backgroundColor: PREMIUM_SITE_PALETTE.backgroundColor,
    backgroundSoftColor: PREMIUM_SITE_PALETTE.backgroundSoftColor,
    accentColor: PREMIUM_SITE_PALETTE.accentColor,
    accentColorDeep: PREMIUM_SITE_PALETTE.accentColorDeep,
    accentColorTwo: PREMIUM_SITE_PALETTE.accentColorTwo,
    brownColor: PREMIUM_SITE_PALETTE.brownColor,
    textColor: PREMIUM_SITE_PALETTE.textColor,
    mutedColor: PREMIUM_SITE_PALETTE.mutedColor,
    surfaceColor: PREMIUM_SITE_PALETTE.surfaceColor,
    lineColor: PREMIUM_SITE_PALETTE.lineColor,
    shadowColor: PREMIUM_SITE_PALETTE.shadowColor,
    socialLinks: [],
    titleFont: BRAND_TITLE_FONT,
    bodyFont: BRAND_BODY_FONT,
    titleSize: 68,
    bodySize: 16
  };

  const PREVIOUS_SITE_DESIGN = {
    backgroundColor: "#F4EBDC",
    accentColor: "#173F2A",
    accentColorTwo: "#8B5E3C",
    textColor: "#1D241A",
    mutedColor: "#6E6254",
    surfaceColor: "#FFF9EF",
    titleFont: '"Cormorant Garamond", Georgia, serif',
    bodyFont: '"Manrope", Inter, Arial, sans-serif',
    heroImageUrl: "images/logo_green.png"
  };
  const GREEN_SITE_DESIGN = {
    backgroundColor: "#F3FAEF",
    accentColor: "#2F6A45",
    accentColorTwo: "#7AA56A",
    textColor: "#203A29",
    mutedColor: "#5B715E",
    surfaceColor: "#FBFFF7",
    heroImageUrl: LIGHT_LOGO
  };

  const state = {
    data: null,
    recipes: null,
    site: null,
    activeSection: "overview",
    selectedCategoryId: "",
    selectedProductId: "",
    selectedRecipeCategory: "",
    selectedRecipeProduct: "",
    selectedRecipePreviewSize: "",
    feedbackFilter: "all",
    channel: null,
    recipeChannel: null,
    siteChannel: null,
    menuEventSource: null,
    recipeEventSource: null,
    siteEventSource: null,
    feedbackEventSource: null,
    bound: false,
    mediaDbPromise: null,
    dirtyMenu: false,
    dirtyRecipes: false,
    dirtySite: false,
    saving: false,
    renderTimer: null
  };

  const els = {};

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    cacheElements();
    populateFontSelects();
    applyPanelTheme();
    applyPanelLayout();
    bindLogin();

    if (safeSessionGet(AUTH_KEY) === "ok") {
      showPanel();
    }
  }

  function cacheElements() {
    const ids = [
      "loginScreen", "loginForm", "passwordInput", "loginError", "panelShell", "miniStats",
      "sidebarPanel", "sidebarToggle", "settingsToggle", "settingsMenu", "workspaceTitle",
      "overviewGrid", "contentGrid", "categoryList", "productList", "saveState", "saveChangesButton", "panelThemeToggle", "addCategoryButton",
      "addProductButton", "resetButton", "saveDefaultButton", "defaultChoiceModal", "mobilePanelToggle", "bgColor", "darkBgColor", "accentColor",
      "textColor", "buttonTextColor", "productCardColor", "socialIconColor", "socialIconSize",
      "socialIconSizeValue", "menuBgType", "menuGradientStart",
      "menuGradientEnd", "menuGradientAngle", "menuBgUrl", "menuOverlay", "menuBgFile",
      "clearMenuBg", "menuUpdateDate", "titleFont", "categoryFont", "productFont",
      "menuTitleSize", "categoryTitleSize", "productTitleSize", "productDescSize",
      "productIngredientsSize", "productPriceSize",
      "popularBoxType", "popularBoxColor", "popularGradientStart", "popularGradientEnd",
      "popularGradientAngle", "popularImageUrl", "popularOverlay", "popularImageFile",
      "clearPopularImage", "suggestBoxType", "suggestBoxColor", "suggestGradientStart",
      "suggestGradientEnd", "suggestGradientAngle", "suggestImageUrl", "suggestOverlay",
      "suggestImageFile", "clearSuggestImage", "bannerMode", "bannerTitle", "bannerSubtitle",
      "bannerVideoUrl", "bannerVideoFile", "clearBannerVideo", "bannerVideoList",
      "bannerImageFile", "clearBannerImages", "bannerImageList", "bannerImages", "bannerProductCategory",
      "bannerProductSearch", "bannerProductList", "categoryEditorTitle", "deleteCategoryButton", "categoryName",
      "categoryActive", "categoryStyleType", "categoryColor", "categoryGradientStart", "categoryGradientEnd",
      "categoryGradientAngle", "categoryImageUrl", "categoryOverlay", "categoryImageFile",
      "clearCategoryImage", "categoryImagePreview", "bulkProductImageUrl", "applyBulkProductImage",
      "bulkProductImageFile", "clearBulkProductImage", "bulkProductStyleType", "bulkProductColor",
      "bulkProductGradientStart", "bulkProductGradientEnd", "bulkProductGradientAngle",
      "applyBulkProductStyle", "productCategoryTabs", "productQuickList", "productEditorTitle", "deleteProductButton", "productName",
      "productCategory", "productDesc", "priceMode", "standardPrice", "standardPriceField",
      "sizePriceFields", "priceK", "priceO", "priceB", "singleDoublePriceFields", "priceSingle", "priceDouble", "productStock",
      "productKind", "productTemperature", "productPopular", "productActive", "productStyleType", "productColor",
      "productGradientStart", "productGradientEnd", "productGradientAngle", "productImageUrl",
      "productImageOverlay", "productImageFile", "clearProductImage", "productImagePreview", "productCalories",
      "productAllergens", "productIngredients", "recipeCategorySelect", "recipeProductSelect",
      "addRecipeCategoryButton", "addRecipeProductButton", "addRecipeSizeButton", "deleteRecipeCategoryButton",
      "deleteRecipeProductButton", "recipeCategoryName", "recipeProductName", "recipeSizeList",
      "feedbackInsights", "feedbackTabs", "feedbackList", "refreshFeedbackButton", "clearFeedbackButton", "jsonOutput", "copyJsonButton",
      "siteHeroKicker", "siteHeroTitle", "siteHeroSubtitle", "siteHeroImageUrl",
      "siteStoryTitle", "siteStoryText", "siteStoryPointOneTitle", "siteStoryPointOneText",
      "siteStoryPointTwoTitle", "siteStoryPointTwoText", "siteStoryPointThreeTitle", "siteStoryPointThreeText",
      "siteMenuTitle", "siteMenuIntro", "siteVisitTitle", "siteVisitText", "siteContactTitle",
      "siteAddress", "siteHours", "sitePhone", "siteEmail", "siteWhatsapp", "siteMapsUrl",
      "siteInstagram", "siteTiktok", "siteSocialLabel", "siteSocialUrl", "siteSocialIcon",
      "addSiteSocialLink", "siteSocialLinksList", "applyPremiumSiteTheme",
      "siteBackgroundColor", "siteSurfaceColor", "siteAccentColor",
      "siteAccentColorTwo", "siteTextColor", "siteMutedColor", "siteTitleFont", "siteBodyFont",
      "siteTitleSize", "siteBodySize",
      "previewKicker", "previewTitle", "livePreview"
    ];
    ids.forEach((id) => {
      els[id] = document.getElementById(id);
    });
  }

  function populateFontSelects() {
    ["titleFont", "categoryFont", "productFont", "siteTitleFont", "siteBodyFont"].forEach((id) => {
      const select = els[id];
      if (!select) return;
      select.innerHTML = FONT_OPTIONS.map(([label, value]) => (
        `<option value="${escapeAttribute(value)}">${escapeHTML(label)}</option>`
      )).join("");
    });
    if (els.siteSocialIcon) {
      els.siteSocialIcon.innerHTML = SITE_ICON_OPTIONS.map(([value, label, mark]) => (
        `<option value="${escapeAttribute(value)}">${escapeHTML(mark)} - ${escapeHTML(label)}</option>`
      )).join("");
    }
  }

  function applyPanelTheme(theme) {
    const nextTheme = theme || safeLocalGet(PANEL_THEME_KEY) || "dark";
    document.body.dataset.panelTheme = nextTheme;
    if (els.panelThemeToggle) {
      els.panelThemeToggle.textContent = nextTheme === "dark" ? "Aydınlık Tema" : "Koyu Tema";
    }
  }

  function togglePanelTheme() {
    const nextTheme = document.body.dataset.panelTheme === "dark" ? "light" : "dark";
    safeLocalSet(PANEL_THEME_KEY, nextTheme);
    applyPanelTheme(nextTheme);
  }

  function applyPanelLayout(layout) {
    const nextLayout = layout || safeLocalGet(PANEL_LAYOUT_KEY) || "desktop";
    const mobile = nextLayout === "mobile";
    document.body.dataset.panelLayout = mobile ? "mobile" : "desktop";
    if (els.panelShell) els.panelShell.classList.toggle("is-mobile-panel", mobile);
    if (els.mobilePanelToggle) {
      els.mobilePanelToggle.textContent = mobile ? "Masaüstü Panele Dön" : "Mobil Paneli Kullan";
    }
  }

  function togglePanelLayout() {
    const nextLayout = document.body.dataset.panelLayout === "mobile" ? "desktop" : "mobile";
    safeLocalSet(PANEL_LAYOUT_KEY, nextLayout);
    applyPanelLayout(nextLayout);
    if (nextLayout === "mobile") setSidebarCollapsed(true);
  }

  function bindLogin() {
    els.loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const password = els.passwordInput.value.trim();
      if (password === LOCAL_PANEL_PIN) {
        safeSessionSet(AUTH_KEY, "ok");
        els.loginError.hidden = true;
        showPanel();
      } else {
        els.loginError.textContent = "PIN hatali. Local panel PIN kodunu tekrar deneyin.";
        els.loginError.hidden = false;
        els.passwordInput.select();
      }
    });
  }

  async function showPanel() {
    try {
      els.loginScreen.hidden = true;
      els.loginScreen.style.display = "none";
      els.panelShell.hidden = false;
      els.panelShell.style.display = "grid";
      state.data = loadData();
      state.recipes = loadRecipeData();
      state.site = loadSiteData();
      ensureSelection();
      ensureRecipeSelection();
      try {
        if ("BroadcastChannel" in window && !state.channel) state.channel = new BroadcastChannel(CHANNEL_NAME);
        if ("BroadcastChannel" in window && !state.recipeChannel) state.recipeChannel = new BroadcastChannel(RECIPE_CHANNEL_NAME);
        if ("BroadcastChannel" in window && !state.siteChannel) state.siteChannel = new BroadcastChannel(SITE_CHANNEL_NAME);
      } catch (error) {
        state.channel = null;
        state.recipeChannel = null;
        state.siteChannel = null;
      }
      bindPanelEvents();
      renderAll();
      await hydrateFromBackend();
      setupBackendEvents();
    } catch (error) {
      console.error("Panel açılırken hata oluştu:", error);
      els.loginScreen.hidden = true;
      els.loginScreen.style.display = "none";
      els.panelShell.hidden = false;
      els.panelShell.style.display = "grid";
      els.panelShell.innerHTML = `
        <section class="panel-card" style="margin:24px">
          <h1>Panel açıldı ancak veri yüklenirken hata oluştu</h1>
          <p class="muted">Tarayıcı eski kayıtları bozmuş olabilir. Aşağıdaki butonla panel verisini sıfırlayıp yeniden açabilirsiniz.</p>
          <button class="primary-action" type="button" id="panicResetButton">Panel Verisini Sıfırla</button>
        </section>
      `;
      const reset = document.getElementById("panicResetButton");
      if (reset) {
        reset.addEventListener("click", () => {
          safeLocalRemove(STORAGE_KEY);
          window.location.reload();
        });
      }
    }
  }

  function bindPanelEvents() {
    if (state.bound) return;
    state.bound = true;

    els.sidebarToggle.addEventListener("click", toggleSidebar);
    if (els.settingsToggle && els.settingsMenu) {
      els.settingsToggle.addEventListener("click", toggleSettingsMenu);
      document.addEventListener("click", handleDocumentClick);
    }
    document.querySelector(".panel-nav").addEventListener("click", handlePanelNavClick);
    els.addCategoryButton.addEventListener("click", addCategory);
    els.addProductButton.addEventListener("click", addProduct);
    els.resetButton.addEventListener("click", resetToDefault);
    if (els.saveDefaultButton) els.saveDefaultButton.addEventListener("click", saveCurrentAsDefault);
    if (els.defaultChoiceModal) els.defaultChoiceModal.addEventListener("click", handleDefaultChoice);
    els.categoryList.addEventListener("click", (event) => {
      const row = event.target.closest("[data-category-id]");
      if (!row) return;
      state.selectedCategoryId = row.dataset.categoryId;
      const category = selectedCategory();
      state.selectedProductId = category && category.products[0] ? category.products[0].id : "";
      setActiveSection("category", { collapseSidebar: true, render: false });
      renderAll();
    });
    els.productList.addEventListener("click", (event) => {
      const row = event.target.closest("[data-product-id]");
      if (!row) return;
      state.selectedProductId = row.dataset.productId;
      setActiveSection("product", { collapseSidebar: true, render: false });
      renderAll();
    });
    els.productCategoryTabs.addEventListener("click", handleProductCategoryTabs);
    els.productQuickList.addEventListener("click", handleProductQuickList);
    els.deleteCategoryButton.addEventListener("click", deleteSelectedCategory);
    els.deleteProductButton.addEventListener("click", deleteSelectedProduct);
    els.copyJsonButton.addEventListener("click", copyJson);
    if (els.saveChangesButton) {
      els.saveChangesButton.addEventListener("pointerdown", handleSaveButtonPointerDown);
      els.saveChangesButton.addEventListener("click", handleSaveButtonClick);
    }
    els.panelThemeToggle.addEventListener("click", togglePanelTheme);
    els.mobilePanelToggle.addEventListener("click", togglePanelLayout);
    els.livePreview.addEventListener("click", handleLivePreviewClick);
    els.feedbackTabs.addEventListener("click", handleFeedbackTabs);
    els.refreshFeedbackButton.addEventListener("click", refreshFeedbackInbox);
    if (els.clearFeedbackButton) els.clearFeedbackButton.addEventListener("click", clearFeedbackItems);
    window.addEventListener("storage", (event) => {
      if (event.key === FEEDBACK_STORAGE_KEY) renderFeedbackInbox();
    });
    els.recipeCategorySelect.addEventListener("change", () => {
      state.selectedRecipeCategory = els.recipeCategorySelect.value;
      const products = recipeProductNames(state.selectedRecipeCategory);
      state.selectedRecipeProduct = products[0] || "";
      state.selectedRecipePreviewSize = "";
      renderRecipeEditor();
      renderPreview();
    });
    els.recipeProductSelect.addEventListener("change", () => {
      state.selectedRecipeProduct = els.recipeProductSelect.value;
      state.selectedRecipePreviewSize = "";
      renderRecipeEditor();
      renderPreview();
    });
    els.recipeCategoryName.addEventListener("change", renameSelectedRecipeCategory);
    els.recipeProductName.addEventListener("change", renameSelectedRecipeProduct);
    els.addRecipeCategoryButton.addEventListener("click", addRecipeCategory);
    els.addRecipeProductButton.addEventListener("click", addRecipeProduct);
    els.addRecipeSizeButton.addEventListener("click", addRecipeSize);
    els.deleteRecipeCategoryButton.addEventListener("click", deleteSelectedRecipeCategory);
    els.deleteRecipeProductButton.addEventListener("click", deleteSelectedRecipeProduct);
    els.recipeSizeList.addEventListener("input", handleRecipeSizeInput);
    els.recipeSizeList.addEventListener("change", handleRecipeSizeChange);
    els.recipeSizeList.addEventListener("click", handleRecipeSizeClick);

    [
      "bgColor", "darkBgColor", "accentColor", "textColor", "buttonTextColor",
      "productCardColor", "socialIconColor", "socialIconSize", "menuBgType", "menuGradientStart", "menuGradientEnd",
      "menuGradientAngle", "menuBgUrl", "menuOverlay", "menuUpdateDate",
      "titleFont", "categoryFont", "productFont", "menuTitleSize", "categoryTitleSize",
      "productTitleSize", "productDescSize", "productIngredientsSize", "productPriceSize",
      "popularBoxType", "popularBoxColor",
      "popularGradientStart", "popularGradientEnd", "popularGradientAngle",
      "popularImageUrl", "popularOverlay", "suggestBoxType", "suggestBoxColor",
      "suggestGradientStart", "suggestGradientEnd", "suggestGradientAngle",
      "suggestImageUrl", "suggestOverlay", "bannerMode", "bannerTitle", "bannerSubtitle",
      "bannerVideoUrl", "bannerImages"
    ].forEach((id) => {
      if (!els[id]) return;
      els[id].addEventListener("input", updateSettingsFromForm);
      els[id].addEventListener("change", updateSettingsFromForm);
    });

    if (els.bannerProductList) {
      els.bannerProductList.addEventListener("change", updateSettingsFromForm);
    }
    if (els.bannerProductCategory) {
      els.bannerProductCategory.addEventListener("change", () => {
        const banner = normalizeBanner(state.data.settings && state.data.settings.banner);
        renderBannerProductList(banner.productIds);
      });
    }
    if (els.bannerProductSearch) {
      els.bannerProductSearch.addEventListener("input", () => {
        const banner = normalizeBanner(state.data.settings && state.data.settings.banner);
        renderBannerProductList(banner.productIds);
      });
    }

    [
      "siteHeroKicker", "siteHeroTitle", "siteHeroSubtitle", "siteHeroImageUrl",
      "siteStoryTitle", "siteStoryText", "siteStoryPointOneTitle", "siteStoryPointOneText",
      "siteStoryPointTwoTitle", "siteStoryPointTwoText", "siteStoryPointThreeTitle", "siteStoryPointThreeText",
      "siteMenuTitle", "siteMenuIntro", "siteVisitTitle", "siteVisitText", "siteContactTitle",
      "siteAddress", "siteHours", "sitePhone", "siteEmail", "siteWhatsapp", "siteMapsUrl",
      "siteInstagram", "siteTiktok", "siteBackgroundColor", "siteSurfaceColor", "siteAccentColor",
      "siteAccentColorTwo", "siteTextColor", "siteMutedColor", "siteTitleFont", "siteBodyFont",
      "siteTitleSize", "siteBodySize"
    ].forEach((id) => {
      if (!els[id]) return;
      els[id].addEventListener("input", updateSiteSettingsFromForm);
      els[id].addEventListener("change", updateSiteSettingsFromForm);
    });

    if (els.addSiteSocialLink) els.addSiteSocialLink.addEventListener("click", addSiteSocialLink);
    if (els.siteSocialLinksList) els.siteSocialLinksList.addEventListener("click", removeSiteSocialLink);
    if (els.applyPremiumSiteTheme) els.applyPremiumSiteTheme.addEventListener("click", applyPremiumSiteTheme);

    [
      "categoryName", "categoryActive", "categoryStyleType", "categoryColor", "categoryGradientStart",
      "categoryGradientEnd", "categoryGradientAngle", "categoryImageUrl", "categoryOverlay"
    ].forEach((id) => {
      els[id].addEventListener("input", updateCategoryFromForm);
      els[id].addEventListener("change", updateCategoryFromForm);
    });

    [
      "productName", "productCategory", "productDesc", "priceMode", "standardPrice", "priceK", "priceO", "priceB", "priceSingle", "priceDouble",
      "productStock", "productKind", "productTemperature", "productPopular", "productActive",
      "productStyleType", "productColor", "productGradientStart", "productGradientEnd", "productGradientAngle",
      "productImageUrl", "productImageOverlay", "productCalories", "productAllergens",
      "productIngredients"
    ].forEach((id) => {
      els[id].addEventListener("input", updateProductFromForm);
      els[id].addEventListener("change", updateProductFromForm);
    });

    els.menuBgFile.addEventListener("change", (event) => readImage(event.target, (dataUrl) => {
      state.data.settings.menuBackground.image = dataUrl;
      state.data.settings.menuBackground.imageUrl = "";
      els.menuBgUrl.value = "";
      saveAndRender();
    }));
    els.clearMenuBg.addEventListener("click", () => {
      state.data.settings.menuBackground.image = "";
      state.data.settings.menuBackground.imageUrl = "";
      state.data.settings.menuBackgroundImage = "";
      saveAndRender();
    });
    els.popularImageFile.addEventListener("change", (event) => readImage(event.target, (dataUrl) => {
      state.data.settings.bottomActions.popular.image = dataUrl;
      state.data.settings.bottomActions.popular.imageUrl = "";
      state.data.settings.bottomActions.popular.type = "image";
      els.popularImageUrl.value = "";
      saveAndRender();
    }));
    els.clearPopularImage.addEventListener("click", () => {
      state.data.settings.bottomActions.popular.image = "";
      state.data.settings.bottomActions.popular.imageUrl = "";
      saveAndRender();
    });
    els.suggestImageFile.addEventListener("change", (event) => readImage(event.target, (dataUrl) => {
      state.data.settings.bottomActions.suggest.image = dataUrl;
      state.data.settings.bottomActions.suggest.imageUrl = "";
      state.data.settings.bottomActions.suggest.type = "image";
      els.suggestImageUrl.value = "";
      saveAndRender();
    }));
    els.clearSuggestImage.addEventListener("click", () => {
      state.data.settings.bottomActions.suggest.image = "";
      state.data.settings.bottomActions.suggest.imageUrl = "";
      saveAndRender();
    });
    if (els.bannerVideoFile) els.bannerVideoFile.addEventListener("change", handleBannerVideoUpload);
    if (els.bannerImageFile) els.bannerImageFile.addEventListener("change", handleBannerImageUpload);
    if (els.bannerVideoList) {
      els.bannerVideoList.addEventListener("click", handleBannerMediaClick);
      els.bannerVideoList.addEventListener("change", handleBannerMediaOrderChange);
    }
    if (els.bannerImageList) {
      els.bannerImageList.addEventListener("click", handleBannerMediaClick);
      els.bannerImageList.addEventListener("change", handleBannerMediaOrderChange);
    }
    if (els.clearBannerVideo) {
      els.clearBannerVideo.addEventListener("click", () => {
        state.data.settings.banner = normalizeBanner(state.data.settings.banner);
        state.data.settings.banner.videos.forEach(deleteStoredMediaItem);
        state.data.settings.banner.videos = [];
        state.data.settings.banner.video = "";
        state.data.settings.banner.videoUrl = "";
        if (state.data.settings.banner.mode === "video") state.data.settings.banner.mode = "random";
        saveAndRender();
      });
    }
    if (els.clearBannerImages) {
      els.clearBannerImages.addEventListener("click", () => {
        state.data.settings.banner = normalizeBanner(state.data.settings.banner);
        state.data.settings.banner.images.forEach(deleteStoredMediaItem);
        state.data.settings.banner.images = [];
        if (state.data.settings.banner.mode === "images") state.data.settings.banner.mode = "random";
        saveAndRender();
      });
    }
    els.categoryImageFile.addEventListener("change", (event) => readImage(event.target, (dataUrl) => {
      const category = selectedCategory();
      if (!category) return;
      category.style.image = dataUrl;
      category.style.imageUrl = "";
      category.style.type = "image";
      category.image = dataUrl;
      saveAndRender();
    }));
    els.clearCategoryImage.addEventListener("click", () => {
      const category = selectedCategory();
      if (!category) return;
      category.style.image = "";
      category.style.imageUrl = "";
      category.image = "";
      saveAndRender();
    });
    els.applyBulkProductImage.addEventListener("click", applyBulkProductImageUrl);
    els.bulkProductImageFile.addEventListener("change", (event) => readImage(event.target, (dataUrl) => {
      applyBulkProductImage(dataUrl, true);
    }));
    els.clearBulkProductImage.addEventListener("click", clearBulkProductImages);
    els.applyBulkProductStyle.addEventListener("click", applyBulkProductStyle);
    els.productImageFile.addEventListener("change", (event) => readImage(event.target, (dataUrl) => {
      const product = selectedProduct();
      if (!product) return;
      product.image = dataUrl;
      product.imageUrl = "";
      saveAndRender();
    }));
    els.clearProductImage.addEventListener("click", () => {
      const product = selectedProduct();
      if (!product) return;
      product.image = "";
      product.imageUrl = "";
      saveAndRender();
    });
  }

  function toggleSidebar() {
    const collapsed = els.panelShell.classList.toggle("is-sidebar-collapsed");
    els.sidebarToggle.setAttribute("aria-expanded", String(!collapsed));
    els.sidebarToggle.setAttribute("aria-label", collapsed ? "Panel menüsünü aç" : "Panel menüsünü kapat");
  }

  function setSidebarCollapsed(collapsed) {
    els.panelShell.classList.toggle("is-sidebar-collapsed", Boolean(collapsed));
    els.sidebarToggle.setAttribute("aria-expanded", String(!collapsed));
    els.sidebarToggle.setAttribute("aria-label", collapsed ? "Panel menüsünü aç" : "Panel menüsünü kapat");
  }

  function toggleSettingsMenu(event) {
    if (!els.settingsMenu || !els.settingsToggle) return;
    event.stopPropagation();
    const hidden = els.settingsMenu.hidden;
    els.settingsMenu.hidden = !hidden;
    els.settingsToggle.setAttribute("aria-expanded", String(hidden));
  }

  function closeSettingsMenu() {
    if (!els.settingsMenu || !els.settingsToggle) return;
    els.settingsMenu.hidden = true;
    els.settingsToggle.setAttribute("aria-expanded", "false");
  }

  function handleDocumentClick(event) {
    if (event.target.closest(".settings-popover")) return;
    closeSettingsMenu();
  }

  function handlePanelNavClick(event) {
    const link = event.target.closest("[data-panel-section]");
    if (!link) return;
    event.preventDefault();
    setActiveSection(link.dataset.panelSection, { collapseSidebar: true });
  }

  function setActiveSection(section, options) {
    state.activeSection = SECTION_TITLES[section] ? section : "overview";
    if (!options || options.collapseSidebar !== false) {
      setSidebarCollapsed(window.matchMedia("(max-width: 1180px)").matches);
    }
    if (!options || options.render !== false) renderAll();
  }

  function loadData() {
    const stored = safeLocalGet(STORAGE_KEY);
    if (stored) {
      try {
        return normalizeState(JSON.parse(stored));
      } catch (error) {
        console.warn("Kayıtlı veri okunamadı.", error);
      }
    }
    return normalizeState({
      settings: DEFAULT_SETTINGS,
      categories: legacyMenuToCategories(window.MENU || {})
    });
  }

  function loadRecipeData() {
    const stored = readStoredJSON(RECIPE_STORAGE_KEY) || readStoredJSON(LEGACY_RECIPE_STORAGE_KEY);
    return normalizeRecipeData(stored || cloneData(window.DEFAULT_RECIPE_DATA || {}));
  }

  function loadSiteData() {
    const stored = readStoredJSON(SITE_STORAGE_KEY);
    return normalizeSiteSettings(stored || DEFAULT_SITE_SETTINGS);
  }

  function readStoredJSON(key) {
    const stored = safeLocalGet(key);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch (error) {
      return null;
    }
  }

  function cloneData(value) {
    return JSON.parse(JSON.stringify(value || {}));
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

  async function backendRequest(path, options) {
    const baseUrl = backendBaseUrl();
    if (!baseUrl || !window.fetch) throw new Error("Backend adresi tanimli degil.");

    const rawBody = options && Object.prototype.hasOwnProperty.call(options, "rawBody") ? options.rawBody : null;
    const headers = Object.assign(rawBody ? {} : { "Content-Type": "application/json" }, options && options.headers);
    const token = options && options.skipToken ? "" : safeSessionGet(BACKEND_TOKEN_KEY);
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${baseUrl}${path}`, {
      method: options && options.method || "GET",
      headers,
      credentials: "include",
      body: rawBody || (options && options.body ? JSON.stringify(options.body) : undefined)
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.ok === false) {
      if (response.status === 401) {
        safeSessionRemove(AUTH_KEY);
        safeSessionRemove(BACKEND_TOKEN_KEY);
      }
      throw new Error(result.message || "Backend istegi basarisiz.");
    }

    return result;
  }

  async function loginBackend(password) {
    if (!backendBaseUrl()) return false;
    try {
      const result = await backendRequest("/api/admin/login", {
        method: "POST",
        skipToken: true,
        body: { password }
      });
      if (result && result.token) safeSessionSet(BACKEND_TOKEN_KEY, result.token);
      return true;
    } catch (error) {
      return false;
    }
  }

  async function verifyBackendSession() {
    if (!backendBaseUrl()) return false;

    try {
      await backendRequest("/api/admin/me");
      return true;
    } catch (error) {
      return false;
    }
  }

  async function hydrateFromBackend() {
    if (!backendBaseUrl()) return;

    const [menuResult, recipeResult, siteResult] = await Promise.allSettled([
      backendRequest("/api/menu", { skipToken: true }),
      backendRequest("/api/recipes", { skipToken: true }),
      backendRequest("/api/site", { skipToken: true })
    ]);

    let changed = false;

    if (menuResult.status === "fulfilled") {
      const menuState = menuResult.value.menuState;
      if (hasMenuContent(menuState)) {
        state.data = normalizeState(menuState);
        safeLocalSet(STORAGE_KEY, JSON.stringify(state.data));
        changed = true;
      } else if (hasMenuContent(state.data)) {
        markDirty("menu", "Backend bos, Kaydet ile yayinlayin");
      }
    }

    if (recipeResult.status === "fulfilled") {
      const recipeState = recipeResult.value.recipeState;
      if (hasRecipeContent(recipeState)) {
        state.recipes = normalizeRecipeData(recipeState);
        saveRecipesLocalOnly();
        changed = true;
      } else if (hasRecipeContent(state.recipes)) {
        markDirty("recipes", "Backend bos, Kaydet ile yayinlayin");
      }
    }

    if (siteResult.status === "fulfilled") {
      const siteState = siteResult.value.siteState;
      if (hasSiteContent(siteState)) {
        state.site = normalizeSiteSettings(siteState);
        safeLocalSet(SITE_STORAGE_KEY, JSON.stringify(state.site));
        changed = true;
      } else if (hasSiteContent(state.site)) {
        markDirty("site", "Backend bos, Kaydet ile yayinlayin");
      }
    }

    if (changed) {
      ensureSelection();
      ensureRecipeSelection();
      renderAll();
      updateSaveControls("Backend bagli");
      window.clearTimeout(hydrateFromBackend.timer);
      hydrateFromBackend.timer = window.setTimeout(() => {
        updateSaveControls();
      }, 1200);
    }
  }

  function setupBackendEvents() {
    const baseUrl = backendBaseUrl();
    if (!baseUrl || !window.EventSource) return;

    if (!state.menuEventSource) {
      state.menuEventSource = new EventSource(`${baseUrl}/api/menu/events`);
      state.menuEventSource.addEventListener("menu", (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (!hasMenuContent(payload.menuState)) return;
          state.data = normalizeState(payload.menuState);
          safeLocalSet(STORAGE_KEY, JSON.stringify(state.data));
          ensureSelection();
          renderAll();
        } catch (error) {}
      });
    }

    if (!state.recipeEventSource) {
      state.recipeEventSource = new EventSource(`${baseUrl}/api/recipes/events`);
      state.recipeEventSource.addEventListener("recipes", (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (!hasRecipeContent(payload.recipeState)) return;
          state.recipes = normalizeRecipeData(payload.recipeState);
          saveRecipesLocalOnly();
          ensureRecipeSelection();
          renderAll();
        } catch (error) {}
      });
    }

    if (!state.siteEventSource) {
      state.siteEventSource = new EventSource(`${baseUrl}/api/site/events`);
      state.siteEventSource.addEventListener("site", (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (!hasSiteContent(payload.siteState)) return;
          state.site = normalizeSiteSettings(payload.siteState);
          safeLocalSet(SITE_STORAGE_KEY, JSON.stringify(state.site));
          renderForms();
        } catch (error) {}
      });
    }

    if (!state.feedbackEventSource) {
      state.feedbackEventSource = new EventSource(`${baseUrl}/api/feedback/events`);
      state.feedbackEventSource.addEventListener("feedback", (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (!Array.isArray(payload.feedbackItems)) return;
          safeLocalSet(FEEDBACK_STORAGE_KEY, JSON.stringify(payload.feedbackItems));
          renderFeedbackInbox();
        } catch (error) {}
      });
    }
  }

  function hasMenuContent(menuState) {
    return Boolean(menuState && Array.isArray(menuState.categories) && menuState.categories.length);
  }

  function hasRecipeContent(recipeState) {
    if (!recipeState || typeof recipeState !== "object" || Array.isArray(recipeState)) return false;
    return Object.keys(recipeState).some((category) => {
      const products = recipeState[category];
      return products && typeof products === "object" && Object.keys(products).length;
    });
  }

  function hasSiteContent(siteState) {
    return Boolean(siteState && typeof siteState === "object" && !Array.isArray(siteState) && Object.keys(siteState).length);
  }

  function hasPendingChanges() {
    return state.dirtyMenu || state.dirtyRecipes || state.dirtySite;
  }

  function markDirty(scope, message) {
    if (scope === "menu") state.dirtyMenu = true;
    if (scope === "recipes") state.dirtyRecipes = true;
    if (scope === "site") state.dirtySite = true;
    updateSaveControls(message || "Kaydedilmedi");
  }

  function updateSaveControls(message) {
    const pending = hasPendingChanges();
    if (els.saveChangesButton) {
      els.saveChangesButton.classList.toggle("is-disabled", state.saving || !pending);
      els.saveChangesButton.setAttribute("aria-disabled", String(state.saving || !pending));
      els.saveChangesButton.textContent = state.saving ? "Kaydediliyor..." : "Kaydet";
    }
    if (els.saveState) {
      els.saveState.textContent = message || (pending ? "Kaydedilmedi" : "Hazir");
    }
  }

  function queueRenderAll() {
    window.clearTimeout(state.renderTimer);
    state.renderTimer = window.setTimeout(() => {
      state.renderTimer = null;
      renderAll();
    }, 80);
  }

  function handleSaveButtonPointerDown() {
    window.setTimeout(() => {
      if (state.saving) return;
      savePendingChanges();
    }, 0);
  }

  function handleSaveButtonClick(event) {
    event.preventDefault();
    savePendingChanges();
  }

  function captureCurrentEditorState() {
    if (!state.data || !state.site || !state.recipes) return;
    if (state.activeSection === "menu" || state.activeSection === "banner") {
      updateSettingsFromForm();
      return;
    }
    if (state.activeSection === "category") {
      updateCategoryFromForm();
      return;
    }
    if (state.activeSection === "product") {
      updateProductFromForm();
      return;
    }
    if (state.activeSection === "settings" && els.siteHeroKicker) {
      updateSiteSettingsFromForm();
    }
  }

  async function savePendingChanges() {
    if (state.saving) return;
    captureCurrentEditorState();
    if (!hasPendingChanges()) {
      updateSaveControls("Degisiklik yok");
      window.setTimeout(() => updateSaveControls(), 1200);
      return;
    }

    state.saving = true;
    updateSaveControls("Kaydediliyor...");

    try {
      if (state.dirtyMenu) {
        safeLocalSet(STORAGE_KEY, JSON.stringify(state.data));
        if (backendBaseUrl()) await saveMenuToBackend();
        state.dirtyMenu = false;
      }
      if (state.dirtyRecipes) {
        saveRecipesLocalOnly();
        if (backendBaseUrl()) await saveRecipesToBackend();
        state.dirtyRecipes = false;
      }
      if (state.dirtySite) {
        safeLocalSet(SITE_STORAGE_KEY, JSON.stringify(state.site));
        if (backendBaseUrl()) await saveSiteToBackend();
        state.dirtySite = false;
      }

      if (state.channel) state.channel.postMessage({ type: "menu-updated", time: Date.now() });
      if (state.recipeChannel) state.recipeChannel.postMessage({ type: "recipes-updated", time: Date.now() });
      if (state.siteChannel) state.siteChannel.postMessage({ type: "site-updated", time: Date.now() });
      state.saving = false;
      updateSaveControls(backendBaseUrl() ? "Backend kaydedildi" : "Yerel kaydedildi");
      window.setTimeout(() => updateSaveControls(), 1200);
    } catch (error) {
      console.error("Kaydetme basarisiz:", error);
      state.saving = false;
      updateSaveControls("Kaydetme basarisiz");
      alert(`Kaydetme basarisiz. ${error.message || "Backend baglantisini ve oturumu kontrol edin."}`);
    }
  }

  function saveRecipesLocalOnly() {
    const json = JSON.stringify(state.recipes);
    safeLocalSet(RECIPE_STORAGE_KEY, json);
    safeLocalSet(LEGACY_RECIPE_STORAGE_KEY, json);
  }

  async function saveMenuToBackend() {
    await backendRequest("/api/menu", {
      method: "PUT",
      body: { menuState: state.data }
    });
  }

  async function saveRecipesToBackend() {
    await backendRequest("/api/recipes", {
      method: "PUT",
      body: { recipeState: state.recipes }
    });
  }

  async function saveSiteToBackend() {
    await backendRequest("/api/site", {
      method: "PUT",
      body: { siteState: state.site }
    });
  }

  function normalizeRecipeData(raw) {
    const source = raw && typeof raw === "object" ? raw : {};
    const normalized = {};
    Object.keys(source).forEach((categoryName) => {
      const products = source[categoryName];
      if (!products || typeof products !== "object") return;
      normalized[categoryName] = {};
      Object.keys(products).forEach((productName) => {
        const sizes = products[productName];
        if (!sizes || typeof sizes !== "object") return;
        normalized[categoryName][productName] = {};
        Object.keys(sizes).forEach((sizeName) => {
          normalized[categoryName][productName][sizeName] = String(sizes[sizeName] || "");
        });
      });
    });
    return normalized;
  }

  function normalizeState(raw) {
    const sourceSettings = raw && raw.settings ? raw.settings : {};
    const settings = Object.assign({}, DEFAULT_SETTINGS, sourceSettings);
    settings.menuBackground = normalizeBackground(settings.menuBackground || {
      type: settings.menuBackgroundImage ? "image" : "solid",
      image: settings.menuBackgroundImage || "",
      imageUrl: "",
      gradientStart: settings.bgColor || DEFAULT_SETTINGS.bgColor,
      gradientEnd: settings.darkBgColor || "#1A1A1A",
      gradientAngle: 160,
      overlay: 0.15
    });
    settings.fonts = normalizeFonts(settings.fonts);
    settings.typography = normalizeTypography(settings.typography);
    settings.bottomActions = normalizeBottomActions(settings.bottomActions);
    settings.banner = normalizeBanner(settings.banner);
    settings.menuUpdateDate = settings.menuUpdateDate || "";
    const didMigrateDesign = migrateDesignSettings(settings, sourceSettings);

    const categories = Array.isArray(raw && raw.categories)
      ? raw.categories.map((category, index) => normalizeCategory(category, index)).filter(Boolean)
      : [];
    if (didMigrateDesign) migrateContentDesign(categories);

    return { settings, categories };
  }

  function migrateDesignSettings(settings, sourceSettings) {
    if (sourceSettings && sourceSettings.designPresetVersion === DESIGN_PRESET_VERSION) return false;

    Object.assign(settings, {
      designPresetVersion: DESIGN_PRESET_VERSION,
      bgColor: "#F3FAEF",
      darkBgColor: "#526B55",
      accentColor: "#2F6A45",
      textColor: "#243C2C",
      buttonTextColor: "#FFFFFF",
      cardColor: "rgba(232,243,222,0.82)",
      productCardColor: "#FFFFFF",
      categoryCardColor: "#E0EDD7",
      socialIconColor: "#2F6A45",
      fonts: {
        title: BRAND_BODY_FONT,
        category: BRAND_BODY_FONT,
        product: BRAND_BODY_FONT
      },
      typography: {
        menuTitle: 36,
        categoryTitle: 24,
        productTitle: 13,
        productDesc: 10,
        productIngredients: 10,
        productPrice: 10
      }
    });

    settings.menuBackground = normalizeBackground({
      type: "gradient",
      image: "",
      imageUrl: "",
      gradientStart: "#F3FAEF",
      gradientEnd: "#D7EACD",
      gradientAngle: 160,
      overlay: 0.15
    });

    settings.bottomActions = normalizeBottomActions({
      popular: {
        type: "gradient",
        color: "#2F6A45",
        image: "",
        imageUrl: "",
        gradientStart: "#2F6A45",
        gradientEnd: "#79A66A",
        gradientAngle: 145,
        overlay: 0.12
      },
      suggest: {
        type: "gradient",
        color: "#2F6A45",
        image: "",
        imageUrl: "",
        gradientStart: "#2F6A45",
        gradientEnd: "#79A66A",
        gradientAngle: 145,
        overlay: 0.12
      }
    });
    settings.banner = normalizeBanner(DEFAULT_SETTINGS.banner);

    return true;
  }

  function migrateContentDesign(categories) {
    categories.forEach((category) => {
      const categoryStyle = category.style || {};
      const categoryImage = categoryStyle.imageUrl || categoryStyle.image || category.image || "";
      category.color = "";
      category.style = normalizeStyle({
        type: categoryImage ? "image" : "solid",
        color: "",
        image: categoryStyle.image || "",
        imageUrl: categoryStyle.imageUrl || "",
        gradientStart: DEFAULT_SETTINGS.categoryCardColor,
        gradientEnd: "#E5E7EB",
        gradientAngle: 135,
        overlay: categoryImage ? categoryStyle.overlay : 0.12
      });
      category.image = category.style.imageUrl || category.style.image || "";

      category.products.forEach((product) => {
        const productStyle = product.style || {};
        const productBgImage = productStyle.imageUrl || productStyle.image || "";
        product.cardColor = "";
        product.style = normalizeStyle({
          type: productBgImage ? "image" : "solid",
          color: "",
          image: productStyle.image || "",
          imageUrl: productStyle.imageUrl || "",
          gradientStart: DEFAULT_SETTINGS.productCardColor,
          gradientEnd: "#E5E7EB",
          gradientAngle: 145,
          overlay: productBgImage ? productStyle.overlay : 0
        });
      });
    });
  }

  function normalizeCategory(category, index) {
    if (!category) return null;
    const id = category.id || makeId("cat", category.name || `Kategori ${index + 1}`);
    const style = normalizeStyle(category.style || {
      color: category.color || "",
      image: category.image || "",
      imageUrl: "",
      gradientStart: category.color || DEFAULT_SETTINGS.categoryCardColor,
      gradientEnd: "#E5E7EB",
      gradientAngle: 135,
      overlay: 0.12
    });

    return {
      id,
      name: category.name || "Kategori",
      active: category.active !== false,
      color: style.color,
      image: style.image,
      style,
      products: Array.isArray(category.products)
        ? category.products.map((product, productIndex) => normalizeProduct(product, id, productIndex)).filter(Boolean)
        : []
    };
  }

  function normalizeProduct(product, categoryId, index) {
    if (!product) return null;
    const prices = normalizePrices(product.prices || pricesFromLegacyProduct(product));
    const priceMode = normalizePriceMode(product, prices);
    const normalizedPrices = normalizePricesForMode(prices, priceMode);
    const style = normalizeStyle(product.style || {
      color: product.cardColor || "",
      image: "",
      imageUrl: "",
      gradientStart: product.cardColor || DEFAULT_SETTINGS.productCardColor,
      gradientEnd: "#E5E7EB",
      gradientAngle: 145,
      overlay: Number(product.cardOverlay || 0)
    });

    return {
      id: product.id || makeId(`${categoryId}-urun`, product.name || `Ürün ${index + 1}`),
      name: product.name || "Ürün",
      desc: product.desc || "",
      active: product.active !== false,
      stock: product.stock || (product.soldOut ? "sold-out" : "active"),
      image: product.image || product.img || "",
      imageUrl: product.imageUrl || "",
      imageOverlay: Number(product.imageOverlay || 0),
      cardColor: style.color,
      style,
      priceMode,
      prices: normalizedPrices,
      variants: normalizeVariants(product.variants, normalizedPrices, priceMode),
      popular: Boolean(product.popular),
      kind: product.kind || inferKind("", "", product.name || ""),
      temperature: product.temperature || inferTemperature("", "", product.name || ""),
      details: {
        calories: product.details && product.details.calories || product.calories || "",
        allergens: product.details && product.details.allergens || product.allergens || "",
        ingredients: product.details && product.details.ingredients || product.ingredients || ""
      }
    };
  }

  function normalizeBackground(bg) {
    return {
      type: bg.type || "solid",
      image: bg.image || "",
      imageUrl: bg.imageUrl || "",
      gradientStart: bg.gradientStart || DEFAULT_SETTINGS.bgColor,
      gradientEnd: bg.gradientEnd || "#E5E7EB",
      gradientAngle: Number(bg.gradientAngle || 160),
      overlay: clamp(Number(bg.overlay || 0), 0, 0.85)
    };
  }

  function normalizeFonts(fonts) {
    return {
      title: fonts && fonts.title || DEFAULT_SETTINGS.fonts.title,
      category: fonts && fonts.category || DEFAULT_SETTINGS.fonts.category,
      product: fonts && fonts.product || DEFAULT_SETTINGS.fonts.product
    };
  }

  function normalizeTypography(typography) {
    const source = typography && typeof typography === "object" ? typography : {};
    return {
      menuTitle: clamp(Number(source.menuTitle || DEFAULT_SETTINGS.typography.menuTitle), 18, 54),
      categoryTitle: clamp(Number(source.categoryTitle || DEFAULT_SETTINGS.typography.categoryTitle), 14, 34),
      productTitle: clamp(Number(source.productTitle || DEFAULT_SETTINGS.typography.productTitle), 10, 28),
      productDesc: clamp(Number(source.productDesc || DEFAULT_SETTINGS.typography.productDesc), 8, 22),
      productIngredients: clamp(Number(source.productIngredients || DEFAULT_SETTINGS.typography.productIngredients), 8, 22),
      productPrice: clamp(Number(source.productPrice || DEFAULT_SETTINGS.typography.productPrice), 8, 22)
    };
  }

  function normalizeSiteSettings(siteSettings) {
    const source = siteSettings && typeof siteSettings === "object" ? siteSettings : {};
    return migrateSiteSettings(Object.assign({}, DEFAULT_SITE_SETTINGS, source, {
      socialLinks: normalizeSocialLinks(source.socialLinks || DEFAULT_SITE_SETTINGS.socialLinks),
      titleSize: clamp(Number(source.titleSize || DEFAULT_SITE_SETTINGS.titleSize), 34, 92),
      bodySize: clamp(Number(source.bodySize || DEFAULT_SITE_SETTINGS.bodySize), 13, 22)
    }));
  }

  function migrateSiteSettings(site) {
    if (site.designVersion === SITE_DESIGN_VERSION) return site;
    const legacy = {
      backgroundColor: "#F7FAF4",
      accentColor: "#365A2B",
      accentColorTwo: "#B87545",
      textColor: "#182315",
      mutedColor: "#63705D",
      surfaceColor: "#FFFFFF",
      titleFont: '"Playfair Display", Georgia, serif',
      titleSize: 62
    };
    const next = Object.assign({}, site);
    [
      "backgroundColor",
      "accentColor",
      "accentColorTwo",
      "textColor",
      "mutedColor",
      "surfaceColor"
    ].forEach((key) => {
      if (sameColor(next[key], legacy[key]) || sameColor(next[key], PREVIOUS_SITE_DESIGN[key]) || sameColor(next[key], GREEN_SITE_DESIGN[key])) {
        next[key] = DEFAULT_SITE_SETTINGS[key];
      }
    });
    [
      "backgroundSoftColor",
      "accentColorDeep",
      "brownColor",
      "lineColor",
      "shadowColor"
    ].forEach((key) => {
      if (!next[key]) next[key] = DEFAULT_SITE_SETTINGS[key];
    });
    if (String(next.titleFont || "").trim() === legacy.titleFont || String(next.titleFont || "").trim() === PREVIOUS_SITE_DESIGN.titleFont) {
      next.titleFont = DEFAULT_SITE_SETTINGS.titleFont;
    }
    if (String(next.bodyFont || "").trim() === PREVIOUS_SITE_DESIGN.bodyFont) {
      next.bodyFont = DEFAULT_SITE_SETTINGS.bodyFont;
    }
    if (String(next.heroImageUrl || "").trim() === PREVIOUS_SITE_DESIGN.heroImageUrl || String(next.heroImageUrl || "").trim() === GREEN_SITE_DESIGN.heroImageUrl) {
      next.heroImageUrl = DEFAULT_SITE_SETTINGS.heroImageUrl;
    }
    if (Number(next.titleSize) === legacy.titleSize) {
      next.titleSize = DEFAULT_SITE_SETTINGS.titleSize;
    }
    next.heroTitle = String(next.heroTitle || "").replace(/Tahmi[şs]çi/gi, "TAHMİSÇİ");
    next.storyText = String(next.storyText || "").replace(/Tahmi[şs]çi/gi, "TAHMİSÇİ");
    next.designVersion = SITE_DESIGN_VERSION;
    next.socialLinks = normalizeSocialLinks(next.socialLinks || []);
    return next;
  }

  function normalizeSocialLinks(links) {
    return Array.isArray(links)
      ? links.map((link) => ({
        label: String(link && link.label || "").trim(),
        url: String(link && link.url || "").trim(),
        icon: SITE_ICON_OPTIONS.some(([value]) => value === (link && link.icon)) ? link.icon : "web"
      })).filter((link) => link.label && link.url)
      : [];
  }

  function sameColor(value, expected) {
    return String(value || "").trim().toUpperCase() === expected;
  }

  function normalizeBottomActions(actions) {
    return {
      popular: normalizeStyle(Object.assign({}, DEFAULT_SETTINGS.bottomActions.popular, actions && actions.popular)),
      suggest: normalizeStyle(Object.assign({}, DEFAULT_SETTINGS.bottomActions.suggest, actions && actions.suggest))
    };
  }

  function normalizeBanner(banner) {
    const source = banner && typeof banner === "object" ? banner : {};
    const mode = ["random", "products", "images", "video"].includes(source.mode) ? source.mode : DEFAULT_SETTINGS.banner.mode;
    const legacyVideo = String(source.videoUrl || source.video || "").trim();
    const videoItems = Array.isArray(source.videos)
      ? source.videos
      : legacyVideo
        ? [{ src: legacyVideo, name: "Yüklenen video", kind: "video" }]
        : [];
    return {
      mode,
      title: source.title || DEFAULT_SETTINGS.banner.title,
      subtitle: source.subtitle || DEFAULT_SETTINGS.banner.subtitle,
      video: String(source.video || "").trim(),
      videoUrl: String(source.videoUrl || "").trim(),
      videos: normalizeMediaList(videoItems, "video"),
      images: normalizeMediaList(source.images, "image"),
      productIds: Array.isArray(source.productIds)
        ? source.productIds.map((item) => String(item || "").trim()).filter(Boolean)
        : []
    };
  }

  function normalizeMediaList(value, kind) {
    const list = Array.isArray(value)
      ? value
      : String(value || "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
    return list.map((item, index) => normalizeMediaItem(item, index, kind)).filter((item) => item.src);
  }

  function normalizeMediaItem(item, index, kind) {
    if (typeof item === "string") {
      const src = item.trim();
      return {
        id: mediaIdFromRef(src),
        src,
        name: defaultMediaName(src, index, kind),
        type: "",
        size: 0,
        kind
      };
    }
    const source = item && typeof item === "object" ? item : {};
    const src = String(source.src || source.url || source.data || "").trim();
    return {
      id: String(source.id || mediaIdFromRef(src) || "").trim(),
      src,
      name: String(source.name || defaultMediaName(src, index, kind)).trim(),
      type: String(source.type || "").trim(),
      size: Number(source.size || 0),
      kind: source.kind || kind
    };
  }

  function normalizeStyle(style) {
    return {
      type: style.type || ((style.image || style.imageUrl) ? "image" : "gradient"),
      color: style.color || "",
      image: style.image || "",
      imageUrl: style.imageUrl || "",
      gradientStart: style.gradientStart || style.color || DEFAULT_SETTINGS.productCardColor,
      gradientEnd: style.gradientEnd || "#E5E7EB",
      gradientAngle: Number(style.gradientAngle || 145),
      overlay: clamp(Number(style.overlay || 0), 0, 0.85)
    };
  }

  function ensureSelection() {
    if (!state.data.categories.length) {
      state.data.categories.push(makeCategory("Yeni Kategori"));
    }
    if (!state.selectedCategoryId || !state.data.categories.some((category) => category.id === state.selectedCategoryId)) {
      state.selectedCategoryId = state.data.categories[0].id;
    }
    const category = selectedCategory();
    if (category && (!state.selectedProductId || !category.products.some((product) => product.id === state.selectedProductId))) {
      state.selectedProductId = category.products[0] ? category.products[0].id : "";
    }
  }

  function ensureRecipeSelection() {
    if (!state.recipes || typeof state.recipes !== "object") {
      state.recipes = {};
    }
    const categories = recipeCategoryNames();
    if (!categories.length) {
      state.recipes["Yeni Reçete"] = {
        "14 oz Örnek İçecek": {
          "14 oz": "Double shot espresso + soğuk süt + buz"
        }
      };
    }

    if (!state.selectedRecipeCategory || !state.recipes[state.selectedRecipeCategory]) {
      state.selectedRecipeCategory = recipeCategoryNames()[0] || "";
    }

    const products = recipeProductNames(state.selectedRecipeCategory);
    if (!state.selectedRecipeProduct || !products.includes(state.selectedRecipeProduct)) {
      state.selectedRecipeProduct = products[0] || "";
    }
  }

  function renderAll() {
    ensureSelection();
    ensureRecipeSelection();
    renderStats();
    renderLists();
    renderForms();
    renderRecipeEditor();
    renderSections();
    renderPreview();
    renderFeedbackInbox();
    renderJson();
  }

  function renderSections() {
    const activeSection = SECTION_TITLES[state.activeSection] ? state.activeSection : "overview";
    state.activeSection = activeSection;

    document.querySelectorAll("[data-section-panel]").forEach((section) => {
      section.hidden = section.dataset.sectionPanel !== activeSection;
    });

    if (els.contentGrid) els.contentGrid.hidden = activeSection === "overview";
    if (els.panelShell) els.panelShell.dataset.activeSection = activeSection;
    const previewColumn = document.querySelector(".preview-column");
    const hidePreview = activeSection === "feedback" || activeSection === "site";
    if (previewColumn) previewColumn.hidden = hidePreview;
    if (els.contentGrid) els.contentGrid.classList.toggle("is-wide", hidePreview);
    if (els.workspaceTitle) els.workspaceTitle.textContent = SECTION_TITLES[activeSection];
    document.querySelectorAll("[data-panel-section]").forEach((link) => {
      link.classList.toggle("is-active", link.dataset.panelSection === activeSection);
    });

    if (els.previewKicker && els.previewTitle) {
      const recipeMode = activeSection === "recipe";
      els.previewKicker.textContent = recipeMode ? "Reçete Önizleme" : "Live Preview";
      els.previewTitle.textContent = recipeMode ? "Canlı Reçete" : "Canlı Önizleme";
    }
  }

  function renderStats() {
    const categories = state.data.categories;
    const products = flatProducts();
    const activeProducts = products.filter(({ product, category }) => product.active && product.stock === "active" && category.active).length;
    const soldOut = products.filter(({ product }) => product.stock === "sold-out" || product.active === false).length;
    const popular = products.filter(({ product }) => product.popular).length;
    const recipeStats = countRecipes();
    const stats = [
      ["Kategori", categories.length],
      ["Ürün", products.length],
      ["Aktif", activeProducts],
      ["Gizli/Tükendi", soldOut],
      ["Popüler", popular],
      ["Reçete", recipeStats.sizes],
      ["Reçete Ürünü", recipeStats.products],
      ["Seçili Kategori", selectedCategory() ? selectedCategory().products.length : 0]
    ];
    const html = stats.map(([label, value]) => `<article class="stat-card"><span>${label}</span><strong>${value}</strong></article>`).join("");
    const recipeActionLabel = isLocalReviewPanel() ? "Local Reçete" : "Reçete Arayüzü";
    const actionCards = [
      `<a class="stat-card overview-action-card" href="${escapeAttribute(menuPageUrl())}" target="_blank" rel="noopener noreferrer"><span>Canlı Menü</span><strong>Aç</strong></a>`,
      `<a class="stat-card overview-action-card" href="${escapeAttribute(recipePageUrl())}" target="_blank" rel="noopener noreferrer"><span>${recipeActionLabel}</span><strong>Aç</strong></a>`
    ].join("");
    els.overviewGrid.innerHTML = html + actionCards;
    if (els.miniStats) {
      els.miniStats.innerHTML = stats.slice(0, 4).map(([label, value]) => `<article class="stat-card"><span>${label}</span><strong>${value}</strong></article>`).join("");
    }
  }

  function renderFeedbackInbox() {
    if (!els.feedbackList) return;
    const items = loadFeedbackItems();
    renderFeedbackInsights(items);
    const filter = state.feedbackFilter || "all";
    const favoriteCounts = favoriteRanking(items);
    const filtered = filter === "all"
      ? items
      : items.filter((item) => filter === "favori"
        ? normalizeFeedbackType(item.type) === "favori" || Boolean(item.favorite)
        : normalizeFeedbackType(item.type) === filter);
    if (filter === "favori") {
      filtered.sort((a, b) => {
        const aKey = favoriteKey(a.favorite);
        const bKey = favoriteKey(b.favorite);
        return (favoriteCounts.get(bKey) || 0) - (favoriteCounts.get(aKey) || 0)
          || new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
    }

    if (els.feedbackTabs) {
      els.feedbackTabs.querySelectorAll("[data-feedback-filter]").forEach((button) => {
        button.classList.toggle("is-active", button.dataset.feedbackFilter === filter);
      });
    }

    if (!filtered.length) {
      els.feedbackList.innerHTML = `<div class="feedback-item is-empty"><strong>Kayıt yok</strong><p>Müşteri mesajları, puanlamalar ve favori içecek tercihleri burada listelenecek.</p></div>`;
      return;
    }

    const rankingHtml = filter === "favori" ? renderFavoriteRanking(favoriteCounts) : "";
    els.feedbackList.innerHTML = rankingHtml + filtered.map((item) => {
      const type = normalizeFeedbackType(item.type);
      const count = favoriteCounts.get(favoriteKey(item.favorite)) || 0;
      const favorite = item.favorite ? `<p><strong>Favori içecek:</strong> ${escapeHTML(item.favorite)}</p>` : "";
      const text = item.text ? `<p>${escapeHTML(item.text)}</p>` : "";
      const emptyText = type === "puanlama" ? "Sadece puanlama gönderildi." : "Metin girilmedi.";
      return `
        <article class="feedback-item">
          <div class="feedback-item-head">
            <strong>${escapeHTML(feedbackTypeLabel(type))}</strong>
            <span>${escapeHTML(formatFeedbackDate(item.createdAt))}</span>
          </div>
          ${text || `<p>${escapeHTML(emptyText)}</p>`}
          ${favorite}
          <div class="feedback-meta">
            <span>${escapeHTML(feedbackStars(item.rating))}</span>
            ${type === "favori" ? `<span>${count} tercih</span>` : ""}
          </div>
        </article>
      `;
    }).join("");
  }

  async function refreshFeedbackInbox() {
    if (!backendBaseUrl()) {
      renderFeedbackInbox();
      return;
    }

    try {
      const result = await backendRequest("/api/feedback");
      if (Array.isArray(result.feedbackItems)) {
        safeLocalSet(FEEDBACK_STORAGE_KEY, JSON.stringify(result.feedbackItems));
      }
      renderFeedbackInbox();
      if (els.saveState) els.saveState.textContent = "Geri bildirim yenilendi";
    } catch (error) {
      console.warn("Geri bildirim backend'den alinamadi.", error);
      renderFeedbackInbox();
      if (els.saveState) els.saveState.textContent = "Yerel geri bildirim";
    }
    window.setTimeout(() => updateSaveControls(), 1200);
  }

  function favoriteRanking(items) {
    const counts = new Map();
    items.forEach((item) => {
      const key = favoriteKey(item.favorite);
      if (!key) return;
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return counts;
  }

  function renderFavoriteRanking(counts) {
    const ranked = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "tr"))
      .slice(0, 8);
    if (!ranked.length) return "";
    return `
      <div class="favorite-ranking">
        ${ranked.map(([name, count], index) => `
          <article>
            <span>${index + 1}</span>
            <strong>${escapeHTML(displayFavoriteName(name))}</strong>
            <small>${count} tercih</small>
          </article>
        `).join("")}
      </div>
    `;
  }

  function favoriteKey(value) {
    return String(value || "").trim().replace(/\s+/g, " ").toLocaleLowerCase("tr-TR");
  }

  function displayFavoriteName(value) {
    return String(value || "").replace(/(^|\s)\S/g, (letter) => letter.toLocaleUpperCase("tr-TR"));
  }

  function renderFeedbackInsights(items) {
    if (!els.feedbackInsights) return;
    const total = items.length;
    const ratingItems = items.filter((item) => Number(item.rating || 0) > 0);
    const ratingTotal = ratingItems.reduce((sum, item) => sum + Number(item.rating || 0), 0);
    const average = ratingItems.length ? (ratingTotal / ratingItems.length).toFixed(1) : "0.0";
    const complaints = items.filter((item) => normalizeFeedbackType(item.type) === "sikayet").length;
    const suggestions = items.filter((item) => normalizeFeedbackType(item.type) === "oneri").length;
    const requests = items.filter((item) => normalizeFeedbackType(item.type) === "istek").length;
    const favorites = items.filter((item) => normalizeFeedbackType(item.type) === "favori").length;
    const ratings = items.filter((item) => normalizeFeedbackType(item.type) === "puanlama").length;

    const insights = [
      ["Toplam kayıt", total],
      ["Yıldızlayan kişi", ratingItems.length],
      ["Ortalama puan", `${average}/5`],
      ["Puanlama", ratings],
      ["Şikayet", complaints],
      ["Öneri", suggestions],
      ["Dilek/İstek", requests],
      ["Favori içecek", favorites]
    ];

    els.feedbackInsights.innerHTML = insights.map(([label, value]) => (
      `<article class="feedback-insight"><span>${escapeHTML(label)}</span><strong>${escapeHTML(String(value))}</strong></article>`
    )).join("");
  }

  function handleFeedbackTabs(event) {
    const button = event.target.closest("[data-feedback-filter]");
    if (!button) return;
    state.feedbackFilter = button.dataset.feedbackFilter || "all";
    renderFeedbackInbox();
  }

  function clearFeedbackItems() {
    if (!confirm("Dilek, istek, şikayet ve favori kayıtları sıfırlansın mı? Puanlamalar korunacak.")) return;
    const preservedRatings = loadFeedbackItems()
      .filter((item) => Number(item.rating || 0) > 0)
      .map((item) => ({
        id: `rating-${item.id || Date.now()}`,
        createdAt: item.createdAt || new Date().toISOString(),
        type: "puanlama",
        text: "Puanlama kaydı",
        favorite: "",
        rating: clamp(Number(item.rating || 0), 1, 5)
      }));
    if (preservedRatings.length) safeLocalSet(FEEDBACK_STORAGE_KEY, JSON.stringify(preservedRatings));
    else safeLocalRemove(FEEDBACK_STORAGE_KEY);
    syncFeedbackItemsToBackend(preservedRatings);
    renderFeedbackInbox();
    if (els.saveState) els.saveState.textContent = "Kayıtlar sıfırlandı, puanlamalar korundu";
    window.setTimeout(() => {
      if (els.saveState) els.saveState.textContent = "Hazır";
    }, 1200);
  }

  async function syncFeedbackItemsToBackend(items) {
    if (!backendBaseUrl()) return;
    try {
      await backendRequest("/api/feedback", {
        method: "PUT",
        body: { feedbackItems: items }
      });
    } catch (error) {
      console.warn("Geri bildirim backend temizleme kaydedilemedi.", error);
    }
  }

  function loadFeedbackItems() {
    const stored = safeLocalGet(FEEDBACK_STORAGE_KEY);
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed)
        ? parsed.map(normalizeFeedbackItem).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        : [];
    } catch (error) {
      console.warn("Geri bildirim kaydı okunamadı.", error);
      return [];
    }
  }

  function normalizeFeedbackItem(item) {
    const next = Object.assign({}, item);
    if (
      normalizeFeedbackType(next.type) === "istek"
      && Number(next.rating || 0) > 0
      && !String(next.favorite || "").trim()
      && String(next.text || "").trim().toLocaleLowerCase("tr-TR") === "puanlama kaydı"
    ) {
      next.type = "puanlama";
    }
    return next;
  }

  function normalizeFeedbackType(type) {
    if (type === "puanlama" || type === "puan" || type === "rating") return "puanlama";
    if (type === "sikayet" || type === "şikayet") return "sikayet";
    if (type === "oneri" || type === "öneri") return "oneri";
    if (type === "favori" || type === "favorite") return "favori";
    return "istek";
  }

  function feedbackTypeLabel(type) {
    return {
      istek: "İstek",
      puanlama: "Puanlama",
      sikayet: "Şikayet",
      oneri: "Öneri",
      favori: "Favori içecek"
    }[type] || "İstek";
  }

  function feedbackStars(value) {
    const rating = Math.round(clamp(Number(value || 0), 0, 5));
    return rating ? `${"★".repeat(rating)}${"☆".repeat(5 - rating)} ${rating}/5` : "Puan yok";
  }

  function formatFeedbackDate(value) {
    const date = new Date(value || "");
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

  function renderLists() {
    els.categoryList.innerHTML = state.data.categories.map((category) => `
      <button class="nav-row${category.id === state.selectedCategoryId ? " is-active" : ""}" type="button" data-category-id="${escapeAttribute(category.id)}">
        <strong>${category.active ? "" : "Gizli · "}${escapeHTML(category.name)}</strong>
        <small>${category.products.length} ürün</small>
      </button>
    `).join("");

    const category = selectedCategory();
    els.productList.innerHTML = category && category.products.length
      ? category.products.map((product) => `
        <button class="nav-row${product.id === state.selectedProductId ? " is-active" : ""}" type="button" data-product-id="${escapeAttribute(product.id)}">
          <strong>${product.popular ? "★ " : ""}${product.stock === "sold-out" || !product.active ? "Gizli · " : ""}${escapeHTML(product.name)}</strong>
          <small>${escapeHTML(priceSummary(product))}</small>
        </button>
      `).join("")
      : `<div class="nav-row"><strong>Ürün yok</strong><small>+ Ürün ile ekleyin</small></div>`;
  }

  function renderForms() {
    const settings = state.data.settings;
    els.bgColor.value = toColor(settings.bgColor, DEFAULT_SETTINGS.bgColor);
    els.darkBgColor.value = toColor(settings.darkBgColor, DEFAULT_SETTINGS.darkBgColor);
    els.accentColor.value = toColor(settings.accentColor, DEFAULT_SETTINGS.accentColor);
    els.textColor.value = toColor(settings.textColor, DEFAULT_SETTINGS.textColor);
    els.buttonTextColor.value = toColor(settings.buttonTextColor, DEFAULT_SETTINGS.buttonTextColor);
    els.productCardColor.value = toColor(settings.productCardColor, DEFAULT_SETTINGS.productCardColor);
    if (els.socialIconColor) els.socialIconColor.value = toColor(settings.socialIconColor, DEFAULT_SETTINGS.socialIconColor);
    if (els.socialIconSize) els.socialIconSize.value = clamp(Number(settings.socialIconSize || DEFAULT_SETTINGS.socialIconSize), 18, 64);
    if (els.socialIconSizeValue && els.socialIconSize) els.socialIconSizeValue.textContent = `${els.socialIconSize.value}px`;
    const socialPreview = document.querySelector(".social-preview");
    if (socialPreview && els.socialIconColor && els.socialIconSize) {
      socialPreview.style.setProperty("--social-preview-color", els.socialIconColor.value);
      socialPreview.style.setProperty("--social-preview-size", `${els.socialIconSize.value}px`);
    }
    els.menuBgType.value = settings.menuBackground.type;
    els.menuGradientStart.value = toColor(settings.menuBackground.gradientStart, DEFAULT_SETTINGS.bgColor);
    els.menuGradientEnd.value = toColor(settings.menuBackground.gradientEnd, "#E5E7EB");
    els.menuGradientAngle.value = settings.menuBackground.gradientAngle;
    els.menuBgUrl.value = settings.menuBackground.imageUrl || "";
    els.menuOverlay.value = settings.menuBackground.overlay;
    els.menuUpdateDate.value = settings.menuUpdateDate || "";
    setFontSelectValue(els.titleFont, settings.fonts.title);
    setFontSelectValue(els.categoryFont, settings.fonts.category);
    setFontSelectValue(els.productFont, settings.fonts.product);
    const typography = normalizeTypography(settings.typography);
    els.menuTitleSize.value = typography.menuTitle;
    els.categoryTitleSize.value = typography.categoryTitle;
    els.productTitleSize.value = typography.productTitle;
    els.productDescSize.value = typography.productDesc;
    els.productIngredientsSize.value = typography.productIngredients;
    els.productPriceSize.value = typography.productPrice;
    renderActionStyleForm("popular", settings.bottomActions.popular);
    renderActionStyleForm("suggest", settings.bottomActions.suggest);
    renderBannerSettingsForm(settings.banner);

    const category = selectedCategory();
    if (category) {
      els.categoryEditorTitle.textContent = `${category.name} kategorisi`;
      els.categoryName.value = category.name;
      els.categoryActive.checked = category.active;
      els.categoryStyleType.value = category.style.type || "gradient";
      els.categoryColor.value = toColor(category.style.color || settings.categoryCardColor, DEFAULT_SETTINGS.categoryCardColor);
      els.categoryGradientStart.value = toColor(category.style.gradientStart, DEFAULT_SETTINGS.categoryCardColor);
      els.categoryGradientEnd.value = toColor(category.style.gradientEnd, "#E5E7EB");
      els.categoryGradientAngle.value = category.style.gradientAngle;
      els.categoryImageUrl.value = category.style.imageUrl || "";
      els.categoryOverlay.value = category.style.overlay;
      els.bulkProductStyleType.value = "solid";
      els.bulkProductColor.value = toColor(settings.productCardColor, DEFAULT_SETTINGS.productCardColor);
      els.bulkProductGradientStart.value = toColor(settings.productCardColor, DEFAULT_SETTINGS.productCardColor);
      els.bulkProductGradientEnd.value = "#E5E7EB";
      els.bulkProductGradientAngle.value = 145;
      renderImagePreview(els.categoryImagePreview, category.style.imageUrl || category.style.image, "Kategori görseli yok");
    }

    els.productCategory.innerHTML = state.data.categories.map((item) => `
      <option value="${escapeAttribute(item.id)}">${escapeHTML(item.name)}</option>
    `).join("");
    renderProductNavigation();
    renderSiteSettingsForm();

    const product = selectedProduct();
    els.deleteProductButton.disabled = !product;
    if (!product) {
      els.productEditorTitle.textContent = "Ürün eklemek için + Ürün";
      clearProductForm();
      return;
    }

    els.productEditorTitle.textContent = `${product.name} detayı`;
    els.productName.value = product.name;
    els.productCategory.value = category ? category.id : "";
    els.productDesc.value = product.desc;
    els.priceMode.value = product.priceMode || "standard";
    els.standardPrice.value = product.prices.standard;
    els.priceK.value = product.prices.k;
    els.priceO.value = product.prices.o;
    els.priceB.value = product.prices.b;
    els.priceSingle.value = product.prices.single;
    els.priceDouble.value = product.prices.double;
    renderPriceModeFields();
    els.productStock.value = product.stock;
    els.productKind.value = product.kind;
    els.productTemperature.value = product.temperature;
    els.productPopular.checked = product.popular;
    els.productActive.checked = product.active;
    els.productStyleType.value = product.style.type === "solid" ? "solid" : "gradient";
    els.productColor.value = toColor(product.style.color || settings.productCardColor, DEFAULT_SETTINGS.productCardColor);
    els.productGradientStart.value = toColor(product.style.gradientStart, DEFAULT_SETTINGS.productCardColor);
    els.productGradientEnd.value = toColor(product.style.gradientEnd, "#E5E7EB");
    els.productGradientAngle.value = product.style.gradientAngle;
    els.productImageUrl.value = product.imageUrl || "";
    els.productImageOverlay.value = product.imageOverlay;
    renderImagePreview(els.productImagePreview, product.imageUrl || product.image, "Ürün görseli yok");
    els.productCalories.value = product.details.calories;
    els.productAllergens.value = product.details.allergens;
    els.productIngredients.value = product.details.ingredients;
  }

  function renderSiteSettingsForm() {
    const site = normalizeSiteSettings(state.site || DEFAULT_SITE_SETTINGS);
    setInputValue("siteHeroKicker", site.heroKicker);
    setInputValue("siteHeroTitle", site.heroTitle);
    setInputValue("siteHeroSubtitle", site.heroSubtitle);
    setInputValue("siteHeroImageUrl", site.heroImageUrl);
    setInputValue("siteStoryTitle", site.storyTitle);
    setInputValue("siteStoryText", site.storyText);
    setInputValue("siteStoryPointOneTitle", site.storyPointOneTitle);
    setInputValue("siteStoryPointOneText", site.storyPointOneText);
    setInputValue("siteStoryPointTwoTitle", site.storyPointTwoTitle);
    setInputValue("siteStoryPointTwoText", site.storyPointTwoText);
    setInputValue("siteStoryPointThreeTitle", site.storyPointThreeTitle);
    setInputValue("siteStoryPointThreeText", site.storyPointThreeText);
    setInputValue("siteMenuTitle", site.menuTitle);
    setInputValue("siteMenuIntro", site.menuIntro);
    setInputValue("siteVisitTitle", site.visitTitle);
    setInputValue("siteVisitText", site.visitText);
    setInputValue("siteContactTitle", site.contactTitle);
    setInputValue("siteAddress", site.address);
    setInputValue("siteHours", site.hours);
    setInputValue("sitePhone", site.phone);
    setInputValue("siteEmail", site.email);
    setInputValue("siteWhatsapp", site.whatsapp);
    setInputValue("siteMapsUrl", site.mapsUrl);
    setInputValue("siteInstagram", site.instagram);
    setInputValue("siteTiktok", site.tiktok);
    setInputValue("siteBackgroundColor", toColor(site.backgroundColor, DEFAULT_SITE_SETTINGS.backgroundColor));
    setInputValue("siteSurfaceColor", toColor(site.surfaceColor, DEFAULT_SITE_SETTINGS.surfaceColor));
    setInputValue("siteAccentColor", toColor(site.accentColor, DEFAULT_SITE_SETTINGS.accentColor));
    setInputValue("siteAccentColorTwo", toColor(site.accentColorTwo, DEFAULT_SITE_SETTINGS.accentColorTwo));
    setInputValue("siteTextColor", toColor(site.textColor, DEFAULT_SITE_SETTINGS.textColor));
    setInputValue("siteMutedColor", toColor(site.mutedColor, DEFAULT_SITE_SETTINGS.mutedColor));
    setFontSelectValue(els.siteTitleFont, site.titleFont);
    setFontSelectValue(els.siteBodyFont, site.bodyFont);
    setInputValue("siteTitleSize", site.titleSize);
    setInputValue("siteBodySize", site.bodySize);
    renderSiteSocialLinksList(site.socialLinks || []);
  }

  function renderSiteSocialLinksList(links) {
    if (!els.siteSocialLinksList) return;
    const normalized = normalizeSocialLinks(links);
    els.siteSocialLinksList.innerHTML = normalized.length
      ? normalized.map((link, index) => {
        const icon = SITE_ICON_OPTIONS.find(([value]) => value === link.icon) || SITE_ICON_OPTIONS[SITE_ICON_OPTIONS.length - 1];
        return `
          <article class="icon-link-item">
            <span>${escapeHTML(icon[2])}</span>
            <strong>${escapeHTML(link.label)}</strong>
            <small>${escapeHTML(link.url)}</small>
            <button class="danger-mini" type="button" data-remove-site-social="${index}">Sil</button>
          </article>
        `;
      }).join("")
      : `<div class="empty-mini">Ek ikonlu bağlantı yok.</div>`;
  }

  function addSiteSocialLink() {
    if (!els.siteSocialLabel || !els.siteSocialUrl || !els.siteSocialIcon) return;
    const label = els.siteSocialLabel.value.trim();
    const url = els.siteSocialUrl.value.trim();
    if (!label || !url) return;
    const site = normalizeSiteSettings(state.site || DEFAULT_SITE_SETTINGS);
    site.socialLinks = normalizeSocialLinks(site.socialLinks || []);
    site.socialLinks.push({
      label,
      url,
      icon: els.siteSocialIcon.value || "web"
    });
    state.site = normalizeSiteSettings(site);
    els.siteSocialLabel.value = "";
    els.siteSocialUrl.value = "";
    saveSiteSettings();
    renderSiteSettingsForm();
  }

  function removeSiteSocialLink(event) {
    const button = event.target.closest("[data-remove-site-social]");
    if (!button) return;
    const index = Number(button.dataset.removeSiteSocial);
    const site = normalizeSiteSettings(state.site || DEFAULT_SITE_SETTINGS);
    site.socialLinks = normalizeSocialLinks(site.socialLinks || []).filter((_, itemIndex) => itemIndex !== index);
    state.site = normalizeSiteSettings(site);
    saveSiteSettings();
    renderSiteSettingsForm();
  }

  function applyPremiumSiteTheme() {
    const site = normalizeSiteSettings(state.site || DEFAULT_SITE_SETTINGS);
    state.site = normalizeSiteSettings(Object.assign({}, site, PREMIUM_SITE_PALETTE, {
      heroImageUrl: "Tahmisçi_Logo/Logolar/Ana_Logo/PNG_Logo.png"
    }));
    saveSiteSettings();
    renderSiteSettingsForm();
  }

  function setInputValue(id, value) {
    if (!els[id]) return;
    els[id].value = value || "";
  }

  function clearProductForm() {
    [
      "productName", "productDesc", "standardPrice", "priceK", "priceO", "priceB", "priceSingle", "priceDouble", "productImageUrl",
      "productCalories", "productAllergens", "productIngredients"
    ].forEach((id) => {
      els[id].value = "";
    });
    els.priceMode.value = "standard";
    els.productStock.value = "active";
    els.productKind.value = "drink";
    els.productTemperature.value = "none";
    els.productPopular.checked = false;
    els.productActive.checked = true;
    renderPriceModeFields();
    renderImagePreview(els.productImagePreview, "", "Ürün görseli yok");
  }

  function renderProductNavigation() {
    if (!els.productCategoryTabs || !els.productQuickList) return;
    const category = selectedCategory();
    els.productCategoryTabs.innerHTML = state.data.categories.map((item) => `
      <button class="category-tab${category && item.id === category.id ? " is-active" : ""}" type="button" data-product-category-tab="${escapeAttribute(item.id)}">
        ${escapeHTML(item.name)} <span>${item.products.length}</span>
      </button>
    `).join("");

    els.productQuickList.innerHTML = category && category.products.length
      ? category.products.map((product) => `
        <button class="product-chip${product.id === state.selectedProductId ? " is-active" : ""}" type="button" data-product-chip="${escapeAttribute(product.id)}">
          ${escapeHTML(product.name)}
        </button>
      `).join("")
      : `<button class="product-chip" type="button" disabled>Ürün yok</button>`;
  }

  function handleProductCategoryTabs(event) {
    const button = event.target.closest("[data-product-category-tab]");
    if (!button) return;
    state.selectedCategoryId = button.dataset.productCategoryTab;
    const category = selectedCategory();
    state.selectedProductId = category && category.products[0] ? category.products[0].id : "";
    setActiveSection("product", { collapseSidebar: false, render: false });
    renderAll();
  }

  function handleProductQuickList(event) {
    const button = event.target.closest("[data-product-chip]");
    if (!button) return;
    state.selectedProductId = button.dataset.productChip;
    setActiveSection("product", { collapseSidebar: false, render: false });
    renderAll();
  }

  function renderRecipeEditor() {
    ensureRecipeSelection();
    const categories = recipeCategoryNames();
    const products = recipeProductNames(state.selectedRecipeCategory);
    const sizes = selectedRecipeSizes();
    const sizeEntries = Object.entries(sizes);
    if (!state.selectedRecipePreviewSize || !Object.prototype.hasOwnProperty.call(sizes, state.selectedRecipePreviewSize)) {
      state.selectedRecipePreviewSize = sizeEntries[0] ? sizeEntries[0][0] : "";
    }

    els.recipeCategorySelect.innerHTML = categories.map((category) => `
      <option value="${escapeAttribute(category)}">${escapeHTML(category)}</option>
    `).join("");
    els.recipeCategorySelect.value = state.selectedRecipeCategory;

    els.recipeProductSelect.innerHTML = products.map((product) => `
      <option value="${escapeAttribute(product)}">${escapeHTML(product)}</option>
    `).join("");
    els.recipeProductSelect.value = state.selectedRecipeProduct;

    els.recipeCategoryName.value = state.selectedRecipeCategory || "";
    els.recipeProductName.value = state.selectedRecipeProduct || "";
    els.deleteRecipeCategoryButton.disabled = !state.selectedRecipeCategory || categories.length <= 1;
    els.deleteRecipeProductButton.disabled = !state.selectedRecipeProduct;
    els.addRecipeProductButton.disabled = !state.selectedRecipeCategory;
    els.addRecipeSizeButton.disabled = !state.selectedRecipeProduct;

    if (!state.selectedRecipeProduct) {
      els.recipeSizeList.innerHTML = `<div class="recipe-empty">Bu kategoride henüz ürün yok. + Ürün ile başlayın.</div>`;
      return;
    }

    els.recipeSizeList.innerHTML = sizeEntries.length
      ? sizeEntries.map(([size, recipe]) => `
        <article class="recipe-size-row">
          <div class="recipe-size-head">
            <label>
              <span>Ölçü</span>
              <input class="recipe-size-name" type="text" value="${escapeAttribute(size)}" data-recipe-size-name="${escapeAttribute(size)}">
            </label>
            <button class="danger-action" type="button" data-delete-recipe-size="${escapeAttribute(size)}">Ölçüyü Sil</button>
          </div>
          <label>
            <span>Reçete</span>
            <textarea class="recipe-textarea" rows="4" data-recipe-body="${escapeAttribute(size)}">${escapeHTML(recipe)}</textarea>
          </label>
        </article>
      `).join("")
      : `<div class="recipe-empty">Bu üründe ölçü yok. + Ölçü ile 14 oz gibi yeni bir reçete ekleyin.</div>`;
  }

  function handleRecipeSizeInput(event) {
    const textarea = event.target.closest("[data-recipe-body]");
    if (!textarea) return;
    const sizes = selectedRecipeSizes();
    const size = textarea.dataset.recipeBody;
    if (!Object.prototype.hasOwnProperty.call(sizes, size)) return;
    sizes[size] = textarea.value;
    saveRecipes({ render: false });
    renderPreview();
  }

  function handleRecipeSizeChange(event) {
    const input = event.target.closest("[data-recipe-size-name]");
    if (!input) return;
    const oldName = input.dataset.recipeSizeName;
    const nextName = input.value.trim() || oldName;
    const sizes = selectedRecipeSizes();
    if (nextName !== oldName && Object.prototype.hasOwnProperty.call(sizes, nextName)) {
      alert("Bu ölçü adı zaten var.");
      input.value = oldName;
      return;
    }
    if (nextName !== oldName) {
      sizes[nextName] = sizes[oldName] || "";
      delete sizes[oldName];
      if (state.selectedRecipePreviewSize === oldName) state.selectedRecipePreviewSize = nextName;
    }
    saveRecipes({ render: true });
  }

  function handleRecipeSizeClick(event) {
    const button = event.target.closest("[data-delete-recipe-size]");
    if (!button) return;
    const size = button.dataset.deleteRecipeSize;
    const sizes = selectedRecipeSizes();
    if (!Object.prototype.hasOwnProperty.call(sizes, size)) return;
    if (!confirm(`${state.selectedRecipeProduct} / ${size} reçetesi silinsin mi?`)) return;
    delete sizes[size];
    if (state.selectedRecipePreviewSize === size) state.selectedRecipePreviewSize = "";
    saveRecipes({ render: true });
  }

  function addRecipeCategory() {
    const name = uniqueName("Yeni Reçete", recipeCategoryNames());
    state.recipes[name] = {
      "14 oz Örnek İçecek": {
        "14 oz": "Double shot espresso + soğuk süt + buz"
      }
    };
    state.selectedRecipeCategory = name;
    state.selectedRecipeProduct = "14 oz Örnek İçecek";
    state.selectedRecipePreviewSize = "14 oz";
    saveRecipes({ render: true });
  }

  function addRecipeProduct() {
    if (!state.selectedRecipeCategory) return;
    const products = recipeProductNames(state.selectedRecipeCategory);
    const name = uniqueName("Yeni Ürün", products);
    state.recipes[state.selectedRecipeCategory][name] = {
      "14 oz": "Reçete adımlarını buraya yazın"
    };
    state.selectedRecipeProduct = name;
    state.selectedRecipePreviewSize = "14 oz";
    saveRecipes({ render: true });
  }

  function addRecipeSize() {
    const sizes = selectedRecipeSizes();
    if (!sizes) return;
    const name = uniqueName("14 oz", Object.keys(sizes));
    sizes[name] = "Reçete adımlarını buraya yazın";
    state.selectedRecipePreviewSize = name;
    saveRecipes({ render: true });
  }

  function deleteSelectedRecipeCategory() {
    if (!state.selectedRecipeCategory || recipeCategoryNames().length <= 1) return;
    if (!confirm(`${state.selectedRecipeCategory} kategorisi ve içindeki reçeteler silinsin mi?`)) return;
    delete state.recipes[state.selectedRecipeCategory];
    state.selectedRecipeCategory = "";
    state.selectedRecipeProduct = "";
    state.selectedRecipePreviewSize = "";
    ensureRecipeSelection();
    saveRecipes({ render: true });
  }

  function deleteSelectedRecipeProduct() {
    if (!state.selectedRecipeCategory || !state.selectedRecipeProduct) return;
    if (!confirm(`${state.selectedRecipeProduct} ürünü ve ölçüleri silinsin mi?`)) return;
    delete state.recipes[state.selectedRecipeCategory][state.selectedRecipeProduct];
    state.selectedRecipeProduct = "";
    state.selectedRecipePreviewSize = "";
    ensureRecipeSelection();
    saveRecipes({ render: true });
  }

  function renameSelectedRecipeCategory() {
    const oldName = state.selectedRecipeCategory;
    const nextName = els.recipeCategoryName.value.trim() || oldName;
    if (!oldName || nextName === oldName) {
      els.recipeCategoryName.value = oldName || "";
      return;
    }
    if (state.recipes[nextName]) {
      alert("Bu kategori adı zaten var.");
      els.recipeCategoryName.value = oldName;
      return;
    }
    state.recipes[nextName] = state.recipes[oldName];
    delete state.recipes[oldName];
    state.selectedRecipeCategory = nextName;
    saveRecipes({ render: true });
  }

  function renameSelectedRecipeProduct() {
    const category = state.recipes[state.selectedRecipeCategory];
    const oldName = state.selectedRecipeProduct;
    const nextName = els.recipeProductName.value.trim() || oldName;
    if (!category || !oldName || nextName === oldName) {
      els.recipeProductName.value = oldName || "";
      return;
    }
    if (category[nextName]) {
      alert("Bu ürün adı zaten var.");
      els.recipeProductName.value = oldName;
      return;
    }
    category[nextName] = category[oldName];
    delete category[oldName];
    state.selectedRecipeProduct = nextName;
    saveRecipes({ render: true });
  }

  function recipeCategoryNames() {
    return Object.keys(state.recipes || {});
  }

  function recipeProductNames(categoryName) {
    return Object.keys((state.recipes && state.recipes[categoryName]) || {});
  }

  function selectedRecipeSizes() {
    return state.recipes
      && state.recipes[state.selectedRecipeCategory]
      && state.recipes[state.selectedRecipeCategory][state.selectedRecipeProduct]
      || {};
  }

  function countRecipes() {
    const counts = { categories: 0, products: 0, sizes: 0 };
    recipeCategoryNames().forEach((category) => {
      counts.categories += 1;
      recipeProductNames(category).forEach((product) => {
        counts.products += 1;
        counts.sizes += Object.keys(state.recipes[category][product] || {}).length;
      });
    });
    return counts;
  }

  function uniqueName(base, existingNames) {
    const names = new Set(existingNames);
    if (!names.has(base)) return base;
    let index = 2;
    while (names.has(`${base} ${index}`)) index += 1;
    return `${base} ${index}`;
  }

  function saveRecipes(options) {
    const render = !options || options.render !== false;
    const json = JSON.stringify(state.recipes);
    safeLocalSet(RECIPE_STORAGE_KEY, json);
    safeLocalSet(LEGACY_RECIPE_STORAGE_KEY, json);
    if (state.recipeChannel) {
      state.recipeChannel.postMessage({ type: "recipes-updated", time: Date.now() });
    }
    markDirty("recipes");
    if (render) queueRenderAll();
  }

  function saveSiteSettings() {
    safeLocalSet(SITE_STORAGE_KEY, JSON.stringify(state.site));
    if (state.siteChannel) state.siteChannel.postMessage({ type: "site-updated", time: Date.now() });
    markDirty("site");
  }

  function renderPriceModeFields() {
    const mode = els.priceMode ? els.priceMode.value : "standard";
    if (els.standardPriceField) els.standardPriceField.hidden = mode !== "standard";
    if (els.sizePriceFields) els.sizePriceFields.hidden = mode !== "sizes";
    if (els.singleDoublePriceFields) els.singleDoublePriceFields.hidden = mode !== "singleDouble";
  }

  function renderImagePreview(target, src, emptyText) {
    if (!target) return;
    target.innerHTML = src
      ? `<img src="${escapeAttribute(src)}" alt=""><span>Önizleme hazır</span>`
      : `<span>${escapeHTML(emptyText)}</span>`;
  }

  function setFontSelectValue(select, value) {
    if (!select) return;
    if (!Array.from(select.options).some((option) => option.value === value)) {
      select.insertAdjacentHTML("beforeend", `<option value="${escapeAttribute(value)}">${escapeHTML(value)}</option>`);
    }
    select.value = value;
  }

  function renderActionStyleForm(prefix, style) {
    const normalized = normalizeStyle(style || DEFAULT_SETTINGS.bottomActions[prefix]);
    const capitalized = prefix === "popular" ? "popular" : "suggest";
    els[`${capitalized}BoxType`].value = normalized.type || "solid";
    els[`${capitalized}BoxColor`].value = toColor(normalized.color, DEFAULT_SETTINGS.bottomActions[prefix].color);
    els[`${capitalized}GradientStart`].value = toColor(normalized.gradientStart, DEFAULT_SETTINGS.bottomActions[prefix].gradientStart);
    els[`${capitalized}GradientEnd`].value = toColor(normalized.gradientEnd, DEFAULT_SETTINGS.bottomActions[prefix].gradientEnd);
    els[`${capitalized}GradientAngle`].value = normalized.gradientAngle;
    els[`${capitalized}ImageUrl`].value = normalized.imageUrl || "";
    els[`${capitalized}Overlay`].value = normalized.overlay;
  }

  function readActionStyleForm(prefix, previous) {
    const key = prefix === "popular" ? "popular" : "suggest";
    return normalizeStyle({
      type: els[`${key}BoxType`].value,
      color: els[`${key}BoxColor`].value,
      image: previous && previous.image || "",
      imageUrl: els[`${key}ImageUrl`].value.trim(),
      gradientStart: els[`${key}GradientStart`].value,
      gradientEnd: els[`${key}GradientEnd`].value,
      gradientAngle: Number(els[`${key}GradientAngle`].value || 145),
      overlay: Number(els[`${key}Overlay`].value || 0)
    });
  }

  function renderBannerSettingsForm(bannerSettings) {
    const banner = normalizeBanner(bannerSettings);
    if (els.bannerMode) els.bannerMode.value = banner.mode;
    if (els.bannerTitle) els.bannerTitle.value = banner.title;
    if (els.bannerSubtitle) els.bannerSubtitle.value = banner.subtitle;
    if (els.bannerVideoUrl) els.bannerVideoUrl.value = banner.videoUrl;
    if (els.bannerImages) els.bannerImages.value = banner.images.map((item) => item.src).join("\n");
    renderBannerMediaList("videos", banner.videos);
    renderBannerMediaList("images", banner.images);
    renderBannerCategorySelect();
    renderBannerProductList(banner.productIds);
  }

  function renderBannerMediaList(kind, items) {
    const target = kind === "videos" ? els.bannerVideoList : els.bannerImageList;
    if (!target) return;
    const title = kind === "videos" ? "video" : "görsel";
    target.innerHTML = items.length
      ? items.map((item, index) => `
        <article class="banner-media-row" data-banner-media-kind="${escapeAttribute(kind)}" data-banner-media-index="${index}">
          <label>
            <span>Sıra</span>
            <input type="number" min="1" max="${items.length}" value="${index + 1}" data-banner-media-order>
          </label>
          <div class="banner-media-name">
            <strong>${escapeHTML(item.name || `${title} ${index + 1}`)}</strong>
            <small>${escapeHTML(formatFileSize(item.size))}</small>
          </div>
          <button class="danger-action" type="button" data-banner-media-delete>Sil</button>
        </article>
      `).join("")
      : `<div class="empty-mini">Henüz yüklenen ${title} yok.</div>`;
  }

  function renderBannerCategorySelect() {
    if (!els.bannerProductCategory) return;
    const categories = state.data.categories.filter((category) => category.active !== false);
    const current = els.bannerProductCategory.value;
    els.bannerProductCategory.innerHTML = categories.length
      ? categories.map((category) => `<option value="${escapeAttribute(category.id)}">${escapeHTML(category.name)}</option>`).join("")
      : `<option value="">Kategori yok</option>`;
    if (categories.some((category) => category.id === current)) {
      els.bannerProductCategory.value = current;
    } else if (state.selectedCategoryId && categories.some((category) => category.id === state.selectedCategoryId)) {
      els.bannerProductCategory.value = state.selectedCategoryId;
    } else if (categories[0]) {
      els.bannerProductCategory.value = categories[0].id;
    }
  }

  function renderBannerProductList(selectedIds) {
    if (!els.bannerProductList) return;
    const selected = new Set(selectedIds || []);
    const categoryId = els.bannerProductCategory && els.bannerProductCategory.value || "";
    const query = normalizeText(els.bannerProductSearch && els.bannerProductSearch.value || "");
    const category = state.data.categories.find((item) => item.id === categoryId) || state.data.categories.find((item) => item.active !== false);
    const products = category
      ? category.products
        .filter((product) => product.active !== false)
        .filter((product) => !query || normalizeText(`${product.name} ${product.desc}`).includes(query))
      : [];
    els.bannerProductList.innerHTML = products.length
      ? products.map((product) => `
        <label class="banner-product-option">
          <input type="checkbox" value="${escapeAttribute(product.id)}" ${selected.has(product.id) ? "checked" : ""}>
          <span>${escapeHTML(product.name)}</span>
          <small>${escapeHTML(category ? category.name : "")}</small>
        </label>
      `).join("")
      : `<div class="empty-mini">Bu kategoride ürün bulunamadı.</div>`;
  }

  function readBannerForm(previous) {
    const previousIds = new Set(previous && previous.productIds || []);
    const visibleInputs = els.bannerProductList ? Array.from(els.bannerProductList.querySelectorAll("input[type='checkbox']")) : [];
    const visibleIds = new Set(visibleInputs.map((input) => input.value));
    visibleIds.forEach((id) => previousIds.delete(id));
    visibleInputs.filter((input) => input.checked).forEach((input) => previousIds.add(input.value));
    return normalizeBanner({
      mode: els.bannerMode ? els.bannerMode.value : previous && previous.mode,
      title: els.bannerTitle ? els.bannerTitle.value.trim() : previous && previous.title,
      subtitle: els.bannerSubtitle ? els.bannerSubtitle.value.trim() : previous && previous.subtitle,
      video: previous && previous.video || "",
      videoUrl: els.bannerVideoUrl ? els.bannerVideoUrl.value.trim() : "",
      videos: previous && previous.videos || [],
      images: els.bannerImages && els.bannerImages.value.trim() ? els.bannerImages.value : previous && previous.images,
      productIds: Array.from(previousIds)
    });
  }

  async function handleBannerVideoUpload(event) {
    await appendBannerFiles(event.target, "videos", "video");
  }

  async function handleBannerImageUpload(event) {
    await appendBannerFiles(event.target, "images", "image");
  }

  async function appendBannerFiles(input, listName, kind) {
    const files = Array.from(input.files || []);
    if (!files.length) return;
    const banner = normalizeBanner(state.data.settings.banner);
    try {
      const mediaItems = [];
      for (const file of files) {
        mediaItems.push(await storeMediaFile(file, kind));
      }
      banner[listName].push(...mediaItems);
      banner.video = "";
      banner.videoUrl = "";
      banner.mode = kind === "video" ? "video" : "images";
      state.data.settings.banner = banner;
      saveAndRender();
    } catch (error) {
      console.error("Banner medyasi yuklenemedi:", error);
      alert(`Medya backend'e yuklenemedi. ${error.message || "Dosya turunu, boyutunu ve oturumu kontrol edin."}`);
    } finally {
      input.value = "";
    }
  }

  function handleBannerMediaClick(event) {
    const button = event.target.closest("[data-banner-media-delete]");
    if (!button) return;
    const row = button.closest("[data-banner-media-kind]");
    if (!row) return;
    const kind = row.dataset.bannerMediaKind;
    const index = Number(row.dataset.bannerMediaIndex || -1);
    const banner = normalizeBanner(state.data.settings.banner);
    const list = kind === "videos" ? banner.videos : banner.images;
    const removed = list.splice(index, 1)[0];
    deleteStoredMediaItem(removed);
    if (kind === "videos") {
      banner.video = "";
      banner.videoUrl = "";
      if (!banner.videos.length && banner.mode === "video") banner.mode = "random";
    }
    if (kind === "images" && !banner.images.length && banner.mode === "images") banner.mode = "random";
    state.data.settings.banner = banner;
    saveAndRender();
  }

  function handleBannerMediaOrderChange(event) {
    const input = event.target.closest("[data-banner-media-order]");
    if (!input) return;
    const row = input.closest("[data-banner-media-kind]");
    if (!row) return;
    const kind = row.dataset.bannerMediaKind;
    const from = Number(row.dataset.bannerMediaIndex || -1);
    const banner = normalizeBanner(state.data.settings.banner);
    const list = kind === "videos" ? banner.videos : banner.images;
    if (from < 0 || from >= list.length) return;
    const to = clamp(Number(input.value || 1), 1, list.length) - 1;
    if (from === to) {
      renderBannerSettingsForm(banner);
      return;
    }
    const [item] = list.splice(from, 1);
    list.splice(to, 0, item);
    state.data.settings.banner = banner;
    saveAndRender();
  }

  function readTypographyForm() {
    return normalizeTypography({
      menuTitle: els.menuTitleSize.value,
      categoryTitle: els.categoryTitleSize.value,
      productTitle: els.productTitleSize.value,
      productDesc: els.productDescSize.value,
      productIngredients: els.productIngredientsSize.value,
      productPrice: els.productPriceSize.value
    });
  }

  function renderPreview() {
    if (state.activeSection === "recipe") {
      renderRecipePreview();
      return;
    }
    renderMenuPreview();
  }

  function renderMenuPreview() {
    const src = menuPreviewUrl();
    const existing = els.livePreview.querySelector(".menu-live-preview");
    if (existing) {
      if (existing.getAttribute("data-preview-src") !== src) {
        existing.setAttribute("data-preview-src", src);
        existing.src = src;
      }
      return;
    }

    els.livePreview.innerHTML = `
      <iframe class="menu-live-preview" data-preview-src="${escapeAttribute(src)}" src="${escapeAttribute(src)}" title="Canlı menü önizleme"></iframe>
    `;
  }

  function isLocalReviewPanel() {
    return String(window.location.pathname || "").toLowerCase().includes("local-inceleme");
  }

  function menuPageUrl() {
    return isLocalReviewPanel() ? "../../index.html" : "../index.html";
  }

  function recipePageUrl() {
    return isLocalReviewPanel() ? "../local-recete/index.html" : "../recete/index.html";
  }

  function menuPreviewUrl() {
    return `${menuPageUrl()}?preview=menu`;
  }

  function renderRecipePreview() {
    ensureRecipeSelection();
    const categories = recipeCategoryNames();
    const products = recipeProductNames(state.selectedRecipeCategory);
    const sizes = selectedRecipeSizes();
    const sizeNames = Object.keys(sizes);
    if (!state.selectedRecipePreviewSize || !Object.prototype.hasOwnProperty.call(sizes, state.selectedRecipePreviewSize)) {
      state.selectedRecipePreviewSize = sizeNames[0] || "";
    }
    const activeSize = state.selectedRecipePreviewSize;
    const activeRecipe = activeSize ? sizes[activeSize] || "" : "";

    els.livePreview.innerHTML = `
      <div class="recipe-preview-screen">
        <div class="recipe-preview-top">
          <div>
            <p class="eyebrow">TAHMİSÇİ Coffee</p>
            <h4>REÇETE</h4>
          </div>
          <span style="font-size:22px">☾</span>
        </div>
        <div class="recipe-preview-tabs">
          ${categories.map((category) => `
            <button class="recipe-preview-tab${category === state.selectedRecipeCategory ? " is-active" : ""}" type="button" data-recipe-preview-category="${escapeAttribute(category)}">
              ${escapeHTML(category)} ${recipeProductNames(category).length}
            </button>
          `).join("")}
        </div>
        <div class="recipe-preview-list">
          <article class="recipe-preview-card">
            <p class="recipe-card-kicker">${escapeHTML(state.selectedRecipeCategory || "Kategori")}</p>
            <h5>${escapeHTML(state.selectedRecipeProduct || products[0] || "Ürün seçin")}</h5>
            <div class="recipe-preview-sizes">
              ${sizeNames.length ? sizeNames.map((size) => `
                <button class="recipe-preview-size${size === activeSize ? " is-active" : ""}" type="button" data-recipe-preview-size="${escapeAttribute(size)}">
                  ${escapeHTML(size)}
                </button>
              `).join("") : `<span class="recipe-preview-size">Ölçü yok</span>`}
            </div>
          </article>
          <article class="recipe-preview-info">
            <strong>${escapeHTML(activeSize || "Ölçü seçin")}</strong>
            <span>${escapeHTML(activeRecipe || "Bu ölçü için reçete bilgisi henüz girilmedi.")}</span>
          </article>
        </div>
      </div>
    `;
  }

  function handleLivePreviewClick(event) {
    if (state.activeSection !== "recipe") return;

    const categoryButton = event.target.closest("[data-recipe-preview-category]");
    if (categoryButton) {
      state.selectedRecipeCategory = categoryButton.dataset.recipePreviewCategory;
      const products = recipeProductNames(state.selectedRecipeCategory);
      state.selectedRecipeProduct = products[0] || "";
      state.selectedRecipePreviewSize = "";
      renderAll();
      return;
    }

    const sizeButton = event.target.closest("[data-recipe-preview-size]");
    if (sizeButton) {
      state.selectedRecipePreviewSize = sizeButton.dataset.recipePreviewSize;
      renderPreview();
    }
  }

  function renderJson() {
    if (els.jsonOutput) {
      els.jsonOutput.value = JSON.stringify(state.data, null, 2);
    }
  }

  function updateSettingsFromForm() {
    const settings = state.data.settings;
    settings.bgColor = els.bgColor.value;
    settings.darkBgColor = els.darkBgColor.value;
    settings.accentColor = els.accentColor.value;
    settings.textColor = els.textColor.value;
    settings.buttonTextColor = els.buttonTextColor.value;
    settings.productCardColor = els.productCardColor.value;
    if (els.socialIconColor) settings.socialIconColor = els.socialIconColor.value;
    if (els.socialIconSize) settings.socialIconSize = clamp(Number(els.socialIconSize.value || DEFAULT_SETTINGS.socialIconSize), 18, 64);
    settings.menuBackground.type = els.menuBgType.value;
    settings.menuBackground.gradientStart = els.menuGradientStart.value;
    settings.menuBackground.gradientEnd = els.menuGradientEnd.value;
    settings.menuBackground.gradientAngle = Number(els.menuGradientAngle.value || 160);
    settings.menuBackground.imageUrl = els.menuBgUrl.value.trim();
    settings.menuBackground.overlay = Number(els.menuOverlay.value || 0);
    settings.menuBackgroundImage = settings.menuBackground.imageUrl || settings.menuBackground.image || "";
    settings.menuUpdateDate = els.menuUpdateDate.value || "";
    settings.fonts = {
      title: els.titleFont.value || DEFAULT_SETTINGS.fonts.title,
      category: els.categoryFont.value || DEFAULT_SETTINGS.fonts.category,
      product: els.productFont.value || DEFAULT_SETTINGS.fonts.product
    };
    settings.typography = readTypographyForm();
    settings.bottomActions.popular = readActionStyleForm("popular", settings.bottomActions.popular);
    settings.bottomActions.suggest = readActionStyleForm("suggest", settings.bottomActions.suggest);
    settings.banner = readBannerForm(settings.banner);
    saveAndRender();
  }

  function updateSiteSettingsFromForm() {
    state.site = normalizeSiteSettings({
      heroKicker: els.siteHeroKicker.value.trim(),
      heroTitle: els.siteHeroTitle.value.trim(),
      heroSubtitle: els.siteHeroSubtitle.value.trim(),
      heroImageUrl: els.siteHeroImageUrl.value.trim(),
      storyTitle: els.siteStoryTitle.value.trim(),
      storyText: els.siteStoryText.value.trim(),
      storyPointOneTitle: els.siteStoryPointOneTitle.value.trim(),
      storyPointOneText: els.siteStoryPointOneText.value.trim(),
      storyPointTwoTitle: els.siteStoryPointTwoTitle.value.trim(),
      storyPointTwoText: els.siteStoryPointTwoText.value.trim(),
      storyPointThreeTitle: els.siteStoryPointThreeTitle.value.trim(),
      storyPointThreeText: els.siteStoryPointThreeText.value.trim(),
      menuTitle: els.siteMenuTitle.value.trim(),
      menuIntro: els.siteMenuIntro.value.trim(),
      visitTitle: els.siteVisitTitle.value.trim(),
      visitText: els.siteVisitText.value.trim(),
      contactTitle: els.siteContactTitle.value.trim(),
      address: els.siteAddress.value.trim(),
      hours: els.siteHours.value.trim(),
      phone: els.sitePhone.value.trim(),
      email: els.siteEmail.value.trim(),
      whatsapp: els.siteWhatsapp.value.trim(),
      mapsUrl: els.siteMapsUrl.value.trim(),
      instagram: els.siteInstagram.value.trim(),
      tiktok: els.siteTiktok.value.trim(),
      socialLinks: normalizeSocialLinks(state.site && state.site.socialLinks || []),
      backgroundColor: els.siteBackgroundColor.value,
      surfaceColor: els.siteSurfaceColor.value,
      accentColor: els.siteAccentColor.value,
      accentColorTwo: els.siteAccentColorTwo.value,
      textColor: els.siteTextColor.value,
      mutedColor: els.siteMutedColor.value,
      titleFont: els.siteTitleFont.value || DEFAULT_SITE_SETTINGS.titleFont,
      bodyFont: els.siteBodyFont.value || DEFAULT_SITE_SETTINGS.bodyFont,
      titleSize: Number(els.siteTitleSize.value || DEFAULT_SITE_SETTINGS.titleSize),
      bodySize: Number(els.siteBodySize.value || DEFAULT_SITE_SETTINGS.bodySize)
    });
    saveSiteSettings();
  }

  function updateCategoryFromForm() {
    const category = selectedCategory();
    if (!category) return;
    category.name = els.categoryName.value.trim() || "Kategori";
    category.active = els.categoryActive.checked;
    category.style.type = els.categoryStyleType.value;
    category.style.color = els.categoryColor.value;
    category.color = category.style.color;
    category.style.gradientStart = els.categoryGradientStart.value;
    category.style.gradientEnd = els.categoryGradientEnd.value;
    category.style.gradientAngle = Number(els.categoryGradientAngle.value || 145);
    category.style.imageUrl = els.categoryImageUrl.value.trim();
    category.style.overlay = Number(els.categoryOverlay.value || 0);
    category.image = category.style.imageUrl || category.style.image || "";
    saveAndRender();
  }

  function updateProductFromForm() {
    const product = selectedProduct();
    if (!product) return;

    const currentCategory = selectedCategory();
    if (currentCategory && els.productCategory.value && els.productCategory.value !== currentCategory.id) {
      moveProductToCategory(product.id, currentCategory.id, els.productCategory.value);
      return;
    }

    product.name = els.productName.value.trim() || "Ürün";
    product.desc = els.productDesc.value.trim();
    product.active = els.productActive.checked;
    product.stock = els.productStock.value;
    product.kind = els.productKind.value;
    product.temperature = els.productTemperature.value;
    product.popular = els.productPopular.checked;
    product.priceMode = ["sizes", "singleDouble"].includes(els.priceMode.value) ? els.priceMode.value : "standard";
    product.prices = normalizePricesForMode(normalizePrices({
      standard: els.standardPrice.value,
      k: els.priceK.value,
      o: els.priceO.value,
      b: els.priceB.value,
      single: els.priceSingle.value,
      double: els.priceDouble.value
    }), product.priceMode);
    product.variants = normalizeVariants(null, product.prices, product.priceMode);
    product.style.type = els.productStyleType.value;
    product.style.color = els.productColor.value;
    product.cardColor = product.style.color;
    product.style.gradientStart = els.productGradientStart.value;
    product.style.gradientEnd = els.productGradientEnd.value;
    product.style.gradientAngle = Number(els.productGradientAngle.value || 145);
    product.imageUrl = els.productImageUrl.value.trim();
    product.imageOverlay = Number(els.productImageOverlay.value || 0);
    product.details.calories = els.productCalories.value.trim();
    product.details.allergens = els.productAllergens.value.trim();
    product.details.ingredients = els.productIngredients.value.trim();
    saveAndRender();
  }

  function applyBulkProductImageUrl() {
    const url = els.bulkProductImageUrl.value.trim();
    if (!url) return;
    applyBulkProductImage(url, false);
  }

  function applyBulkProductImage(src, isEmbedded) {
    const category = selectedCategory();
    if (!category) return;
    category.products.forEach((product) => {
      if (isEmbedded) {
        product.image = src;
        product.imageUrl = "";
      } else {
        product.imageUrl = src;
        product.image = "";
      }
    });
    saveAndRender();
  }

  function clearBulkProductImages() {
    const category = selectedCategory();
    if (!category) return;
    category.products.forEach((product) => {
      product.image = "";
      product.imageUrl = "";
    });
    els.bulkProductImageUrl.value = "";
    saveAndRender();
  }

  function applyBulkProductStyle() {
    const category = selectedCategory();
    if (!category) return;
    const stylePatch = {
      type: els.bulkProductStyleType.value,
      color: els.bulkProductColor.value,
      gradientStart: els.bulkProductGradientStart.value,
      gradientEnd: els.bulkProductGradientEnd.value,
      gradientAngle: Number(els.bulkProductGradientAngle.value || 145)
    };
    category.products.forEach((product) => {
      product.style = normalizeStyle(Object.assign({}, product.style, stylePatch));
      product.cardColor = product.style.color;
    });
    saveAndRender();
  }

  function addCategory() {
    const category = makeCategory(`Yeni Kategori ${state.data.categories.length + 1}`);
    state.data.categories.push(category);
    state.selectedCategoryId = category.id;
    state.selectedProductId = "";
    saveAndRender();
  }

  function addProduct() {
    const category = selectedCategory();
    if (!category) return;
    const product = makeProduct(`Yeni Ürün ${category.products.length + 1}`, category.id);
    category.products.push(product);
    state.selectedProductId = product.id;
    saveAndRender();
  }

  function deleteSelectedCategory() {
    const category = selectedCategory();
    if (!category) return;
    if (!confirm(`${category.name} kategorisi ve içindeki ürünler silinsin mi?`)) return;
    state.data.categories = state.data.categories.filter((item) => item.id !== category.id);
    ensureSelection();
    saveAndRender();
  }

  function deleteSelectedProduct() {
    const category = selectedCategory();
    const product = selectedProduct();
    if (!category || !product) return;
    if (!confirm(`${product.name} ürünü silinsin mi?`)) return;
    category.products = category.products.filter((item) => item.id !== product.id);
    state.selectedProductId = category.products[0] ? category.products[0].id : "";
    saveAndRender();
  }

  function moveProductToCategory(productId, fromCategoryId, toCategoryId) {
    const from = state.data.categories.find((category) => category.id === fromCategoryId);
    const to = state.data.categories.find((category) => category.id === toCategoryId);
    if (!from || !to) return;
    const index = from.products.findIndex((product) => product.id === productId);
    if (index < 0) return;
    const [product] = from.products.splice(index, 1);
    to.products.push(product);
    state.selectedCategoryId = to.id;
    state.selectedProductId = product.id;
    saveAndRender();
  }

  function resetToDefault() {
    const savedDefault = readStoredJSON(CUSTOM_DEFAULT_KEY);
    if (savedDefault) {
      openDefaultChoiceModal();
      return;
    }
    if (!confirm("Panel verisi ilk menü verisine döndürülsün mü?")) return;
    applyDefaultState("initial");
  }

  function saveCurrentAsDefault() {
    const snapshot = normalizeState(cloneData(state.data));
    const ok = safeLocalSet(CUSTOM_DEFAULT_KEY, JSON.stringify(snapshot));
    if (els.saveState) els.saveState.textContent = ok ? "Varsayılan kaydedildi" : "Varsayılan geçici kaydedildi";
    window.clearTimeout(saveCurrentAsDefault.timer);
    saveCurrentAsDefault.timer = window.setTimeout(() => {
      if (els.saveState) els.saveState.textContent = "Hazır";
    }, 1400);
  }

  function openDefaultChoiceModal() {
    if (!els.defaultChoiceModal) {
      const useSaved = confirm("Kaydedilen varsayılan kullanılsın mı? Tamam: Kaydedilen varsayılan, İptal: İlk varsayılan");
      applyDefaultState(useSaved ? "saved" : "initial");
      return;
    }
    els.defaultChoiceModal.hidden = false;
  }

  function closeDefaultChoiceModal() {
    if (els.defaultChoiceModal) els.defaultChoiceModal.hidden = true;
  }

  function handleDefaultChoice(event) {
    const button = event.target.closest("[data-default-choice]");
    if (!button) {
      if (event.target === els.defaultChoiceModal) closeDefaultChoiceModal();
      return;
    }
    const choice = button.dataset.defaultChoice;
    if (choice === "cancel") {
      closeDefaultChoiceModal();
      return;
    }
    applyDefaultState(choice === "saved" ? "saved" : "initial");
    closeDefaultChoiceModal();
  }

  function applyDefaultState(kind) {
    const savedDefault = kind === "saved" ? readStoredJSON(CUSTOM_DEFAULT_KEY) : null;
    if (kind === "saved" && !savedDefault) {
      alert("Kaydedilen varsayılan bulunamadı.");
      return;
    }
    state.data = normalizeState(savedDefault || initialDefaultState());
    state.selectedCategoryId = "";
    state.selectedProductId = "";
    saveAndRender();
  }

  function initialDefaultState() {
    return {
      settings: cloneData(DEFAULT_SETTINGS),
      categories: legacyMenuToCategories(window.MENU || {})
    };
  }

  function saveAndRender() {
    safeLocalSet(STORAGE_KEY, JSON.stringify(state.data));
    if (state.channel) state.channel.postMessage({ type: "menu-updated", time: Date.now() });
    markDirty("menu");
    queueRenderAll();
  }

  function copyJson() {
    const text = JSON.stringify(state.data, null, 2);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        els.saveState.textContent = "JSON kopyalandı";
      });
    } else {
      els.jsonOutput.select();
      document.execCommand("copy");
      els.saveState.textContent = "JSON kopyalandı";
    }
  }

  function legacyMenuToCategories(menu) {
    const names = Object.keys(menu || {});
    return names.map((name) => {
      const category = makeCategory(name);
      category.id = makeId("cat", name);
      const groups = menu[name] || {};
      Object.keys(groups).forEach((groupName) => {
        (groups[groupName] || []).forEach((item, index) => {
          const product = normalizeProduct({
            id: makeId(category.id, `${groupName}-${item.name || index}`),
            name: item.name || "Ürün",
            desc: item.desc || groupName,
            image: item.img || "",
            prices: pricesFromLegacyProduct(item),
            kind: inferKind(name, groupName, item.name || ""),
            temperature: inferTemperature(name, groupName, item.name || "")
          }, category.id, index);
          category.products.push(product);
        });
      });
      return category;
    });
  }

  function makeCategory(name) {
    return {
      id: makeId("cat", `${name}-${Date.now()}`),
      name,
      active: true,
      color: "",
      image: "",
      style: normalizeStyle({
        color: DEFAULT_SETTINGS.categoryCardColor,
        gradientStart: DEFAULT_SETTINGS.categoryCardColor,
        gradientEnd: "#E5E7EB",
        gradientAngle: 135,
        overlay: 0.12
      }),
      products: []
    };
  }

  function makeProduct(name, categoryId) {
    return normalizeProduct({
      id: makeId(categoryId, `${name}-${Date.now()}`),
      name,
      prices: { standard: "", k: "", o: "", b: "", single: "", double: "" },
      active: true,
      stock: "active",
      kind: "drink",
      temperature: "none"
    }, categoryId, 0);
  }

  function selectedCategory() {
    return state.data.categories.find((category) => category.id === state.selectedCategoryId) || state.data.categories[0] || null;
  }

  function selectedProduct() {
    const category = selectedCategory();
    if (!category) return null;
    return category.products.find((product) => product.id === state.selectedProductId) || category.products[0] || null;
  }

  function flatProducts() {
    return state.data.categories.flatMap((category) => category.products.map((product) => ({ category, product })));
  }

  function isVisibleProduct(product) {
    return product.active !== false && product.stock !== "sold-out";
  }

  function readImage(input, callback) {
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      callback(reader.result);
      input.value = "";
    };
    reader.readAsDataURL(file);
  }

  function mediaRef(id) {
    return `${MEDIA_REF_PREFIX}${id}`;
  }

  function mediaIdFromRef(src) {
    const value = String(src || "");
    return value.startsWith(MEDIA_REF_PREFIX) ? value.slice(MEDIA_REF_PREFIX.length) : "";
  }

  function defaultMediaName(src, index, kind) {
    if (!src) return kind === "video" ? `Video ${index + 1}` : `Görsel ${index + 1}`;
    try {
      const url = new URL(src, window.location.href);
      const name = decodeURIComponent(url.pathname.split("/").pop() || "");
      if (name) return name;
    } catch (error) {
      const parts = src.split(/[\\/]/);
      const last = parts[parts.length - 1];
      if (last && !last.startsWith("data:") && !last.startsWith(MEDIA_REF_PREFIX)) return last;
    }
    return kind === "video" ? `Video ${index + 1}` : `Görsel ${index + 1}`;
  }

  function formatFileSize(size) {
    const bytes = Number(size || 0);
    if (!bytes) return "Boyut bilgisi yok";
    if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${bytes} B`;
  }

  function openMediaDb() {
    if (!window.indexedDB) return Promise.reject(new Error("Tarayici medya depolamayi desteklemiyor."));
    if (state.mediaDbPromise) return state.mediaDbPromise;
    state.mediaDbPromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(MEDIA_DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(MEDIA_STORE_NAME)) {
          db.createObjectStore(MEDIA_STORE_NAME, { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Medya deposu acilamadi."));
    });
    return state.mediaDbPromise;
  }

  async function storeMediaFile(file, kind) {
    if (backendBaseUrl() && window.fetch) {
      return uploadMediaFile(file, kind);
    }

    const db = await openMediaDb();
    const id = `${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const record = {
      id,
      kind,
      name: file.name || (kind === "video" ? "Video" : "Görsel"),
      type: file.type || "",
      size: file.size || 0,
      blob: file,
      createdAt: new Date().toISOString()
    };
    await new Promise((resolve, reject) => {
      const tx = db.transaction(MEDIA_STORE_NAME, "readwrite");
      tx.objectStore(MEDIA_STORE_NAME).put(record);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error || new Error("Medya kaydedilemedi."));
    });
    return {
      id,
      src: mediaRef(id),
      name: record.name,
      type: record.type,
      size: record.size,
      kind
    };
  }

  async function uploadMediaFile(file, kind) {
    const result = await backendRequest("/api/media", {
      method: "POST",
      rawBody: file,
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        "X-File-Name": encodeURIComponent(file.name || ""),
        "X-Media-Kind": kind
      }
    });
    const media = result && result.media;
    const src = media && (media.src || media.url);
    if (!src) throw new Error("Backend medya adresi dondurmedi.");
    return {
      id: String(media.id || ""),
      src,
      name: media.name || file.name || (kind === "video" ? "Video" : "Gorsel"),
      type: media.type || file.type || "",
      size: media.size || file.size || 0,
      kind
    };
  }

  function deleteStoredMediaItem(item) {
    const id = item && (item.id || mediaIdFromRef(item.src));
    if (!id) return;
    openMediaDb().then((db) => new Promise((resolve, reject) => {
      const tx = db.transaction(MEDIA_STORE_NAME, "readwrite");
      tx.objectStore(MEDIA_STORE_NAME).delete(id);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error || new Error("Medya silinemedi."));
    })).catch((error) => console.warn("Medya silinemedi.", error));
  }

  function buildMenuBackground(settings) {
    const bg = settings.menuBackground || DEFAULT_SETTINGS.menuBackground;
    if (bg.type === "image" && (bg.imageUrl || bg.image || settings.menuBackgroundImage)) {
      const image = cssUrl(bg.imageUrl || bg.image || settings.menuBackgroundImage);
      if (!image) return settings.bgColor;
      return `linear-gradient(rgba(0,0,0,${bg.overlay}),rgba(0,0,0,${bg.overlay})), url("${image}") center / cover, ${settings.bgColor}`;
    }
    if (bg.type === "gradient") {
      return `linear-gradient(${bg.gradientAngle}deg, ${bg.gradientStart}, ${bg.gradientEnd})`;
    }
    return settings.bgColor;
  }

  function buildBoxStyle(style, fallbackColor) {
    const image = cssUrl(style.imageUrl || style.image || "");
    const type = style.type || (image ? "image" : "gradient");
    const background = type === "image" && image
      ? `linear-gradient(rgba(0,0,0,${style.overlay}),rgba(0,0,0,${style.overlay})), url("${image}") center / cover, ${style.color || fallbackColor}`
      : type === "gradient"
        ? `linear-gradient(${style.gradientAngle}deg, ${style.gradientStart || style.color || fallbackColor}, ${style.gradientEnd || style.color || fallbackColor})`
        : `${style.color || fallbackColor}`;
    return `background:${background};--preview-overlay:${style.overlay}`;
  }

  function pricesFromLegacyProduct(product) {
    const prices = { standard: "", k: "", o: "", b: "", single: "", double: "" };
    const variants = Array.isArray(product && product.variants) ? product.variants : [];
    if (variants.length) {
      variants.forEach((variant) => {
        const label = normalizeText(variant.name || variant.label || "");
        const price = variant.price ?? "";
        if (price === "" || price === null || price === undefined) return;
        if (label.includes("KUCUK") || label === "K") prices.k = price;
        else if (label.includes("ORTA") || label === "O") prices.o = price;
        else if (label.includes("BUYUK") || label === "B") prices.b = price;
        else if (label.includes("SINGLE")) prices.single = price;
        else if (label.includes("DOUBLE")) prices.double = price;
        else if (label.includes("TEK") || label.includes("FINCAN") || label.includes("PORSIYON") || label.includes("ADET")) prices.standard = price;
        else if (variants.length === 1) prices.standard = price;
        else if (!prices.o) prices.o = price;
      });
    } else if (product && (product.price || product.price === 0)) {
      prices.standard = product.price;
    }
    return normalizePrices(prices);
  }

  function normalizeVariants(variants, prices, priceMode) {
    if (priceMode === "standard") {
      return [{ label: "", price: prices.standard }];
    }
    if (priceMode === "singleDouble") {
      return [
        { label: "Single", price: prices.single },
        { label: "Double", price: prices.double }
      ];
    }
    if (Array.isArray(variants) && variants.length) {
      const normalizedVariants = variants.map((variant) => ({
        label: variant.label || variant.name || "",
        price: cleanPrice(variant.price)
      })).filter((variant) => variant.label);
      if (normalizedVariants.length) return normalizedVariants;
    }
    return [
      { label: "K", price: prices.k },
      { label: "O", price: prices.o },
      { label: "B", price: prices.b }
    ];
  }

  function normalizePrices(prices) {
    return {
      standard: cleanPrice(prices && prices.standard),
      k: cleanPrice(prices && prices.k),
      o: cleanPrice(prices && prices.o),
      b: cleanPrice(prices && prices.b),
      single: cleanPrice(prices && prices.single),
      double: cleanPrice(prices && prices.double)
    };
  }

  function normalizePriceMode(product, prices) {
    if (product && product.priceMode === "sizes") return "sizes";
    if (product && product.priceMode === "singleDouble") return "singleDouble";
    if (product && product.priceMode === "standard") return "standard";
    if (hasPrice(prices.standard)) return "standard";
    if (hasPrice(prices.single) || hasPrice(prices.double)) return "singleDouble";
    if (hasPrice(prices.o) && !hasPrice(prices.k) && !hasPrice(prices.b)) return "standard";
    if (hasPrice(prices.k) || hasPrice(prices.o) || hasPrice(prices.b)) return "sizes";
    return "standard";
  }

  function normalizePricesForMode(prices, priceMode) {
    if (priceMode === "standard") {
      return {
        standard: firstFilledPrice(prices.standard, prices.o, prices.k, prices.b, prices.single, prices.double),
        k: "",
        o: "",
        b: "",
        single: "",
        double: ""
      };
    }
    if (priceMode === "singleDouble") {
      return {
        standard: "",
        k: "",
        o: "",
        b: "",
        single: prices.single,
        double: prices.double
      };
    }
    return {
      standard: "",
      k: prices.k,
      o: prices.o,
      b: prices.b,
      single: "",
      double: ""
    };
  }

  function priceSummary(product) {
    if (!product || product.priceMode === "standard") {
      return formatPrice(product && product.prices && product.prices.standard);
    }
    if (product.priceMode === "singleDouble") {
      return `Single ${formatPrice(product.prices.single)} | Double ${formatPrice(product.prices.double)}`;
    }
    return `K ${formatPrice(product.prices.k)} | O ${formatPrice(product.prices.o)} | B ${formatPrice(product.prices.b)}`;
  }

  function firstFilledPrice() {
    return Array.from(arguments).find(hasPrice) ?? "";
  }

  function hasPrice(value) {
    return value !== "" && value !== null && value !== undefined;
  }

  function cleanPrice(value) {
    if (value === null || value === undefined) return "";
    if (typeof value === "number") return Number.isFinite(value) ? value : "";
    const cleaned = String(value).replace(/[^\d.,]/g, "").replace(",", ".").trim();
    if (!cleaned) return "";
    const numberValue = Number(cleaned);
    return Number.isFinite(numberValue) ? numberValue : "";
  }

  function formatPrice(value) {
    if (value === "" || value === null || value === undefined) return "-";
    return `${new Intl.NumberFormat("tr-TR").format(Number(value))}₺`;
  }

  function formatDisplayDate(value) {
    if (!value) return "";
    const date = new Date(`${value}T12:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(date);
  }

  function inferKind(top, sub, product) {
    const text = normalizeText(`${top} ${sub} ${product}`);
    if (/(TATLI|PASTA|WAFFLE|SAN SEBASTIAN|MAGNOLIA|CHEESECAKE|KURABIYE|DONDURMA)/.test(text)) return "dessert";
    if (/(SANDVIC|TOST|YIYECEK|KAHVALTI)/.test(text)) return "food";
    return "drink";
  }

  function inferTemperature(top, sub, product) {
    const text = normalizeText(`${top} ${sub} ${product}`);
    if (/(SOGUK|FROZEN|MILKSHAKE|ICE|BUZLU|LIMONATA|CHURCHILL|SMOOTHIE)/.test(text)) return "cold";
    if (/(SICAK|ESPRESSO|LATTE|CAPPUCCINO|AMERICANO|TURK|CAY|SAHLEP|SALEP|KAHVE)/.test(text)) return "hot";
    return "none";
  }

  function makeId(prefix, value) {
    const slug = normalizeText(`${prefix}-${value}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return slug || Math.random().toString(36).slice(2, 8);
  }

  function normalizeText(text) {
    return String(text || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ı/g, "i")
      .replace(/İ/g, "I")
      .replace(/ç/g, "c")
      .replace(/Ç/g, "C")
      .replace(/ğ/g, "g")
      .replace(/Ğ/g, "G")
      .replace(/ö/g, "o")
      .replace(/Ö/g, "O")
      .replace(/ş/g, "s")
      .replace(/Ş/g, "S")
      .replace(/ü/g, "u")
      .replace(/Ü/g, "U")
      .toUpperCase();
  }

  function toColor(value, fallback) {
    return /^#[0-9a-f]{6}$/i.test(value || "") ? value : fallback;
  }

  function clamp(value, min, max) {
    if (!Number.isFinite(value)) return min;
    return Math.min(max, Math.max(min, value));
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

  function cssUrl(value) {
    return safeMediaUrl(value)
      .replace(/\\/g, "\\\\")
      .replace(/"/g, "\\\"")
      .replace(/[\r\n]/g, "");
  }

  function safeMediaUrl(value) {
    const text = String(value || "").trim();
    if (!isSafeMediaUrl(text)) return "";
    return text;
  }

  function isSafeMediaUrl(value) {
    const text = String(value || "").trim();
    if (!text || /[<>"'\\]/.test(text)) return false;
    if (/^data:image\/(?:png|jpe?g|gif|webp);base64,/i.test(text)) return true;
    if (/^data:video\/[a-z0-9.+-]+;base64,/i.test(text)) return true;
    if (/^data:/i.test(text)) return false;
    if (!/^[a-z][a-z0-9+.-]*:/i.test(text) && !text.startsWith("//")) return true;

    try {
      const url = new URL(text.startsWith("//") ? `https:${text}` : text, window.location.href);
      return ["http:", "https:", "blob:"].includes(url.protocol);
    } catch (error) {
      return false;
    }
  }

  function safeLocalGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return memoryStore[key] || "";
    }
  }

  function safeLocalSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
      memoryStore[key] = value;
      return true;
    } catch (error) {
      memoryStore[key] = value;
      console.warn("Yerel kayıt yapılamadı.", error);
      return false;
    }
  }

  function safeLocalRemove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      delete memoryStore[key];
      return;
    }
    delete memoryStore[key];
  }

  function safeSessionGet(key) {
    try {
      return window.sessionStorage.getItem(key);
    } catch (error) {
      return memoryStore[key] || "";
    }
  }

  function safeSessionSet(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch (error) {
      memoryStore[key] = value;
    }
  }

  function safeSessionRemove(key) {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {}
    delete memoryStore[key];
  }
})();

