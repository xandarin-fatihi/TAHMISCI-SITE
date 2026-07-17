"use strict";

const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..", "..", "..");
const pages = [
  "apps/website/index.html",
  "apps/website/mudavim/index.html",
  "apps/admin/index.html",
  "apps/qr-menu/index.html",
  "apps/recipe/index.html",
  "apps/auth/login.html",
  "apps/auth/password-reset/index.html"
];
const missing = [];

for (const relativePage of pages) {
  const pagePath = path.join(projectRoot, relativePage);
  const html = fs.readFileSync(pagePath, "utf8");
  const references = [...html.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const reference of references) {
    const clean = reference.split(/[?#]/)[0].replace(/^\/+/, "");
    if (!clean || /^(?:https?:|mailto:|tel:|data:|#)/i.test(reference)) continue;
    if (!/\.[a-z0-9]{2,5}$/i.test(clean)) continue;
    const target = reference.startsWith("/")
      ? routeFile(clean)
      : path.resolve(path.dirname(pagePath), clean);
    if (target && !fs.existsSync(target)) missing.push(`${relativePage} -> ${reference}`);
  }
}

const siteIndex = fs.readFileSync(path.join(projectRoot, "apps", "website", "index.html"), "utf8");
if (/recipe-data\.js/i.test(siteIndex)) missing.push("apps/website/index.html statik recete kopyasi yukluyor");
for (const fileName of ["api/public-data-provider.js", "bootstrap/initialize-site.js"]) {
  const source = fs.readFileSync(path.join(projectRoot, "apps", "website", "scripts", fileName), "utf8");
  if (/window\.fetch\s*=/.test(source)) missing.push(`${fileName} global fetch mudalesi iceriyor`);
}

if (missing.length) {
  console.error(`Statik baglanti kontrolu basarisiz:\n- ${missing.join("\n- ")}`);
  process.exit(1);
}

console.log(`${pages.length} HTML dosyasindaki yerel CSS, JS, gorsel ve video baglantilari dogrulandi.`);

function routeFile(clean) {
  if (clean.startsWith("assets/")) return path.join(projectRoot, "public", clean);
  if (clean.startsWith("shared/")) return path.join(projectRoot, clean);
  if (clean.startsWith("styles/")) return path.join(projectRoot, "apps", "website", clean);
  if (clean.startsWith("scripts/")) return path.join(projectRoot, "apps", "website", clean);
  if (clean.startsWith("mudavim/")) return path.join(projectRoot, "apps", "website", clean);
  if (clean.startsWith("panel/")) return path.join(projectRoot, "apps", "admin", clean.slice("panel/".length));
  if (clean.startsWith("recete/")) return path.join(projectRoot, "apps", "recipe", clean.slice("recete/".length));
  if (clean.startsWith("qr-menu/")) return path.join(projectRoot, "apps", "qr-menu", clean.slice("qr-menu/".length));
  if (clean === "sw.js") return path.join(projectRoot, "apps", "website", clean);
  return path.join(projectRoot, clean);
}
