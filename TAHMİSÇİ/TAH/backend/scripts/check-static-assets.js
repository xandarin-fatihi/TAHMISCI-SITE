"use strict";

const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..", "..");
const pages = [
  "site/index.html",
  "panel/index.html",
  "qr-menu/index.html",
  "recete/index.html",
  "password-reset/index.html"
];
const missing = [];

for (const relativePage of pages) {
  const pagePath = path.join(projectRoot, relativePage);
  const html = fs.readFileSync(pagePath, "utf8");
  const references = [...html.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const reference of references) {
    const clean = reference.split(/[?#]/)[0];
    if (!clean || /^(?:https?:|mailto:|tel:|data:|#)/i.test(reference)) continue;
    if (!/\.[a-z0-9]{2,5}$/i.test(clean)) continue;
    const target = clean.startsWith("/")
      ? routeFile(clean)
      : path.resolve(path.dirname(pagePath), clean);
    if (target && !fs.existsSync(target)) missing.push(`${relativePage} -> ${reference}`);
  }
}

const siteIndex = fs.readFileSync(path.join(projectRoot, "site", "index.html"), "utf8");
if (/menu-catalog\.js|recipe-data\.js/i.test(siteIndex)) missing.push("site/index.html statik katalog veya reçete kopyası yüklüyor");
for (const fileName of ["public-data-provider.js", "main-runtime.js"]) {
  const source = fs.readFileSync(path.join(projectRoot, "site", "js", fileName), "utf8");
  if (/window\.fetch\s*=/.test(source)) missing.push(`${fileName} global fetch müdahalesi içeriyor`);
}

if (missing.length) {
  console.error(`Statik bağlantı kontrolü başarısız:\n- ${missing.join("\n- ")}`);
  process.exit(1);
}

console.log(`${pages.length} HTML dosyasındaki yerel CSS, JS, görsel ve video bağlantıları doğrulandı.`);

function routeFile(routePath) {
  const clean = routePath.replace(/^\/+/, "");
  if (/^(?:assets|css|js)\//.test(clean)) return path.join(projectRoot, "site", clean);
  if (clean.startsWith("brand-assets/")) return path.join(projectRoot, "Tahmisçi_Logo", clean.slice("brand-assets/".length));
  if (clean === "sw.js") return path.join(projectRoot, "site", clean);
  return path.join(projectRoot, clean);
}
