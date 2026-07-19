"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { buildPublicBootstrap } = require("../src/public-bootstrap");
const { migrateSiteState } = require("../src/site-state");
const { createFileStore, normalizeStore } = require("../src/store/file-store");
const { loadDefaults } = require("../src/store/seed-defaults");
const { migrateStore, reconcileRecipeCatalog } = require("../src/store/migrations");
const { validateSiteState } = require("../src/validators");

function fixture() {
  return {
    futureSafeField: { retained: true },
    admin: { passwordHash: "hash", recipePasswordHash: "recipe-hash", customAdminField: "keep" },
    recipeUsers: [{ id: "u1", username: "barista", passwordHash: "secret-hash", active: true }],
    recipeAssignments: [{ id: "a1", userId: "u1", kind: "exam" }],
    recipeActivity: [{ id: "x1", userId: "u1", type: "exam_completed" }],
    feedbackItems: [{ id: "f1" }],
    recipeState: {
      Kahveler: {
        Latte: {
          Standart: { content: "Espresso, süt", preparation: "Gizli hazırlık", note: "Barista notu", active: true, order: 4 }
        }
      }
    },
    menuState: {
      settings: {},
      categories: [{
        id: "coffee",
        name: "Kahveler",
        active: true,
        products: [{
          id: "latte",
          name: "Latte",
          active: true,
          stock: "active",
          prices: { standard: 125 },
          details: { ingredients: "Manuel içerik", calories: "180", allergens: "Süt" }
        }]
      }]
    },
    siteState: { hero: { slides: [{ id: "one", visible: true, order: 0, title: { tr: "Başlık" } }] } }
  };
}

test("store normalizasyonu uygulama verisini ve bilinmeyen güvenli alanları korur", () => {
  const migrated = migrateStore(fixture());
  assert.equal(migrated.futureSafeField.retained, true);
  assert.equal(migrated.recipeUsers[0].username, "barista");
  assert.equal(migrated.recipeAssignments[0].kind, "exam");
  assert.equal(migrated.recipeActivity[0].type, "exam_completed");
  assert.equal(migrated.admin.customAdminField, "keep");
  const item = migrated.recipeState.Kahveler.Latte.Standart;
  assert.deepEqual({ note: item.note, active: item.active, order: item.order }, { note: "Barista notu", active: true, order: 4 });
  assert.deepEqual(migrateStore(migrated), migrated, "migration idempotent olmalı");
});

test("file store kullanıcı, atama ve aktiviteyi yazıp tekrar okur", async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "tahmisci-store-"));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const store = createFileStore(path.join(directory, "store.json"), {
    defaultPanelPassword: "Panel123456",
    defaultRecipePassword: "Recipe123456",
    bcryptRounds: 10
  });
  await store.ensure();
  await store.update((data) => {
    data.recipeUsers.push({ id: "u1", username: "barista", passwordHash: "hash", active: true });
    data.recipeAssignments.push({ id: "a1", userId: "u1", kind: "homework" });
    data.recipeActivity.push({ id: "x1", userId: "u1", type: "homework_created" });
    data.recipeState = fixture().recipeState;
    return data;
  });
  const reloaded = await store.read();
  assert.equal(reloaded.recipeUsers[0].id, "u1");
  assert.equal(reloaded.recipeAssignments[0].id, "a1");
  assert.equal(reloaded.recipeActivity[0].id, "x1");
  assert.equal(reloaded.recipeState.Kahveler.Latte.Standart.note, "Barista notu");
});

test("ilk güvenli eşleştirme yalnızca benzersiz tam adları bağlar", () => {
  const unique = migrateStore(fixture());
  const product = unique.menuState.categories[0].products[0];
  assert.equal(product.contentMode, "recipe");
  assert.ok(product.recipeId);
  assert.equal(product.recipeLinkStatus, "linked");

  const duplicate = fixture();
  duplicate.recipeState.Buzlular = { Latte: { "16 oz": { content: "Soğuk içerik", preparation: "Gizli" } } };
  const ambiguous = migrateStore(duplicate);
  const ambiguousProduct = ambiguous.menuState.categories[0].products[0];
  assert.equal(ambiguousProduct.recipeId, "");
  assert.equal(ambiguousProduct.contentMode, "manual");
  assert.equal(ambiguous.recipeLinkReview[0].reason, "ambiguous");
});

