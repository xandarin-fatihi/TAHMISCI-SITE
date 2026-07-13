"use strict";

const assert = require("assert/strict");
const fs = require("fs/promises");
const { once } = require("events");
const {
  assertOwnedLocalTarget,
  buildLocalEnvironment,
  getLocalCredentials,
  getLocalPaths,
  parseLocalPort
} = require("../src/local-development");

const port = parseLocalPort(process.argv.slice(2), 18080);
const paths = getLocalPaths("smoke");
Object.assign(process.env, buildLocalEnvironment({ port, kind: "smoke" }));

let server = null;
let baseUrl = "";
let adminToken = "";

main().catch((error) => {
  console.error(`Lokal smoke test başarısız: ${error.stack || error.message}`);
  process.exitCode = 1;
});

async function main() {
  await cleanSmokeData();
  try {
    const { startServer } = require("../src/server");
    server = await startServer();
    if (!server.listening) await Promise.race([once(server, "listening"), once(server, "error").then(([error]) => Promise.reject(error))]);
    baseUrl = `http://127.0.0.1:${port}`;

    await checkHealthAndRoutes();
    await loginRecipe();
    await loginAdmin();
    await checkProtectedPanel();
    const bootstrap = await checkBootstrapSafety();
    await checkStaticAssets();
    await checkSitePublishFlow();
    await checkRecipePublishFlow(bootstrap);

    console.log("\nLokal smoke test: tüm kontroller başarılı.");
  } finally {
    if (server) await new Promise((resolve) => server.close(resolve));
    await cleanSmokeData();
  }
}

async function checkHealthAndRoutes() {
  const health = await jsonRequest("/api/health");
  assert.equal(health.response.status, 200);
  assert.equal(health.body.ok, true);
  pass("Backend başlıyor ve health endpoint'i cevap veriyor");

  for (const [pathname, marker] of [
    ["/", "public-data-provider.js"],
    ["/login.html", "loginForm"],
    ["/recete/", "recipeGateForm"],
    ["/qr-menu/", "menu.js"]
  ]) {
    const response = await fetch(`${baseUrl}${pathname}`, { redirect: "manual" });
    assert.equal(response.status, 200, `${pathname} HTTP ${response.status}`);
    assert.match(await response.text(), new RegExp(marker));
  }
  pass("Ana site, admin giriş, reçete ve QR menü rotaları açılıyor");
}

async function loginAdmin() {
  const credentials = getLocalCredentials();
  const result = await jsonRequest("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: baseUrl },
    body: JSON.stringify({ password: credentials.adminPassword })
  });
  assert.equal(result.response.status, 200);
  assert.ok(result.body.token);
  adminToken = result.body.token;
  pass("Lokal admin bilgisiyle giriş yapılabiliyor");
}

async function loginRecipe() {
  const credentials = getLocalCredentials();
  const result = await jsonRequest("/api/recipe/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: baseUrl },
    body: JSON.stringify({ password: credentials.recipePassword })
  });
  assert.equal(result.response.status, 200);
  assert.ok(result.body.token);
  pass("Lokal reçete bilgisiyle giriş yapılabiliyor");
}

async function checkProtectedPanel() {
  const anonymous = await fetch(`${baseUrl}/panel/`, { redirect: "manual" });
  assert.equal(anonymous.status, 302);
  const authenticated = await fetch(`${baseUrl}/panel/`, { headers: adminHeaders(), redirect: "manual" });
  assert.equal(authenticated.status, 200);
  assert.match(await authenticated.text(), /siteEditorCard/);
  pass("Panel oturumsuz kapalı, admin oturumuyla açılıyor");
}

async function checkBootstrapSafety() {
  const result = await jsonRequest("/api/public/bootstrap");
  assert.equal(result.response.status, 200);
  assert.equal(result.body.ok, true);
  assert.equal(result.body.menu.categoryCount, 7);
  assert.equal(result.body.menu.productCount, 215);
  assert.equal(Array.isArray(result.body.menu.products), true);
  assert.equal(result.body.menu.products.length, 215);
  assertNoForbiddenKeys(result.body, new Set([
    "preparation", "recipeState", "recipeUsers", "recipeAssignments", "recipeActivity",
    "passwordHash", "recipePasswordHash", "admin"
  ]));
  pass("Public bootstrap 215 ürün döndürüyor ve gizli reçete/admin verisi sızdırmıyor");
  return result.body;
}

async function checkStaticAssets() {
  const documents = [
    ["/", {}],
    ["/login.html", {}],
    ["/recete/", {}],
    ["/qr-menu/", {}],
    ["/panel/", { headers: adminHeaders() }]
  ];
  const assetUrls = new Set();
  for (const [pathname, options] of documents) {
    const response = await fetch(`${baseUrl}${pathname}`, options);
    assert.equal(response.status, 200);
    const html = await response.text();
    for (const url of extractAssetUrls(html, `${baseUrl}${pathname}`)) assetUrls.add(url);
  }

  for (const url of assetUrls) {
    const headers = new URL(url).pathname.startsWith("/panel/") ? adminHeaders() : {};
    const response = await fetch(url, { headers, redirect: "manual" });
    assert.ok(response.status >= 200 && response.status < 400, `${url} HTTP ${response.status}`);
  }

  const video = await fetch(`${baseUrl}/assets/videos/hero/tahmisci-reel-secondary.mp4`, {
    headers: { Range: "bytes=0-1023" }
  });
  assert.equal(video.status, 206);
  assert.match(String(video.headers.get("content-type") || ""), /^video\/mp4/i);
  pass(`${assetUrls.size} yerel static bağlantı ve MP4 Range/206 davranışı doğrulandı`);
}

