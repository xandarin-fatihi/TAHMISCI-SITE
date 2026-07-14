"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const runRoot = path.join(os.tmpdir(), `tahmisci-server-${process.pid}-${Date.now()}`);
process.env.NODE_ENV = "test";
process.env.DATA_FILE = path.join(runRoot, "store.json");
process.env.MEDIA_DIR = path.join(runRoot, "media");
process.env.DEFAULT_PANEL_PASSWORD = "Panel123456";
process.env.DEFAULT_RECIPE_PASSWORD = "Recipe123456";
process.env.JWT_SECRET = "test-secret-that-is-longer-than-thirty-two-characters-123456789";
process.env.COOKIE_SECURE = "false";
process.env.ALLOW_LOCALHOST_ORIGINS = "true";

const { app, prepareRuntime } = require("../src/server");

let server;
let baseUrl;

test.before(async () => {
  await prepareRuntime();
  server = await new Promise((resolve) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  await fs.rm(runRoot, { recursive: true, force: true });
});

async function json(pathname, options = {}) {
  const response = await fetch(`${baseUrl}${pathname}`, options);
  return { response, body: await response.json().catch(() => ({})) };
}

async function login() {
  const { response, body } = await json("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: baseUrl },
    body: JSON.stringify({ password: "Panel123456" })
  });
  assert.equal(response.status, 200);
  assert.ok(body.token);
  return body.token;
}

function adminHeaders(token, contentType = "application/json") {
  return { Authorization: `Bearer ${token}`, Origin: baseUrl, "Content-Type": contentType };
}

test("ana site, QR menü ve public bootstrap yeni klasörlerden açılır", async () => {
  const home = await fetch(`${baseUrl}/`);
  assert.equal(home.status, 200);
  assert.match(await home.text(), /public-data-provider\.js/);
  const qr = await fetch(`${baseUrl}/qr-menu/`);
  assert.equal(qr.status, 200);
  assert.match(await qr.text(), /Tahmisçi Dijital Menü/);
  const asset = await fetch(`${baseUrl}/assets/images/hero/tahmisci-barista-main.jpg`);
  assert.equal(asset.status, 200);

  const { response, body } = await json("/api/public/bootstrap");
  assert.equal(response.status, 200);
  assert.equal(body.menu.categoryCount, 7);
  assert.equal(body.menu.productCount, 215);
  assert.equal(JSON.stringify(body).includes("preparation"), false);
  assert.equal(JSON.stringify(body).includes("recipeUsers"), false);
});

test("reçete ve admin yazma uçları yetkisiz erişime kapalıdır", async () => {
  assert.equal((await fetch(`${baseUrl}/api/recipes`, { redirect: "manual" })).status, 401);
  assert.equal((await fetch(`${baseUrl}/recipe-data.js`, { redirect: "manual" })).status, 302);
  const current = (await json("/api/menu")).body.menuState;
  const denied = await json("/api/menu", {
    method: "PUT",
    headers: { "Content-Type": "application/json", Origin: baseUrl },
    body: JSON.stringify({ menuState: current })
  });
  assert.equal(denied.response.status, 401);
});

test("admin fiyat ve reçete içeriği yayınları public bootstrap'a yansır", async () => {
  const token = await login();
  const menuResult = await json("/api/menu");
  const menu = menuResult.body.menuState;
  const linkedProduct = menu.categories.flatMap((category) => category.products).find((product) => product.recipeId);
  assert.ok(linkedProduct, "başlangıç migration'ı güvenli bir reçete bağlantısı kurmalı");
  linkedProduct.prices = { standard: 321 };
  linkedProduct.priceMode = "standard";
  linkedProduct.variants = [];
  let saved = await json("/api/menu", {
    method: "PUT",
    headers: adminHeaders(token),
    body: JSON.stringify({ menuState: menu })
  });
  assert.equal(saved.response.status, 200);
  let bootstrap = (await json("/api/public/bootstrap")).body;
  assert.equal(bootstrap.menu.products.find((product) => product.id === linkedProduct.id).basePrice, 321);

  const recipesResult = await json("/api/recipes", { headers: adminHeaders(token) });
  assert.equal(recipesResult.response.status, 200);
  const record = recipesResult.body.recipeCatalog.find((item) => item.id === linkedProduct.recipeId);
  assert.ok(record);
  const sizes = recipesResult.body.recipeState[record.category][record.product];
  const sizeName = linkedProduct.recipeSize && sizes[linkedProduct.recipeSize] ? linkedProduct.recipeSize : Object.keys(sizes)[0];
  const previous = sizes[sizeName];
  sizes[sizeName] = typeof previous === "string"
    ? { content: "Public içerik güncellendi", preparation: "Gizli hazırlık" }
    : { ...previous, content: "Public içerik güncellendi", preparation: "Gizli hazırlık" };
  saved = await json("/api/recipes", {
    method: "PUT",
    headers: adminHeaders(token),
    body: JSON.stringify({ recipeState: recipesResult.body.recipeState, recipeCatalog: recipesResult.body.recipeCatalog })
  });
  assert.equal(saved.response.status, 200);
  bootstrap = (await json("/api/public/bootstrap")).body;
  const publicProduct = bootstrap.menu.products.find((product) => product.id === linkedProduct.id);
  assert.equal(publicProduct.content, "Public içerik güncellendi");
  assert.equal(JSON.stringify(bootstrap).includes("Gizli hazırlık"), false);
});

test("zararlı siteState ve geçersiz medya admin oturumunda da reddedilir", async () => {
  const token = await login();
  const malicious = await json("/api/site", {
    method: "PUT",
    headers: adminHeaders(token),
    body: JSON.stringify({ siteState: { seo: { canonicalUrl: "javascript:alert(1)" } } })
  });
  assert.equal(malicious.response.status, 400);

  const upload = await fetch(`${baseUrl}/api/media`, {
    method: "POST",
    headers: { ...adminHeaders(token, "image/png"), "X-Media-Kind": "image", "X-File-Name": "fake.png" },
    body: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  });
  assert.equal(upload.status, 400);
});

test("public SSE site yayını sonrası güncel bootstrap olayı gönderir", async () => {
  const token = await login();
  const controller = new AbortController();
  const events = await fetch(`${baseUrl}/api/public/events`, { signal: controller.signal });
  assert.equal(events.status, 200);
  const reader = events.body.getReader();
  const decoder = new TextDecoder();
  const received = (async () => {
    let text = "";
    const timeoutAt = Date.now() + 5000;
    while (Date.now() < timeoutAt) {
      const { value, done } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
      if (text.includes('"reason":"site"')) return text;
    }
    return text;
  })();

  const current = (await json("/api/site")).body.siteState;
  current.hero.slides[0].title.tr = "SSE ile güncellendi";
  const saved = await json("/api/site", {
    method: "PUT",
    headers: adminHeaders(token),
    body: JSON.stringify({ siteState: current })
  });
  assert.equal(saved.response.status, 200);
  const text = await received;
  controller.abort();
  assert.match(text, /"reason":"site"/);
  assert.match(text, /SSE ile güncellendi/);
});
