(function () {
  "use strict";
  // Developer: Uzeyir | System Key: xandar | Admin panel runtime marker

  const STORAGE_KEY = "tahmisci.menu.state.v1";
  const SITE_STORAGE_KEY = "tahmisci.site.state.v1";
  const FEEDBACK_STORAGE_KEY = "tahmisci.feedback.items.v1";
  const RECIPE_STORAGE_KEY = "tahmisci.recipe.state.v1";
  const LEGACY_RECIPE_STORAGE_KEY = "tahmisRecipeMenuData";
  const BACKEND_URL_KEY = "tahmisci.backend.url";
  const BACKEND_TOKEN_KEY = "tahmisci.backend.panel.token";
  const AUTH_KEY = "tahmisci.panel.auth";
  const PANEL_THEME_KEY = "tahmisci.panel.theme";
  const PANEL_LAYOUT_KEY = "tahmisci.panel.layout";
  const SIDEBAR_STATE_KEY = "tahmisci.admin.sidebar.collapsed.v1";
  const SIDEBAR_BREAKPOINT = window.matchMedia("(max-width: 1180px)");
  const CUSTOM_DEFAULT_KEY = "tahmisci.menu.customDefault.v1";
  const CHANNEL_NAME = "tahmisci-menu-updates";
  const RECIPE_CHANNEL_NAME = "tahmisci-recipe-updates";
  const SITE_CHANNEL_NAME = "tahmisci-site-updates";
  const MEDIA_DB_NAME = "tahmisci.media.v1";
  const MEDIA_STORE_NAME = "files";
  const MEDIA_REF_PREFIX = "media:";
  const SESSION_WARNING_SECONDS = 30;
  const SESSION_EXPIRED_MESSAGE = "Oturum süreniz doldu. Bu işlem kaydedilmedi. Lütfen tekrar giriş yapın.";
  const DESIGN_PRESET_VERSION = "tahmisci-20260522a";
  const SITE_DESIGN_VERSION = "site-20260523a";
  const BRAND_TITLE_FONT = '"Magnolia Script", "Dancing Script", cursive';
  const BRAND_BODY_FONT = '"Tahmisci Poppins", Poppins, Arial, sans-serif';
  const LIGHT_LOGO = "/assets/brand/logo-primary.png";
  const DEFAULT_PRODUCT_IMAGE = "/assets/images/products/product-1.jpg";
  const SECTION_TITLES = {
    overview: "Genel Bakış",
    menu: "Menü düzenleme",
    banner: "BANNER düzenleme",
    category: "Kategori düzenleme",
    product: "Ürün düzenleme",
    bulkPrice: "Toplu fiyat güncelleme",
    menuOutput: "Menü çıktısı",
    recipe: "Reçete Düzenleme",
    site: "Site Düzenleme",
    staffAccess: "Kullanıcı yetkilendirme",
    mudavim: "Müdavimler",
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
  const CATEGORY_ICON_REGISTRY = window.TahmisciCategoryIcons || {
    inferIconKey: () => "default",
    getIconClass: () => "fas fa-tags",
    options: () => [
      { key: "cold", label: "Soğuklar", mark: "❄" },
      { key: "hot", label: "Sıcaklar", mark: "♨" },
      { key: "dessert", label: "Tatlı & Sandwich", mark: "✦" }
    ]
  };
  const DEFAULT_HEADER_NAVIGATION = [
    { id: "home", label: { tr: "Ana Sayfa", en: "Home" }, url: "#top", icon: "fas fa-house", visible: true, order: 0 },
    { id: "menu", label: { tr: "Menü", en: "Menu" }, url: "#menu", icon: "fas fa-utensils", visible: true, order: 1 },
    { id: "about", label: { tr: "Hakkımızda", en: "About" }, url: "#about", icon: "fas fa-mug-hot", visible: true, order: 2 },
    { id: "contact", label: { tr: "İletişim", en: "Contact" }, url: "#contact", icon: "fas fa-phone", visible: true, order: 3 }
  ];
  const MUDAVIM_CUSTOMERS = [
    {
      id: "mud-1001",
      name: "Elif Yılmaz",
      contact: "elif@example.com",
      level: "Gold",
      code: "THM-4821",
      totalVisits: 26,
      cycleVisits: 6,
      rewardsEarned: 2,
      rewardStatus: "active",
      lastVisit: "2026-07-16",
      note: "Gold müdavim. Dört ziyaret sonra yeni tatlı hakkı açılacak.",
      activeRewards: [],
      visits: [
        { date: "2026-07-16", type: "Ziyaret", change: "+1 ziyaret", note: "Latte" },
        { date: "2026-07-10", type: "Ziyaret", change: "+1 ziyaret", note: "Mango frozen" },
        { date: "2026-06-28", type: "Ödül kullanımı", change: "Tatlı hakkı kullanıldı", note: "Limonlu cheesecake" }
      ]
    },
    {
      id: "mud-1002",
      name: "Mehmet Kaya",
      contact: "0555 120 35 80",
      level: "Silver",
      code: "THM-7390",
      totalVisits: 20,
      cycleVisits: 10,
      rewardsEarned: 1,
      rewardStatus: "ready",
      lastVisit: "2026-07-15",
      note: "Ödül hazır. Kasada tatlı hakkı kullandırılabilir.",
      activeRewards: ["Tatlı hakkı"],
      visits: [
        { date: "2026-07-15", type: "Ziyaret", change: "+1 ziyaret", note: "Americano" },
        { date: "2026-07-12", type: "Ödül", change: "Ödül hazır", note: "10. içecek tamamlandı" }
      ]
    },
    {
      id: "mud-1003",
      name: "Ayşe Demir",
      contact: "ayse@example.com",
      level: "Yeni",
      code: "THM-1042",
      totalVisits: 1,
      cycleVisits: 1,
      rewardsEarned: 0,
      rewardStatus: "new",
      lastVisit: "2026-07-12",
      note: "Yeni kayıt. İlk ziyaret işlendi.",
      activeRewards: [],
      visits: [
        { date: "2026-07-12", type: "Yeni kayıt", change: "+1 ziyaret", note: "Müdavim kaydı oluşturuldu" }
      ]
    },
    {
      id: "mud-1004",
      name: "Burak Çelik",
      contact: "burak@example.com",
      level: "Gold",
      code: "THM-6628",
      totalVisits: 31,
      cycleVisits: 3,
      rewardsEarned: 2,
      rewardStatus: "used",
      lastVisit: "2026-07-09",
      note: "Son ödülünü kullandı. Yeni döngü devam ediyor.",
      activeRewards: [],
      visits: [
        { date: "2026-07-09", type: "Ödül kullanımı", change: "Tatlı hakkı kullanıldı", note: "Brownie" },
        { date: "2026-07-07", type: "Ziyaret", change: "+1 ziyaret", note: "Espresso" }
      ]
    },
    {
      id: "mud-1005",
      name: "Zeynep Arslan",
      contact: "zeynep@example.com",
      level: "Silver",
      code: "THM-3157",
      totalVisits: 18,
      cycleVisits: 8,
      rewardsEarned: 1,
      rewardStatus: "active",
      lastVisit: "2026-07-17",
      note: "2 ziyaret kaldı. Soğuk içecekleri tercih ediyor.",
      activeRewards: [],
      visits: [
        { date: "2026-07-17", type: "Ziyaret", change: "+1 ziyaret", note: "Cold brew" },
        { date: "2026-07-11", type: "Ziyaret", change: "+1 ziyaret", note: "Latte" }
      ]
    }
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


  const MENU_OUTPUT_ICON_OPTIONS = [
    ["", "İkon yok", ""],
    ["coffee", "Kahve bardağı", "☕"],
    ["bean", "Kahve çekirdeği", "◖"],
    ["leaf", "Yaprak", "❧"],
    ["ice", "Buz", "❄"],
    ["milk", "Süt", "▣"],
    ["syrup", "Şurup", "◎"],
    ["espresso", "Espresso", "▥"],
    ["cold", "Cold drink", "◌"],
    ["hot", "Hot drink", "♨"],
    ["dessert", "Tatlı", "✦"],
    ["shot", "Ekstra shot", "+"],
    ["herbal", "Bitkisel süt", "◇"],
    ["tea", "Çay", "◍"],
    ["lemon", "Limon", "●"],
    ["fruit", "Meyve", "●"],
    ["frozen", "Kar tanesi", "❆"],
    ["star", "Yıldız", "★"],
    ["flame", "Ateş", "▲"],
    ["drop", "Damla", "♦"],
    ["mug", "Kupa", "▢"],
    ["shaker", "Shaker", "⌁"],
    ["blender", "Blender", "◫"],
    ["milkshake", "Milkshake", "◉"],
    ["matcha", "Matcha", "✳"],
    ["filter", "Filtre kahve", "∿"],
    ["brew", "Demleme", "◎"],
    ["campaign", "Kampanya", "%"],
    ["special", "Özel ürün", "◆"],
    ["line", "Dekoratif çizgi", "━"],
    ["spark", "Parıltı", "✶"],
    ["waves", "Dalga", "≋"],
    ["figure", "Tahmisçi figür", "♙"]
  ];

  const MENU_OUTPUT_FRAME_OPTIONS = [
    ["none", "Çerçeve yok"],
    ["thin", "Düz ince çizgi"],
    ["leaf", "Yaprak desenli"],
    ["bean", "Kahve çekirdeği desenli"],
    ["corner", "Köşe süslemeli"],
    ["shadow", "Sade gölge"]
  ];

  const DEFAULT_MENU_OUTPUT = {
    templateName: "Tahmisçi TV Menü",
    currentTemplateId: "",
    defaultTemplateId: "",
    canvaLink: "https://canva.link/srve7kbdqy27mfc",
    gridEnabled: true,
    safeAreaEnabled: true,
    settings: {
      bgColor: "#fffff0",
      boxColor: "#2c1609",
      textColor: "#e9f6ff",
      titleFont: BRAND_BODY_FONT,
      bodyFont: BRAND_BODY_FONT,
      priceFont: BRAND_BODY_FONT,
      productSize: 28,
      rowGap: 34,
      dateText: ""
    },
    sections: [],
    templates: []
  };
  const MENU_OUTPUT_WIDTH = 1080;
  const MENU_OUTPUT_HEIGHT = 1920;
  const MENU_OUTPUT_MIN_ZOOM = 0.15;
  const MENU_OUTPUT_MAX_ZOOM = 1.5;
  const MENU_OUTPUT_SNAP = 8;
  const MENU_OUTPUT_SAFE_X = 54;
  const MENU_OUTPUT_SAFE_Y = 96;
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
    heroImageUrl: "/assets/brand/logo-primary.png",
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
    heroImageUrl: "/assets/brand/logo-green-compact.png"
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
    recipeCatalog: [],
    recipeLinkReview: [],
    site: null,
    siteRevisions: [],
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
    renderTimer: null,
    bulkPriceSelectedIds: new Set(),
    bulkPriceMessage: "",
    recipeAccess: {
      users: [],
      assignments: [],
      activity: []
    },
    selectedStaffUserId: "",
    staffUserFilter: "active",
    staffActivityTab: "login",
    staffMessage: "",
    mudavimSearch: "",
    mudavimLevelFilter: "all",
    mudavimRewardFilter: "all",
    selectedMudavimAnnouncementId: "",
    selectedMudavimCustomerId: "mud-1001",
    selectedMenuOutputSectionId: "",
    menuOutputZoom: 0,
    menuOutputControlTab: "sections",
    menuOutputGuides: { x: null, y: null },
    menuOutputFullscreen: false,
    menuOutputNoticeTimer: null,
    productImportFile: null,
    productImportReport: null,
    recipeImportFile: null,
    recipeImportReport: null,
    session: {
      expiresAt: 0,
      warningTimer: null,
      expiryTimer: null,
      warningShown: false,
      expired: false,
      refreshing: false
    }
  };

  const els = {};

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    cacheElements();
    populateFontSelects();
    applyPanelTheme();
    applyPanelLayout();
    bindLogin();

    if (await verifyBackendSession()) {
      safeSessionSet(AUTH_KEY, "ok");
      showPanel();
    } else {
      safeSessionRemove(AUTH_KEY);
      safeSessionRemove(BACKEND_TOKEN_KEY);
    }
  }

  function cacheElements() {
    const ids = [
      "loginScreen", "loginForm", "passwordInput", "loginError", "panelShell", "miniStats",
      "sessionWarningModal", "sessionWarningText", "sessionRefreshButton", "sessionLogoutButton",
      "sidebarPanel", "sidebarToggle", "settingsToggle", "settingsMenu", "workspaceTitle",
      "overviewGrid", "contentGrid", "categoryList", "productList", "saveState", "saveChangesButton", "panelThemeToggle", "addCategoryButton",
      "bulkPriceCategory", "bulkPriceSearch", "bulkPriceProductList", "bulkPriceSelectVisible", "bulkPriceClearSelection",
      "bulkPriceSelectedCount", "bulkPriceValueLabel", "bulkPriceValue", "bulkPriceSummary", "bulkPriceApply",
      "menuOutputCard", "menuOutputTemplateName", "menuOutputCanvaLink", "menuOutputOpenCanva", "menuOutputSaveTemplate",
      "menuOutputUpdateTemplate", "menuOutputDuplicateTemplate", "menuOutputDeleteTemplate", "menuOutputSetDefaultTemplate",
      "menuOutputTemplateList", "menuOutputReset", "menuOutputExportPng", "menuOutputExportJpg", "menuOutputExportPdf",
      "menuOutputBgColor", "menuOutputBoxColor", "menuOutputTextColor", "menuOutputTitleFont", "menuOutputBodyFont",
      "menuOutputPriceFont", "menuOutputProductSize", "menuOutputRowGap", "menuOutputDate", "menuOutputSectionTitle",
      "menuOutputSectionType", "menuOutputSectionMode", "menuOutputSectionCategory", "menuOutputAddSection",
      "menuOutputSectionList", "menuOutputLayerList", "menuOutputControlTabs", "menuOutputQualityPanel",
      "menuOutputPreview", "menuOutputStatus", "menuOutputPreviewStage", "menuOutputCanvasShell",
      "menuOutputZoomOut", "menuOutputZoomIn", "menuOutputZoomValue", "menuOutputFitPreview", "menuOutputZoomActual",
      "menuOutputGridToggle", "menuOutputSafeAreaToggle", "menuOutputFullscreen",
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
      "menuSummaryTheme", "menuSummaryThemeText", "menuSummaryDark", "menuSummaryAccent",
      "menuSummaryAccentText", "menuSummaryText", "menuSummaryCard", "menuSummaryStatus",
      "menuOverlayValue", "popularOverlayValue", "suggestOverlayValue",
      "menuPreviewUpdated", "menuPreviewStatus",
      "bannerVideoUrl", "bannerVideoFile", "clearBannerVideo", "bannerVideoList",
      "bannerImageFile", "clearBannerImages", "bannerImageList", "bannerImages", "bannerProductCategory",
      "bannerProductSearch", "bannerProductList", "categoryEditorTitle", "deleteCategoryButton", "categoryName",
      "categoryActive", "categoryIconKey", "categoryStyleType", "categoryColor", "categoryGradientStart", "categoryGradientEnd",
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
      "productAllergens", "productIngredients", "productContentMode", "productRecipeId", "productRecipeSize",
      "productRecipeLinkStatus", "productExcelFile", "productExcelImportButton",
      "productImportSummary", "productImportReport", "productImportStats", "productImportChanges",
      "productImportErrors", "productImportShowErrorsButton", "recipeCategorySelect", "recipeProductSelect",
      "recipeExcelFile", "recipeExcelImportButton", "recipeImportSummary", "recipeImportReport", "recipeImportStats",
      "recipeImportChanges", "recipeImportErrors",
      "addRecipeCategoryButton", "addRecipeProductButton", "addRecipeSizeButton", "deleteRecipeCategoryButton",
      "deleteRecipeProductButton", "recipeCategoryName", "recipeProductName", "recipeSizeList",
      "staffRefreshButton", "staffUserName", "staffUsername", "staffPassword", "staffUserActive",
      "staffUserSaveButton", "staffUserResetButton", "staffUserMessage", "staffUserList", "staffUserCount", "staffUserFilter",
      "staffAssignmentUser", "staffAssignmentKind", "staffScopeType", "staffAssignmentCategory",
      "staffAssignmentProduct", "staffAssignmentSize", "staffQuestionCount", "staffPassingScore",
      "staffDifficulty", "staffProductPicker", "staffAdminNote", "staffAssignmentCreateButton", "staffAssignmentMessage",
      "staffAssignmentSummary", "staffAssignmentList", "staffAssignmentCount", "staffAssignmentDetail",
      "staffActivityTabs", "staffActivityList", "staffActivityCount",
      "mudavimStats", "mudavimSearch", "mudavimLevelFilter", "mudavimRewardFilter", "mudavimCustomerList",
      "mudavimCustomerDetail", "mudavimRewardRules", "mudavimCampaigns", "mudavimSettings",
      "mudavimAnnouncementList", "mudavimAnnouncementEditor", "mudavimAnnouncementPreview", "addMudavimAnnouncementButton", "publishMudavimAnnouncementsButton",
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
      "siteTitleSize", "siteBodySize", "siteSectionOrder", "siteRevisionRefresh", "siteRevisionList",
      "previewKicker", "previewTitle", "livePreview", "menuPreviewMobile", "menuPreviewDesktop",
      "menuPreviewLight", "menuPreviewDark"
    ];
    ids.forEach((id) => {
      els[id] = document.getElementById(id);
    });
  }

  function populateFontSelects() {
    ["titleFont", "categoryFont", "productFont", "siteTitleFont", "siteBodyFont", "menuOutputTitleFont", "menuOutputBodyFont", "menuOutputPriceFont"].forEach((id) => {
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
      const backendLogin = await loginBackend(password);
      if (backendLogin.ok) {
        safeSessionSet(AUTH_KEY, "ok");
        els.loginError.hidden = true;
        showPanel();
      } else {
        els.loginError.textContent = backendLogin.message || (backendBaseUrl()
          ? "Şifre hatalı veya oturum açılamadı."
          : "Backend adresi tanımlı değil. Panel için backend bağlantısı gerekli.");
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
      setSidebarCollapsed(
        window.matchMedia("(max-width: 1180px)").matches || safeLocalGet(SIDEBAR_STATE_KEY) === "1"
      );
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
      await hydrateRecipeAccessFromBackend();
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
    if (typeof SIDEBAR_BREAKPOINT.addEventListener === "function") {
      SIDEBAR_BREAKPOINT.addEventListener("change", syncSidebarForViewport);
    } else if (typeof SIDEBAR_BREAKPOINT.addListener === "function") {
      SIDEBAR_BREAKPOINT.addListener(syncSidebarForViewport);
    }
    if (els.settingsToggle && els.settingsMenu) {
      els.settingsToggle.addEventListener("click", toggleSettingsMenu);
      document.addEventListener("click", handleDocumentClick);
    }
    if (els.sessionRefreshButton) els.sessionRefreshButton.addEventListener("click", refreshAdminSession);
    if (els.sessionLogoutButton) els.sessionLogoutButton.addEventListener("click", logoutAdminSession);
    document.querySelector(".panel-nav").addEventListener("click", handlePanelNavClick);
    if (els.overviewGrid) els.overviewGrid.addEventListener("click", handleOverviewAction);
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
    els.bulkPriceCategory.addEventListener("change", () => {
      state.bulkPriceMessage = "";
      renderBulkPriceProductList();
      updateBulkPriceControls();
    });
    els.bulkPriceSearch.addEventListener("input", () => {
      state.bulkPriceMessage = "";
      renderBulkPriceProductList();
      updateBulkPriceControls();
    });
    els.bulkPriceProductList.addEventListener("change", handleBulkPriceProductSelection);
    els.bulkPriceSelectVisible.addEventListener("click", selectVisibleBulkPriceProducts);
    els.bulkPriceClearSelection.addEventListener("click", clearBulkPriceSelection);
    els.bulkPriceValue.addEventListener("input", () => {
      state.bulkPriceMessage = "";
      updateBulkPriceControls();
    });
    document.querySelectorAll("input[name='bulkPriceMode'], input[name='bulkPriceDirection']").forEach((input) => {
      input.addEventListener("change", () => {
        state.bulkPriceMessage = "";
        updateBulkPriceControls();
      });
    });
    els.bulkPriceApply.addEventListener("click", applyBulkPriceUpdate);
    bindMenuOutputEvents();
    bindProductImportEvents();
    bindRecipeImportEvents();
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
    ensureMenuPreviewResizeObserver();
    [els.menuPreviewMobile, els.menuPreviewDesktop, els.menuPreviewLight, els.menuPreviewDark].forEach((control) => {
      if (control) control.addEventListener("change", queueMenuPreviewScale);
    });
    window.addEventListener("resize", queueMenuPreviewScale, { passive: true });
    els.feedbackTabs.addEventListener("click", handleFeedbackTabs);
    els.refreshFeedbackButton.addEventListener("click", refreshFeedbackInbox);
    if (els.clearFeedbackButton) els.clearFeedbackButton.addEventListener("click", clearFeedbackItems);
    if (els.mudavimSearch) {
      els.mudavimSearch.addEventListener("input", () => {
        state.mudavimSearch = els.mudavimSearch.value.trim();
        renderMudavimPanel();
      });
    }
    if (els.mudavimLevelFilter) {
      els.mudavimLevelFilter.addEventListener("change", () => {
        state.mudavimLevelFilter = els.mudavimLevelFilter.value || "all";
        renderMudavimPanel();
      });
    }
    if (els.mudavimRewardFilter) {
      els.mudavimRewardFilter.addEventListener("change", () => {
        state.mudavimRewardFilter = els.mudavimRewardFilter.value || "all";
        renderMudavimPanel();
      });
    }
    if (els.mudavimCustomerList) {
      els.mudavimCustomerList.addEventListener("click", (event) => {
        const row = event.target.closest("[data-mudavim-customer-id]");
        if (!row) return;
        state.selectedMudavimCustomerId = row.dataset.mudavimCustomerId;
        renderMudavimPanel();
      });
    }
    if (els.mudavimCustomerDetail) {
      els.mudavimCustomerDetail.addEventListener("click", handleMudavimDetailAction);
    }
    if (els.addMudavimAnnouncementButton) {
      els.addMudavimAnnouncementButton.addEventListener("click", addMudavimAnnouncement);
    }
    if (els.publishMudavimAnnouncementsButton) {
      els.publishMudavimAnnouncementsButton.addEventListener("click", savePendingChanges);
    }
    if (els.mudavimAnnouncementList) {
      els.mudavimAnnouncementList.addEventListener("click", handleMudavimAnnouncementListClick);
    }
    if (els.mudavimAnnouncementEditor) {
      els.mudavimAnnouncementEditor.addEventListener("input", handleMudavimAnnouncementEditorInput);
      els.mudavimAnnouncementEditor.addEventListener("change", handleMudavimAnnouncementEditorChange);
      els.mudavimAnnouncementEditor.addEventListener("click", handleMudavimAnnouncementEditorClick);
    }
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
    if (els.staffRefreshButton) els.staffRefreshButton.addEventListener("click", hydrateRecipeAccessFromBackend);
    if (els.staffUserSaveButton) els.staffUserSaveButton.addEventListener("click", saveStaffUser);
    if (els.staffUserResetButton) els.staffUserResetButton.addEventListener("click", resetStaffUserForm);
    if (els.staffUserList) els.staffUserList.addEventListener("click", handleStaffUserListClick);
    if (els.staffUserFilter) els.staffUserFilter.addEventListener("click", handleStaffUserFilterClick);
    if (els.staffAssignmentCategory) els.staffAssignmentCategory.addEventListener("change", () => {
      renderStaffAssignmentOptions();
    });
    if (els.staffAssignmentProduct) els.staffAssignmentProduct.addEventListener("change", () => {
      renderStaffAssignmentSizeOptions();
    });
    if (els.staffAssignmentKind) els.staffAssignmentKind.addEventListener("change", updateStaffAssignmentControls);
    if (els.staffScopeType) els.staffScopeType.addEventListener("change", updateStaffAssignmentControls);
    if (els.staffProductPicker) els.staffProductPicker.addEventListener("change", () => {
      if (els.staffAssignmentMessage) els.staffAssignmentMessage.textContent = "";
    });
    if (els.staffAssignmentCreateButton) els.staffAssignmentCreateButton.addEventListener("click", createStaffAssignment);
    if (els.staffAssignmentList) els.staffAssignmentList.addEventListener("click", handleStaffAssignmentListClick);
    if (els.staffActivityTabs) els.staffActivityTabs.addEventListener("click", handleStaffActivityTabClick);

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

    document.querySelectorAll("[data-site-path]").forEach((input) => {
      input.addEventListener("input", handleSiteEditorInput);
      input.addEventListener("change", handleSiteEditorInput);
    });
    document.querySelectorAll("[data-site-upload-target]").forEach((input) => {
      input.addEventListener("change", handleSiteMediaUpload);
    });
    if (els.siteSectionOrder) els.siteSectionOrder.addEventListener("change", handleSiteSectionOrder);
    if (els.siteRevisionRefresh) els.siteRevisionRefresh.addEventListener("click", loadSiteRevisions);
    if (els.siteRevisionList) els.siteRevisionList.addEventListener("click", handleSiteRevisionRestore);
    window.addEventListener("beforeunload", (event) => {
      if (!hasPendingChanges()) return;
      event.preventDefault();
      event.returnValue = "";
    });

    [
      "categoryName", "categoryActive", "categoryIconKey", "categoryStyleType", "categoryColor", "categoryGradientStart",
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
      "productIngredients", "productContentMode", "productRecipeId", "productRecipeSize"
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
    safeLocalSet(SIDEBAR_STATE_KEY, collapsed ? "1" : "0");
    els.sidebarToggle.setAttribute("aria-expanded", String(!collapsed));
    els.sidebarToggle.setAttribute("aria-label", collapsed ? "Panel menüsünü aç" : "Panel menüsünü kapat");
  }

  function setSidebarCollapsed(collapsed) {
    els.panelShell.classList.toggle("is-sidebar-collapsed", Boolean(collapsed));
    els.sidebarToggle.setAttribute("aria-expanded", String(!collapsed));
    els.sidebarToggle.setAttribute("aria-label", collapsed ? "Panel menüsünü aç" : "Panel menüsünü kapat");
  }

  function syncSidebarForViewport(event) {
    setSidebarCollapsed(event.matches || safeLocalGet(SIDEBAR_STATE_KEY) === "1");
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

  function handleOverviewAction(event) {
    const target = event.target.closest("[data-overview-section]");
    if (!target) return;
    event.preventDefault();
    setActiveSection(target.dataset.overviewSection, {
      collapseSidebar: window.matchMedia("(max-width: 1180px)").matches
    });
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
    if (!baseUrl || !window.fetch) throw new Error("Backend adresi tanımlı değil.");

    const method = String(options && options.method || "GET").toUpperCase();
    if (shouldBlockForExpiredSession(path, method, options)) {
      handleSessionEnded(SESSION_EXPIRED_MESSAGE);
      throw new Error(SESSION_EXPIRED_MESSAGE);
    }

    const rawBody = options && Object.prototype.hasOwnProperty.call(options, "rawBody") ? options.rawBody : null;
    const headers = Object.assign(rawBody ? {} : { "Content-Type": "application/json" }, options && options.headers);
    const token = options && options.skipToken ? "" : safeSessionGet(BACKEND_TOKEN_KEY);
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      credentials: "include",
      body: rawBody || (options && options.body ? JSON.stringify(options.body) : undefined)
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.ok === false) {
      if ((response.status === 401 || response.status === 403) && !(options && options.skipAuthFailure)) {
        handleSessionEnded(result.message || SESSION_EXPIRED_MESSAGE);
      }
      throw new Error(result.message || "Backend isteği başarısız.");
    }

    updateSessionFromResponse(result);
    return result;
  }

  function shouldBlockForExpiredSession(path, method, options) {
    if (options && options.skipSessionPrecheck) return false;
    if (["GET", "HEAD", "OPTIONS"].includes(method)) return false;
    if (path === "/api/admin/login" || path === "/api/admin/logout" || path === "/api/admin/session/refresh") return false;
    return Boolean(state.session.expiresAt && Date.now() >= state.session.expiresAt);
  }

  function updateSessionFromResponse(result) {
    const expiresAt = sessionExpiryMs(result);
    if (!expiresAt) return;

    state.session.expiresAt = expiresAt;
    state.session.expired = false;
    state.session.warningShown = false;
    scheduleSessionTimers();
  }

  function sessionExpiryMs(result) {
    if (!result || typeof result !== "object") return 0;
    if (result.expiresAt) {
      const parsed = Date.parse(result.expiresAt);
      if (Number.isFinite(parsed) && parsed > Date.now()) return parsed;
    }
    const ttlSeconds = Number(result.ttlSeconds || result.expiresInSeconds || 0);
    if (Number.isFinite(ttlSeconds) && ttlSeconds > 0) {
      return Date.now() + ttlSeconds * 1000;
    }
    return 0;
  }

  function scheduleSessionTimers() {
    window.clearTimeout(state.session.warningTimer);
    window.clearTimeout(state.session.expiryTimer);

    const expiresAt = Number(state.session.expiresAt || 0);
    if (!expiresAt) return;

    const warningDelay = Math.max(0, expiresAt - Date.now() - SESSION_WARNING_SECONDS * 1000);
    const expiryDelay = Math.max(0, expiresAt - Date.now());
    state.session.warningTimer = window.setTimeout(showSessionWarning, warningDelay);
    state.session.expiryTimer = window.setTimeout(() => {
      handleSessionEnded(SESSION_EXPIRED_MESSAGE);
    }, expiryDelay);
  }

  function showSessionWarning() {
    if (state.session.expired || state.session.warningShown) return;
    state.session.warningShown = true;
    if (els.sessionWarningText) {
      els.sessionWarningText.textContent = "Oturumunuz 30 saniye içinde sona erecek. Devam etmek için oturumu yenileyin.";
    }
    if (els.sessionWarningModal) els.sessionWarningModal.hidden = false;
  }

  function hideSessionWarning() {
    if (els.sessionWarningModal) els.sessionWarningModal.hidden = true;
  }

  async function refreshAdminSession() {
    if (state.session.refreshing) return;
    state.session.refreshing = true;
    if (els.sessionRefreshButton) {
      els.sessionRefreshButton.disabled = true;
      els.sessionRefreshButton.textContent = "Yenileniyor...";
    }

    try {
      const result = await backendRequest("/api/admin/session/refresh", {
        method: "POST",
        skipSessionPrecheck: true
      });
      if (result && result.token) safeSessionSet(BACKEND_TOKEN_KEY, result.token);
      updateSessionFromResponse(result);
      hideSessionWarning();
      updateSaveControls("Oturum yenilendi");
      window.setTimeout(() => updateSaveControls(), 1200);
    } catch (error) {
      handleSessionEnded(error.message || SESSION_EXPIRED_MESSAGE);
    } finally {
      state.session.refreshing = false;
      if (els.sessionRefreshButton) {
        els.sessionRefreshButton.disabled = false;
        els.sessionRefreshButton.textContent = "Oturumu Yenile";
      }
    }
  }

  async function logoutAdminSession() {
    try {
      await backendRequest("/api/admin/logout", {
        method: "POST",
        skipSessionPrecheck: true,
        skipAuthFailure: true
      });
    } catch (_error) {}
    handleSessionEnded("Oturum kapatildi.");
  }

  function handleSessionEnded(message) {
    state.session.expired = true;
    state.session.expiresAt = 0;
    window.clearTimeout(state.session.warningTimer);
    window.clearTimeout(state.session.expiryTimer);
    hideSessionWarning();
    closeBackendEvents();
    safeSessionRemove(AUTH_KEY);
    safeSessionRemove(BACKEND_TOKEN_KEY);
    state.saving = false;
    if (els.panelShell) {
      els.panelShell.hidden = true;
      els.panelShell.style.display = "none";
    }
    if (els.loginScreen) {
      els.loginScreen.hidden = false;
      els.loginScreen.style.display = "grid";
    }
    if (els.loginError) {
      els.loginError.textContent = message || SESSION_EXPIRED_MESSAGE;
      els.loginError.hidden = false;
    }
    if (els.passwordInput) {
      els.passwordInput.value = "";
      window.setTimeout(() => els.passwordInput.focus(), 60);
    }
    updateSaveControls(message || SESSION_EXPIRED_MESSAGE);
  }

  function closeBackendEvents() {
    ["menuEventSource", "recipeEventSource", "siteEventSource", "feedbackEventSource"].forEach((key) => {
      if (!state[key]) return;
      try {
        state[key].close();
      } catch (_error) {}
      state[key] = null;
    });
  }

  async function loginBackend(password) {
    if (!backendBaseUrl()) return { ok: false };
    try {
      const result = await backendRequest("/api/admin/login", {
        method: "POST",
        skipToken: true,
        body: { password }
      });
      if (result && result.token) safeSessionSet(BACKEND_TOKEN_KEY, result.token);
      updateSessionFromResponse(result);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.message || "" };
    }
  }

  async function verifyBackendSession() {
    if (!backendBaseUrl()) return false;

    try {
      const result = await backendRequest("/api/admin/me");
      updateSessionFromResponse(result);
      return true;
    } catch (error) {
      return false;
    }
  }

  async function hydrateFromBackend() {
    if (!backendBaseUrl()) return;

    const [menuResult, recipeResult, siteResult] = await Promise.allSettled([
      backendRequest("/api/menu", { skipToken: true }),
      backendRequest("/api/recipes"),
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
        state.recipeCatalog = normalizeRecipeCatalog(recipeResult.value.recipeCatalog);
        state.recipeLinkReview = Array.isArray(recipeResult.value.recipeLinkReview) ? recipeResult.value.recipeLinkReview : [];
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

  async function hydrateRecipeAccessFromBackend() {
    if (!backendBaseUrl()) return;
    try {
      const result = await backendRequest("/api/admin/recipe-access");
      state.recipeAccess = normalizeRecipeAccess(result);
      renderStaffAccess();
      updateSaveControls("Kullanıcı yetkileri güncel");
      window.clearTimeout(hydrateRecipeAccessFromBackend.timer);
      hydrateRecipeAccessFromBackend.timer = window.setTimeout(updateSaveControls, 1200);
    } catch (error) {
      state.staffMessage = error.message || "Kullanıcı yetkileri alınamadı";
      renderStaffAccess();
    }
  }

  function normalizeRecipeAccess(result) {
    return {
      users: Array.isArray(result && result.users) ? result.users : [],
      assignments: Array.isArray(result && result.assignments) ? result.assignments : [],
      activity: Array.isArray(result && result.activity) ? result.activity : []
    };
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
          state.recipeCatalog = normalizeRecipeCatalog(payload.recipeCatalog);
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

    // Geri bildirimler paneldeki Yenile düğmesiyle alınır. Ayrı bir uzun ömürlü
    // bağlantı açmamak, HTTP/1.1 altında kayıt istekleri için bağlantı bırakır.
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
      els.saveChangesButton.textContent = state.saving ? "Kaydediliyor..." : "Kaydet ve Yayınla";
    }
    if (els.saveState) {
      els.saveState.textContent = message || (pending ? "Kaydedilmedi" : "Hazır");
    }
    if (els.menuPreviewStatus) {
      const previewMessage = state.saving ? "Kaydediliyor" : pending ? "Kaydedilmedi" : "Güncel";
      els.menuPreviewStatus.textContent = previewMessage;
      const statusPill = els.menuPreviewStatus.closest(".menu-preview-live-state");
      if (statusPill) statusPill.classList.toggle("is-pending", pending || state.saving);
    }
    if (els.menuSummaryStatus) {
      els.menuSummaryStatus.textContent = state.saving ? "Kaydediliyor" : pending ? "Taslak" : "Hazır";
      const summaryStatus = els.menuSummaryStatus.closest(".menu-summary-status");
      if (summaryStatus) summaryStatus.classList.toggle("is-pending", pending || state.saving);
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
    if (state.activeSection === "site") {
      handleSiteSectionOrder();
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
      updateSaveControls("Değişiklik yok");
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
      console.error("Kaydetme başarısız:", error);
      state.saving = false;
      updateSaveControls("Kaydetme başarısız");
      alert(`Kaydetme başarısız. ${error.message || "Backend bağlantısını ve oturumu kontrol edin."}`);
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
    const result = await backendRequest("/api/recipes", {
      method: "PUT",
      body: { recipeState: state.recipes, recipeCatalog: state.recipeCatalog }
    });
    state.recipeCatalog = normalizeRecipeCatalog(result.recipeCatalog);
    state.recipeLinkReview = Array.isArray(result.recipeLinkReview) ? result.recipeLinkReview : state.recipeLinkReview;
  }

  async function saveSiteToBackend() {
    const result = await backendRequest("/api/site", {
      method: "PUT",
      body: { siteState: state.site }
    });
    if (result.siteState) state.site = normalizeSiteSettings(result.siteState);
    await loadSiteRevisions();
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
          normalized[categoryName][productName][sizeName] = normalizeRecipeItem(sizes[sizeName]);
        });
      });
    });
    return normalized;
  }

  function normalizeRecipeCatalog(raw) {
    return Array.isArray(raw) ? raw.map((item) => ({
      id: String(item && item.id || ""),
      category: String(item && item.category || ""),
      product: String(item && item.product || ""),
      createdAt: String(item && item.createdAt || ""),
      updatedAt: String(item && item.updatedAt || "")
    })).filter((item) => item.id && item.category && item.product) : [];
  }

  function normalizeRecipeItem(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return {
        content: String(value.content ?? value.recipe ?? value.ingredients ?? ""),
        preparation: String(value.preparation ?? value.method ?? value.steps ?? value.description ?? ""),
        note: String(value.note ?? value.productNote ?? ""),
        active: value.active !== false && String(value.active || "").toLowerCase() !== "false",
        order: Number.isFinite(Number(value.order)) ? Number(value.order) : 0
      };
    }

    return {
      content: String(value ?? ""),
      preparation: "",
      note: "",
      active: true,
      order: 0
    };
  }

  function recipeContent(value) {
    return normalizeRecipeItem(value).content;
  }

  function recipePreparation(value) {
    return normalizeRecipeItem(value).preparation;
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
    settings.menuOutput = normalizeMenuOutput(settings.menuOutput);
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
      iconKey: normalizeCategoryIconKey(category.iconKey || category.icon, category.name),
      icon: CATEGORY_ICON_REGISTRY.getIconClass(normalizeCategoryIconKey(category.iconKey || category.icon, category.name)),
      color: style.color,
      image: style.image,
      style,
      products: Array.isArray(category.products)
        ? category.products.map((product, productIndex) => normalizeProduct(product, id, productIndex)).filter(Boolean)
        : []
    };
  }

  function normalizeCategoryIconKey(value, categoryName) {
    const key = String(value || "").trim();
    const allowed = CATEGORY_ICON_REGISTRY.options().some((item) => item.key === key);
    return allowed ? key : CATEGORY_ICON_REGISTRY.inferIconKey(categoryName);
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
      contentMode: ["recipe", "manual", "hidden", "not-required"].includes(product.contentMode) ? product.contentMode : "manual",
      recipeId: String(product.recipeId || ""),
      recipeSize: String(product.recipeSize || ""),
      manualContent: String(product.manualContent || product.details && product.details.ingredients || product.ingredients || ""),
      recipeLinkStatus: String(product.recipeLinkStatus || (product.recipeId ? "linked" : "unmatched")),
      order: Number.isFinite(Number(product.order)) ? Number(product.order) : index,
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
    if (Number(source.schemaVersion || 0) >= 2) return normalizeModernSiteSettings(cloneData(source));
    return migrateSiteSettings(Object.assign({}, DEFAULT_SITE_SETTINGS, source, {
      socialLinks: normalizeSocialLinks(source.socialLinks || DEFAULT_SITE_SETTINGS.socialLinks),
      titleSize: clamp(Number(source.titleSize || DEFAULT_SITE_SETTINGS.titleSize), 34, 92),
      bodySize: clamp(Number(source.bodySize || DEFAULT_SITE_SETTINGS.bodySize), 13, 22)
    }));
  }

  function normalizeModernSiteSettings(site) {
    const next = site && typeof site === "object" ? site : {};
    next.header = next.header && typeof next.header === "object" && !Array.isArray(next.header) ? next.header : {};
    if (next.header.visible === undefined) next.header.visible = true;
    if (next.header.contactVisible === undefined) next.header.contactVisible = true;
    next.header.navigation = normalizeHeaderNavigation(next.header.navigation);
    next.footer = next.footer && typeof next.footer === "object" && !Array.isArray(next.footer) ? next.footer : {};
    next.footer.quickLinks = Array.isArray(next.footer.quickLinks) ? next.footer.quickLinks : [];
    next.mudavim = next.mudavim && typeof next.mudavim === "object" && !Array.isArray(next.mudavim) ? next.mudavim : {};
    next.mudavim.announcements = normalizeMudavimAnnouncements(next.mudavim.announcements);
    return next;
  }

  function normalizeMudavimAnnouncements(value) {
    return (Array.isArray(value) ? value : []).map((item, itemIndex) => {
      const id = String(item && item.id || `announcement-${itemIndex + 1}`);
      return {
        id,
        title: String(item && item.title || "Yeni Duyuru"),
        slug: String(item && item.slug || slugifyMudavimAnnouncement(item && item.title || id)),
        order: Number.isFinite(Number(item && item.order)) ? Number(item.order) : itemIndex,
        isPublished: item && item.isPublished === true,
        blocks: (Array.isArray(item && item.blocks) ? item.blocks : []).map((block, blockIndex) => {
          const allowedTypes = ["text", "image", "image-text", "text-image"];
          const type = allowedTypes.includes(block && block.type) ? block.type : (block && block.type === "image" ? "image" : "text");
          const hasText = type !== "image";
          const hasImage = type !== "text";
          const body = String(block && (block.body ?? block.content) || "");
          return {
            id: String(block && block.id || `${id}-block-${blockIndex + 1}`),
            type,
            badge: hasText ? String(block && block.badge || "") : "",
            date: hasText ? String(block && block.date || "") : "",
            heading: hasText ? String(block && block.heading || "") : "",
            body: hasText ? body : "",
            content: type === "text" ? body : "",
            imageUrl: hasImage ? String(block && block.imageUrl || "") : "",
            alt: hasImage ? String(block && block.alt || "") : "",
            order: Number.isFinite(Number(block && block.order)) ? Number(block.order) : blockIndex
          };
        }).sort((first, second) => first.order - second.order),
        createdAt: String(item && item.createdAt || ""),
        updatedAt: String(item && item.updatedAt || "")
      };
    }).sort((first, second) => first.order - second.order);
  }

  function slugifyMudavimAnnouncement(value) {
    return String(value || "duyuru")
      .toLocaleLowerCase("tr-TR")
      .replace(/[çÇ]/g, "c").replace(/[ğĞ]/g, "g").replace(/[ıİ]/g, "i")
      .replace(/[öÖ]/g, "o").replace(/[şŞ]/g, "s").replace(/[üÜ]/g, "u")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "duyuru";
  }

  function normalizeHeaderNavigation(value) {
    const source = Array.isArray(value) && value.length ? value : DEFAULT_HEADER_NAVIGATION;
    return source.map((item, index) => {
      const fallback = DEFAULT_HEADER_NAVIGATION[index] || {};
      const label = normalizeLocalizedLabel(item && (item.label || item.text) || fallback.label);
      return {
        id: String(item && item.id || fallback.id || `nav-${index + 1}`),
        label,
        url: String(item && item.url || fallback.url || "#top"),
        icon: String(item && item.icon || fallback.icon || ""),
        visible: item && Object.prototype.hasOwnProperty.call(item, "visible") ? item.visible !== false : true,
        order: Number.isFinite(Number(item && item.order)) ? Number(item.order) : index
      };
    });
  }

  function normalizeLocalizedLabel(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return { tr: String(value.tr || value.en || ""), en: String(value.en || value.tr || "") };
    }
    const text = String(value || "");
    return { tr: text, en: text };
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
          "14 oz": {
            content: "Double shot espresso + soğuk süt + buz",
            preparation: "",
            note: ""
          }
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
    renderBulkPriceTools();
    renderLists();
    renderForms();
    renderRecipeEditor();
    renderStaffAccess();
    renderMudavimPanel();
    renderMenuOutput();
    renderProductImportReport();
    renderRecipeImportReport();
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

    if (els.contentGrid) els.contentGrid.hidden = activeSection === "overview" || activeSection === "bulkPrice";
    if (els.panelShell) els.panelShell.dataset.activeSection = activeSection;
    const previewColumn = document.querySelector(".preview-column");
    const hidePreview = activeSection === "feedback" || activeSection === "site" || activeSection === "staffAccess" || activeSection === "mudavim" || activeSection === "menuOutput";
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
    const menuIsOpen = activeProducts > 0;
    const summaryCards = [
      { label: "Toplam Kategori", value: categories.length, icon: "categories" },
      { label: "Toplam Ürün", value: products.length, icon: "products" },
      { label: "Aktif Ürün", value: activeProducts, icon: "active" },
      { label: "Reçete Ürünü", value: recipeStats.products, icon: "recipe" },
      { label: "Canlı Menü", value: menuIsOpen ? "Açık" : "Kapalı", icon: "live", status: menuIsOpen },
      { label: "Gizli / Tükendi", value: soldOut, icon: "hidden", secondary: true },
      { label: "Popüler", value: popular, icon: "popular", secondary: true }
    ];
    const distribution = overviewCategoryDistribution(categories, products.length);
    const conicGradient = distribution.length
      ? `conic-gradient(${distribution.map((item) => `${item.color} ${item.start.toFixed(2)}% ${item.end.toFixed(2)}%`).join(", ")})`
      : "conic-gradient(#e7d8ca 0 100%)";
    const updateDate = state.data.settings.menuUpdateDate || state.site.updatedAt || new Date().toISOString();
    const updates = [
      { icon: "menu", title: "Menü verisi güncel", meta: `${formatOverviewNumber(products.length)} ürün · ${formatOverviewTime(updateDate)}` },
      { icon: "categories", title: "Kategoriler hazır", meta: `${formatOverviewNumber(categories.length)} aktif yapı` },
      { icon: "recipe", title: "Reçeteler eşitlendi", meta: `${formatOverviewNumber(recipeStats.products)} reçete ürünü` },
      { icon: "active", title: "Müdavim özeti hazır", meta: `${formatOverviewNumber(MUDAVIM_CUSTOMERS.length)} kayıt` }
    ];
    const trend = overviewVisitTrend();
    const totalMudavimVisits = MUDAVIM_CUSTOMERS.reduce((sum, customer) => sum + Number(customer.totalVisits || 0), 0);

    els.overviewGrid.innerHTML = `
      <div class="overview-dashboard">
        <div class="overview-summary-grid" aria-label="Menü özeti">
          ${summaryCards.map((card) => `
            <article class="overview-summary-card${card.secondary ? " is-secondary" : ""}">
              <span class="overview-icon">${overviewIcon(card.icon)}</span>
              <div>
                <span>${escapeHTML(card.label)}</span>
                <strong>${typeof card.value === "number" ? formatOverviewNumber(card.value) : escapeHTML(card.value)}</strong>
              </div>
              ${Object.hasOwn(card, "status") ? `<i class="overview-status-dot${card.status ? " is-open" : ""}" aria-label="${card.status ? "Menü yayında" : "Menü kapalı"}"></i>` : ""}
            </article>
          `).join("")}
        </div>

        <div class="overview-main-grid">
          <article class="overview-panel overview-distribution-panel">
            <header><h3>Kategorilere Göre Ürün Dağılımı</h3></header>
            <div class="overview-distribution-content">
              <div class="overview-donut" style="background:${conicGradient}" role="img" aria-label="Toplam ${formatOverviewNumber(products.length)} ürünün kategori dağılımı">
                <div><strong>${formatOverviewNumber(products.length)}</strong><span>Toplam</span></div>
              </div>
              <ul class="overview-legend">
                ${distribution.map((item) => `
                  <li><i style="--legend-color:${item.color}"></i><span>${escapeHTML(item.label)}</span><strong>${Math.round(item.percent)}%</strong></li>
                `).join("") || `<li><span>Henüz ürün yok</span><strong>0%</strong></li>`}
              </ul>
            </div>
          </article>

          <article class="overview-panel overview-updates-panel">
            <header><h3>Son Güncellemeler</h3></header>
            <div class="overview-update-list">
              ${updates.map((item) => `
                <div class="overview-update-row">
                  <span class="overview-icon is-small">${overviewIcon(item.icon)}</span>
                  <div><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.meta)}</small></div>
                </div>
              `).join("")}
            </div>
            <button class="overview-list-action" type="button" data-overview-section="menu">Menüyü Yönet</button>
          </article>

          <article class="overview-panel overview-shortcuts-panel">
            <header><h3>Kısa Yollar</h3></header>
            <div class="overview-shortcut-list">
              <button type="button" data-overview-section="menu"><span>${overviewIcon("menu")}</span><strong>Menü Düzenle</strong><i>›</i></button>
              <button type="button" data-overview-section="product"><span>${overviewIcon("products")}</span><strong>Ürün Ekle</strong><i>›</i></button>
              <button type="button" data-overview-section="banner"><span>${overviewIcon("banner")}</span><strong>Banner Ekle</strong><i>›</i></button>
              <button type="button" data-overview-section="recipe"><span>${overviewIcon("recipe")}</span><strong>Reçete Yönetimi</strong><i>›</i></button>
              <a href="/" target="_blank" rel="noopener noreferrer"><span>${overviewIcon("active")}</span><strong>Site Önizleme</strong><i>↗</i></a>
            </div>
          </article>
        </div>

        <div class="overview-bottom-grid">
          <article class="overview-panel overview-trend-panel">
            <header><div><h3>Ziyaretçi Trendi</h3><small>Müdavim ziyaret kayıtlarının son 7 günü</small></div><strong>${formatOverviewNumber(trend.total)} ziyaret</strong></header>
            <div class="overview-chart-wrap">
              <svg class="overview-trend-chart" viewBox="0 0 700 190" role="img" aria-label="Son yedi günlük ziyaretçi trendi">
                <defs><linearGradient id="overviewTrendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b7773d" stop-opacity=".35"/><stop offset="1" stop-color="#b7773d" stop-opacity=".02"/></linearGradient></defs>
                <path class="overview-chart-grid" d="M28 45H672M28 95H672M28 145H672"/>
                <polygon class="overview-chart-area" points="${trend.area}"/>
                <polyline class="overview-chart-line" points="${trend.points}"/>
                ${trend.coordinates.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="4"/>`).join("")}
                ${trend.labels.map((label, index) => `<text x="${trend.coordinates[index].x}" y="177" text-anchor="middle">${escapeHTML(label)}</text>`).join("")}
              </svg>
            </div>
          </article>

          <article class="overview-panel overview-members-panel">
            <header><h3>Müdavim Özeti</h3><button type="button" data-overview-section="mudavim">Tümünü Gör</button></header>
            <div class="overview-member-metrics">
              <div><span>Toplam Müdavim</span><strong>${formatOverviewNumber(MUDAVIM_CUSTOMERS.length)}</strong><small>Kayıtlı üye</small></div>
              <div><span>Son 7 Gün</span><strong>${formatOverviewNumber(trend.total)}</strong><small>Ziyaret kaydı</small></div>
              <div><span>Toplam Ziyaret</span><strong>${formatOverviewNumber(totalMudavimVisits)}</strong><small>Tüm zamanlar</small></div>
            </div>
          </article>
        </div>
      </div>
    `;
    if (els.miniStats) {
      const miniStats = [
        ["Kategori", categories.length],
        ["Ürün", products.length],
        ["Aktif", activeProducts],
        ["Gizli/Tükendi", soldOut]
      ];
      els.miniStats.innerHTML = miniStats.map(([label, value]) => `<article class="stat-card"><span>${label}</span><strong>${formatOverviewNumber(value)}</strong></article>`).join("");
    }
  }

  function overviewIcon(name) {
    const paths = {
      categories: `<path d="M3.5 7.5h17v12h-17z"/><path d="M3.5 7.5 6 4.5h5l2 3"/>`,
      products: `<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>`,
      active: `<circle cx="12" cy="12" r="9"/><path d="m8 12 2.7 2.7L16.5 9"/>`,
      recipe: `<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/>`,
      live: `<path d="M6 8h10a4 4 0 0 1 0 8H6zM8 5v3M13 4v4M7 19h10"/>`,
      hidden: `<path d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.8 5.2A10.7 10.7 0 0 1 21 12a12 12 0 0 1-3.2 4.2M6.2 7.1A12 12 0 0 0 3 12a10.8 10.8 0 0 0 6.2 5.8"/>`,
      popular: `<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2-4.5-4.4 6.2-.9z"/>`,
      menu: `<path d="M7 6h14M7 12h14M7 18h14"/><circle cx="3.5" cy="6" r=".7"/><circle cx="3.5" cy="12" r=".7"/><circle cx="3.5" cy="18" r=".7"/>`,
      banner: `<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m6 16 4-4 3 3 2-2 3 3"/>`
    };
    return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.active}</svg>`;
  }

  function overviewCategoryDistribution(categories, totalProducts) {
    const colors = ["#4a2c1d", "#75462d", "#a96f45", "#c99b78", "#dec4ad"];
    const sorted = categories.map((category) => ({
      label: category.name,
      count: Array.isArray(category.products) ? category.products.length : 0
    })).sort((a, b) => b.count - a.count);
    const visible = sorted.slice(0, 4);
    const otherCount = sorted.slice(4).reduce((sum, item) => sum + item.count, 0);
    if (otherCount) visible.push({ label: "Diğer", count: otherCount });
    let cursor = 0;
    return visible.filter((item) => item.count > 0).map((item, index) => {
      const percent = totalProducts ? (item.count / totalProducts) * 100 : 0;
      const start = cursor;
      cursor += percent;
      return { ...item, percent, start, end: cursor, color: colors[index % colors.length] };
    });
  }

  function overviewVisitTrend() {
    const visits = MUDAVIM_CUSTOMERS.flatMap((customer) => Array.isArray(customer.visits) ? customer.visits : []);
    const timestamps = visits.map((visit) => Date.parse(`${visit.date}T12:00:00`)).filter(Number.isFinite);
    const latest = timestamps.length ? new Date(Math.max(...timestamps)) : new Date();
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(latest);
      date.setDate(latest.getDate() - (6 - index));
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      return {
        key,
        label: new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }).format(date),
        value: visits.filter((visit) => visit.date === key).length
      };
    });
    const maxValue = Math.max(1, ...days.map((day) => day.value));
    const coordinates = days.map((day, index) => ({
      x: Number((28 + index * (644 / 6)).toFixed(2)),
      y: Number((145 - (day.value / maxValue) * 100).toFixed(2))
    }));
    const points = coordinates.map((point) => `${point.x},${point.y}`).join(" ");
    return {
      points,
      area: `28,145 ${points} 672,145`,
      coordinates,
      labels: days.map((day) => day.label),
      total: days.reduce((sum, day) => sum + day.value, 0)
    };
  }

  function formatOverviewNumber(value) {
    return new Intl.NumberFormat("tr-TR").format(Number(value) || 0);
  }

  function formatOverviewTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Şimdi";
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

  function renderBulkPriceTools() {
    if (!els.bulkPriceProductList) return;
    const validIds = new Set(flatProducts().map(({ product }) => product.id));
    state.bulkPriceSelectedIds.forEach((id) => {
      if (!validIds.has(id)) state.bulkPriceSelectedIds.delete(id);
    });
    renderBulkPriceCategorySelect();
    renderBulkPriceProductList();
    updateBulkPriceControls();
  }

  function renderBulkPriceCategorySelect() {
    const current = els.bulkPriceCategory.value || "all";
    els.bulkPriceCategory.innerHTML = [
      `<option value="all">Tüm kategoriler</option>`,
      ...state.data.categories.map((category) => (
        `<option value="${escapeAttribute(category.id)}">${escapeHTML(category.name)}</option>`
      ))
    ].join("");
    els.bulkPriceCategory.value = current === "all" || state.data.categories.some((category) => category.id === current)
      ? current
      : "all";
  }

  function visibleBulkPriceProducts() {
    const categoryId = els.bulkPriceCategory.value || "all";
    const query = normalizeText(els.bulkPriceSearch.value || "");
    return flatProducts().filter(({ category, product }) => {
      if (categoryId !== "all" && category.id !== categoryId) return false;
      return !query || normalizeText(`${product.name} ${category.name}`).includes(query);
    });
  }

  function renderBulkPriceProductList() {
    const products = visibleBulkPriceProducts();
    els.bulkPriceProductList.innerHTML = products.length
      ? products.map(({ category, product }) => `
        <label class="bulk-price-product-option">
          <input type="checkbox" value="${escapeAttribute(product.id)}" ${state.bulkPriceSelectedIds.has(product.id) ? "checked" : ""}>
          <span>
            <strong>${escapeHTML(product.name)}</strong>
            <small>${escapeHTML(category.name)} · ${escapeHTML(priceSummary(product))}</small>
          </span>
        </label>
      `).join("")
      : `<div class="bulk-price-empty">Ürün bulunamadı</div>`;
  }

  function handleBulkPriceProductSelection(event) {
    const input = event.target.closest("input[type='checkbox']");
    if (!input) return;
    if (input.checked) state.bulkPriceSelectedIds.add(input.value);
    else state.bulkPriceSelectedIds.delete(input.value);
    state.bulkPriceMessage = "";
    updateBulkPriceControls();
  }

  function selectVisibleBulkPriceProducts() {
    visibleBulkPriceProducts().forEach(({ product }) => state.bulkPriceSelectedIds.add(product.id));
    state.bulkPriceMessage = "";
    renderBulkPriceProductList();
    updateBulkPriceControls();
  }

  function clearBulkPriceSelection() {
    state.bulkPriceSelectedIds.clear();
    state.bulkPriceMessage = "";
    renderBulkPriceProductList();
    updateBulkPriceControls();
  }

  function selectedBulkPriceOption(name, fallback) {
    const input = document.querySelector(`input[name='${name}']:checked`);
    return input ? input.value : fallback;
  }

  function selectedBulkPriceProducts() {
    return flatProducts().filter(({ product }) => state.bulkPriceSelectedIds.has(product.id));
  }

  function updateBulkPriceControls() {
    const selectedCount = selectedBulkPriceProducts().length;
    const mode = selectedBulkPriceOption("bulkPriceMode", "fixed");
    const direction = selectedBulkPriceOption("bulkPriceDirection", "increase");
    const amount = Number(els.bulkPriceValue.value || 0);
    els.bulkPriceSelectedCount.textContent = `${selectedCount} ürün seçildi`;
    els.bulkPriceValueLabel.textContent = mode === "percentage" ? "Oran (%)" : "Tutar (\u20BA)";
    els.bulkPriceApply.disabled = selectedCount === 0 || !Number.isFinite(amount) || amount <= 0;

    if (state.bulkPriceMessage) {
      els.bulkPriceSummary.textContent = state.bulkPriceMessage;
      return;
    }
    if (!selectedCount) {
      els.bulkPriceSummary.textContent = "Ürün seçimi bekleniyor";
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      els.bulkPriceSummary.textContent = `${selectedCount} ürün · Değer bekleniyor`;
      return;
    }
    const operation = direction === "increase" ? "artış" : "azalış";
    const value = mode === "percentage" ? `%${formatBulkPriceNumber(amount)}` : `${formatBulkPriceNumber(amount)}\u20BA`;
    els.bulkPriceSummary.textContent = `${selectedCount} ürün · ${value} ${operation}`;
  }

  function applyBulkPriceUpdate() {
    const selected = selectedBulkPriceProducts();
    const mode = selectedBulkPriceOption("bulkPriceMode", "fixed");
    const direction = selectedBulkPriceOption("bulkPriceDirection", "increase");
    const amount = Number(els.bulkPriceValue.value || 0);
    if (!selected.length || !Number.isFinite(amount) || amount <= 0) return;

    const priceKeys = ["standard", "k", "o", "b", "single", "double"];
    let affectedPriceCount = 0;
    const updates = selected.map(({ product }) => {
      const prices = Object.assign({}, product.prices);
      let productPriceCount = 0;
      priceKeys.forEach((key) => {
        if (!hasPrice(prices[key])) return;
        const current = Number(prices[key]);
        if (!Number.isFinite(current)) return;
        const difference = mode === "percentage" ? current * (amount / 100) : amount;
        const next = direction === "increase" ? current + difference : current - difference;
        prices[key] = roundPrice(Math.max(0, next));
        productPriceCount += 1;
      });
      affectedPriceCount += productPriceCount;
      return { product, prices, productPriceCount };
    }).filter((update) => update.productPriceCount > 0);

    if (!affectedPriceCount) {
      state.bulkPriceMessage = "Seçili ürünlerde güncellenecek fiyat yok";
      updateBulkPriceControls();
      return;
    }

    const operation = direction === "increase" ? "artırmak" : "azaltmak";
    const value = mode === "percentage" ? `%${formatBulkPriceNumber(amount)}` : `${formatBulkPriceNumber(amount)}\u20BA`;
    const confirmed = window.confirm(
      `${updates.length} üründeki ${affectedPriceCount} fiyatı ${value} ${operation} istiyor musunuz?`
    );
    if (!confirmed) return;

    updates.forEach(({ product, prices }) => {
      product.prices = normalizePricesForMode(normalizePrices(prices), product.priceMode);
      product.variants = normalizeVariants(null, product.prices, product.priceMode);
    });
    state.bulkPriceMessage = `${updates.length} ürün ve ${affectedPriceCount} fiyat güncellendi · Kaydet bekleniyor`;
    saveAndRender();
  }

  function roundPrice(value) {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  }

  function formatBulkPriceNumber(value) {
    return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 }).format(Number(value));
  }

  function renderMudavimPanel() {
    if (!els.mudavimCustomerList) return;
    renderMudavimStats();
    renderMudavimCustomerList();
    renderMudavimCustomerDetail();
    renderMudavimRewardRules();
    renderMudavimCampaigns();
    renderMudavimSettings();
    renderMudavimAnnouncements();
  }

  function filteredMudavimCustomers() {
    const query = normalizeText(state.mudavimSearch || "");
    const level = state.mudavimLevelFilter || "all";
    const reward = state.mudavimRewardFilter || "all";
    return MUDAVIM_CUSTOMERS.filter((customer) => {
      const searchText = normalizeText(`${customer.name} ${customer.contact} ${customer.code} ${customer.level}`);
      const matchesQuery = !query || searchText.includes(query);
      const matchesLevel = level === "all" || customer.level === level;
      const matchesReward = reward === "all" || customer.rewardStatus === reward;
      return matchesQuery && matchesLevel && matchesReward;
    });
  }

  function renderMudavimStats() {
    if (!els.mudavimStats) return;
    const total = MUDAVIM_CUSTOMERS.length;
    const active = MUDAVIM_CUSTOMERS.filter((customer) => customer.rewardStatus !== "new").length;
    const monthVisits = MUDAVIM_CUSTOMERS.reduce((sum, customer) => sum + (customer.visits || []).filter((visit) => String(visit.date || "").startsWith("2026-07")).length, 0);
    const rewards = MUDAVIM_CUSTOMERS.reduce((sum, customer) => sum + Number(customer.rewardsEarned || 0), 0);
    const stats = [
      ["Toplam müdavim", total],
      ["Aktif müşteri", active],
      ["Bu ay ziyaret", monthVisits],
      ["Dağıtılan ödül", rewards]
    ];
    els.mudavimStats.innerHTML = stats.map(([label, value]) => (
      `<article class="mudavim-stat-card"><span>${escapeHTML(label)}</span><strong>${escapeHTML(String(value))}</strong></article>`
    )).join("");
  }

  function renderMudavimCustomerList() {
    if (!els.mudavimCustomerList) return;
    const customers = filteredMudavimCustomers();
    if (!customers.some((customer) => customer.id === state.selectedMudavimCustomerId)) {
      state.selectedMudavimCustomerId = customers[0]?.id || MUDAVIM_CUSTOMERS[0]?.id || "";
    }
    if (!customers.length) {
      els.mudavimCustomerList.innerHTML = `<div class="mudavim-empty">Filtreye uygun müdavim yok.</div>`;
      return;
    }
    els.mudavimCustomerList.innerHTML = customers.map((customer) => (
      `<button class="mudavim-customer-row${customer.id === state.selectedMudavimCustomerId ? " is-active" : ""}" type="button" data-mudavim-customer-id="${escapeAttribute(customer.id)}">
        <span>
          <strong>${escapeHTML(customer.name)}</strong>
          <small>${escapeHTML(customer.contact)}</small>
        </span>
        <em>${escapeHTML(customer.level)}</em>
        <span class="mudavim-row-meta">
          <b>${escapeHTML(formatMudavimRewardStatus(customer.rewardStatus))}</b>
          <small>${escapeHTML(formatMudavimDate(customer.lastVisit))}</small>
        </span>
      </button>`
    )).join("");
  }

  function renderMudavimCustomerDetail() {
    if (!els.mudavimCustomerDetail) return;
    const customer = MUDAVIM_CUSTOMERS.find((item) => item.id === state.selectedMudavimCustomerId) || MUDAVIM_CUSTOMERS[0];
    if (!customer) {
      els.mudavimCustomerDetail.innerHTML = `<div class="mudavim-empty">Müşteri seçimi bekleniyor.</div>`;
      return;
    }
    const remain = Math.max(0, 10 - Number(customer.cycleVisits || 0));
    const progress = Math.min(100, Number(customer.cycleVisits || 0) * 10);
    els.mudavimCustomerDetail.innerHTML = `
      <div class="mudavim-detail-head">
        <div>
          <p class="eyebrow">Müşteri detayı</p>
          <h4>${escapeHTML(customer.name)}</h4>
          <span>${escapeHTML(customer.contact)}</span>
        </div>
        <strong>${escapeHTML(customer.code)}</strong>
      </div>
      <div class="mudavim-detail-grid">
        <span><b>${escapeHTML(customer.level)}</b> Seviye</span>
        <span><b>${escapeHTML(String(customer.totalVisits))}</b> Toplam ziyaret</span>
        <span><b>${escapeHTML(String(customer.rewardsEarned))}</b> Ödül</span>
      </div>
      <div class="mudavim-admin-qr" aria-label="QR placeholder">
        ${Array.from({ length: 25 }, (_, index) => `<i class="${index % 4 === 0 ? "is-soft" : ""}"></i>`).join("")}
      </div>
      <div class="mudavim-progress-line">
        <div><strong>${escapeHTML(String(customer.cycleVisits))} / 10 ziyaret</strong><span>${remain === 0 ? "Ödülün hazır" : `${remain} ziyaret kaldı`}</span></div>
        <div class="mudavim-progress-track"><span style="width:${progress}%"></span></div>
      </div>
      <div class="mudavim-detail-actions" aria-label="Müdavim işlem butonları">
        <button class="primary-action" type="button" data-mudavim-action="add-visit">Ziyaret ekle</button>
        <button class="line-action" type="button" data-mudavim-action="use-reward">Ödülü kullandır</button>
      </div>
      <section>
        <h5>Aktif ödüller</h5>
        <div class="mudavim-chip-list">
          ${(customer.activeRewards || []).length ? customer.activeRewards.map((reward) => `<span>${escapeHTML(reward)}</span>`).join("") : "<span>Aktif ödül yok</span>"}
        </div>
      </section>
      <section>
        <h5>Ziyaret geçmişi</h5>
        <div class="mudavim-visit-list">
          ${(customer.visits || []).map((visit) => `
            <article>
              <time>${escapeHTML(formatMudavimDate(visit.date))}</time>
              <strong>${escapeHTML(visit.type)}</strong>
              <span>${escapeHTML(visit.change)}</span>
              <small>${escapeHTML(visit.note)}</small>
            </article>
          `).join("")}
        </div>
      </section>
      <section>
        <h5>Admin notu</h5>
        <p class="mudavim-note">${escapeHTML(customer.note)}</p>
      </section>
    `;
  }

  function handleMudavimDetailAction(event) {
    const button = event.target.closest("[data-mudavim-action]");
    if (!button) return;
    const customer = MUDAVIM_CUSTOMERS.find((item) => item.id === state.selectedMudavimCustomerId);
    if (!customer) return;
    const today = mudavimToday();
    if (button.dataset.mudavimAction === "add-visit") {
      customer.totalVisits = Number(customer.totalVisits || 0) + 1;
      customer.cycleVisits = Math.min(10, Number(customer.cycleVisits || 0) + 1);
      customer.lastVisit = today;
      customer.rewardStatus = customer.cycleVisits >= 10 ? "ready" : "active";
      customer.activeRewards = customer.cycleVisits >= 10 ? ["Tatlı hakkı"] : [];
      customer.note = customer.cycleVisits >= 10 ? "Ödül hazır. Kasada tatlı hakkı kullandırılabilir." : `${10 - customer.cycleVisits} ziyaret kaldı.`;
      customer.visits = [
        { date: today, type: "Ziyaret", change: "+1 ziyaret", note: "Admin UI mock işlemi" },
        ...(customer.visits || [])
      ].slice(0, 6);
    }
    if (button.dataset.mudavimAction === "use-reward" && (customer.cycleVisits >= 10 || (customer.activeRewards || []).length)) {
      customer.rewardsEarned = Number(customer.rewardsEarned || 0) + 1;
      customer.cycleVisits = 0;
      customer.rewardStatus = "used";
      customer.activeRewards = [];
      customer.lastVisit = today;
      customer.note = "Ödül kullandırıldı. Yeni ziyaret döngüsü başladı.";
      customer.visits = [
        { date: today, type: "Ödül kullanımı", change: "Tatlı hakkı kullanıldı", note: "Admin UI mock işlemi" },
        ...(customer.visits || [])
      ].slice(0, 6);
    }
    renderMudavimPanel();
  }

  function renderMudavimRewardRules() {
    if (!els.mudavimRewardRules) return;
    els.mudavimRewardRules.innerHTML = `
      <article class="mudavim-rule-card">
        <strong>10 içecek sonrası ödül</strong>
        <span>11. alışverişte yanında tatlı hakkı.</span>
        <em>Aktif</em>
      </article>
      <article class="mudavim-rule-card">
        <strong>Kullanım limiti</strong>
        <span>Ödül, kazanımdan sonra 30 gün içinde kullanılabilir.</span>
        <em>UI taslak</em>
      </article>
    `;
  }

  function renderMudavimCampaigns() {
    if (!els.mudavimCampaigns) return;
    const campaigns = [
      ["Doğum günü hediyesi", "Doğum günü ayında tek seferlik tatlı sürprizi.", "Planlandı"],
      ["X ziyaret sonrası ödül", "Belirlenen ziyaret eşiğinde özel kahve teklifi.", "Taslak"],
      ["Dönemsel kampanya", "Hafta içi sabah ziyaretlerini artıran kampanya.", "Pasif"]
    ];
    els.mudavimCampaigns.innerHTML = campaigns.map(([title, text, stateText]) => (
      `<article class="mudavim-campaign-card"><strong>${escapeHTML(title)}</strong><span>${escapeHTML(text)}</span><em>${escapeHTML(stateText)}</em></article>`
    )).join("");
  }

  function renderMudavimSettings() {
    if (!els.mudavimSettings) return;
    els.mudavimSettings.innerHTML = `
      <label class="toggle-row"><input type="checkbox" checked disabled><span>QR kasada okutulsun</span></label>
      <label class="toggle-row"><input type="checkbox" checked disabled><span>10 içecekte 1 tatlı hakkı gösterilsin</span></label>
      <label><span>Müşteri ekranı metni</span><input type="text" value="Kasada kodunu okut" disabled></label>
      <label><span>Seviye kuralı</span><input type="text" value="Bronz / Gümüş / Altın" disabled></label>
    `;
  }

  function mudavimAnnouncements() {
    if (!state.site || typeof state.site !== "object") state.site = normalizeSiteSettings({ schemaVersion: 3 });
    if (!state.site.mudavim || typeof state.site.mudavim !== "object") state.site.mudavim = {};
    state.site.mudavim.announcements = normalizeMudavimAnnouncements(state.site.mudavim.announcements);
    return state.site.mudavim.announcements;
  }

  function selectedMudavimAnnouncement() {
    const announcements = mudavimAnnouncements();
    if (!announcements.some((item) => item.id === state.selectedMudavimAnnouncementId)) {
      state.selectedMudavimAnnouncementId = announcements[0]?.id || "";
    }
    return announcements.find((item) => item.id === state.selectedMudavimAnnouncementId) || null;
  }

  function renderMudavimAnnouncements() {
    if (!els.mudavimAnnouncementList || !els.mudavimAnnouncementEditor) return;
    const announcements = mudavimAnnouncements();
    const selected = selectedMudavimAnnouncement();
    els.mudavimAnnouncementList.innerHTML = announcements.length ? announcements.map((item) => `
      <button class="mudavim-announcement-row${item.id === state.selectedMudavimAnnouncementId ? " is-active" : ""}" type="button" data-mudavim-announcement-id="${escapeAttribute(item.id)}">
        <span><strong>${escapeHTML(item.title)}</strong><small>${item.blocks.length} blok · ${escapeHTML(item.slug)}</small></span>
        <em class="${item.isPublished ? "is-published" : ""}">${item.isPublished ? "Yayında" : "Taslak"}</em>
      </button>
    `).join("") : `<div class="mudavim-empty">Henüz duyuru yok. “Yeni Duyuru” ile başlayın.</div>`;

    if (!selected) {
      els.mudavimAnnouncementEditor.innerHTML = `<div class="mudavim-empty">Düzenlemek için bir duyuru seçin.</div>`;
      renderMudavimAnnouncementPreview();
      return;
    }

    els.mudavimAnnouncementEditor.innerHTML = `
      <div class="mudavim-announcement-editor__head">
        <div><p class="eyebrow">Duyuru düzenleyici</p><h4>${escapeHTML(selected.title)}</h4></div>
        <button class="danger-action" type="button" data-mudavim-announcement-action="delete-announcement">Duyuruyu Sil</button>
      </div>
      <div class="form-grid two mudavim-announcement-fields">
        <label><span>Başlık</span><input type="text" value="${escapeAttribute(selected.title)}" data-mudavim-announcement-field="title" maxlength="160"></label>
        <label><span>Slug</span><input type="text" value="${escapeAttribute(selected.slug)}" data-mudavim-announcement-field="slug" maxlength="160"></label>
        <label><span>Sıra</span><input type="number" min="0" value="${escapeAttribute(selected.order)}" data-mudavim-announcement-field="order"></label>
        <label class="toggle-row"><input type="checkbox" data-mudavim-announcement-field="isPublished" ${selected.isPublished ? "checked" : ""}><span>Müşteri panelinde yayınla</span></label>
      </div>
      <div class="mudavim-block-toolbar">
        <div><p class="eyebrow">Duyuru Blokları</p><h5>İçerik Yönetimi</h5><span>Bloklar aşağıdaki sırayla yayınlanır.</span></div>
        <div>
          <button class="line-action" type="button" data-mudavim-announcement-action="add-text"><i class="fas fa-align-left" aria-hidden="true"></i> Metin</button>
          <button class="line-action" type="button" data-mudavim-announcement-action="add-image"><i class="far fa-image" aria-hidden="true"></i> Görsel</button>
          <button class="line-action" type="button" data-mudavim-announcement-action="add-image-text"><i class="fas fa-table-columns" aria-hidden="true"></i> Görsel + Metin</button>
          <button class="line-action" type="button" data-mudavim-announcement-action="add-text-image"><i class="fas fa-table-columns" aria-hidden="true"></i> Metin + Görsel</button>
        </div>
      </div>
      <div class="mudavim-block-list">
        ${selected.blocks.length ? selected.blocks.map((block, index) => renderMudavimAnnouncementBlock(block, index, selected.blocks.length)).join("") : `<div class="mudavim-empty">Bu duyuruda henüz içerik bloğu yok.</div>`}
      </div>
      <p class="control-note">Değişiklikler “Değişiklikleri Kaydet” düğmesine basıldığında canlıya alınır.</p>
    `;
    applyMudavimPreviewImageOrientation(els.mudavimAnnouncementEditor);
    renderMudavimAnnouncementPreview();
  }

  function renderMudavimAnnouncementBlock(block, index, total) {
    const hasText = block.type !== "image";
    const hasImage = block.type !== "text";
    const typeOptions = [
      ["text", "Sadece Metin"],
      ["image", "Sadece Görsel"],
      ["image-text", "Görsel + Metin"],
      ["text-image", "Metin + Görsel"]
    ];
    const textFields = hasText ? `
      <div class="mudavim-block-text-fields">
        <div class="form-grid two">
          <label><span>Etiket / kategori</span><input type="text" value="${escapeAttribute(block.badge)}" data-mudavim-block-field="badge" maxlength="40" placeholder="YENİ, ETKİNLİK, SEZONAL"></label>
          <label><span>Tarih</span><input type="date" value="${escapeAttribute(block.date)}" data-mudavim-block-field="date"></label>
        </div>
        <label><span>Başlık</span><input type="text" value="${escapeAttribute(block.heading)}" data-mudavim-block-field="heading" maxlength="180" placeholder="Duyuru başlığı"></label>
        <label><span>Kısa açıklama</span><textarea rows="4" data-mudavim-block-field="body" maxlength="10000" placeholder="Duyuru metnini yazın">${escapeHTML(block.body)}</textarea></label>
      </div>
    ` : "";
    const imageFields = hasImage ? `
      <div class="mudavim-block-image-fields">
        ${block.imageUrl ? `<img src="${escapeAttribute(block.imageUrl)}" alt="" data-mudavim-preview-image>` : `<div class="mudavim-block-image-empty">Görsel seçilmedi</div>`}
        <label><span>Görsel URL</span><input type="text" value="${escapeAttribute(block.imageUrl)}" data-mudavim-block-field="imageUrl"></label>
        <label><span>Alternatif metin</span><input type="text" value="${escapeAttribute(block.alt)}" data-mudavim-block-field="alt" maxlength="240"></label>
        <label class="file-button"><span>Görsel Yükle / Değiştir</span><input type="file" accept="image/jpeg,image/png,image/webp" data-mudavim-block-image></label>
      </div>
    ` : "";
    return `
      <article class="mudavim-block-card" data-mudavim-block-id="${escapeAttribute(block.id)}">
        <div class="mudavim-block-card__head">
          <span class="mudavim-block-order">${index + 1}</span>
          <label class="mudavim-block-type"><span>Blok tipi</span><select data-mudavim-block-field="type">${typeOptions.map(([value, label]) => `<option value="${value}" ${block.type === value ? "selected" : ""}>${label}</option>`).join("")}</select></label>
          <div>
            <button type="button" aria-label="Yukarı taşı" data-mudavim-announcement-action="move-block-up" ${index === 0 ? "disabled" : ""}><i class="fas fa-arrow-up" aria-hidden="true"></i></button>
            <button type="button" aria-label="Aşağı taşı" data-mudavim-announcement-action="move-block-down" ${index === total - 1 ? "disabled" : ""}><i class="fas fa-arrow-down" aria-hidden="true"></i></button>
            <button type="button" aria-label="Bloğu sil" data-mudavim-announcement-action="delete-block"><i class="fas fa-trash" aria-hidden="true"></i></button>
          </div>
        </div>
        <div class="mudavim-block-editor-grid${hasText && hasImage ? " is-combined" : ""}">${imageFields}${textFields}</div>
      </article>
    `;
  }

  function renderMudavimAnnouncementPreview() {
    if (!els.mudavimAnnouncementPreview) return;
    const announcement = selectedMudavimAnnouncement();
    if (!announcement) {
      els.mudavimAnnouncementPreview.innerHTML = `<div class="mudavim-empty">Canlı önizleme için bir duyuru seçin.</div>`;
      return;
    }
    els.mudavimAnnouncementPreview.innerHTML = `
      <div class="mudavim-preview-frame">
        <div class="mudavim-preview-head"><span></span><h5>Duyurular</h5><i class="fas fa-xmark" aria-hidden="true"></i></div>
        <article class="mudavim-preview-announcement">
          <header><span>Duyuru</span><h4>${escapeHTML(announcement.title)}</h4></header>
          <div class="mudavim-preview-blocks">
            ${announcement.blocks.length ? announcement.blocks.map(renderMudavimAnnouncementPreviewBlock).join("") : `<div class="mudavim-empty">Henüz blok eklenmedi.</div>`}
          </div>
        </article>
      </div>
    `;
    applyMudavimPreviewImageOrientation(els.mudavimAnnouncementPreview);
  }

  function renderMudavimAnnouncementPreviewBlock(block) {
    const hasText = block.type !== "image";
    const hasImage = block.type !== "text";
    const meta = hasText && (block.badge || block.date) ? `<div class="mudavim-preview-meta">${block.badge ? `<span>${escapeHTML(block.badge)}</span>` : ""}${block.date ? `<time>${escapeHTML(formatMudavimAnnouncementDate(block.date))}</time>` : ""}</div>` : "";
    const copy = hasText ? `<div class="mudavim-preview-copy">${meta}${block.heading ? `<h5>${escapeHTML(block.heading)}</h5>` : ""}${block.body ? `<p>${escapeHTML(block.body).replace(/\n/g, "<br>")}</p>` : ""}</div>` : "";
    const media = hasImage ? `<figure class="mudavim-preview-media">${block.imageUrl ? `<img src="${escapeAttribute(block.imageUrl)}" alt="${escapeAttribute(block.alt || block.heading || "Duyuru görseli")}" data-mudavim-preview-image>` : `<span>Görsel bekleniyor</span>`}</figure>` : "";
    return `<section class="mudavim-preview-block is-${escapeAttribute(block.type)}">${media}${copy}</section>`;
  }

  function formatMudavimAnnouncementDate(value) {
    if (!value) return "";
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  }

  function applyMudavimPreviewImageOrientation(root) {
    root.querySelectorAll("img[data-mudavim-preview-image]").forEach((image) => {
      const apply = () => {
        const frame = image.closest("figure, .mudavim-block-image-fields");
        if (!frame) return;
        frame.classList.toggle("is-portrait", image.naturalHeight > image.naturalWidth);
        frame.classList.toggle("is-landscape", image.naturalHeight <= image.naturalWidth);
      };
      if (image.complete) apply();
      else image.addEventListener("load", apply, { once: true });
    });
  }

  function addMudavimAnnouncement() {
    const announcements = mudavimAnnouncements();
    const now = new Date().toISOString();
    const id = `announcement-${Date.now().toString(36)}`;
    announcements.push({
      id,
      title: "Yeni Duyuru",
      slug: `${slugifyMudavimAnnouncement("Yeni Duyuru")}-${announcements.length + 1}`,
      order: announcements.length,
      isPublished: false,
      blocks: [{
        id: `${id}-block-1`,
        type: "text",
        badge: "",
        date: "",
        heading: "",
        body: "",
        content: "",
        imageUrl: "",
        alt: "",
        order: 0
      }],
      createdAt: now,
      updatedAt: now
    });
    state.selectedMudavimAnnouncementId = id;
    saveSiteSettings();
    renderMudavimAnnouncements();
  }

  function handleMudavimAnnouncementListClick(event) {
    const row = event.target.closest("[data-mudavim-announcement-id]");
    if (!row) return;
    state.selectedMudavimAnnouncementId = row.dataset.mudavimAnnouncementId;
    renderMudavimAnnouncements();
  }

  function handleMudavimAnnouncementEditorInput(event) {
    const announcement = selectedMudavimAnnouncement();
    if (!announcement) return;
    const announcementField = event.target.dataset.mudavimAnnouncementField;
    if (announcementField) {
      announcement[announcementField] = event.target.type === "checkbox"
        ? event.target.checked
        : event.target.type === "number" ? Number(event.target.value || 0) : event.target.value;
      announcement.updatedAt = new Date().toISOString();
      saveSiteSettings();
      renderMudavimAnnouncementPreview();
      return;
    }
    const blockField = event.target.dataset.mudavimBlockField;
    const blockId = event.target.closest("[data-mudavim-block-id]")?.dataset.mudavimBlockId;
    const block = announcement.blocks.find((item) => item.id === blockId);
    if (!blockField || !block) return;
    block[blockField] = event.target.value;
    if (blockField === "body" && block.type === "text") block.content = block.body;
    announcement.updatedAt = new Date().toISOString();
    saveSiteSettings();
    renderMudavimAnnouncementPreview();
  }

  async function handleMudavimAnnouncementEditorChange(event) {
    const input = event.target.closest("[data-mudavim-block-image]");
    if (!input) {
      if (event.target.matches("[data-mudavim-block-field='type']")) {
        renderMudavimAnnouncements();
        return;
      }
      if (event.target.matches("[data-mudavim-announcement-field='title'], [data-mudavim-announcement-field='slug'], [data-mudavim-announcement-field='order'], [data-mudavim-announcement-field='isPublished']")) {
        renderMudavimAnnouncements();
      }
      return;
    }
    const file = input.files && input.files[0];
    const announcement = selectedMudavimAnnouncement();
    const blockId = input.closest("[data-mudavim-block-id]")?.dataset.mudavimBlockId;
    const block = announcement?.blocks.find((item) => item.id === blockId);
    if (!file || !announcement || !block) return;
    input.disabled = true;
    try {
      const media = await storeMediaFile(file, "image");
      block.imageUrl = media.src;
      block.alt = block.alt || announcement.title;
      announcement.updatedAt = new Date().toISOString();
      saveSiteSettings();
      renderMudavimAnnouncements();
      updateSaveControls("Duyuru görseli yüklendi, yayın bekliyor");
    } catch (error) {
      alert(`Duyuru görseli yüklenemedi. ${error.message || "Dosyayı kontrol edin."}`);
      input.disabled = false;
    }
  }

  function handleMudavimAnnouncementEditorClick(event) {
    const button = event.target.closest("[data-mudavim-announcement-action]");
    if (!button) return;
    const action = button.dataset.mudavimAnnouncementAction;
    const announcements = mudavimAnnouncements();
    const announcement = selectedMudavimAnnouncement();
    if (!announcement) return;
    if (action === "delete-announcement") {
      if (!confirm("Bu duyuruyu silmek istiyor musunuz?")) return;
      state.site.mudavim.announcements = announcements.filter((item) => item.id !== announcement.id)
        .map((item, index) => ({ ...item, order: index }));
      state.selectedMudavimAnnouncementId = state.site.mudavim.announcements[0]?.id || "";
      saveSiteSettings();
      renderMudavimAnnouncements();
      return;
    }
    if (["add-text", "add-image", "add-image-text", "add-text-image"].includes(action)) {
      const type = action.replace(/^add-/, "");
      announcement.blocks.push({
        id: `${announcement.id}-block-${Date.now().toString(36)}`,
        type,
        badge: "",
        date: "",
        heading: "",
        body: "",
        content: "",
        imageUrl: "",
        alt: "",
        order: announcement.blocks.length
      });
    }
    const blockId = button.closest("[data-mudavim-block-id]")?.dataset.mudavimBlockId;
    const blockIndex = announcement.blocks.findIndex((item) => item.id === blockId);
    if (action === "delete-block" && blockIndex >= 0) announcement.blocks.splice(blockIndex, 1);
    if (action === "move-block-up" && blockIndex > 0) {
      [announcement.blocks[blockIndex - 1], announcement.blocks[blockIndex]] = [announcement.blocks[blockIndex], announcement.blocks[blockIndex - 1]];
    }
    if (action === "move-block-down" && blockIndex >= 0 && blockIndex < announcement.blocks.length - 1) {
      [announcement.blocks[blockIndex + 1], announcement.blocks[blockIndex]] = [announcement.blocks[blockIndex], announcement.blocks[blockIndex + 1]];
    }
    announcement.blocks.forEach((block, index) => { block.order = index; });
    announcement.updatedAt = new Date().toISOString();
    saveSiteSettings();
    renderMudavimAnnouncements();
  }

  function formatMudavimRewardStatus(status) {
    const labels = {
      ready: "Ödül hazır",
      active: "Aktif",
      used: "Ödül kullanıldı",
      new: "Yeni kayıt"
    };
    return labels[status] || "Aktif";
  }

  function mudavimToday() {
    return new Date().toISOString().slice(0, 10);
  }

  function formatMudavimDate(value) {
    if (!value) return "-";
    const date = new Date(`${value}T12:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" });
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
      console.warn("Geri bildirim backend'den alınamadı.", error);
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

  function renderStaffAccess() {
    if (!els.staffUserList) return;
    const access = state.recipeAccess || { users: [], assignments: [], activity: [] };
    renderStaffUsers(access.users || []);
    renderStaffAssignmentOptions();
    renderStaffAssignments(access.assignments || []);
    renderStaffActivity(access.activity || []);
    if (els.staffUserMessage) els.staffUserMessage.textContent = state.staffMessage || "";
  }

  function renderStaffUsers(users) {
    const list = Array.isArray(users) ? users : [];
    const filter = state.staffUserFilter || "active";
    const visible = list.filter((user) => {
      if (filter === "active") return user.active !== false;
      if (filter === "inactive") return user.active === false;
      return true;
    });
    if (els.staffUserCount) {
      const activeCount = list.filter((user) => user.active !== false).length;
      const passiveCount = list.length - activeCount;
      els.staffUserCount.textContent = `${activeCount} aktif / ${passiveCount} pasif`;
    }
    if (els.staffUserFilter) {
      Array.from(els.staffUserFilter.querySelectorAll("[data-staff-user-filter]")).forEach((button) => {
        button.classList.toggle("is-active", button.dataset.staffUserFilter === filter);
      });
    }
    if (!visible.length) {
      els.staffUserList.innerHTML = `<div class="staff-empty">Bu filtrede barista kullanıcısı yok.</div>`;
      return;
    }

    els.staffUserList.innerHTML = visible.map((user) => `
      <article class="staff-user-row${user.id === state.selectedStaffUserId ? " is-active" : ""}">
        <button class="staff-user-main" type="button" data-staff-user="${escapeAttribute(user.id)}">
          <span>
            <strong>${escapeHTML(user.name || user.username)}</strong>
            <small>@${escapeHTML(user.username)}${user.lastLoginAt ? ` - son giriş ${escapeHTML(formatStaffDate(user.lastLoginAt))}` : ""}</small>
          </span>
        </button>
        <em class="${user.active === false ? "is-passive" : "is-active"}">${user.active === false ? "Pasif" : "Aktif"}</em>
        <span class="staff-row-actions">
          <button class="${user.active === false ? "line-action" : "danger-mini"}" type="button" data-toggle-staff-user="${escapeAttribute(user.id)}" data-next-active="${user.active === false ? "true" : "false"}">
            ${user.active === false ? "Tekrar aktif et" : "Yetkiyi Kaldır"}
          </button>
          <button class="danger-mini" type="button" data-permanent-delete-user="${escapeAttribute(user.id)}">Kalıcı Sil</button>
        </span>
      </article>
    `).join("");
  }

  function handleStaffUserListClick(event) {
    const permanentDeleteButton = event.target.closest("[data-permanent-delete-user]");
    if (permanentDeleteButton) {
      permanentlyDeleteStaffUser(permanentDeleteButton.dataset.permanentDeleteUser);
      return;
    }

    const toggleButton = event.target.closest("[data-toggle-staff-user]");
    if (toggleButton) {
      toggleStaffUserAccess(toggleButton.dataset.toggleStaffUser, toggleButton.dataset.nextActive === "true");
      return;
    }

    const button = event.target.closest("[data-staff-user]");
    if (!button) return;
    const user = (state.recipeAccess.users || []).find((item) => item.id === button.dataset.staffUser);
    if (!user) return;
    state.selectedStaffUserId = user.id;
    if (els.staffUserName) els.staffUserName.value = user.name || "";
    if (els.staffUsername) els.staffUsername.value = user.username || "";
    if (els.staffPassword) els.staffPassword.value = "";
    if (els.staffUserActive) els.staffUserActive.checked = user.active !== false;
    state.staffMessage = "Kullanıcı düzenleniyor";
    renderStaffAccess();
  }

  function handleStaffUserFilterClick(event) {
    const button = event.target.closest("[data-staff-user-filter]");
    if (!button) return;
    state.staffUserFilter = button.dataset.staffUserFilter || "active";
    renderStaffAccess();
  }

  async function toggleStaffUserAccess(id, nextActive) {
    const user = (state.recipeAccess.users || []).find((item) => item.id === id);
    if (!user) return;

    if (!nextActive && !confirm("Bu kullanıcının reçete erişim yetkisi kaldırılacak. Geçmiş görev ve aktivite kayıtları korunacak. Devam edilsin mi?")) {
      return;
    }

    try {
      const result = nextActive
        ? await backendRequest(`/api/admin/recipe-users/${encodeURIComponent(id)}`, {
          method: "PUT",
          body: {
            name: user.name || user.username,
            username: user.username,
            password: "",
            active: true
          }
        })
        : await backendRequest(`/api/admin/recipe-users/${encodeURIComponent(id)}`, {
          method: "DELETE"
        });

      if (Array.isArray(result.users)) state.recipeAccess.users = result.users;
      if (Array.isArray(result.assignments)) state.recipeAccess.assignments = result.assignments;
      if (Array.isArray(result.activity)) state.recipeAccess.activity = result.activity;
      state.staffMessage = nextActive ? "Kullanıcı tekrar aktif edildi" : "Kullanıcı yetkisi kaldırıldı";
      if (!nextActive && state.selectedStaffUserId === id && els.staffUserActive) els.staffUserActive.checked = false;
      renderStaffAccess();
    } catch (error) {
      state.staffMessage = error.message || "Kullanıcı yetkisi güncellenemedi";
      renderStaffAccess();
    }
  }

  async function permanentlyDeleteStaffUser(id) {
    const user = (state.recipeAccess.users || []).find((item) => item.id === id);
    if (!user) return;
    const confirmation = prompt(`${user.name || user.username} kalıcı olarak silinecek. Eski ödev ve aktivite kayıtları korunacak. Devam etmek için KALICI SİL yazın.`);
    if (confirmation !== "KALICI SİL") {
      state.staffMessage = "Kalıcı silme iptal edildi";
      renderStaffAccess();
      return;
    }

    try {
      const result = await backendRequest(`/api/admin/recipe-users/${encodeURIComponent(id)}/permanent`, {
        method: "DELETE",
        body: { confirmation }
      });
      if (Array.isArray(result.users)) state.recipeAccess.users = result.users;
      if (Array.isArray(result.assignments)) state.recipeAccess.assignments = result.assignments;
      if (Array.isArray(result.activity)) state.recipeAccess.activity = result.activity;
      if (state.selectedStaffUserId === id) resetStaffUserForm();
      state.staffMessage = "Kullanıcı kalıcı silindi; eski kayıtlar korundu";
      renderStaffAccess();
    } catch (error) {
      state.staffMessage = error.message || "Kullanıcı kalıcı silinemedi";
      renderStaffAccess();
    }
  }

  function resetStaffUserForm() {
    state.selectedStaffUserId = "";
    state.staffMessage = "";
    if (els.staffUserName) els.staffUserName.value = "";
    if (els.staffUsername) els.staffUsername.value = "";
    if (els.staffPassword) els.staffPassword.value = "";
    if (els.staffUserActive) els.staffUserActive.checked = true;
    renderStaffAccess();
  }

  async function saveStaffUser() {
    const selectedId = state.selectedStaffUserId;
    const payload = {
      name: (els.staffUserName && els.staffUserName.value || "").trim(),
      username: (els.staffUsername && els.staffUsername.value || "").trim(),
      password: (els.staffPassword && els.staffPassword.value || "").trim(),
      active: !els.staffUserActive || els.staffUserActive.checked
    };

    try {
      const result = await backendRequest(selectedId ? `/api/admin/recipe-users/${encodeURIComponent(selectedId)}` : "/api/admin/recipe-users", {
        method: selectedId ? "PUT" : "POST",
        body: payload
      });
      if (Array.isArray(result.users)) state.recipeAccess.users = result.users;
      if (Array.isArray(result.assignments)) state.recipeAccess.assignments = result.assignments;
      if (Array.isArray(result.activity)) state.recipeAccess.activity = result.activity;
      state.selectedStaffUserId = result.user && result.user.id || selectedId || "";
      state.staffMessage = selectedId ? "Kullanıcı güncellendi" : "Kullanıcı oluşturuldu";
      if (els.staffPassword) els.staffPassword.value = "";
      renderStaffAccess();
    } catch (error) {
      state.staffMessage = error.message || "Kullanıcı kaydedilemedi";
      renderStaffAccess();
    }
  }

  function renderStaffAssignmentOptions() {
    if (!els.staffAssignmentUser || !els.staffAssignmentCategory) return;
    const users = (state.recipeAccess.users || []).filter((user) => user.active !== false);
    els.staffAssignmentUser.innerHTML = users.length
      ? users.map((user) => `<option value="${escapeAttribute(user.id)}">${escapeHTML(user.name || user.username)}</option>`).join("")
      : `<option value="">Aktif kullanıcı yok</option>`;

    const categories = recipeCategoryNames();
    const currentCategory = categories.includes(els.staffAssignmentCategory.value)
      ? els.staffAssignmentCategory.value
      : categories[0] || "";
    els.staffAssignmentCategory.innerHTML = categories.length
      ? categories.map((category) => `<option value="${escapeAttribute(category)}">${escapeHTML(category)}</option>`).join("")
      : `<option value="">Reçete yok</option>`;
    els.staffAssignmentCategory.value = currentCategory;
    renderStaffAssignmentProductOptions();
    updateStaffAssignmentControls();
  }

  function renderStaffAssignmentProductOptions() {
    if (!els.staffAssignmentProduct) return;
    const category = els.staffAssignmentCategory ? els.staffAssignmentCategory.value : "";
    const products = recipeProductNames(category);
    const currentProduct = products.includes(els.staffAssignmentProduct.value)
      ? els.staffAssignmentProduct.value
      : products[0] || "";
    els.staffAssignmentProduct.innerHTML = products.length
      ? products.map((product) => `<option value="${escapeAttribute(product)}">${escapeHTML(product)}</option>`).join("")
      : `<option value="">Ürün yok</option>`;
    els.staffAssignmentProduct.value = currentProduct;
    renderStaffAssignmentSizeOptions();
    renderStaffProductPicker();
  }

  function renderStaffAssignmentSizeOptions() {
    if (!els.staffAssignmentSize) return;
    const category = els.staffAssignmentCategory ? els.staffAssignmentCategory.value : "";
    const product = els.staffAssignmentProduct ? els.staffAssignmentProduct.value : "";
    const sizes = Object.keys((state.recipes && state.recipes[category] && state.recipes[category][product]) || {});
    const currentSize = sizes.includes(els.staffAssignmentSize.value) ? els.staffAssignmentSize.value : sizes[0] || "";
    els.staffAssignmentSize.innerHTML = sizes.length
      ? sizes.map((size) => `<option value="${escapeAttribute(size)}">${escapeHTML(size)}</option>`).join("")
      : `<option value="">Ölçü yok</option>`;
    els.staffAssignmentSize.value = currentSize;
    renderStaffProductPicker();
  }

  function updateStaffAssignmentControls() {
    const kind = staffAssignmentKindValue();
    const scope = staffScopeTypeValue();
    const needsQuestions = ["quick_quiz", "exam", "retraining"].includes(kind);
    const usesCategory = scope === "category" || scope === "products";
    const usesProducts = scope === "products";

    if (els.staffAssignmentCategory) els.staffAssignmentCategory.disabled = !usesCategory;
    if (els.staffAssignmentProduct) els.staffAssignmentProduct.disabled = !usesProducts;
    if (els.staffAssignmentSize) els.staffAssignmentSize.disabled = !usesProducts;
    if (els.staffQuestionCount) els.staffQuestionCount.disabled = !needsQuestions;
    if (els.staffPassingScore) els.staffPassingScore.disabled = !needsQuestions;
    if (els.staffDifficulty) els.staffDifficulty.disabled = !needsQuestions;
    renderStaffProductPicker();
  }

  function renderStaffProductPicker() {
    if (!els.staffProductPicker) return;
    const scope = staffScopeTypeValue();
    if (scope !== "products") {
      els.staffProductPicker.innerHTML = `<span class="staff-picker-note">${escapeHTML(staffScopeTypeLabel(scope))} kapsamı seçili.</span>`;
      return;
    }

    const category = els.staffAssignmentCategory ? els.staffAssignmentCategory.value : "";
    const items = flattenRecipeAssignmentItems(category);
    if (!items.length) {
      els.staffProductPicker.innerHTML = `<span class="staff-picker-note">Seçilebilir reçete yok.</span>`;
      return;
    }

    const currentProduct = els.staffAssignmentProduct ? els.staffAssignmentProduct.value : "";
    const currentSize = els.staffAssignmentSize ? els.staffAssignmentSize.value : "";
    els.staffProductPicker.innerHTML = items.map((item) => {
      const checked = item.product === currentProduct && (!currentSize || item.size === currentSize);
      return `
        <label>
          <input type="checkbox" value="${escapeAttribute(recipeItemKey(item))}"${checked ? " checked" : ""}>
          <span>${escapeHTML([item.product, item.size].filter(Boolean).join(" / "))}</span>
        </label>
      `;
    }).join("");
  }

  function flattenRecipeAssignmentItems(categoryFilter) {
    const items = [];
    Object.keys(state.recipes || {}).forEach((category) => {
      if (categoryFilter && category !== categoryFilter) return;
      const products = state.recipes[category] || {};
      Object.keys(products).forEach((product) => {
        const sizes = products[product] || {};
        Object.keys(sizes).forEach((size) => {
          items.push({ category, product, size });
        });
      });
    });
    return items;
  }

  function selectedStaffProducts() {
    const checked = els.staffProductPicker
      ? Array.from(els.staffProductPicker.querySelectorAll("input[type='checkbox']:checked"))
      : [];
    const byKey = new Map(flattenRecipeAssignmentItems("").map((item) => [recipeItemKey(item), item]));
    const selected = checked.map((input) => byKey.get(input.value)).filter(Boolean);
    if (selected.length) return selected;

    const category = els.staffAssignmentCategory && els.staffAssignmentCategory.value || "";
    const product = els.staffAssignmentProduct && els.staffAssignmentProduct.value || "";
    const size = els.staffAssignmentSize && els.staffAssignmentSize.value || "";
    return category && product && size ? [{ category, product, size }] : [];
  }

  function recipeItemKey(item) {
    return [item.category, item.product, item.size].map((part) => String(part || "")).join("|||");
  }

  function staffAssignmentKindValue() {
    const value = els.staffAssignmentKind && els.staffAssignmentKind.value || "quick_quiz";
    return ["quick_quiz", "training", "homework", "exam", "retraining"].includes(value) ? value : "quick_quiz";
  }

  function staffScopeTypeValue() {
    const value = els.staffScopeType && els.staffScopeType.value || "products";
    return ["all", "category", "products", "failed_items"].includes(value) ? value : "products";
  }

  async function createStaffAssignment() {
    const kind = staffAssignmentKindValue();
    const scopeType = staffScopeTypeValue();
    const selectedProducts = scopeType === "products" ? selectedStaffProducts() : [];
    const payload = {
      userId: els.staffAssignmentUser && els.staffAssignmentUser.value || "",
      assignmentKind: kind,
      scopeType,
      category: els.staffAssignmentCategory && els.staffAssignmentCategory.value || "",
      product: els.staffAssignmentProduct && els.staffAssignmentProduct.value || "",
      size: els.staffAssignmentSize && els.staffAssignmentSize.value || "",
      selectedProducts,
      questionCount: els.staffQuestionCount && els.staffQuestionCount.value || (kind === "quick_quiz" ? 3 : 8),
      passingScore: els.staffPassingScore && els.staffPassingScore.value || 70,
      difficulty: els.staffDifficulty && els.staffDifficulty.value || "normal",
      adminNote: els.staffAdminNote && els.staffAdminNote.value || ""
    };

    try {
      const result = await backendRequest("/api/admin/recipe-assignments", {
        method: "POST",
        body: payload
      });
      if (Array.isArray(result.assignments)) state.recipeAccess.assignments = result.assignments;
      if (Array.isArray(result.activity)) state.recipeAccess.activity = result.activity;
      if (els.staffAssignmentMessage) els.staffAssignmentMessage.textContent = "Program atandi";
      if (els.staffAdminNote) els.staffAdminNote.value = "";
      renderStaffAccess();
    } catch (error) {
      if (els.staffAssignmentMessage) els.staffAssignmentMessage.textContent = error.message || "Program atanamadi";
    }
  }

  function renderStaffAssignments(assignments) {
    const list = Array.isArray(assignments) ? assignments : [];
    if (els.staffAssignmentCount) els.staffAssignmentCount.textContent = `${list.length} kayıt`;
    if (!els.staffAssignmentList) return;
    if (els.staffAssignmentSummary) {
      const total = list.length;
      const pending = list.filter((item) => staffAssignmentStatus(item) === "pending").length;
      const completed = list.filter((item) => staffAssignmentStatus(item) === "completed").length;
      const retry = list.filter((item) => ["retry_required", "failed"].includes(staffAssignmentStatus(item))).length;
      els.staffAssignmentSummary.innerHTML = [
        ["Toplam kayıt", total],
        ["Bekleyen", pending],
        ["Tamamlanan", completed],
        ["Tekrar gerekli", retry]
      ].map(([label, value]) => `<article><span>${escapeHTML(label)}</span><strong>${escapeHTML(value)}</strong></article>`).join("");
    }
    if (!list.length) {
      els.staffAssignmentList.innerHTML = `<div class="staff-empty">Henüz eğitim, ödev veya sınav yok.</div>`;
      if (els.staffAssignmentDetail) els.staffAssignmentDetail.hidden = true;
      return;
    }

    els.staffAssignmentList.innerHTML = `
      <div class="staff-ledger staff-assignment-ledger">
        <div class="staff-ledger-head">
          <span>Tarih</span>
          <span>Barista</span>
          <span>Tip</span>
          <span>Başlık</span>
          <span>Kapsam</span>
          <span>Durum</span>
          <span>Ilerleme</span>
          <span>Skor</span>
          <span>Islem</span>
        </div>
        ${list.map((assignment) => {
      const score = staffAssignmentScore(assignment);
      const userName = assignment.name || assignment.username || "Silinmiş Kullanıcı";
      return `
        <article class="staff-assignment-row">
          <span>${escapeHTML(formatStaffDate(assignment.createdAt))}</span>
          <strong>${escapeHTML(userName)}</strong>
          <span>${escapeHTML(staffAssignmentKindLabel(assignment.assignmentKind || assignment.assignmentType))}</span>
          <span>${escapeHTML(assignment.title || [assignment.category, assignment.product, assignment.size].filter(Boolean).join(" / ") || "Program")}</span>
          <span>${escapeHTML(staffScopeSummary(assignment))}</span>
          <em class="${escapeAttribute(staffAssignmentStatus(assignment))}">${escapeHTML(staffAssignmentStatusLabel(assignment.status))}</em>
          <span>${escapeHTML(staffAssignmentProgress(assignment))}</span>
          <span>${escapeHTML(score)}</span>
          <span class="staff-row-actions">
            <button class="line-action" type="button" data-assignment-detail="${escapeAttribute(assignment.id)}">Detay</button>
            <button class="danger-mini" type="button" data-delete-assignment="${escapeAttribute(assignment.id)}">Sil</button>
          </span>
        </article>
      `;
    }).join("")}
      </div>
    `;
  }

  async function handleStaffAssignmentListClick(event) {
    const detailButton = event.target.closest("[data-assignment-detail]");
    if (detailButton) {
      renderStaffAssignmentDetail(detailButton.dataset.assignmentDetail);
      return;
    }

    const button = event.target.closest("[data-delete-assignment]");
    if (!button) return;
    if (!confirm("Bu ödev silinsin mi?")) return;
    try {
      const result = await backendRequest(`/api/admin/recipe-assignments/${encodeURIComponent(button.dataset.deleteAssignment)}`, {
        method: "DELETE"
      });
      if (Array.isArray(result.assignments)) state.recipeAccess.assignments = result.assignments;
      if (els.staffAssignmentDetail) els.staffAssignmentDetail.hidden = true;
      renderStaffAccess();
    } catch (error) {
      if (els.staffAssignmentMessage) els.staffAssignmentMessage.textContent = error.message || "Ödev silinemedi";
    }
  }

  function renderStaffAssignmentDetail(id) {
    const assignment = (state.recipeAccess.assignments || []).find((item) => item.id === id);
    if (!assignment || !els.staffAssignmentDetail) return;
    const questions = Array.isArray(assignment.questions) ? assignment.questions : [];
    const answers = Array.isArray(assignment.answers) ? assignment.answers : [];
    const recipeItems = Array.isArray(assignment.recipeItems) ? assignment.recipeItems : [];
    const failedItems = Array.isArray(assignment.failedItems) ? assignment.failedItems : [];
    els.staffAssignmentDetail.hidden = false;
    els.staffAssignmentDetail.innerHTML = `
      <div class="staff-box-head">
        <h4>Program Detayi</h4>
        <button class="line-action" type="button" data-close-assignment-detail>Kapat</button>
      </div>
      <div class="staff-detail-grid">
        <span>Barista</span><strong>${escapeHTML(assignment.name || assignment.username || "Silinmiş Kullanıcı")}</strong>
        <span>Başlık</span><strong>${escapeHTML(assignment.title || "-")}</strong>
        <span>Tip</span><strong>${escapeHTML(staffAssignmentKindLabel(assignment.assignmentKind || assignment.assignmentType))}</strong>
        <span>Kapsam</span><strong>${escapeHTML(staffScopeSummary(assignment))}</strong>
        <span>Durum</span><strong>${escapeHTML(staffAssignmentStatusLabel(assignment.status))}</strong>
        <span>Ilerleme</span><strong>${escapeHTML(staffAssignmentProgress(assignment))}</strong>
        <span>Skor</span><strong>${escapeHTML(staffAssignmentScore(assignment))}</strong>
        <span>Tamamlanma</span><strong>${escapeHTML(formatStaffDate(assignment.completedAt))}</strong>
        <span>Admin notu</span><strong>${escapeHTML(assignment.adminNote || "-")}</strong>
      </div>
      ${recipeItems.length ? `
        <div class="staff-question-list">
          <article>
            <strong>Kapsamdaki reçeteler</strong>
            <span>${escapeHTML(recipeItems.map((item) => [item.category, item.product, item.size].filter(Boolean).join(" / ")).join(" | "))}</span>
          </article>
        </div>
      ` : ""}
      ${failedItems.length ? `
        <div class="staff-question-list">
          <article>
            <strong>Yanlış yapılan ürünler</strong>
            <span>${escapeHTML(failedItems.map((item) => [item.category, item.product, item.size].filter(Boolean).join(" / ")).join(" | "))}</span>
          </article>
        </div>
      ` : ""}
      <div class="staff-question-list">
        ${questions.map((question, index) => {
      const givenIndex = Number(answers[index]);
      const correctIndex = Number(question.correctIndex);
      const options = Array.isArray(question.options) ? question.options : [];
      return `
          <article>
            <strong>${escapeHTML(index + 1)}. ${escapeHTML(question.text || "Soru")}</strong>
            <span>Verilen cevap: ${escapeHTML(options[givenIndex] || "-")}</span>
            <span>Dogru cevap: ${escapeHTML(options[correctIndex] || "-")}</span>
          </article>
        `;
    }).join("")}
      </div>
    `;
    const closeButton = els.staffAssignmentDetail.querySelector("[data-close-assignment-detail]");
    if (closeButton) closeButton.addEventListener("click", () => {
      els.staffAssignmentDetail.hidden = true;
    });
  }

  function renderStaffActivity(activity) {
    const tab = state.staffActivityTab || "login";
    const list = (Array.isArray(activity) ? activity : [])
      .slice()
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    const filtered = list.filter((item) => staffActivityMatchesTab(item, tab)).slice(0, 50);
    if (els.staffActivityCount) els.staffActivityCount.textContent = `${list.length} kayıt`;
    if (!els.staffActivityList) return;
    if (els.staffActivityTabs) {
      Array.from(els.staffActivityTabs.querySelectorAll("[data-staff-activity-tab]")).forEach((button) => {
        button.classList.toggle("is-active", button.dataset.staffActivityTab === tab);
      });
    }
    if (!filtered.length) {
      els.staffActivityList.innerHTML = `<div class="staff-empty">Bu sekmede aktivite yok.</div>`;
      return;
    }

    els.staffActivityList.innerHTML = `
      <div class="staff-ledger staff-activity-ledger">
        <div class="staff-ledger-head">
          <span>Barista</span>
          <span>Hareket</span>
          <span>Detay</span>
          <span>Tarih</span>
        </div>
        ${filtered.map((item) => `
          <article class="staff-activity-row">
            <strong>${escapeHTML(item.name || item.username || "Bilinmeyen kullanıcı")}</strong>
            <span>${escapeHTML(staffActivityLabel(item.type))}</span>
            <span>${escapeHTML(staffActivityDetail(item))}</span>
            <time>${escapeHTML(formatStaffDate(item.createdAt))}</time>
          </article>
        `).join("")}
      </div>
    `;
  }

  function handleStaffActivityTabClick(event) {
    const button = event.target.closest("[data-staff-activity-tab]");
    if (!button) return;
    state.staffActivityTab = button.dataset.staffActivityTab || "login";
    renderStaffActivity((state.recipeAccess && state.recipeAccess.activity) || []);
  }

  function staffActivityLabel(type) {
    const value = String(type || "");
    if (value === "login") return "Giriş yaptı";
    if (value === "login_failed") return "Hatalı giriş";
    if (value === "view_recipe") return "Reçete açtı";
    if (value === "view_preparation") return "Hazırlanışa baktı";
    if (value === "assignment_created") return "Ödev atandı";
    if (value === "assignment_started") return "Ödev başladı";
    if (value === "training_started") return "Eğitim başladı";
    if (value === "training_assigned") return "Eğitim atandı";
    if (value === "training_completed") return "Eğitim tamamlandı";
    if (value === "homework_assigned") return "Ödev atandı";
    if (value === "homework_started") return "Ödev başladı";
    if (value === "homework_completed") return "Ödev tamamlandı";
    if (value === "exam_assigned") return "Sınav atandı";
    if (value === "exam_started") return "Sınav başladı";
    if (value === "exam_completed") return "Sınav tamamlandı";
    if (value === "exam_failed") return "Sınav başarısız";
    if (value === "retry_training_suggested") return "Tekrar eğitimi önerildi";
    if (value === "assignment_completed") return "Ödev tamamlandı";
    if (value === "assignment_retry_required") return "Tekrar gerekli";
    if (value === "recipe_user_deactivated") return "Yetki kaldırıldı";
    if (value === "recipe_user_reactivated") return "Yetki tekrar verildi";
    if (value === "recipe_user_permanently_deleted") return "Kalıcı silindi";
    return value || "Aktivite";
  }

  function staffActivityMatchesTab(item, tab) {
    const value = String(item && item.type || "");
    if (tab === "login") return value === "login" || value === "login_failed";
    if (tab === "recipe") return value === "view_recipe" || value === "view_preparation";
    if (tab === "training") {
      return ["training_assigned", "training_started", "training_completed", "retry_training_suggested"].includes(value);
    }
    if (tab === "homework") {
      return ["homework_assigned", "homework_started", "homework_completed"].includes(value);
    }
    if (tab === "exam") {
      return ["exam_assigned", "exam_started", "exam_completed", "exam_failed", "assignment_created", "assignment_started", "assignment_completed", "assignment_retry_required"].includes(value);
    }
    return ["recipe_user_deactivated", "recipe_user_reactivated", "recipe_user_permanently_deleted", "login_failed"].includes(value);
  }

  function staffActivityDetail(item) {
    const parts = [item.category, item.product, item.size, item.panel].filter(Boolean);
    if (item.assignmentTitle) parts.unshift(item.assignmentTitle);
    if (item.status) parts.push(staffAssignmentStatusLabel(item.status));
    if (Number(item.total || 0)) parts.push(staffAssignmentScore(item));
    return parts.join(" / ") || "-";
  }

  function staffAssignmentStatus(assignment) {
    const value = String(assignment && assignment.status || "pending");
    return ["pending", "in_progress", "completed", "failed", "retry_required"].includes(value) ? value : "pending";
  }

  function staffAssignmentStatusLabel(status) {
    const value = String(status || "pending");
    return {
      pending: "Bekliyor",
      in_progress: "Devam ediyor",
      completed: "Tamamlandı",
      failed: "Tekrar gerekli",
      retry_required: "Tekrar gerekli"
    }[value] || "Bekliyor";
  }

  function staffAssignmentKindLabel(type) {
    return {
      quick_quiz: "Hizli Quiz",
      quiz: "Hizli Quiz",
      training: "Eğitim Paketi",
      homework: "Çalışma Ödevi",
      exam: "Hakimiyet Sınavı",
      training_quiz: "Eğitim + Test (Eski)",
      retraining: "Tekrar Eğitimi"
    }[String(type || "quick_quiz")] || "Hizli Quiz";
  }

  function staffScopeTypeLabel(type) {
    return {
      all: "Tüm reçeteler",
      category: "Kategori",
      products: "Ürünler",
      failed_items: "Yanlış yapılanlar"
    }[String(type || "products")] || "Ürünler";
  }

  function staffScopeSummary(assignment) {
    const scope = String(assignment && assignment.scopeType || "products");
    const items = Array.isArray(assignment && assignment.recipeItems) ? assignment.recipeItems : [];
    if (scope === "all") return "Tüm reçeteler";
    if (scope === "category") return assignment.category || "Kategori";
    if (scope === "failed_items") return items.length ? `${items.length} yanlış ürün` : "Yanlış yapılanlar";
    if (items.length > 1) return `${items.length} reçete`;
    if (items.length === 1) return [items[0].product, items[0].size].filter(Boolean).join(" / ");
    return [assignment && assignment.category, assignment && assignment.product, assignment && assignment.size].filter(Boolean).join(" / ") || "Ürünler";
  }

  function staffAssignmentProgress(assignment) {
    const totalItems = Array.isArray(assignment && assignment.recipeItems) ? assignment.recipeItems.length : 0;
    const completedItems = Array.isArray(assignment && assignment.completedItems) ? assignment.completedItems.length : 0;
    if (totalItems) return `${completedItems}/${totalItems}`;
    const percent = Number(assignment && assignment.percent);
    if (Number.isFinite(percent) && percent > 0) return `%${Math.round(percent)}`;
    return staffAssignmentStatusLabel(staffAssignmentStatus(assignment));
  }

  function staffAssignmentScore(assignment) {
    const total = Number(assignment && assignment.total || 0) || 0;
    const score = Number(assignment && assignment.score || 0) || 0;
    if (!total) return "-";
    const status = staffAssignmentStatus(assignment);
    if (status === "pending") return "Bekliyor";
    if (status === "in_progress") return "Devam ediyor";
    return `${score}/${total}`;
  }

  function formatStaffDate(value) {
    if (!value) return "-";
    try {
      return new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(value));
    } catch (error) {
      return String(value);
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
    return rating ? `${"★".repeat(rating)}${"\u2606".repeat(5 - rating)} ${rating}/5` : "Puan yok";
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
    renderMenuUiSummary(settings);
    renderBannerSettingsForm(settings.banner);

    const category = selectedCategory();
    if (category) {
      els.categoryEditorTitle.textContent = `${category.name} kategorisi`;
      els.categoryName.value = category.name;
      els.categoryActive.checked = category.active;
      renderCategoryIconOptions(category);
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
    renderSiteEditorForm();

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
    els.productIngredients.value = product.manualContent || product.details.ingredients;
    renderProductRecipeLink(product);
  }

  function renderProductRecipeLink(product) {
    if (!els.productContentMode || !els.productRecipeId || !els.productRecipeSize) return;
    els.productContentMode.value = product.contentMode || "manual";
    const catalog = normalizeRecipeCatalog(state.recipeCatalog);
    els.productRecipeId.innerHTML = `<option value="">Bağlantı yok</option>${catalog.map((item) => `
      <option value="${escapeAttribute(item.id)}">${escapeHTML(item.category)} / ${escapeHTML(item.product)}</option>
    `).join("")}`;
    els.productRecipeId.value = catalog.some((item) => item.id === product.recipeId) ? product.recipeId : "";
    const linked = catalog.find((item) => item.id === els.productRecipeId.value);
    const sizes = linked && state.recipes[linked.category] && state.recipes[linked.category][linked.product]
      ? Object.keys(state.recipes[linked.category][linked.product]) : [];
    els.productRecipeSize.innerHTML = `<option value="">Otomatik (Standart → 16 oz → ilk)</option>${sizes.map((size) => `
      <option value="${escapeAttribute(size)}">${escapeHTML(size)}</option>
    `).join("")}`;
    els.productRecipeSize.value = sizes.includes(product.recipeSize) ? product.recipeSize : "";
    const status = linked ? `Bağlı: ${linked.category} / ${linked.product}` : "Eşleştirme gerekli veya manuel içerik kullanılmalı.";
    if (els.productRecipeLinkStatus) els.productRecipeLinkStatus.textContent = status;
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

  function renderSiteEditorForm() {
    if (!state.site || Number(state.site.schemaVersion || 0) < 2) return;
    document.querySelectorAll("[data-site-path]").forEach((input) => {
      const value = getValueAtPath(state.site, input.dataset.sitePath);
      if (input.dataset.siteType === "boolean") input.checked = value !== false;
      else if (input.dataset.siteType === "array") input.value = Array.isArray(value) ? value.join(", ") : "";
      else input.value = value == null ? "" : String(value);
    });
    if (els.siteSectionOrder) els.siteSectionOrder.value = Array.isArray(state.site.sectionOrder) ? state.site.sectionOrder.join(", ") : "";
  }

  function getValueAtPath(source, pathValue) {
    return String(pathValue || "").split(".").filter(Boolean).reduce((value, key) => value == null ? undefined : value[key], source);
  }

  function setValueAtPath(target, pathValue, value) {
    const keys = String(pathValue || "").split(".").filter(Boolean);
    if (!keys.length) return;
    let cursor = target;
    keys.slice(0, -1).forEach((key, index) => {
      const nextKey = keys[index + 1];
      if (!cursor[key] || typeof cursor[key] !== "object") cursor[key] = /^\d+$/.test(nextKey) ? [] : {};
      cursor = cursor[key];
    });
    cursor[keys[keys.length - 1]] = value;
  }

  function handleSiteEditorInput(event) {
    const input = event.currentTarget;
    if (!input || !state.site || Number(state.site.schemaVersion || 0) < 2) return;
    let value = input.value;
    if (input.dataset.siteType === "boolean") value = input.checked;
    if (input.dataset.siteType === "number") value = Number(input.value || 0);
    if (input.dataset.siteType === "array") value = String(input.value || "").split(",").map((item) => item.trim()).filter(Boolean);
    setValueAtPath(state.site, input.dataset.sitePath, value);
    saveSiteSettings();
  }

  function handleSiteSectionOrder() {
    if (!state.site || Number(state.site.schemaVersion || 0) < 2) return;
    state.site.sectionOrder = String(els.siteSectionOrder.value || "").split(",").map((item) => item.trim()).filter(Boolean);
    saveSiteSettings();
  }

  async function handleSiteMediaUpload(event) {
    const input = event.currentTarget;
    const file = input && input.files && input.files[0];
    if (!file || !state.site) return;
    input.disabled = true;
    try {
      const media = await storeMediaFile(file, file.type.startsWith("video/") ? "video" : "image");
      setValueAtPath(state.site, input.dataset.siteUploadTarget, media.src);
      saveSiteSettings();
      renderSiteEditorForm();
      updateSaveControls("Medya yüklendi, yayın bekliyor");
    } catch (error) {
      alert(`Medya yüklenemedi. ${error.message || "Dosyayı kontrol edin."}`);
    } finally {
      input.value = "";
      input.disabled = false;
    }
  }

  async function loadSiteRevisions() {
    if (!backendBaseUrl() || !els.siteRevisionList) return;
    els.siteRevisionList.textContent = "Yükleniyor...";
    try {
      const result = await backendRequest("/api/admin/site/revisions");
      state.siteRevisions = Array.isArray(result.revisions) ? result.revisions : [];
      renderSiteRevisions();
    } catch (error) {
      els.siteRevisionList.textContent = error.message || "Revizyonlar alınamadı.";
    }
  }

  function renderSiteRevisions() {
    if (!els.siteRevisionList) return;
    els.siteRevisionList.innerHTML = state.siteRevisions.length ? state.siteRevisions.map((revision) => `
      <article class="icon-link-item">
        <div><strong>${escapeHTML(new Date(revision.createdAt).toLocaleString("tr-TR"))}</strong><small>${escapeHTML(revision.id)}</small></div>
        <button class="line-action" type="button" data-site-revision-id="${escapeAttribute(revision.id)}">Geri Yükle</button>
      </article>
    `).join("") : "Henüz geri alınabilir yayın yok.";
  }

  async function handleSiteRevisionRestore(event) {
    const button = event.target.closest("[data-site-revision-id]");
    if (!button || !confirm("Bu site yayınını geri yüklemek istiyor musunuz?")) return;
    try {
      const result = await backendRequest(`/api/admin/site/revisions/${encodeURIComponent(button.dataset.siteRevisionId)}/restore`, { method: "POST" });
      state.site = normalizeSiteSettings(result.siteState);
      state.dirtySite = false;
      renderSiteEditorForm();
      await loadSiteRevisions();
      updateSaveControls("Revizyon geri yüklendi");
    } catch (error) {
      alert(`Revizyon geri yüklenemedi. ${error.message || ""}`);
    }
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
      heroImageUrl: "/assets/brand/logo-primary.png"
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
    if (els.productContentMode) els.productContentMode.value = "manual";
    if (els.productRecipeId) els.productRecipeId.innerHTML = `<option value="">Bağlantı yok</option>`;
    if (els.productRecipeSize) els.productRecipeSize.innerHTML = `<option value="">Otomatik</option>`;
    if (els.productRecipeLinkStatus) els.productRecipeLinkStatus.textContent = "Reçete bağlantısı seçilmedi.";
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

  function renderCategoryIconOptions(category) {
    if (!els.categoryIconKey) return;
    const current = normalizeCategoryIconKey(category.iconKey || category.icon, category.name);
    els.categoryIconKey.innerHTML = CATEGORY_ICON_REGISTRY.options().map((item) => (
      `<option value="${escapeAttribute(item.key)}">${escapeHTML(`${item.mark || ""} ${item.label}`.trim())}</option>`
    )).join("");
    els.categoryIconKey.value = current;
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

  function bindMenuOutputEvents() {
    [
      "menuOutputBgColor", "menuOutputBoxColor", "menuOutputTextColor",
      "menuOutputTitleFont", "menuOutputBodyFont", "menuOutputPriceFont",
      "menuOutputProductSize", "menuOutputRowGap", "menuOutputDate",
      "menuOutputTemplateName", "menuOutputCanvaLink"
    ].forEach((id) => {
      if (!els[id]) return;
      els[id].addEventListener("input", updateMenuOutputFromControls);
      els[id].addEventListener("change", updateMenuOutputFromControls);
    });
    if (els.menuOutputAddSection) els.menuOutputAddSection.addEventListener("click", addMenuOutputSection);
    if (els.menuOutputSectionList) {
      els.menuOutputSectionList.addEventListener("input", handleMenuOutputSectionInput);
      els.menuOutputSectionList.addEventListener("change", handleMenuOutputSectionInput);
      els.menuOutputSectionList.addEventListener("click", handleMenuOutputSectionClick);
    }
    if (els.menuOutputLayerList) els.menuOutputLayerList.addEventListener("click", handleMenuOutputLayerClick);
    if (els.menuOutputControlTabs) els.menuOutputControlTabs.addEventListener("click", handleMenuOutputControlTabClick);
    if (els.menuOutputPreview) els.menuOutputPreview.addEventListener("pointerdown", startMenuOutputSectionPointer);
    if (els.menuOutputTemplateList) els.menuOutputTemplateList.addEventListener("click", handleMenuOutputTemplateClick);
    if (els.menuOutputSaveTemplate) els.menuOutputSaveTemplate.addEventListener("click", saveMenuOutputTemplate);
    if (els.menuOutputUpdateTemplate) els.menuOutputUpdateTemplate.addEventListener("click", updateMenuOutputTemplate);
    if (els.menuOutputDuplicateTemplate) els.menuOutputDuplicateTemplate.addEventListener("click", duplicateMenuOutputTemplate);
    if (els.menuOutputDeleteTemplate) els.menuOutputDeleteTemplate.addEventListener("click", deleteMenuOutputTemplate);
    if (els.menuOutputSetDefaultTemplate) els.menuOutputSetDefaultTemplate.addEventListener("click", setDefaultMenuOutputTemplate);
    if (els.menuOutputOpenCanva) els.menuOutputOpenCanva.addEventListener("click", openMenuOutputCanva);
    if (els.menuOutputReset) els.menuOutputReset.addEventListener("click", resetMenuOutputDesign);
    if (els.menuOutputExportPng) els.menuOutputExportPng.addEventListener("click", () => exportMenuOutputImage("png"));
    if (els.menuOutputExportJpg) els.menuOutputExportJpg.addEventListener("click", () => exportMenuOutputImage("jpg"));
    if (els.menuOutputExportPdf) els.menuOutputExportPdf.addEventListener("click", exportMenuOutputPdf);
    if (els.menuOutputZoomOut) els.menuOutputZoomOut.addEventListener("click", () => setMenuOutputZoom(menuOutputPreviewScale() - 0.1));
    if (els.menuOutputZoomIn) els.menuOutputZoomIn.addEventListener("click", () => setMenuOutputZoom(menuOutputPreviewScale() + 0.1));
    if (els.menuOutputFitPreview) els.menuOutputFitPreview.addEventListener("click", fitMenuOutputPreview);
    if (els.menuOutputZoomActual) els.menuOutputZoomActual.addEventListener("click", () => setMenuOutputZoom(1));
    if (els.menuOutputGridToggle) els.menuOutputGridToggle.addEventListener("click", toggleMenuOutputGrid);
    if (els.menuOutputSafeAreaToggle) els.menuOutputSafeAreaToggle.addEventListener("click", toggleMenuOutputSafeArea);
    if (els.menuOutputFullscreen) els.menuOutputFullscreen.addEventListener("click", toggleMenuOutputFullscreen);
    window.addEventListener("resize", applyMenuOutputZoom);
    document.addEventListener("fullscreenchange", syncMenuOutputFullscreenState);
  }

  function menuOutputPreviewScale() {
    if (state.menuOutputZoom > 0) return state.menuOutputZoom;
    if (!els.menuOutputPreviewStage) return 0.3;
    const width = Math.max(1, els.menuOutputPreviewStage.clientWidth - 34);
    const height = Math.max(1, els.menuOutputPreviewStage.clientHeight - 34);
    return clamp(Math.min(width / MENU_OUTPUT_WIDTH, height / MENU_OUTPUT_HEIGHT), MENU_OUTPUT_MIN_ZOOM, MENU_OUTPUT_MAX_ZOOM);
  }

  function setMenuOutputZoom(value) {
    state.menuOutputZoom = clamp(Number(value) || 1, MENU_OUTPUT_MIN_ZOOM, MENU_OUTPUT_MAX_ZOOM);
    applyMenuOutputZoom();
  }

  function fitMenuOutputPreview() {
    state.menuOutputZoom = 0;
    applyMenuOutputZoom();
  }

  function handleMenuOutputControlTabClick(event) {
    const button = event.target.closest("[data-menu-output-tab]");
    if (!button) return;
    setMenuOutputControlTab(button.dataset.menuOutputTab);
  }

  function setMenuOutputControlTab(tab) {
    const allowed = ["sections", "style", "layers", "templates", "output"];
    state.menuOutputControlTab = allowed.includes(tab) ? tab : "sections";
    document.querySelectorAll("[data-menu-output-tab]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.menuOutputTab === state.menuOutputControlTab);
    });
    document.querySelectorAll("[data-menu-output-control-panel]").forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.menuOutputControlPanel === state.menuOutputControlTab);
    });
  }

  function toggleMenuOutputGrid() {
    const menuOutput = ensureMenuOutputState();
    menuOutput.gridEnabled = !menuOutput.gridEnabled;
    saveMenuOutputState(true);
  }

  function toggleMenuOutputSafeArea() {
    const menuOutput = ensureMenuOutputState();
    menuOutput.safeAreaEnabled = !menuOutput.safeAreaEnabled;
    saveMenuOutputState(true);
  }

  function applyMenuOutputZoom() {
    if (!els.menuOutputPreview || !els.menuOutputCanvasShell) return;
    const scale = menuOutputPreviewScale();
    els.menuOutputPreview.style.setProperty("--menu-output-preview-scale", scale.toFixed(4));
    els.menuOutputCanvasShell.style.width = `${Math.round(MENU_OUTPUT_WIDTH * scale)}px`;
    els.menuOutputCanvasShell.style.height = `${Math.round(MENU_OUTPUT_HEIGHT * scale)}px`;
    if (els.menuOutputZoomValue) {
      els.menuOutputZoomValue.textContent = state.menuOutputZoom > 0 ? `%${Math.round(scale * 100)}` : `Sığdır · %${Math.round(scale * 100)}`;
    }
  }

  async function toggleMenuOutputFullscreen() {
    const target = els.menuOutputPreviewStage;
    if (!target) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }
      if (!target.requestFullscreen) throw new Error("Fullscreen API desteklenmiyor");
      await target.requestFullscreen();
    } catch (_error) {
      showMenuOutputNotice("Tam ekran modu tarayıcı tarafından engellendi.");
    }
  }

  function syncMenuOutputFullscreenState() {
    state.menuOutputFullscreen = document.fullscreenElement === els.menuOutputPreviewStage;
    if (els.menuOutputFullscreen) {
      els.menuOutputFullscreen.textContent = state.menuOutputFullscreen ? "Tam ekrandan çık" : "Tam ekran";
    }
    applyMenuOutputZoom();
  }

  function showMenuOutputNotice(message) {
    if (!els.menuOutputStatus) return;
    window.clearTimeout(state.menuOutputNoticeTimer);
    els.menuOutputStatus.classList.add("is-warning");
    els.menuOutputStatus.textContent = message;
    state.menuOutputNoticeTimer = window.setTimeout(() => {
      els.menuOutputStatus.classList.remove("is-warning");
      renderMenuOutputPreview(ensureMenuOutputState());
    }, 3600);
  }

  function ensureMenuOutputState() {
    if (!state.data) return normalizeMenuOutput(null);
    if (!state.data.settings) state.data.settings = {};
    state.data.settings.menuOutput = normalizeMenuOutput(state.data.settings.menuOutput);
    return state.data.settings.menuOutput;
  }

  function normalizeMenuOutput(value) {
    const source = value && typeof value === "object" ? value : {};
    const settings = Object.assign({}, DEFAULT_MENU_OUTPUT.settings, source.settings || {});
    settings.productSize = clamp(Number(settings.productSize || DEFAULT_MENU_OUTPUT.settings.productSize), 12, 72);
    settings.rowGap = clamp(Number(settings.rowGap || DEFAULT_MENU_OUTPUT.settings.rowGap), 10, 90);
    return {
      templateName: source.templateName || DEFAULT_MENU_OUTPUT.templateName,
      currentTemplateId: source.currentTemplateId || "",
      defaultTemplateId: source.defaultTemplateId || "",
      canvaLink: source.canvaLink || DEFAULT_MENU_OUTPUT.canvaLink,
      gridEnabled: source.gridEnabled !== false,
      safeAreaEnabled: source.safeAreaEnabled !== false,
      settings,
      sections: Array.isArray(source.sections) ? source.sections.map(normalizeMenuOutputSection).filter(Boolean) : [],
      templates: Array.isArray(source.templates) ? source.templates.map(normalizeMenuOutputTemplate).filter(Boolean) : []
    };
  }

  function normalizeMenuOutputSection(section, index) {
    if (!section || typeof section !== "object") return null;
    const type = ["main", "bottom", "right", "small"].includes(section.type) ? section.type : "main";
    const base = menuOutputDefaultLayout(type, index || 0);
    const normalized = Object.assign({
      id: section.id || makeId("menu-output", `alan-${index || 0}`),
      title: section.title || "SPECIAL",
      type,
      mode: ["category", "manual", "all"].includes(section.mode) ? section.mode : "category",
      categoryId: section.categoryId || "",
      productIds: Array.isArray(section.productIds) ? section.productIds : [],
      bgColor: "",
      titleColor: "",
      textColor: "",
      font: "",
      fontSize: 0,
      rowGap: 0,
      showPrices: true,
      showDescription: false,
      icon: "",
      iconOpacity: 0.85,
      bgIcon: "",
      bgIconOpacity: 0.12,
      frame: "shadow",
      offsetX: 0,
      offsetY: 0,
      x: base.x + Number(section.offsetX || 0),
      y: base.y + Number(section.offsetY || 0),
      width: base.w,
      height: base.h,
      zIndex: (index || 0) + 10,
      hidden: false,
      locked: false,
      overflow: false,
      overflowCount: 0
    }, section);
    normalized.x = Number.isFinite(Number(normalized.x)) ? Number(normalized.x) : base.x;
    normalized.y = Number.isFinite(Number(normalized.y)) ? Number(normalized.y) : base.y;
    normalized.width = Number(normalized.width) > 0 ? Number(normalized.width) : base.w;
    normalized.height = Number(normalized.height) > 0 ? Number(normalized.height) : base.h;
    normalized.zIndex = Number.isFinite(Number(normalized.zIndex)) ? Number(normalized.zIndex) : (index || 0) + 10;
    normalized.hidden = normalized.hidden === true;
    normalized.locked = normalized.locked === true;
    normalized.overflow = normalized.overflow === true;
    normalized.overflowCount = Math.max(0, Number(normalized.overflowCount || 0));
    return normalized;
  }

  function normalizeMenuOutputTemplate(template) {
    if (!template || typeof template !== "object") return null;
    const snapshot = template.snapshot && typeof template.snapshot === "object" ? template.snapshot : {};
    return {
      id: template.id || makeId("menu-output-template", template.name || "şablon"),
      name: template.name || "Menü şablonu",
      snapshot: normalizeMenuOutput(snapshot),
      createdAt: template.createdAt || new Date().toISOString(),
      updatedAt: template.updatedAt || template.createdAt || new Date().toISOString()
    };
  }

  function saveMenuOutputState(render) {
    ensureMenuOutputState();
    safeLocalSet(STORAGE_KEY, JSON.stringify(state.data));
    markDirty("menu");
    if (render !== false) renderMenuOutput();
  }

  function updateMenuOutputFromControls() {
    const menuOutput = ensureMenuOutputState();
    menuOutput.templateName = els.menuOutputTemplateName ? els.menuOutputTemplateName.value.trim() || menuOutput.templateName : menuOutput.templateName;
    menuOutput.canvaLink = els.menuOutputCanvaLink ? els.menuOutputCanvaLink.value.trim() : menuOutput.canvaLink;
    menuOutput.settings = Object.assign({}, menuOutput.settings, {
      bgColor: els.menuOutputBgColor ? els.menuOutputBgColor.value : menuOutput.settings.bgColor,
      boxColor: els.menuOutputBoxColor ? els.menuOutputBoxColor.value : menuOutput.settings.boxColor,
      textColor: els.menuOutputTextColor ? els.menuOutputTextColor.value : menuOutput.settings.textColor,
      titleFont: els.menuOutputTitleFont ? els.menuOutputTitleFont.value : menuOutput.settings.titleFont,
      bodyFont: els.menuOutputBodyFont ? els.menuOutputBodyFont.value : menuOutput.settings.bodyFont,
      priceFont: els.menuOutputPriceFont ? els.menuOutputPriceFont.value : menuOutput.settings.priceFont,
      productSize: els.menuOutputProductSize ? Number(els.menuOutputProductSize.value || 28) : menuOutput.settings.productSize,
      rowGap: els.menuOutputRowGap ? Number(els.menuOutputRowGap.value || 34) : menuOutput.settings.rowGap,
      dateText: els.menuOutputDate ? els.menuOutputDate.value.trim() : menuOutput.settings.dateText
    });
    saveMenuOutputState(true);
  }

  function createMenuOutputSection(type, index) {
    const firstCategory = state.data && state.data.categories && state.data.categories[0] ? state.data.categories[0].id : "";
    return normalizeMenuOutputSection({
      id: makeId("menu-output", Date.now()),
      title: els.menuOutputSectionTitle ? els.menuOutputSectionTitle.value.trim() || "SPECIAL" : "SPECIAL",
      type: type || (els.menuOutputSectionType ? els.menuOutputSectionType.value : "main"),
      mode: els.menuOutputSectionMode ? els.menuOutputSectionMode.value : "category",
      categoryId: els.menuOutputSectionCategory ? els.menuOutputSectionCategory.value || firstCategory : firstCategory,
      icon: "",
      bgIcon: ""
    }, index || 0);
  }

  function addMenuOutputSection() {
    const menuOutput = ensureMenuOutputState();
    const section = createMenuOutputSection(null, menuOutput.sections.length);
    menuOutput.sections.push(section);
    state.selectedMenuOutputSectionId = section.id;
    saveMenuOutputState(true);
  }

  function renderMenuOutput() {
    if (!els.menuOutputCard) return;
    const menuOutput = ensureMenuOutputState();
    renderMenuOutputControls(menuOutput);
    renderMenuOutputSections(menuOutput);
    renderMenuOutputLayers(menuOutput);
    renderMenuOutputTemplates(menuOutput);
    renderMenuOutputQualityPanel(menuOutput);
    renderMenuOutputPreview(menuOutput);
    setMenuOutputControlTab(state.menuOutputControlTab);
  }

  function renderMenuOutputControls(menuOutput) {
    if (els.menuOutputTemplateName) els.menuOutputTemplateName.value = menuOutput.templateName || "";
    if (els.menuOutputCanvaLink) els.menuOutputCanvaLink.value = menuOutput.canvaLink || "";
    if (els.menuOutputBgColor) els.menuOutputBgColor.value = menuOutput.settings.bgColor || DEFAULT_MENU_OUTPUT.settings.bgColor;
    if (els.menuOutputBoxColor) els.menuOutputBoxColor.value = menuOutput.settings.boxColor || DEFAULT_MENU_OUTPUT.settings.boxColor;
    if (els.menuOutputTextColor) els.menuOutputTextColor.value = menuOutput.settings.textColor || DEFAULT_MENU_OUTPUT.settings.textColor;
    setFontSelectValue(els.menuOutputTitleFont, menuOutput.settings.titleFont || BRAND_BODY_FONT);
    setFontSelectValue(els.menuOutputBodyFont, menuOutput.settings.bodyFont || BRAND_BODY_FONT);
    setFontSelectValue(els.menuOutputPriceFont, menuOutput.settings.priceFont || BRAND_BODY_FONT);
    if (els.menuOutputProductSize) els.menuOutputProductSize.value = menuOutput.settings.productSize || 28;
    if (els.menuOutputRowGap) els.menuOutputRowGap.value = menuOutput.settings.rowGap || 34;
    if (els.menuOutputDate) els.menuOutputDate.value = menuOutput.settings.dateText || "";
    if (els.menuOutputGridToggle) {
      els.menuOutputGridToggle.textContent = menuOutput.gridEnabled ? "Grid açık" : "Grid kapalı";
      els.menuOutputGridToggle.classList.toggle("is-active", menuOutput.gridEnabled);
    }
    if (els.menuOutputSafeAreaToggle) {
      els.menuOutputSafeAreaToggle.textContent = menuOutput.safeAreaEnabled ? "Güvenli alan" : "Güvenli alan kapalı";
      els.menuOutputSafeAreaToggle.classList.toggle("is-active", menuOutput.safeAreaEnabled);
    }
    renderMenuOutputCategorySelect();
  }

  function renderMenuOutputCategorySelect() {
    if (!els.menuOutputSectionCategory || !state.data) return;
    const options = state.data.categories.map((category) => `
      <option value="${escapeAttribute(category.id)}">${escapeHTML(category.name)}</option>
    `).join("");
    els.menuOutputSectionCategory.innerHTML = options;
  }

  function renderMenuOutputSections(menuOutput) {
    if (!els.menuOutputSectionList) return;
    if (!menuOutput.sections.length) {
      els.menuOutputSectionList.innerHTML = `<div class="empty-mini">Henüz alan yok. Alan Ekle ile başlayın.</div>`;
      return;
    }
    const categories = menuOutputCategoryOptions();
    const products = menuOutputProducts();
    els.menuOutputSectionList.innerHTML = menuOutput.sections.map((section, index) => {
      const selected = section.id === state.selectedMenuOutputSectionId;
      const diagnostics = menuOutputSectionDiagnostics(section, menuOutput);
      const statusBadges = [
        section.hidden ? `<span class="menu-output-badge">Gizli</span>` : "",
        section.locked ? `<span class="menu-output-badge">Kilitli</span>` : "",
        diagnostics.hasMissingData ? `<span class="menu-output-badge is-warning">Eksik veri</span>` : "",
        diagnostics.overflowCount > 0 ? `<span class="menu-output-badge is-warning">${diagnostics.overflowCount} ürün taşıyor</span>` : ""
      ].filter(Boolean).join("");
      return `
        <article class="menu-output-section-item${selected ? " is-active" : ""}${section.hidden ? " is-hidden" : ""}${section.locked ? " is-locked" : ""}" data-menu-output-section="${escapeAttribute(section.id)}">
          <div class="section-item-head">
            <div class="menu-output-section-title">
              <strong>${escapeHTML(section.title || `Alan ${index + 1}`)}</strong>
              <span>${statusBadges}</span>
            </div>
            <div>
              <button class="line-action" type="button" data-menu-output-action="duplicate">Kopyala</button>
              <button class="line-action" type="button" data-menu-output-action="visibility">${section.hidden ? "Göster" : "Gizle"}</button>
              <button class="line-action" type="button" data-menu-output-action="lock">${section.locked ? "Kilidi aç" : "Kilitle"}</button>
              <button class="line-action" type="button" data-menu-output-action="forward"${section.locked ? " disabled" : ""}>Öne</button>
              <button class="line-action" type="button" data-menu-output-action="backward"${section.locked ? " disabled" : ""}>Arkaya</button>
              <button class="danger-mini" type="button" data-menu-output-delete${section.locked ? " disabled" : ""}>Sil</button>
            </div>
          </div>
          ${diagnostics.messages.length ? `<div class="menu-output-section-warnings">${diagnostics.messages.map((message) => `<span>${escapeHTML(message)}</span>`).join("")}</div>` : ""}
          <fieldset class="menu-output-section-fields"${section.locked ? " disabled" : ""}>
          <div class="form-grid three">
            <label><span>Başlık</span><input data-menu-output-field="title" value="${escapeAttribute(section.title)}"></label>
            <label><span>Alan tipi</span><select data-menu-output-field="type">${menuOutputOptions([["main","Ana büyük liste"],["bottom","Alt yatay kategori"],["right","Sağ küçük kategori"],["small","Extra/küçük kart"]], section.type)}</select></label>
            <label><span>Ürün seçimi</span><select data-menu-output-field="mode">${menuOutputOptions([["category","Tüm kategori"],["manual","Manuel"],["all","Tüm menü"]], section.mode)}</select></label>
            <label><span>Kategori</span><select data-menu-output-field="categoryId">${menuOutputOptions(categories, section.categoryId)}</select></label>
            <label><span>Kutu rengi</span><input type="color" data-menu-output-field="bgColor" value="${escapeAttribute(section.bgColor || menuOutput.settings.boxColor)}"></label>
            <label><span>Başlık rengi</span><input type="color" data-menu-output-field="titleColor" value="${escapeAttribute(section.titleColor || menuOutput.settings.textColor)}"></label>
            <label><span>Yazı rengi</span><input type="color" data-menu-output-field="textColor" value="${escapeAttribute(section.textColor || menuOutput.settings.textColor)}"></label>
            <label><span>Font</span><select data-menu-output-field="font">${menuOutputOptions(FONT_OPTIONS.map(([label, value]) => [value, label]), section.font || menuOutput.settings.bodyFont)}</select></label>
            <label><span>Punto</span><input type="number" min="12" max="64" data-menu-output-field="fontSize" value="${escapeAttribute(section.fontSize || menuOutput.settings.productSize)}"></label>
            <label><span>Satır aralığı</span><input type="number" min="10" max="90" data-menu-output-field="rowGap" value="${escapeAttribute(section.rowGap || menuOutput.settings.rowGap)}"></label>
            <label><span>İkon</span><select data-menu-output-field="icon">${menuOutputOptions(MENU_OUTPUT_ICON_OPTIONS.map(([value, label, mark]) => [value, `${mark ? `${mark} ` : ""}${label}`]), section.icon || "")}</select></label>
            <label><span>Arka plan ikonu</span><select data-menu-output-field="bgIcon">${menuOutputOptions(MENU_OUTPUT_ICON_OPTIONS.map(([value, label, mark]) => [value, `${mark ? `${mark} ` : ""}${label}`]), section.bgIcon || "")}</select></label>
            <label><span>İkon opacity</span><input type="number" min="0" max="1" step="0.05" data-menu-output-field="iconOpacity" value="${escapeAttribute(section.iconOpacity ?? 0.85)}"></label>
            <label><span>Arka ikon opacity</span><input type="number" min="0" max="0.7" step="0.05" data-menu-output-field="bgIconOpacity" value="${escapeAttribute(section.bgIconOpacity ?? 0.12)}"></label>
            <label><span>Çerçeve/dekor</span><select data-menu-output-field="frame">${menuOutputOptions(MENU_OUTPUT_FRAME_OPTIONS, section.frame || "shadow")}</select></label>
            <label><span>X</span><input type="number" step="8" data-menu-output-field="x" value="${escapeAttribute(Math.round(section.x))}"></label>
            <label><span>Y</span><input type="number" step="8" data-menu-output-field="y" value="${escapeAttribute(Math.round(section.y))}"></label>
            <label><span>Genişlik</span><input type="number" min="180" max="1080" step="8" data-menu-output-field="width" value="${escapeAttribute(Math.round(section.width))}"></label>
            <label><span>Yükseklik</span><input type="number" min="140" max="1920" step="8" data-menu-output-field="height" value="${escapeAttribute(Math.round(section.height))}"></label>
            <label><span>Katman</span><input type="number" min="0" max="999" step="1" data-menu-output-field="zIndex" value="${escapeAttribute(Math.round(section.zIndex))}"></label>
          </div>
          <div class="form-grid two">
            <label class="toggle-row"><input type="checkbox" data-menu-output-field="showPrices" ${section.showPrices !== false ? "checked" : ""}><span>Fiyat kolonları</span></label>
            <label class="toggle-row"><input type="checkbox" data-menu-output-field="showDescription" ${section.showDescription ? "checked" : ""}><span>Açıklama / içerik</span></label>
          </div>
          <div class="menu-output-product-picker" ${section.mode === "manual" ? "" : "hidden"}>
            ${products.map(({ category, product }) => `
              <label class="toggle-row">
                <input type="checkbox" data-menu-output-product="${escapeAttribute(product.id)}" ${section.productIds.includes(product.id) ? "checked" : ""}>
                <span>${escapeHTML(category.name)} / ${escapeHTML(product.name)}</span>
              </label>
            `).join("")}
          </div>
          </fieldset>
        </article>
      `;
    }).join("");
  }

  function handleMenuOutputSectionInput(event) {
    const container = event.target.closest("[data-menu-output-section]");
    if (!container) return;
    const menuOutput = ensureMenuOutputState();
    const section = menuOutput.sections.find((item) => item.id === container.dataset.menuOutputSection);
    if (!section || section.locked) return;
    state.selectedMenuOutputSectionId = section.id;
    const productInput = event.target.closest("[data-menu-output-product]");
    if (productInput) {
      const id = productInput.dataset.menuOutputProduct;
      section.productIds = productInput.checked
        ? Array.from(new Set([...(section.productIds || []), id]))
        : (section.productIds || []).filter((item) => item !== id);
      saveMenuOutputState(true);
      return;
    }
    const control = event.target.closest("[data-menu-output-field]");
    if (!control) return;
    const field = control.dataset.menuOutputField;
    if (["showPrices", "showDescription"].includes(field)) section[field] = control.checked;
    else if (["fontSize", "rowGap", "iconOpacity", "bgIconOpacity", "x", "y", "width", "height", "zIndex"].includes(field)) section[field] = Number(control.value || 0);
    else section[field] = control.value;
    if (["x", "y", "width", "height"].includes(field)) constrainMenuOutputSection(section);
    if (field === "mode") renderMenuOutputSections(menuOutput);
    saveMenuOutputState(true);
  }

  function handleMenuOutputSectionClick(event) {
    const container = event.target.closest("[data-menu-output-section]");
    if (container) state.selectedMenuOutputSectionId = container.dataset.menuOutputSection;
    const menuOutput = ensureMenuOutputState();
    const section = container ? menuOutput.sections.find((item) => item.id === container.dataset.menuOutputSection) : null;
    if (!section) return;
    const action = event.target.closest("[data-menu-output-action]");
    if (action) {
      if (action.dataset.menuOutputAction === "duplicate") {
        duplicateMenuOutputSection(menuOutput, section);
      } else if (action.dataset.menuOutputAction === "visibility") {
        section.hidden = !section.hidden;
      } else if (action.dataset.menuOutputAction === "lock") {
        section.locked = !section.locked;
      } else if (action.dataset.menuOutputAction === "forward" || action.dataset.menuOutputAction === "backward") {
        if (section.locked) return;
        moveMenuOutputSectionLayer(menuOutput, section, action.dataset.menuOutputAction);
      }
      saveMenuOutputState(true);
      return;
    }
    if (event.target.closest("[data-menu-output-delete]")) {
      if (section.locked) return;
      if (!confirm("Bu menü çıktı alanı silinsin mi?")) return;
      deleteMenuOutputSection(menuOutput, section);
      saveMenuOutputState(true);
      return;
    }
    if (!event.target.closest("input,select,button,label")) selectMenuOutputSection(section.id);
  }

  function duplicateMenuOutputSection(menuOutput, section) {
    const nextZ = Math.max(0, ...menuOutput.sections.map((item) => Number(item.zIndex || 0))) + 1;
    const copy = normalizeMenuOutputSection(Object.assign({}, cloneData(section), {
      id: makeId("menu-output", Date.now()),
      title: `${section.title || "Alan"} Kopya`,
      x: Number(section.x || 0) + 16,
      y: Number(section.y || 0) + 16,
      zIndex: nextZ,
      hidden: false,
      locked: false
    }), menuOutput.sections.length);
    constrainMenuOutputSection(copy);
    const index = menuOutput.sections.findIndex((item) => item.id === section.id);
    menuOutput.sections.splice(index + 1, 0, copy);
    state.selectedMenuOutputSectionId = copy.id;
    return copy;
  }

  function deleteMenuOutputSection(menuOutput, section) {
    menuOutput.sections = menuOutput.sections.filter((item) => item.id !== section.id);
    state.selectedMenuOutputSectionId = menuOutput.sections[0] ? menuOutput.sections[0].id : "";
  }

  function moveMenuOutputSectionLayer(menuOutput, section, direction) {
    const ordered = [...menuOutput.sections].sort((a, b) => Number(a.zIndex || 0) - Number(b.zIndex || 0));
    const index = ordered.findIndex((item) => item.id === section.id);
    const targetIndex = direction === "forward" ? index + 1 : index - 1;
    if (index < 0 || targetIndex < 0 || targetIndex >= ordered.length) return;
    const target = ordered[targetIndex];
    const currentZ = Number(section.zIndex || 0);
    section.zIndex = Number(target.zIndex || 0);
    target.zIndex = currentZ;
  }

  function selectMenuOutputSection(id) {
    const menuOutput = ensureMenuOutputState();
    if (!menuOutput.sections.some((section) => section.id === id)) return;
    state.selectedMenuOutputSectionId = id;
    renderMenuOutputSections(menuOutput);
    renderMenuOutputLayers(menuOutput);
    renderMenuOutputPreview(menuOutput);
  }

  function renderMenuOutputLayers(menuOutput) {
    if (!els.menuOutputLayerList) return;
    const sorted = [...menuOutput.sections].sort((a, b) => Number(b.zIndex || 0) - Number(a.zIndex || 0));
    els.menuOutputLayerList.innerHTML = sorted.length ? sorted.map((section) => `
      <article class="menu-output-layer${section.id === state.selectedMenuOutputSectionId ? " is-active" : ""}${section.hidden ? " is-hidden" : ""}" data-menu-output-layer="${escapeAttribute(section.id)}">
        <button class="menu-output-layer-select" type="button" data-layer-action="select">
          <strong>${escapeHTML(section.title || "Adsız alan")}</strong>
          <small>z${escapeHTML(section.zIndex)} · ${escapeHTML(Math.round(section.width))}×${escapeHTML(Math.round(section.height))}</small>
        </button>
        <div class="menu-output-layer-actions">
          <button type="button" data-layer-action="visibility" title="${section.hidden ? "Göster" : "Gizle"}">${section.hidden ? "Göster" : "Gizle"}</button>
          <button type="button" data-layer-action="lock" title="${section.locked ? "Kilidi aç" : "Kilitle"}">${section.locked ? "Aç" : "Kilitle"}</button>
          <button type="button" data-layer-action="duplicate">Kopyala</button>
          <button type="button" data-layer-action="forward">Öne</button>
          <button type="button" data-layer-action="backward">Arkaya</button>
          <button class="is-danger" type="button" data-layer-action="delete"${section.locked ? " disabled" : ""}>Sil</button>
        </div>
      </article>
    `).join("") : `<div class="empty-mini">Henüz katman yok.</div>`;
  }

  function handleMenuOutputLayerClick(event) {
    const row = event.target.closest("[data-menu-output-layer]");
    const button = event.target.closest("[data-layer-action]");
    if (!row || !button) return;
    const menuOutput = ensureMenuOutputState();
    const section = menuOutput.sections.find((item) => item.id === row.dataset.menuOutputLayer);
    if (!section) return;
    const action = button.dataset.layerAction;
    state.selectedMenuOutputSectionId = section.id;
    if (action === "select") {
      selectMenuOutputSection(section.id);
      return;
    }
    if (action === "visibility") section.hidden = !section.hidden;
    else if (action === "lock") section.locked = !section.locked;
    else if (action === "duplicate") duplicateMenuOutputSection(menuOutput, section);
    else if (action === "forward" || action === "backward") {
      if (section.locked) return;
      moveMenuOutputSectionLayer(menuOutput, section, action);
    } else if (action === "delete") {
      if (section.locked || !confirm("Bu menü çıktı alanı silinsin mi?")) return;
      deleteMenuOutputSection(menuOutput, section);
    }
    saveMenuOutputState(true);
  }

  function renderMenuOutputTemplates(menuOutput) {
    if (!els.menuOutputTemplateList) return;
    els.menuOutputTemplateList.innerHTML = menuOutput.templates.length ? menuOutput.templates.map((template) => {
      const diagnostics = menuOutputDesignDiagnostics(template.snapshot);
      return `
        <article class="menu-output-template${template.id === menuOutput.currentTemplateId ? " is-active" : ""}" data-menu-output-template="${escapeAttribute(template.id)}">
          <button class="menu-output-template-preview" type="button" data-menu-output-template-action="open" aria-label="${escapeAttribute(template.name)} şablonunu aç">
            <img src="${menuOutputTemplateThumbnail(template)}" alt="${escapeAttribute(template.name)} önizlemesi">
          </button>
          <div class="menu-output-template-meta">
            <strong>${escapeHTML(template.name)}</strong>
            <small>${escapeHTML(formatDateTime(template.updatedAt))}</small>
            <span>
              ${template.id === menuOutput.defaultTemplateId ? `<em class="menu-output-badge">Varsayılan</em>` : ""}
              ${diagnostics.hasMissingData ? `<em class="menu-output-badge is-warning">Eksik veri</em>` : ""}
              ${diagnostics.overflowCount ? `<em class="menu-output-badge is-warning">${diagnostics.overflowCount} taşan</em>` : ""}
            </span>
          </div>
          <div class="menu-output-template-actions">
            <button class="line-action" type="button" data-menu-output-template-action="open">Aç</button>
            <button class="line-action" type="button" data-menu-output-template-action="duplicate">Kopyala</button>
            <button class="danger-mini" type="button" data-menu-output-template-action="delete">Sil</button>
          </div>
        </article>
      `;
    }).join("") : `<div class="empty-mini">Kayıtlı şablon yok.</div>`;
  }

  function handleMenuOutputTemplateClick(event) {
    const card = event.target.closest("[data-menu-output-template]");
    if (!card) return;
    const id = card.dataset.menuOutputTemplate;
    const action = event.target.closest("[data-menu-output-template-action]");
    const type = action ? action.dataset.menuOutputTemplateAction : "open";
    if (type === "duplicate") duplicateMenuOutputTemplate(id);
    else if (type === "delete") deleteMenuOutputTemplate(id);
    else loadMenuOutputTemplate(id);
  }

  function menuOutputTemplateThumbnail(template) {
    const svg = menuOutputSvg(template && template.snapshot);
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  function menuOutputDesignDiagnostics(value) {
    const snapshot = normalizeMenuOutput(value);
    return snapshot.sections.reduce((summary, section) => {
      const diagnostics = menuOutputSectionDiagnostics(section, snapshot);
      summary.hasMissingData = summary.hasMissingData || diagnostics.hasMissingData;
      summary.overflowCount += diagnostics.overflowCount;
      return summary;
    }, { hasMissingData: false, overflowCount: 0 });
  }

  function menuOutputSnapshot(currentMenuOutput) {
    const menuOutput = currentMenuOutput || ensureMenuOutputState();
    return normalizeMenuOutput({
      templateName: menuOutput.templateName,
      canvaLink: menuOutput.canvaLink,
      gridEnabled: menuOutput.gridEnabled,
      safeAreaEnabled: menuOutput.safeAreaEnabled,
      settings: cloneData(menuOutput.settings),
      sections: cloneData(menuOutput.sections),
      templates: []
    });
  }

  function saveMenuOutputTemplate() {
    const menuOutput = ensureMenuOutputState();
    const name = els.menuOutputTemplateName ? els.menuOutputTemplateName.value.trim() : "";
    const now = new Date().toISOString();
    const template = {
      id: makeId("menu-output-template", name || now),
      name: name || menuOutput.templateName || "Menü şablonu",
      snapshot: menuOutputSnapshot(menuOutput),
      createdAt: now,
      updatedAt: now
    };
    menuOutput.templates.unshift(template);
    menuOutput.currentTemplateId = template.id;
    if (!menuOutput.defaultTemplateId) menuOutput.defaultTemplateId = template.id;
    saveMenuOutputState(true);
  }

  function updateMenuOutputTemplate() {
    const menuOutput = ensureMenuOutputState();
    const template = menuOutput.templates.find((item) => item.id === menuOutput.currentTemplateId);
    if (!template) {
      saveMenuOutputTemplate();
      return;
    }
    template.name = els.menuOutputTemplateName ? els.menuOutputTemplateName.value.trim() || template.name : template.name;
    template.snapshot = menuOutputSnapshot(menuOutput);
    template.updatedAt = new Date().toISOString();
    saveMenuOutputState(true);
  }

  function duplicateMenuOutputTemplate(templateId) {
    const menuOutput = ensureMenuOutputState();
    const source = menuOutput.templates.find((item) => item.id === (templateId || menuOutput.currentTemplateId));
    if (!source) {
      saveMenuOutputTemplate();
      return;
    }
    const now = new Date().toISOString();
    const copy = {
      id: makeId("menu-output-template", `${source.name}-copy`),
      name: `${source.name} Kopya`,
      snapshot: normalizeMenuOutput(cloneData(source.snapshot)),
      createdAt: now,
      updatedAt: now
    };
    menuOutput.templates.unshift(copy);
    menuOutput.currentTemplateId = copy.id;
    saveMenuOutputState(true);
  }

  function deleteMenuOutputTemplate(templateId) {
    const menuOutput = ensureMenuOutputState();
    const targetId = templateId || menuOutput.currentTemplateId;
    if (!targetId) return;
    if (!confirm("Seçili Menü Çıktısı şablonu silinsin mi?")) return;
    const deletingCurrent = menuOutput.currentTemplateId === targetId;
    menuOutput.templates = menuOutput.templates.filter((item) => item.id !== targetId);
    if (menuOutput.defaultTemplateId === targetId) {
      menuOutput.defaultTemplateId = menuOutput.templates[0] ? menuOutput.templates[0].id : "";
    }
    if (deletingCurrent) {
      menuOutput.currentTemplateId = menuOutput.templates[0] ? menuOutput.templates[0].id : "";
      if (menuOutput.currentTemplateId) {
        loadMenuOutputTemplate(menuOutput.currentTemplateId);
        return;
      }
    }
    saveMenuOutputState(true);
  }

  function setDefaultMenuOutputTemplate() {
    const menuOutput = ensureMenuOutputState();
    if (!menuOutput.currentTemplateId) return;
    menuOutput.defaultTemplateId = menuOutput.currentTemplateId;
    saveMenuOutputState(true);
  }

  function loadMenuOutputTemplate(id) {
    const menuOutput = ensureMenuOutputState();
    const template = menuOutput.templates.find((item) => item.id === id);
    if (!template) return;
    const snapshot = normalizeMenuOutput(template.snapshot);
    const templates = menuOutput.templates;
    const defaultTemplateId = menuOutput.defaultTemplateId;
    state.data.settings.menuOutput = normalizeMenuOutput(Object.assign({}, snapshot, {
      currentTemplateId: template.id,
      defaultTemplateId,
      templates
    }));
    state.selectedMenuOutputSectionId = state.data.settings.menuOutput.sections[0] ? state.data.settings.menuOutput.sections[0].id : "";
    saveMenuOutputState(true);
  }

  function openMenuOutputCanva() {
    const link = ensureMenuOutputState().canvaLink || "";
    if (!link) {
      alert("Canva referans linki yok.");
      return;
    }
    window.open(link, "_blank", "noopener,noreferrer");
  }

  function resetMenuOutputDesign() {
    if (!confirm("Menü Çıktısı tasarımı varsayılan değerlere alınsın mı? Şablon kütüphanesi korunur.")) return;
    const current = ensureMenuOutputState();
    state.data.settings.menuOutput = normalizeMenuOutput(Object.assign({}, DEFAULT_MENU_OUTPUT, {
      templates: current.templates,
      defaultTemplateId: current.defaultTemplateId
    }));
    state.selectedMenuOutputSectionId = "";
    saveMenuOutputState(true);
  }

  function renderMenuOutputPreview(menuOutput) {
    if (!els.menuOutputPreview) return;
    const settings = menuOutput.settings;
    els.menuOutputPreview.style.setProperty("--menu-output-bg", settings.bgColor);
    els.menuOutputPreview.style.setProperty("--menu-output-box", settings.boxColor);
    els.menuOutputPreview.style.setProperty("--menu-output-text", settings.textColor);
    els.menuOutputPreview.style.setProperty("--menu-output-title-font", settings.titleFont);
    els.menuOutputPreview.style.setProperty("--menu-output-body-font", settings.bodyFont);
    els.menuOutputPreview.style.setProperty("--menu-output-price-font", settings.priceFont);

    const visibleSections = menuOutputSortedVisibleSections(menuOutput);
    els.menuOutputPreview.classList.toggle("is-grid-enabled", menuOutput.gridEnabled);
    const sections = visibleSections.length
      ? visibleSections.map(({ section, index }) => renderMenuOutputPreviewSection(section, index, menuOutput)).join("")
      : `<div class="menu-output-empty">Alan ekleyin ve canlı menüden ürün seçin.</div>`;
    const dateText = settings.dateText || `Fiyat değişikliği tarihi: ${formatMenuOutputDate(new Date())}`;
    els.menuOutputPreview.innerHTML = `
      <div class="menu-output-preview-bg"></div>
      ${menuOutput.safeAreaEnabled ? `<div class="menu-output-safe-area" aria-hidden="true"></div>` : ""}
      ${sections}
      ${Number.isFinite(state.menuOutputGuides.x) ? `<div class="menu-output-guide is-vertical" style="left:${state.menuOutputGuides.x}px"></div>` : ""}
      ${Number.isFinite(state.menuOutputGuides.y) ? `<div class="menu-output-guide is-horizontal" style="top:${state.menuOutputGuides.y}px"></div>` : ""}
      <div class="menu-output-date-pill">${escapeHTML(dateText)}</div>
    `;
    if (els.menuOutputStatus) {
      const warnings = menuOutput.sections.reduce((total, section) => {
        const diagnostics = menuOutputSectionDiagnostics(section, menuOutput);
        return total + diagnostics.messages.length;
      }, 0);
      els.menuOutputStatus.textContent = `${visibleSections.length} görünür alan • ${menuOutputProducts().length} canlı ürün${warnings ? ` • ${warnings} uyarı` : ""}`;
    }
    window.requestAnimationFrame(applyMenuOutputZoom);
  }

  function renderMenuOutputPreviewSection(section, index, menuOutput) {
    const layout = computeMenuOutputLayouts(section, index);
    const diagnostics = menuOutputSectionDiagnostics(section, menuOutput);
    const products = menuOutputProductsForSection(section).slice(0, diagnostics.capacity);
    const settings = menuOutput.settings;
    const bgColor = section.bgColor || settings.boxColor;
    const textColor = section.textColor || settings.textColor;
    const fontSize = Number(section.fontSize || settings.productSize || 28);
    const rowGap = Number(section.rowGap || settings.rowGap || 34);
    const frame = ` frame-${escapeAttribute(section.frame || "shadow")}`;
    const selected = section.id === state.selectedMenuOutputSectionId;
    const canvasWarning = diagnostics.overflowCount
      ? `Bu alanda ${diagnostics.overflowCount} ürün taşıyor`
      : diagnostics.messages[0] || "";
    const handles = selected && !section.locked ? ["nw", "n", "ne", "e", "se", "s", "sw", "w"]
      .map((handle) => `<span class="menu-output-resize-handle is-${handle}" data-menu-output-resize="${handle}" aria-hidden="true"></span>`).join("") : "";
    return `
      <section class="menu-output-board-section type-${escapeAttribute(section.type)}${frame}${selected ? " is-selected" : ""}${section.locked ? " is-locked" : ""}" data-menu-output-canvas-section="${escapeAttribute(section.id)}" style="left:${layout.x}px;top:${layout.y}px;width:${layout.w}px;height:${layout.h}px;z-index:${escapeAttribute(section.zIndex)};background:${escapeAttribute(bgColor)};color:${escapeAttribute(textColor)};font-family:${escapeAttribute(section.font || settings.bodyFont)};--row-gap:${rowGap}px;--font-size:${fontSize}px;">
        ${section.type === "main" ? `<div class="menu-output-vertical" style="font-family:${escapeAttribute(settings.titleFont)}">${escapeHTML(section.title || "SPECIAL")}</div>` : `<h5 style="font-family:${escapeAttribute(settings.titleFont)};color:${escapeAttribute(section.titleColor || textColor)}">${escapeHTML(section.title)}</h5>`}
        ${section.bgIcon ? `<div class="menu-output-bg-icon" style="opacity:${clamp(Number(section.bgIconOpacity || 0.12), 0, 0.7)}">${escapeHTML(menuOutputIcon(section.bgIcon))}</div>` : ""}
        ${section.icon ? `<div class="menu-output-price-icons" style="opacity:${clamp(Number(section.iconOpacity || 0.85), 0, 1)}">${[0,1,2].map(() => `<span>${escapeHTML(menuOutputIcon(section.icon))}</span>`).join("")}</div>` : ""}
        <div class="menu-output-product-rows">
          ${products.map(({ category, product }) => renderMenuOutputProduct(category, product, section, menuOutput)).join("")}
        </div>
        ${canvasWarning ? `<div class="menu-output-canvas-warning">${escapeHTML(canvasWarning)}</div>` : ""}
        ${handles}
      </section>
    `;
  }

  function renderMenuOutputProduct(category, product, section, menuOutput) {
    const prices = menuOutputProductPrices(product);
    const detail = product.details && product.details.ingredients || product.desc || "";
    return `
      <article class="menu-output-product-row">
        <div>
          <strong>${escapeHTML(product.name)}</strong>
          ${section.showDescription && detail ? `<small>${escapeHTML(detail)}</small>` : ""}
        </div>
        ${section.showPrices !== false ? `<div class="menu-output-price-cols" style="font-family:${escapeAttribute(menuOutput.settings.priceFont)}">${prices.map((price) => `<span>${escapeHTML(price)}</span>`).join("")}</div>` : ""}
      </article>
    `;
  }

  function menuOutputDefaultLayout(type, index) {
    return {
      main: { x: 210, y: 150, w: 760, h: 1100 },
      bottom: { x: 80, y: 1320, w: 590, h: 360 },
      right: { x: 700, y: 1320, w: 300, h: 360 },
      small: { x: 120 + (index % 2) * 440, y: 1280 + Math.floor(index / 2) * 300, w: 400, h: 280 }
    }[type] || { x: 210, y: 150, w: 760, h: 1100 };
  }

  function computeMenuOutputLayouts(section, index) {
    const base = menuOutputDefaultLayout(section.type, index || 0);
    return {
      x: Number.isFinite(Number(section.x)) ? Number(section.x) : base.x + Number(section.offsetX || 0),
      y: Number.isFinite(Number(section.y)) ? Number(section.y) : base.y + Number(section.offsetY || 0),
      w: Number(section.width) > 0 ? Number(section.width) : base.w,
      h: Number(section.height) > 0 ? Number(section.height) : base.h
    };
  }

  function constrainMenuOutputSection(section) {
    section.width = clamp(Number(section.width || 180), 180, MENU_OUTPUT_WIDTH);
    section.height = clamp(Number(section.height || 140), 140, MENU_OUTPUT_HEIGHT);
    section.x = clamp(Number(section.x || 0), 0, MENU_OUTPUT_WIDTH - section.width);
    section.y = clamp(Number(section.y || 0), 0, MENU_OUTPUT_HEIGHT - section.height);
  }

  function menuOutputSortedVisibleSections(menuOutput) {
    return menuOutput.sections
      .filter((section) => !section.hidden)
      .map((section, index) => ({ section, index }))
      .sort((a, b) => Number(a.section.zIndex || 0) - Number(b.section.zIndex || 0));
  }

  function menuOutputProductsForSection(section) {
    const products = menuOutputProducts().filter(({ category, product }) => category.active !== false && product.active !== false && product.stock !== "sold-out");
    if (section.mode === "all") return products;
    if (section.mode === "manual") {
      const ids = new Set(section.productIds || []);
      return products.filter(({ product }) => ids.has(product.id));
    }
    return products.filter(({ category }) => category.id === section.categoryId);
  }

  function menuOutputSectionCapacity(section, menuOutput) {
    const fallback = section.type === "main" ? 16 : 8;
    const settings = menuOutput && menuOutput.settings ? menuOutput.settings : DEFAULT_MENU_OUTPUT.settings;
    const layout = computeMenuOutputLayouts(section, 0);
    const fontSize = clamp(Number(section.fontSize || settings.productSize || 28), 12, 72);
    const compactScale = section.type === "main" ? 1 : 0.72;
    const renderedFontSize = fontSize * compactScale;
    const priceSize = section.showPrices === false ? 0 : renderedFontSize;
    const rowGap = clamp(Number(section.rowGap || settings.rowGap || 34), 10, 90);
    const productLineHeight = renderedFontSize * 1.05;
    const priceLineHeight = priceSize * 1.05;
    const descriptionHeight = section.showDescription
      ? renderedFontSize * 0.56 * 1.2 + 5
      : 0;
    const effectiveGap = section.type === "main" ? rowGap : rowGap * 0.58;
    const rowHeight = Math.max(effectiveGap, productLineHeight + descriptionHeight, priceLineHeight);
    const titleSpace = section.type === "main" ? 118 : 92;
    const bottomSpace = section.type === "main" ? 34 : 24;
    const availableHeight = Number(layout.h) - titleSpace - bottomSpace;
    if (!Number.isFinite(rowHeight) || rowHeight <= 0 || !Number.isFinite(availableHeight) || availableHeight <= 0) {
      return fallback;
    }
    return Math.max(1, Math.floor(availableHeight / rowHeight));
  }

  function menuOutputSectionDiagnostics(section, menuOutput) {
    const allProducts = menuOutputProducts();
    const productIds = new Set(allProducts.map(({ product }) => product.id));
    const categoryIds = new Set((state.data && state.data.categories || []).map((category) => category.id));
    const products = menuOutputProductsForSection(section);
    const capacity = menuOutputSectionCapacity(section, menuOutput);
    const missingCategory = section.mode === "category" && (!section.categoryId || !categoryIds.has(section.categoryId));
    const missingProducts = section.mode === "manual"
      ? (section.productIds || []).filter((id) => !productIds.has(id)).length
      : 0;
    const emptyManualSelection = section.mode === "manual" && !(section.productIds || []).length;
    const missingPriceCount = products.filter(({ product }) => menuOutputProductHasMissingPrice(product)).length;
    const overflowCount = Math.max(0, products.length - capacity);
    const messages = [];
    if (missingCategory) messages.push("Eksik veri: seçili kategori bulunamadı");
    if (missingProducts) messages.push(`Eksik veri: ${missingProducts} ürün bulunamadı`);
    if (emptyManualSelection) messages.push("Eksik veri: manuel ürün seçilmedi");
    if (missingPriceCount) messages.push(`Eksik veri: ${missingPriceCount} üründe fiyat eksik`);
    if (overflowCount) messages.push(`Bu alanda ürün taşması var: ${overflowCount} ürün sığmıyor`);
    return {
      capacity,
      overflowCount,
      missingPriceCount,
      missingCategory,
      missingProducts,
      emptyManualSelection,
      hasMissingData: missingCategory || missingProducts > 0 || emptyManualSelection || missingPriceCount > 0,
      messages
    };
  }

  function menuOutputExportDiagnostics(menuOutput) {
    const visibleSections = menuOutput.sections.filter((section) => !section.hidden);
    const summary = visibleSections.reduce((result, section) => {
      const diagnostics = menuOutputSectionDiagnostics(section, menuOutput);
      result.missingCategories += diagnostics.missingCategory ? 1 : 0;
      result.missingProducts += diagnostics.missingProducts;
      result.emptySelections += diagnostics.emptyManualSelection ? 1 : 0;
      result.missingPrices += diagnostics.missingPriceCount;
      result.overflow += diagnostics.overflowCount;
      const fontSize = Number(section.fontSize || menuOutput.settings.productSize || 28);
      result.smallFonts += fontSize < 16 ? 1 : 0;
      const bgColor = section.bgColor || menuOutput.settings.boxColor;
      const textColor = section.textColor || menuOutput.settings.textColor;
      const titleColor = section.titleColor || textColor;
      result.readabilityRisks += Math.min(menuOutputContrastRatio(bgColor, textColor), menuOutputContrastRatio(bgColor, titleColor)) < 3 ? 1 : 0;
      return result;
    }, {
      missingCategories: 0,
      missingProducts: 0,
      emptySelections: 0,
      missingPrices: 0,
      overflow: 0,
      smallFonts: 0,
      readabilityRisks: 0
    });
    const messages = [];
    if (!visibleSections.length) messages.push("Görünür menü alanı yok.");
    if (summary.missingCategories) messages.push(`${summary.missingCategories} alanda kategori eksik.`);
    if (summary.missingProducts) messages.push(`${summary.missingProducts} seçili ürün bulunamadı.`);
    if (summary.emptySelections) messages.push(`${summary.emptySelections} manuel alanda ürün seçilmedi.`);
    if (summary.missingPrices) messages.push(`${summary.missingPrices} üründe fiyat eksik.`);
    if (summary.overflow) messages.push(`${summary.overflow} ürün alanlara sığmayabilir.`);
    if (summary.smallFonts) messages.push(`${summary.smallFonts} alanda punto 16 px altında.`);
    if (summary.readabilityRisks) messages.push(`${summary.readabilityRisks} alanda düşük renk kontrastı var.`);
    return { summary, messages };
  }

  function renderMenuOutputQualityPanel(menuOutput) {
    if (!els.menuOutputQualityPanel) return;
    const diagnostics = menuOutputExportDiagnostics(menuOutput);
    els.menuOutputQualityPanel.classList.toggle("is-warning", diagnostics.messages.length > 0);
    els.menuOutputQualityPanel.innerHTML = `
      <strong>Kontrol edildi: ${diagnostics.messages.length} uyarı var</strong>
      ${diagnostics.messages.length
        ? `<ul>${diagnostics.messages.map((message) => `<li>${escapeHTML(message)}</li>`).join("")}</ul>`
        : `<span>Çıktı için kritik veri sorunu görünmüyor.</span>`}
    `;
  }

  function notifyMenuOutputExportWarnings() {
    const menuOutput = ensureMenuOutputState();
    const diagnostics = menuOutputExportDiagnostics(menuOutput);
    renderMenuOutputQualityPanel(menuOutput);
    if (!diagnostics.messages.length) return;
    showMenuOutputNotice(`Export öncesi ${diagnostics.messages.length} uyarı bulundu.`);
    setMenuOutputControlTab("output");
  }

  function menuOutputContrastRatio(first, second) {
    const firstLum = menuOutputColorLuminance(first);
    const secondLum = menuOutputColorLuminance(second);
    if (firstLum === null || secondLum === null) return 21;
    const lighter = Math.max(firstLum, secondLum);
    const darker = Math.min(firstLum, secondLum);
    return (lighter + 0.05) / (darker + 0.05);
  }

  function menuOutputColorLuminance(value) {
    const match = String(value || "").trim().match(/^#([0-9a-f]{6})$/i);
    if (!match) return null;
    const channels = [0, 2, 4].map((offset) => parseInt(match[1].slice(offset, offset + 2), 16) / 255)
      .map((channel) => channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  }

  function menuOutputProductHasMissingPrice(product) {
    if (!product || !product.prices) return true;
    if (product.priceMode === "standard") return cleanPrice(product.prices.standard) === "";
    if (product.priceMode === "singleDouble") {
      return cleanPrice(product.prices.single) === "" || cleanPrice(product.prices.double) === "";
    }
    return [product.prices.k, product.prices.o, product.prices.b].some((price) => cleanPrice(price) === "");
  }

  function menuOutputProducts() {
    return state.data && Array.isArray(state.data.categories) ? flatProducts() : [];
  }

  function menuOutputCategoryOptions() {
    return state.data && Array.isArray(state.data.categories)
      ? state.data.categories.map((category) => [category.id, category.name])
      : [];
  }

  function menuOutputProductPrices(product) {
    if (!product || !product.prices) return ["", "", ""];
    if (product.priceMode === "singleDouble") {
      return [formatPrice(product.prices.single), formatPrice(product.prices.double), ""].filter(Boolean);
    }
    if (product.priceMode === "standard") {
      const price = formatPrice(product.prices.standard);
      return price ? [price] : [];
    }
    return [formatPrice(product.prices.k), formatPrice(product.prices.o), formatPrice(product.prices.b)].filter(Boolean);
  }

  function menuOutputIcon(value) {
    const icon = MENU_OUTPUT_ICON_OPTIONS.find((item) => item[0] === value);
    return icon ? icon[2] : "";
  }

  function menuOutputOptions(options, selectedValue) {
    return options.map(([value, label]) => `
      <option value="${escapeAttribute(value)}"${String(value) === String(selectedValue) ? " selected" : ""}>${escapeHTML(label)}</option>
    `).join("");
  }

  async function exportMenuOutputImage(format) {
    notifyMenuOutputExportWarnings();
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const svg = menuOutputSvg();
    const image = new Image();
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = MENU_OUTPUT_WIDTH;
    canvas.height = MENU_OUTPUT_HEIGHT;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = ensureMenuOutputState().settings.bgColor || "#fffff0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    URL.revokeObjectURL(url);
    const type = format === "jpg" ? "image/jpeg" : "image/png";
    const dataUrl = canvas.toDataURL(type, 0.95);
    downloadDataUrl(dataUrl, menuOutputExportFileName(format === "jpg" ? "jpg" : "png"));
  }

  async function exportMenuOutputPdf() {
    notifyMenuOutputExportWarnings();
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const svg = menuOutputSvg();
    const image = new Image();
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = MENU_OUTPUT_WIDTH;
    canvas.height = MENU_OUTPUT_HEIGHT;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = ensureMenuOutputState().settings.bgColor || "#fffff0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    URL.revokeObjectURL(url);
    const dataUrl = canvas.toDataURL("image/png");
    const win = window.open("", "_blank", "noopener,noreferrer");
    if (!win) {
      downloadDataUrl(dataUrl, menuOutputExportFileName("png"));
      return;
    }
    win.document.write(`<html><head><title>${escapeHTML(menuOutputExportFileName("pdf"))}</title><style>@page{size:9in 16in;margin:0}body{margin:0;background:#fff}img{width:100vw;height:100vh;object-fit:contain;display:block}</style></head><body><img src="${dataUrl}" onload="setTimeout(()=>print(),250)"></body></html>`);
    win.document.close();
  }

  function menuOutputSvg(value) {
    const menuOutput = value && typeof value === "object" ? normalizeMenuOutput(value) : ensureMenuOutputState();
    const settings = menuOutput.settings;
    const sections = menuOutputSortedVisibleSections(menuOutput)
      .map(({ section, index }) => menuOutputSectionSvg(section, index, menuOutput))
      .join("");
    const dateText = settings.dateText || `Fiyat değişikliği tarihi: ${formatMenuOutputDate(new Date())}`;
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${MENU_OUTPUT_WIDTH}" height="${MENU_OUTPUT_HEIGHT}" viewBox="0 0 ${MENU_OUTPUT_WIDTH} ${MENU_OUTPUT_HEIGHT}">
        <rect width="1080" height="1920" fill="${escapeAttribute(settings.bgColor || "#fffff0")}"/>
        ${sections}
        <rect x="225" y="1736" width="630" height="58" rx="29" fill="${escapeAttribute(settings.boxColor || "#2c1609")}"/>
        <text x="540" y="1765" text-anchor="middle" dominant-baseline="middle" fill="${escapeAttribute(settings.textColor || "#e9f6ff")}" font-size="33" font-weight="700" font-family="${escapeAttribute(settings.bodyFont)}">${escapeHTML(dateText)}</text>
      </svg>
    `;
  }

  function startMenuOutputSectionPointer(event) {
    if (event.button !== 0) return;
    const element = event.target.closest("[data-menu-output-canvas-section]");
    if (!element) return;
    const menuOutput = ensureMenuOutputState();
    const section = menuOutput.sections.find((item) => item.id === element.dataset.menuOutputCanvasSection);
    if (!section) return;
    state.selectedMenuOutputSectionId = section.id;
    if (section.locked) {
      selectMenuOutputSection(section.id);
      return;
    }
    event.preventDefault();
    const handle = event.target.dataset.menuOutputResize || "move";
    const scale = menuOutputPreviewScale();
    const startX = event.clientX;
    const startY = event.clientY;
    const start = computeMenuOutputLayouts(section, menuOutput.sections.indexOf(section));
    element.classList.add("is-dragging");

    const move = (moveEvent) => {
      const dx = (moveEvent.clientX - startX) / scale;
      const dy = (moveEvent.clientY - startY) / scale;
      if (handle === "move") moveMenuOutputSection(section, start, dx, dy, menuOutput);
      else resizeMenuOutputSection(section, start, handle, dx, dy, menuOutput.gridEnabled);
      renderMenuOutputPreview(menuOutput);
      updateMenuOutputGeometryInputs(section);
    };
    const stop = () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", stop);
      state.menuOutputGuides = { x: null, y: null };
      saveMenuOutputState(true);
    };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", stop);
  }

  function moveMenuOutputSection(section, start, dx, dy, menuOutput) {
    let x = start.x + dx;
    let y = start.y + dy;
    if (menuOutput.gridEnabled) {
      x = snapMenuOutputValue(x);
      y = snapMenuOutputValue(y);
    }
    const aligned = alignMenuOutputSection(section, x, y, start.w, start.h, menuOutput);
    section.x = aligned.x;
    section.y = aligned.y;
    section.width = start.w;
    section.height = start.h;
    state.menuOutputGuides = { x: aligned.guideX, y: aligned.guideY };
    constrainMenuOutputSection(section);
  }

  function resizeMenuOutputSection(section, start, handle, dx, dy, snapEnabled) {
    let left = start.x;
    let top = start.y;
    let right = start.x + start.w;
    let bottom = start.y + start.h;
    if (handle.includes("e")) right += dx;
    if (handle.includes("s")) bottom += dy;
    if (handle.includes("w")) left += dx;
    if (handle.includes("n")) top += dy;
    if (snapEnabled) {
      if (handle.includes("e")) right = snapMenuOutputValue(right);
      if (handle.includes("s")) bottom = snapMenuOutputValue(bottom);
      if (handle.includes("w")) left = snapMenuOutputValue(left);
      if (handle.includes("n")) top = snapMenuOutputValue(top);
    }
    if (right - left < 180) {
      if (handle.includes("w")) left = right - 180;
      else right = left + 180;
    }
    if (bottom - top < 140) {
      if (handle.includes("n")) top = bottom - 140;
      else bottom = top + 140;
    }
    section.x = left;
    section.y = top;
    section.width = right - left;
    section.height = bottom - top;
    state.menuOutputGuides = { x: null, y: null };
    constrainMenuOutputSection(section);
  }

  function snapMenuOutputValue(value) {
    return Math.round(Number(value || 0) / MENU_OUTPUT_SNAP) * MENU_OUTPUT_SNAP;
  }

  function alignMenuOutputSection(section, x, y, width, height, menuOutput) {
    const xTargets = [0, MENU_OUTPUT_WIDTH / 2, MENU_OUTPUT_WIDTH];
    const yTargets = [0, MENU_OUTPUT_HEIGHT / 2, MENU_OUTPUT_HEIGHT];
    if (menuOutput.safeAreaEnabled) {
      xTargets.push(MENU_OUTPUT_SAFE_X, MENU_OUTPUT_WIDTH - MENU_OUTPUT_SAFE_X);
      yTargets.push(MENU_OUTPUT_SAFE_Y, MENU_OUTPUT_HEIGHT - MENU_OUTPUT_SAFE_Y);
    }
    menuOutput.sections.filter((item) => item.id !== section.id && !item.hidden).forEach((item, index) => {
      const layout = computeMenuOutputLayouts(item, index);
      xTargets.push(layout.x, layout.x + layout.w / 2, layout.x + layout.w);
      yTargets.push(layout.y, layout.y + layout.h / 2, layout.y + layout.h);
    });
    const alignedX = alignMenuOutputAxis(x, width, xTargets);
    const alignedY = alignMenuOutputAxis(y, height, yTargets);
    return { x: alignedX.value, y: alignedY.value, guideX: alignedX.guide, guideY: alignedY.guide };
  }

  function alignMenuOutputAxis(start, size, targets) {
    let best = { distance: 9, value: start, guide: null };
    [0, size / 2, size].forEach((offset) => {
      targets.forEach((target) => {
        const distance = Math.abs(start + offset - target);
        if (distance <= 8 && distance < best.distance) {
          best = { distance, value: target - offset, guide: target };
        }
      });
    });
    return best;
  }

  function updateMenuOutputGeometryInputs(section) {
    if (!els.menuOutputSectionList) return;
    const container = Array.from(els.menuOutputSectionList.querySelectorAll("[data-menu-output-section]"))
      .find((item) => item.dataset.menuOutputSection === section.id);
    if (!container) return;
    ["x", "y", "width", "height", "zIndex"].forEach((field) => {
      const input = container.querySelector(`[data-menu-output-field="${field}"]`);
      if (input) input.value = Math.round(Number(section[field] || 0));
    });
  }

  function menuOutputSectionSvg(section, index, menuOutput) {
    const layout = computeMenuOutputLayouts(section, index);
    const settings = menuOutput.settings;
    const bg = section.bgColor || settings.boxColor || "#2c1609";
    const color = section.textColor || settings.textColor || "#e9f6ff";
    const titleColor = section.titleColor || color;
    const products = menuOutputProductsForSection(section).slice(0, menuOutputSectionCapacity(section, menuOutput));
    const fontSize = Number(section.fontSize || settings.productSize || 28);
    const rowGap = Number(section.rowGap || settings.rowGap || 34);
    const productStartY = section.type === "main" ? layout.y + 118 : layout.y + 92;
    const title = section.title || "SPECIAL";
    const titleFont = settings.titleFont;
    const productFont = section.font || settings.bodyFont;
    const priceFont = settings.priceFont;
    const compactScale = section.type === "main" ? 1 : 0.72;
    const renderedFontSize = fontSize * compactScale;
    const descriptionSize = renderedFontSize * 0.56;
    const effectiveGap = section.type === "main" ? rowGap : rowGap * 0.58;
    const rowStep = Math.max(effectiveGap, renderedFontSize * 1.05 + (section.showDescription ? descriptionSize * 1.2 + 5 : 0));
    const rows = products.map(({ product }, rowIndex) => {
      const y = productStartY + rowIndex * rowStep;
      const prices = section.showPrices !== false ? menuOutputProductPrices(product) : [];
      const priceText = prices.map((price, priceIndex) => `<text x="${layout.x + layout.w - 70 - (prices.length - 1 - priceIndex) * 120}" y="${y}" text-anchor="middle" dominant-baseline="middle" fill="${escapeAttribute(color)}" font-size="${renderedFontSize}" font-weight="800" font-family="${escapeAttribute(priceFont)}">${escapeHTML(price)}</text>`).join("");
      const desc = section.showDescription && (product.details && product.details.ingredients || product.desc) ? `<text x="${layout.x + 38}" y="${y + renderedFontSize * 0.8}" fill="${escapeAttribute(color)}" opacity="0.78" font-size="${descriptionSize}" font-family="${escapeAttribute(productFont)}">${escapeHTML((product.details && product.details.ingredients || product.desc).slice(0, 42))}</text>` : "";
      return `<text x="${layout.x + 38}" y="${y}" dominant-baseline="middle" fill="${escapeAttribute(color)}" font-size="${renderedFontSize}" font-weight="800" font-family="${escapeAttribute(productFont)}">${escapeHTML(product.name.slice(0, 28))}</text>${desc}${priceText}`;
    }).join("");
    const vertical = section.type === "main"
      ? `<rect x="${layout.x - 165}" y="${layout.y - 150}" width="150" height="520" rx="0" fill="${escapeAttribute(bg)}"/><text x="${layout.x - 90}" y="${layout.y - 70}" text-anchor="middle" fill="${escapeAttribute(titleColor)}" font-size="54" font-weight="900" font-family="${escapeAttribute(titleFont)}">${svgVerticalText(title, layout.x - 90)}</text>`
      : `<text x="${layout.x + layout.w / 2}" y="${layout.y + 54}" text-anchor="middle" dominant-baseline="middle" fill="${escapeAttribute(titleColor)}" font-size="54" font-weight="900" font-family="${escapeAttribute(titleFont)}">${escapeHTML(title)}</text>`;
    const icons = section.icon ? [0, 1, 2].map((_, iconIndex) => `<text x="${layout.x + layout.w - 260 + iconIndex * 120}" y="${layout.y + 72}" text-anchor="middle" dominant-baseline="middle" fill="${escapeAttribute(color)}" opacity="${clamp(Number(section.iconOpacity || 0.85), 0, 1)}" font-size="30" font-family="${escapeAttribute(productFont)}">${escapeHTML(menuOutputIcon(section.icon))}</text>`).join("") : "";
    const bgIcon = section.bgIcon ? `<text x="${layout.x + layout.w / 2}" y="${layout.y + layout.h / 2}" text-anchor="middle" dominant-baseline="middle" fill="${escapeAttribute(color)}" opacity="${clamp(Number(section.bgIconOpacity || 0.12), 0, 0.7)}" font-size="260" font-family="${escapeAttribute(productFont)}">${escapeHTML(menuOutputIcon(section.bgIcon))}</text>` : "";
    return `<g><rect x="${layout.x}" y="${layout.y}" width="${layout.w}" height="${layout.h}" rx="34" fill="${escapeAttribute(bg)}"/><rect x="${layout.x}" y="${layout.y}" width="${layout.w}" height="${layout.h}" rx="34" fill="none" stroke="${escapeAttribute(color)}" opacity="${section.frame === "thin" ? 0.6 : 0.08}" stroke-width="${section.frame === "thin" ? 3 : 1}"/>${vertical}${bgIcon}${icons}${rows}</g>`;
  }

  function svgVerticalText(value, x) {
    const position = Number.isFinite(Number(x)) ? Number(x) : 120;
    return String(value || "").split("").map((char, index) => `<tspan x="${position}" dy="${index === 0 ? 0 : 58}">${escapeHTML(char)}</tspan>`).join("");
  }

  function downloadDataUrl(dataUrl, filename) {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function formatMenuOutputDate(date) {
    return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
  }

  function isoDateForFile() {
    const date = new Date();
    const pad = (value) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function menuOutputExportFileName(extension) {
    const menuOutput = ensureMenuOutputState();
    const name = slugFilePart(menuOutput.templateName || "menu");
    return `tahmisci-${name}-${MENU_OUTPUT_WIDTH}x${MENU_OUTPUT_HEIGHT}-${isoDateForFile()}.${extension}`;
  }

  function slugFilePart(value) {
    return String(value || "menu")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ı/g, "i")
      .replace(/İ/g, "I")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "menu";
  }

  function formatDateTime(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("tr-TR", { dateStyle: "short", timeStyle: "short" }).format(date);
  }

  function bindRecipeImportEvents() {
    if (els.recipeExcelFile) {
      els.recipeExcelFile.addEventListener("change", () => {
        state.recipeImportFile = els.recipeExcelFile.files && els.recipeExcelFile.files[0] ? els.recipeExcelFile.files[0] : null;
        if (els.recipeImportSummary) {
          els.recipeImportSummary.textContent = state.recipeImportFile
            ? `${state.recipeImportFile.name} seçildi.`
            : "Son aktarım sonucu yok.";
        }
      });
    }
    if (els.recipeExcelImportButton) {
      els.recipeExcelImportButton.addEventListener("click", importRecipeExcelFromFile);
    }
  }

  function bindProductImportEvents() {
    if (els.productExcelFile) {
      els.productExcelFile.addEventListener("change", () => {
        state.productImportFile = els.productExcelFile.files && els.productExcelFile.files[0] ? els.productExcelFile.files[0] : null;
        if (els.productImportSummary) {
          els.productImportSummary.textContent = state.productImportFile
            ? `${state.productImportFile.name} seçildi.`
            : "Son aktarım sonucu yok.";
        }
      });
    }
    if (els.productExcelImportButton) {
      els.productExcelImportButton.addEventListener("click", importProductExcelFromFile);
    }
    if (els.productImportShowErrorsButton) {
      els.productImportShowErrorsButton.addEventListener("click", showProductImportErrors);
    }
  }

  async function importProductExcelFromFile() {
    const file = state.productImportFile || (els.productExcelFile && els.productExcelFile.files && els.productExcelFile.files[0]);
    if (!file) {
      alert("Önce Excel dosyası seçin.");
      return;
    }
    if (!backendBaseUrl()) {
      alert("Excel aktarımı için backend bağlantısı gerekir.");
      return;
    }

    if (els.productExcelImportButton) {
      els.productExcelImportButton.disabled = true;
      els.productExcelImportButton.textContent = "Aktarılıyor...";
    }
    if (els.productImportSummary) els.productImportSummary.textContent = "Excel okunuyor ve ürün verisiyle karşılaştırılıyor...";

    try {
      const result = await backendRequest("/api/admin/products/import-excel", {
        method: "POST",
        rawBody: await file.arrayBuffer(),
        headers: {
          "Content-Type": file.type || "application/octet-stream",
          "X-File-Name": encodeURIComponent(file.name || "products.xlsx")
        }
      });
      if (result.menuState) {
        state.data = normalizeState(result.menuState);
        safeLocalSet(STORAGE_KEY, JSON.stringify(state.data));
        if (state.channel) state.channel.postMessage({ type: "menu-updated", time: Date.now() });
      }
      state.productImportReport = result.report || null;
      renderAll();
      renderProductImportReport();
      if (els.saveState) els.saveState.textContent = "Ürün Excel aktarımı tamamlandı";
    } catch (error) {
      state.productImportReport = {
        totalRows: 0,
        updatedCount: 0,
        createdCount: 0,
        unchangedCount: 0,
        errorCount: 1,
        changes: [],
        errors: [{ rowNumber: "-", message: error.message || "Aktarım başarısız." }]
      };
      renderProductImportReport();
      alert(`Ürün Excel aktarımı başarısız. ${error.message || ""}`);
    } finally {
      if (els.productExcelImportButton) {
        els.productExcelImportButton.disabled = false;
        els.productExcelImportButton.textContent = "Aktarımı Başlat";
      }
    }
  }

  function renderProductImportReport() {
    const report = state.productImportReport;
    if (!els.productImportReport || !els.productImportSummary) return;
    if (!report) {
      els.productImportReport.hidden = true;
      els.productImportSummary.textContent = "Son aktarım sonucu yok.";
      return;
    }
    const updated = Number(report.updatedCount || 0);
    const created = Number(report.createdCount || 0);
    const unchanged = Number(report.unchangedCount || 0);
    const errors = Number(report.errorCount || 0);
    els.productImportReport.hidden = false;
    els.productImportSummary.textContent = `Toplam ${Number(report.totalRows || 0)} satır okundu. ${updated} güncellendi, ${created} yeni eklendi, ${unchanged} aynı kaldı, ${errors} hatalı.`;
    if (els.productImportStats) {
      els.productImportStats.innerHTML = [
        ["Okunan", report.totalRows || 0],
        ["Güncellenen", updated],
        ["Yeni", created],
        ["Aynı", unchanged],
        ["Hatalı", errors]
      ].map(([label, value]) => `<span><strong>${escapeHTML(value)}</strong>${escapeHTML(label)}</span>`).join("");
    }
    if (els.productImportChanges) {
      const changes = Array.isArray(report.changes) ? report.changes : [];
      els.productImportChanges.innerHTML = changes.length ? changes.slice(0, 120).map((change) => `
        <article class="recipe-import-row">
          <strong>${escapeHTML(change.category || "-")} / ${escapeHTML(change.product || "-")}</strong>
          <span>${escapeHTML(change.field || "-")} · ${escapeHTML(change.changeType || "Değişti")}</span>
          <small>${escapeHTML(change.oldValue || "")} → ${escapeHTML(change.newValue || "")}</small>
          <em>${escapeHTML(change.status || "")}</em>
        </article>
      `).join("") : `<div class="empty-mini">Değişen ürün bilgisi yok.</div>`;
    }
    if (els.productImportErrors) {
      const importErrors = Array.isArray(report.errors) ? report.errors : [];
      els.productImportErrors.innerHTML = importErrors.length ? importErrors.slice(0, 120).map((item) => {
        const productLine = item.product ? `<small>Ürün: ${escapeHTML(item.product)}</small>` : "";
        const rowPreview = item.rowPreview
          ? `<small>Satır içeriği: ${escapeHTML(item.rowPreview)}</small>`
          : `<small>Satır içeriği okunamadı.</small>`;
        return `
          <article class="recipe-import-row is-error">
            <strong>${escapeHTML(item.sheetName || item.category || "-")} / Satır ${escapeHTML(item.rowNumber || "-")}</strong>
            <span>${escapeHTML(item.message || "Hatalı satır")}</span>
            ${productLine}
            ${rowPreview}
          </article>
        `;
      }).join("") : `<div class="empty-mini">Hatalı satır yok.</div>`;
    }
    if (els.productImportShowErrorsButton) {
      els.productImportShowErrorsButton.disabled = !errors;
      els.productImportShowErrorsButton.textContent = errors ? `Hatalıları Göster (${errors})` : "Hatalı Yok";
    }
  }

  function showProductImportErrors() {
    const errors = state.productImportReport && Array.isArray(state.productImportReport.errors)
      ? state.productImportReport.errors
      : [];
    if (!errors.length) {
      alert("Hatalı satır yok.");
      return;
    }

    if (els.productImportErrors) {
      els.productImportErrors.scrollIntoView({ behavior: "smooth", block: "center" });
      els.productImportErrors.classList.add("is-highlighted");
      window.setTimeout(() => els.productImportErrors.classList.remove("is-highlighted"), 1800);
    }

    const summary = errors.slice(0, 12).map((item) => {
      const where = `${item.sheetName || item.category || "-"} / Satır ${item.rowNumber || "-"}`;
      const product = item.product ? ` / Ürün: ${item.product}` : "";
      const preview = item.rowPreview ? ` | Satır içeriği: ${item.rowPreview}` : " | Satır içeriği okunamadı";
      return `- ${where}${product}: ${item.message || "Hatalı satır"}${preview}`;
    }).join("\n");
    const suffix = errors.length > 12 ? `\n\nİlk 12 hata gösterildi. Toplam hata: ${errors.length}` : "";
    alert(`Hatalı satırlar:\n${summary}${suffix}`);
  }

  async function importRecipeExcelFromFile() {
    const file = state.recipeImportFile || (els.recipeExcelFile && els.recipeExcelFile.files && els.recipeExcelFile.files[0]);
    if (!file) {
      alert("Önce Excel dosyası seçin.");
      return;
    }
    if (!backendBaseUrl()) {
      alert("Excel aktarımı için backend bağlantısı gerekir.");
      return;
    }

    if (els.recipeExcelImportButton) {
      els.recipeExcelImportButton.disabled = true;
      els.recipeExcelImportButton.textContent = "Aktarılıyor...";
    }
    if (els.recipeImportSummary) els.recipeImportSummary.textContent = "Excel okunuyor ve reçete verisiyle karşılaştırılıyor...";

    try {
      const result = await backendRequest("/api/admin/recipes/import-excel", {
        method: "POST",
        rawBody: await file.arrayBuffer(),
        headers: {
          "Content-Type": file.type || "application/octet-stream",
          "X-File-Name": encodeURIComponent(file.name || "recipes.xlsx")
        }
      });
      if (result.recipeState) {
        state.recipes = normalizeRecipeData(result.recipeState);
        state.recipeCatalog = normalizeRecipeCatalog(result.recipeCatalog);
        state.recipeLinkReview = Array.isArray(result.recipeLinkReview) ? result.recipeLinkReview : state.recipeLinkReview;
        saveRecipesLocalOnly();
        if (state.recipeChannel) state.recipeChannel.postMessage({ type: "recipes-updated", time: Date.now() });
      }
      state.recipeImportReport = result.report || null;
      renderRecipeEditor();
      renderRecipeImportReport();
      if (els.saveState) els.saveState.textContent = "Excel aktarımı tamamlandı";
    } catch (error) {
      state.recipeImportReport = {
        totalRows: 0,
        updatedCount: 0,
        createdCount: 0,
        unchangedCount: 0,
        errorCount: 1,
        changes: [],
        errors: [{ rowNumber: "-", message: error.message || "Aktarım başarısız." }]
      };
      renderRecipeImportReport();
      alert(`Excel aktarımı başarısız. ${error.message || ""}`);
    } finally {
      if (els.recipeExcelImportButton) {
        els.recipeExcelImportButton.disabled = false;
        els.recipeExcelImportButton.textContent = "Aktarımı Başlat";
      }
    }
  }

  function renderRecipeImportReport() {
    const report = state.recipeImportReport;
    if (!els.recipeImportReport || !els.recipeImportSummary) return;
    if (!report) {
      els.recipeImportReport.hidden = true;
      els.recipeImportSummary.textContent = "Son aktarım sonucu yok.";
      return;
    }
    const updated = Number(report.updatedCount || 0);
    const created = Number(report.createdCount || 0);
    const unchanged = Number(report.unchangedCount || 0);
    const errors = Number(report.errorCount || 0);
    els.recipeImportReport.hidden = false;
    els.recipeImportSummary.textContent = `Toplam ${Number(report.totalRows || 0)} satır okundu. ${updated} güncellendi, ${created} yeni eklendi, ${unchanged} aynı kaldı, ${errors} hatalı.`;
    if (els.recipeImportStats) {
      els.recipeImportStats.innerHTML = [
        ["Okunan", report.totalRows || 0],
        ["Güncellenen", updated],
        ["Yeni", created],
        ["Aynı", unchanged],
        ["Hatalı", errors]
      ].map(([label, value]) => `<span><strong>${escapeHTML(value)}</strong>${escapeHTML(label)}</span>`).join("");
    }
    if (els.recipeImportChanges) {
      const changes = Array.isArray(report.changes) ? report.changes : [];
      els.recipeImportChanges.innerHTML = changes.length ? changes.slice(0, 120).map((change) => `
        <article class="recipe-import-row">
          <strong>${escapeHTML(change.category || "-")} / ${escapeHTML(change.product || "-")} / ${escapeHTML(change.size || "-")}</strong>
          <span>${escapeHTML(change.field || "-")} · ${escapeHTML(change.changeType || "Değişti")}</span>
          <small>${escapeHTML(change.oldValue || "")} → ${escapeHTML(change.newValue || "")}</small>
          <em>${escapeHTML(change.status || "")}</em>
        </article>
      `).join("") : `<div class="empty-mini">Değişen içerik yok.</div>`;
    }
    if (els.recipeImportErrors) {
      const importErrors = Array.isArray(report.errors) ? report.errors : [];
      els.recipeImportErrors.innerHTML = importErrors.length ? importErrors.slice(0, 120).map((item) => `
        <article class="recipe-import-row is-error">
          <strong>Satır ${escapeHTML(item.rowNumber || "-")}</strong>
          <span>${escapeHTML(item.message || "Hatalı satır")}</span>
        </article>
      `).join("") : `<div class="empty-mini">Hatalı satır yok.</div>`;
    }
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
      ? sizeEntries.map(([size, recipe]) => {
        const item = normalizeRecipeItem(recipe);
        return `
        <article class="recipe-size-row">
          <div class="recipe-size-head">
            <label>
              <span>Ölçü</span>
              <input class="recipe-size-name" type="text" value="${escapeAttribute(size)}" data-recipe-size-name="${escapeAttribute(size)}">
            </label>
            <button class="danger-action" type="button" data-delete-recipe-size="${escapeAttribute(size)}">Ölçüyü Sil</button>
          </div>
          <label>
            <span>İçerik</span>
            <textarea class="recipe-textarea" rows="3" data-recipe-body="${escapeAttribute(size)}" data-recipe-field="content">${escapeHTML(item.content)}</textarea>
          </label>
          <label>
            <span>Hazırlanışı</span>
            <textarea class="recipe-textarea" rows="5" data-recipe-body="${escapeAttribute(size)}" data-recipe-field="preparation">${escapeHTML(item.preparation)}</textarea>
          </label>
          <label>
            <span>Ürün Notu</span>
            <textarea class="recipe-textarea" rows="2" data-recipe-body="${escapeAttribute(size)}" data-recipe-field="note">${escapeHTML(item.note)}</textarea>
          </label>
          <div class="form-grid two recipe-size-meta">
            <label class="toggle-row">
              <input type="checkbox" data-recipe-body="${escapeAttribute(size)}" data-recipe-field="active" ${item.active !== false ? "checked" : ""}>
              <span>Aktif</span>
            </label>
            <label>
              <span>Sıralama</span>
              <input type="number" step="1" data-recipe-body="${escapeAttribute(size)}" data-recipe-field="order" value="${escapeAttribute(item.order || 0)}">
            </label>
          </div>
        </article>
      `;
      }).join("")
      : `<div class="recipe-empty">Bu üründe ölçü yok. + Ölçü ile 14 oz gibi yeni bir reçete ekleyin.</div>`;
  }

  function handleRecipeSizeInput(event) {
    const control = event.target.closest("[data-recipe-body]");
    if (!control || control.dataset.recipeSizeName) return;
    const sizes = selectedRecipeSizes();
    const size = control.dataset.recipeBody;
    if (!Object.prototype.hasOwnProperty.call(sizes, size)) return;
    const item = normalizeRecipeItem(sizes[size]);
    const field = control.dataset.recipeField || "content";
    if (field === "active") {
      item.active = control.checked;
    } else if (field === "order") {
      item.order = Number(control.value || 0) || 0;
    } else if (["content", "preparation", "note"].includes(field)) {
      item[field] = control.value;
    } else {
      return;
    }
    sizes[size] = item;
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
        "14 oz": {
          content: "Double shot espresso + soğuk süt + buz",
          preparation: "",
          note: ""
        }
      }
    };
    state.selectedRecipeCategory = name;
    state.selectedRecipeProduct = "14 oz Örnek İçecek";
    addRecipeCatalogEntry(name, state.selectedRecipeProduct);
    state.selectedRecipePreviewSize = "14 oz";
    saveRecipes({ render: true });
  }

  function addRecipeProduct() {
    if (!state.selectedRecipeCategory) return;
    const products = recipeProductNames(state.selectedRecipeCategory);
    const name = uniqueName("Yeni Ürün", products);
    state.recipes[state.selectedRecipeCategory][name] = {
      "14 oz": {
        content: "Reçete içeriğini buraya yazın",
        preparation: "",
        note: ""
      }
    };
    state.selectedRecipeProduct = name;
    state.selectedRecipePreviewSize = "14 oz";
    saveRecipes({ render: true });
  }

  function addRecipeSize() {
    const sizes = selectedRecipeSizes();
    if (!sizes) return;
    const name = uniqueName("14 oz", Object.keys(sizes));
    sizes[name] = {
      content: "Reçete içeriğini buraya yazın",
      preparation: "",
      note: ""
    };
    addRecipeCatalogEntry(state.selectedRecipeCategory, name);
    state.selectedRecipePreviewSize = name;
    saveRecipes({ render: true });
  }

  function deleteSelectedRecipeCategory() {
    if (!state.selectedRecipeCategory || recipeCategoryNames().length <= 1) return;
    const ids = state.recipeCatalog.filter((item) => item.category === state.selectedRecipeCategory).map((item) => item.id);
    const linkedCount = linkedMenuProductsForRecipeIds(ids).length;
    if (!confirm(`${state.selectedRecipeCategory} kategorisi ve içindeki reçeteler silinsin mi?${linkedCount ? ` ${linkedCount} menü ürünü manuel/boş içerik fallback'ine geçecek.` : ""}`)) return;
    state.recipeCatalog = state.recipeCatalog.filter((item) => item.category !== state.selectedRecipeCategory);
    delete state.recipes[state.selectedRecipeCategory];
    state.selectedRecipeCategory = "";
    state.selectedRecipeProduct = "";
    state.selectedRecipePreviewSize = "";
    ensureRecipeSelection();
    saveRecipes({ render: true });
  }

  function deleteSelectedRecipeProduct() {
    if (!state.selectedRecipeCategory || !state.selectedRecipeProduct) return;
    const catalogItem = state.recipeCatalog.find((item) => item.category === state.selectedRecipeCategory && item.product === state.selectedRecipeProduct);
    const linkedCount = linkedMenuProductsForRecipeIds(catalogItem ? [catalogItem.id] : []).length;
    if (!confirm(`${state.selectedRecipeProduct} ürünü ve ölçüleri silinsin mi?${linkedCount ? ` ${linkedCount} bağlı menü ürünü manuel/boş içerik fallback'ine geçecek.` : ""}`)) return;
    if (catalogItem) state.recipeCatalog = state.recipeCatalog.filter((item) => item.id !== catalogItem.id);
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
    state.recipeCatalog.forEach((item) => {
      if (item.category === oldName) item.category = nextName;
    });
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
    const catalogItem = state.recipeCatalog.find((item) => item.category === state.selectedRecipeCategory && item.product === oldName);
    if (catalogItem) catalogItem.product = nextName;
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

  function renderMenuUiSummary(settings) {
    if (!settings) return;
    const swatches = [
      [els.menuSummaryTheme, settings.bgColor],
      [els.menuSummaryDark, settings.darkBgColor],
      [els.menuSummaryAccent, settings.accentColor],
      [els.menuSummaryText, settings.textColor],
      [els.menuSummaryCard, settings.productCardColor]
    ];
    swatches.forEach(([element, value]) => {
      if (element) element.style.backgroundColor = toColor(value, "#F4EBDC");
    });
    if (els.menuSummaryThemeText) {
      const labels = { solid: "Düz renk", gradient: "Gradient", image: "Görsel" };
      els.menuSummaryThemeText.textContent = labels[settings.menuBackground.type] || "Aydınlık";
    }
    if (els.menuSummaryAccentText) {
      els.menuSummaryAccentText.textContent = toColor(settings.accentColor, DEFAULT_SETTINGS.accentColor).toUpperCase();
    }
    if (els.menuOverlayValue) els.menuOverlayValue.textContent = `${Math.round(Number(settings.menuBackground.overlay || 0) * 100)}%`;
    const popular = normalizeStyle(settings.bottomActions.popular);
    const suggest = normalizeStyle(settings.bottomActions.suggest);
    if (els.popularOverlayValue) els.popularOverlayValue.textContent = `${Math.round(Number(popular.overlay || 0) * 100)}%`;
    if (els.suggestOverlayValue) els.suggestOverlayValue.textContent = `${Math.round(Number(suggest.overlay || 0) * 100)}%`;
    if (els.menuPreviewUpdated) els.menuPreviewUpdated.textContent = settings.menuUpdateDate || "Canlı veri";
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
      console.error("Banner medyası yüklenemedi:", error);
      alert(`Medya backend'e yüklenemedi. ${error.message || "Dosya türünü, boyutunu ve oturumu kontrol edin."}`);
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

  let menuPreviewScaleFrame = 0;

  function renderMenuPreview() {
    ensureMenuPreviewResizeObserver();
    const src = menuPreviewUrl();
    const existing = els.livePreview.querySelector(".menu-live-preview");
    if (existing) {
      if (existing.getAttribute("data-preview-src") !== src) {
        existing.setAttribute("data-preview-src", src);
        existing.src = src;
      }
      queueMenuPreviewScale();
      return;
    }

    els.livePreview.innerHTML = `
      <iframe class="menu-live-preview" data-preview-src="${escapeAttribute(src)}" src="${escapeAttribute(src)}" title="Canlı menü önizleme" loading="eager" scrolling="yes" allow="autoplay"></iframe>
    `;
    const iframe = els.livePreview.querySelector(".menu-live-preview");
    if (iframe) iframe.addEventListener("load", queueMenuPreviewScale, { passive: true });
    queueMenuPreviewScale();
  }

  function queueMenuPreviewScale() {
    window.cancelAnimationFrame(menuPreviewScaleFrame);
    menuPreviewScaleFrame = window.requestAnimationFrame(syncMenuPreviewScale);
  }

  function ensureMenuPreviewResizeObserver() {
    if (!els.livePreview || !window.ResizeObserver || els.livePreview.__menuPreviewResizeObserver) return;
    const observer = new ResizeObserver(queueMenuPreviewScale);
    observer.observe(els.livePreview);
    els.livePreview.__menuPreviewResizeObserver = observer;
  }

  function syncMenuPreviewScale() {
    if (!els.livePreview) return;
    const iframe = els.livePreview.querySelector(".menu-live-preview");
    if (!iframe) return;

    const desktop = Boolean(els.menuPreviewDesktop?.checked);
    const viewportWidth = desktop ? 1440 : 390;
    const viewportHeight = desktop ? 900 : 844;
    const availableWidth = els.livePreview.clientWidth;
    const availableHeight = els.livePreview.clientHeight;
    if (availableWidth < 20 || availableHeight < 20) return;
    const scale = Math.min(availableWidth / viewportWidth, availableHeight / viewportHeight);
    const renderedWidth = viewportWidth * scale;
    const renderedHeight = viewportHeight * scale;

    els.livePreview.dataset.previewDevice = desktop ? "desktop" : "mobile";
    iframe.style.width = `${viewportWidth}px`;
    iframe.style.height = `${viewportHeight}px`;
    iframe.style.left = `${Math.max(0, (availableWidth - renderedWidth) / 2)}px`;
    iframe.style.top = `${Math.max(0, (availableHeight - renderedHeight) / 2)}px`;
    iframe.style.transform = `scale(${scale})`;
  }

  function menuPageUrl() {
    return publicSiteUrl();
  }

  function recipePageUrl() {
    return `${publicSiteUrl().replace(/\/+$/, "")}/recete/`;
  }

  function publicSiteUrl() {
    const explicit = window.TAHMISCI_PUBLIC_URL || "";
    if (explicit) return String(explicit).replace(/\/+$/, "/");

    const host = window.location.hostname || "";
    const protocol = window.location.protocol || "https:";
    const port = window.location.port ? `:${window.location.port}` : "";
    if (host.startsWith("admin.")) return `${protocol}//${host.slice(6)}${port}/`;

    return "../";
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
    const activeRecipe = activeSize ? normalizeRecipeItem(sizes[activeSize]) : normalizeRecipeItem("");

    els.livePreview.innerHTML = `
      <div class="recipe-preview-screen">
        <div class="recipe-preview-top">
          <div>
            <p class="eyebrow">TAHMİSÇİ Coffee</p>
            <h4>REÇETE</h4>
          </div>
          <span style="font-size:22px">\u263E</span>
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
            <span>${escapeHTML(activeRecipe.content || "Bu ölçü için reçete bilgisi henüz girilmedi.")}</span>
            ${activeRecipe.preparation ? `<em>Hazırlanışı: ${escapeHTML(activeRecipe.preparation)}</em>` : ""}
            ${activeRecipe.note ? `<em>Ürün Notu: ${escapeHTML(activeRecipe.note)}</em>` : ""}
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
    category.iconKey = normalizeCategoryIconKey(els.categoryIconKey && els.categoryIconKey.value, category.name);
    category.icon = CATEGORY_ICON_REGISTRY.getIconClass(category.iconKey);
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
    product.manualContent = els.productIngredients.value.trim();
    product.details.ingredients = product.manualContent;
    product.contentMode = ["recipe", "manual", "hidden", "not-required"].includes(els.productContentMode.value) ? els.productContentMode.value : "manual";
    product.recipeId = els.productRecipeId.value || "";
    product.recipeSize = els.productRecipeSize.value || "";
    product.recipeLinkStatus = product.recipeId ? "linked" : "unmatched";
    saveAndRender();
  }

  function addRecipeCatalogEntry(category, product) {
    const existing = state.recipeCatalog.find((item) => item.category === category && item.product === product);
    if (existing) return existing;
    const now = new Date().toISOString();
    const item = {
      id: window.crypto && typeof window.crypto.randomUUID === "function"
        ? window.crypto.randomUUID()
        : `recipe-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      category,
      product,
      createdAt: now,
      updatedAt: now
    };
    state.recipeCatalog.push(item);
    return item;
  }

  function linkedMenuProductsForRecipeIds(ids) {
    const wanted = new Set(ids || []);
    return flatProducts().filter(({ product }) => wanted.has(product.recipeId));
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
      iconKey: normalizeCategoryIconKey("", name),
      icon: CATEGORY_ICON_REGISTRY.getIconClass(normalizeCategoryIconKey("", name)),
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
    if (!window.indexedDB) return Promise.reject(new Error("Tarayıcı medya depolamayı desteklemiyor."));
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
    if (!src) throw new Error("Backend medya adresi döndürmedi.");
    return {
      id: String(media.id || ""),
      src,
      name: media.name || file.name || (kind === "video" ? "Video" : "Görsel"),
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
    const clean = cleanPrice(value);
    if (clean === "") return "-";
    return `${new Intl.NumberFormat("tr-TR").format(clean)}\u20BA`;
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