test("public bootstrap fiyat/aktiflik ve güvenli reçete içeriğini doğru projekte eder", () => {
  const data = migrateStore(fixture());
  const first = buildPublicBootstrap(data);
  const product = first.menu.products[0];
  assert.equal(product.basePrice, 125);
  assert.equal(product.content, "Espresso, süt");
  const encoded = JSON.stringify(first);
  assert.equal(encoded.includes("Gizli hazırlık"), false);
  assert.equal(encoded.includes("Barista notu"), false);
  assert.equal(encoded.includes("recipeUsers"), false);
  assert.equal(encoded.includes("passwordHash"), false);

  data.recipeState.Kahveler.Latte.Standart.content = "Espresso, yulaf sütü";
  assert.equal(buildPublicBootstrap(data).menu.products[0].content, "Espresso, yulaf sütü");

  data.menuState.categories[0].products[0].active = false;
  assert.equal(buildPublicBootstrap(data).menu.productCount, 0);
});

test("stable reçete bağlantısı ad değişikliğinde, manuel ve gizli modlarda çalışır", () => {
  const data = migrateStore(fixture());
  const product = data.menuState.categories[0].products[0];
  const stableId = product.recipeId;
  data.recipeState.Kahveler["Latte Yeni"] = data.recipeState.Kahveler.Latte;
  delete data.recipeState.Kahveler.Latte;
  data.recipeCatalog = data.recipeCatalog.map((item) => item.id === stableId ? { ...item, product: "Latte Yeni" } : item);
  data.recipeCatalog = reconcileRecipeCatalog(data.recipeState, data.recipeCatalog);
  assert.equal(buildPublicBootstrap(data).menu.products[0].content, "Espresso, süt");

  product.contentMode = "manual";
  product.manualContent = "Manuel yayın";
  assert.equal(buildPublicBootstrap(data).menu.products[0].content, "Manuel yayın");
  product.contentMode = "hidden";
  assert.equal(buildPublicBootstrap(data).menu.products[0].content, "");
});

test("siteState sürümlenir, restart normalizasyonunda korunur ve zararlı içerik reddedilir", () => {
  const state = migrateSiteState({ hero: { slides: [{ id: "main", visible: true, order: 0, title: { tr: "Yeni hero" } }] } });
  state.about.description.tr = "Yeni hakkımızda";
  const reloaded = normalizeStore({ ...fixture(), siteState: state });
  assert.equal(reloaded.siteState.schemaVersion, 3);
  assert.equal(reloaded.siteState.about.description.tr, "Yeni hakkımızda");
  assert.match(validateSiteState({ ...state, seo: { ...state.seo, canonicalUrl: "javascript:alert(1)" } }), /guvensiz/);
  assert.match(validateSiteState({ ...state, about: { ...state.about, description: { tr: "<img onerror=alert(1)>" } } }), /guvensiz/);
});

test("eski Windows lokal seedindeki bozuk Türkçe varsayılanlar veri kaybetmeden onarılır", () => {
  const migrated = migrateSiteState({
    header: { navigation: [
      { id: "home", label: { tr: "Ana Sayfa", en: "Home" }, url: "#top", visible: true, order: 0 },
      { id: "menu", label: { tr: "Men?", en: "Menu" }, url: "#menu", visible: true, order: 1 }
    ] },
    hero: { slides: [{
      id: "hero-main",
      title: { tr: "Kahvenin iyi hali", en: "Coffee at its best" },
      description: { tr: "?zenle hazirlanan kahveler ve g?n?n her anina eslik eden lezzetler.", en: "Carefully prepared coffees and flavors for every moment of the day." },
      buttonText: { tr: "Men?y? Kesfet", en: "Explore the Menu" }
    }] },
    about: { title: { tr: "Yönetici tarafından yazılmış özel başlık?", en: "Custom" } }
  });

  assert.equal(migrated.header.navigation[1].label.tr, "Menü");
  assert.equal(migrated.hero.slides[0].description.tr, "Özenle hazırlanan kahveler ve günün her anına eşlik eden lezzetler.");
  assert.equal(migrated.hero.slides[0].buttonText.tr, "Menüyü Keşfet");
  assert.equal(migrated.about.title.tr, "Yönetici tarafından yazılmış özel başlık?");
});