async function checkSitePublishFlow() {
  const current = await jsonRequest("/api/site", { headers: adminHeaders() });
  assert.equal(current.response.status, 200);
  const siteState = current.body.siteState;
  const originalTitle = siteState.hero.slides[0].title.tr;
  const marker = `Lokal yayın testi ${Date.now()}`;
  siteState.hero.slides[0].title.tr = marker;

  let result = await jsonRequest("/api/site", {
    method: "PUT",
    headers: adminHeaders("application/json"),
    body: JSON.stringify({ siteState })
  });
  assert.equal(result.response.status, 200);
  result = await jsonRequest("/api/public/bootstrap");
  assert.equal(result.body.siteState.hero.slides[0].title.tr, marker);

  siteState.hero.slides[0].title.tr = originalTitle;
  result = await jsonRequest("/api/site", {
    method: "PUT",
    headers: adminHeaders("application/json"),
    body: JSON.stringify({ siteState })
  });
  assert.equal(result.response.status, 200);
  pass("Admin site yayını public bootstrap'a yansıyor ve geri alınabiliyor");
}

async function checkRecipePublishFlow(initialBootstrap) {
  const menu = await jsonRequest("/api/menu");
  const linkedProduct = menu.body.menuState.categories
    .flatMap((category) => category.products || [])
    .find((product) => product.recipeId);
  assert.ok(linkedProduct, "Lokal seed en az bir güvenli reçete bağlantısı üretmeli");

  const recipes = await jsonRequest("/api/recipes", { headers: adminHeaders() });
  assert.equal(recipes.response.status, 200);
  const record = recipes.body.recipeCatalog.find((item) => item.id === linkedProduct.recipeId);
  assert.ok(record);
  const sizes = recipes.body.recipeState[record.category][record.product];
  const sizeName = linkedProduct.recipeSize && sizes[linkedProduct.recipeSize]
    ? linkedProduct.recipeSize
    : Object.keys(sizes)[0];
  const previous = sizes[sizeName];
  const publicMarker = `Lokal public içerik ${Date.now()}`;
  const privateMarker = `Gizli hazırlanış ${Date.now()}`;
  sizes[sizeName] = typeof previous === "string"
    ? { content: publicMarker, preparation: privateMarker }
    : { ...previous, content: publicMarker, preparation: privateMarker };

  const saved = await jsonRequest("/api/recipes", {
    method: "PUT",
    headers: adminHeaders("application/json"),
    body: JSON.stringify({ recipeState: recipes.body.recipeState, recipeCatalog: recipes.body.recipeCatalog })
  });
  assert.equal(saved.response.status, 200);

  const bootstrap = (await jsonRequest("/api/public/bootstrap")).body;
  const publicProduct = bootstrap.menu.products.find((product) => product.id === linkedProduct.id);
  assert.equal(publicProduct.content, publicMarker);
  assert.equal(JSON.stringify(bootstrap).includes(privateMarker), false);
  assert.notEqual(initialBootstrap.version, bootstrap.version);
  pass("Reçete public içeriği bağlı ürüne yansıyor, hazırlanış public API'ye çıkmıyor");
}

async function jsonRequest(pathname, options = {}) {
  const response = await fetch(`${baseUrl}${pathname}`, options);
  return { response, body: await response.json().catch(() => ({})) };
}

function adminHeaders(contentType) {
  return {
    Authorization: `Bearer ${adminToken}`,
    Origin: baseUrl,
    ...(contentType ? { "Content-Type": contentType } : {})
  };
}

function extractAssetUrls(html, documentUrl) {
  const urls = [];
  const pattern = /(?:src|href|poster)=["']([^"']+)["']/gi;
  let match;
  while ((match = pattern.exec(html))) {
    const value = String(match[1] || "").trim();
    if (!value || value.startsWith("#") || /^(?:data:|blob:|mailto:|tel:|javascript:)/i.test(value)) continue;
    let url;
    try { url = new URL(value, documentUrl); } catch (_error) { continue; }
    if (url.origin !== baseUrl) continue;
    if (!/\.(?:css|js|png|jpe?g|webp|gif|svg|mp4|webm|woff2?|ttf|otf)$/i.test(url.pathname)) continue;
    urls.push(url.toString());
  }
  return urls;
}

function assertNoForbiddenKeys(value, forbidden, currentPath = "bootstrap") {
  if (!value || typeof value !== "object") return;
  for (const [key, item] of Object.entries(value)) {
    assert.equal(forbidden.has(key), false, `${currentPath}.${key} public çıktıda bulunmamalı`);
    assertNoForbiddenKeys(item, forbidden, `${currentPath}.${key}`);
  }
}

async function cleanSmokeData() {
  const dataFile = assertOwnedLocalTarget(paths.dataFile, paths.dataFile);
  const mediaDir = assertOwnedLocalTarget(paths.mediaDir, paths.mediaDir);
  await fs.rm(dataFile, { force: true });
  await fs.rm(mediaDir, { recursive: true, force: true });
}

function pass(message) {
  console.log(`✓ ${message}`);
}