test("Müdavim duyuruları sıralı bloklarla korunur ve public çıktıda yalnızca yayınlanan içerik görünür", () => {
  const data = migrateStore(fixture());
  data.siteState = migrateSiteState(data.siteState);
  data.siteState.mudavim.announcements = [
    {
      id: "taslak",
      title: "Taslak duyuru",
      slug: "taslak-duyuru",
      order: 0,
      isPublished: false,
      blocks: [{ id: "taslak-metin", type: "text", content: "Yayınlanmamalı", order: 0 }]
    },
    {
      id: "yayinda",
      title: "Yayındaki duyuru",
      slug: "yayindaki-duyuru",
      order: 1,
      isPublished: true,
      blocks: [
        { id: "yayinda-gorsel", type: "image", imageUrl: "/media/duyuru.webp", alt: "Duyuru", order: 1 },
        { id: "yayinda-metin", type: "text", content: "Önce metin", order: 0 },
        {
          id: "yayinda-gorsel-metin",
          type: "image-text",
          badge: "YENİ",
          date: "2026-07-19",
          heading: "Yeni sezon",
          body: "Görsel solda, metin sağda.",
          imageUrl: "/media/yeni-sezon.webp",
          alt: "Yeni sezon duyurusu",
          order: 2
        },
        {
          id: "yayinda-metin-gorsel",
          type: "text-image",
          badge: "ETKİNLİK",
          heading: "Atölye buluşması",
          body: "Metin solda, görsel sağda.",
          imageUrl: "/media/atolye.webp",
          order: 3
        }
      ]
    }
  ];

  const normalized = normalizeStore(data);
  assert.equal(normalized.siteState.mudavim.announcements.length, 2);
  const publicAnnouncements = buildPublicBootstrap(normalized).siteState.mudavim.announcements;
  assert.equal(publicAnnouncements.length, 1);
  assert.equal(publicAnnouncements[0].id, "yayinda");
  assert.deepEqual(publicAnnouncements[0].blocks.map((block) => block.type), ["text", "image", "image-text", "text-image"]);
  assert.equal(publicAnnouncements[0].blocks[2].badge, "YENİ");
  assert.equal(publicAnnouncements[0].blocks[2].heading, "Yeni sezon");
  assert.equal(publicAnnouncements[0].blocks[2].body, "Görsel solda, metin sağda.");
  assert.equal("content" in publicAnnouncements[0].blocks[2], false);
  assert.equal(JSON.stringify(publicAnnouncements).includes("Yayınlanmamalı"), false);
  assert.match(validateSiteState({
    ...normalized.siteState,
    mudavim: {
      announcements: [{
        id: "zararli",
        title: "Zararlı",
        isPublished: true,
        blocks: [{ id: "gorsel", type: "image", imageUrl: "javascript:alert(1)" }]
      }]
    }
  }), /guvensiz/);
});

test("gerçek başlangıç verisi 215 ürünü kaybetmeden okunur", async () => {
  const defaults = await loadDefaults(path.resolve(__dirname, "..", ".."));
  const count = defaults.menuState.categories.reduce((total, category) => total + category.products.length, 0);
  assert.equal(defaults.menuState.categories.length, 7);
  assert.equal(count, 215);
  assert.ok(Object.keys(defaults.recipeState).length > 0);
});
