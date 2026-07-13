"use strict";

const { once } = require("events");
const {
  buildLocalEnvironment,
  getLocalCredentials,
  getLocalPaths,
  parseLocalPort
} = require("../src/local-development");

const port = parseLocalPort();
Object.assign(process.env, buildLocalEnvironment({ port, kind: "dev" }));

let server = null;
let closing = false;

main().catch((error) => {
  console.error(`Lokal sunucu başlatılamadı: ${error.message}`);
  process.exitCode = 1;
});

async function main() {
  const { startServer } = require("../src/server");
  server = await startServer();
  if (!server.listening) await Promise.race([once(server, "listening"), once(server, "error").then(([error]) => Promise.reject(error))]);
  printLocalBanner();
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

function printLocalBanner() {
  const origin = `http://localhost:${port}`;
  const credentials = getLocalCredentials();
  const paths = getLocalPaths("dev");
  console.log("\nTahmisçi lokal geliştirme hazır");
  console.log(`Site             : ${origin}/`);
  console.log(`Canlı menü       : ${origin}/#menu`);
  console.log(`Admin giriş      : ${origin}/login.html`);
  console.log(`Admin paneli     : ${origin}/panel/`);
  console.log(`Reçete           : ${origin}/recete/`);
  console.log(`QR menü          : ${origin}/qr-menu/`);
  console.log(`Health           : ${origin}/api/health`);
  console.log(`Lokal admin şifre: ${credentials.adminPassword}`);
  console.log(`Lokal reçete şifre: ${credentials.recipePassword}`);
  console.log(`Lokal store      : ${paths.dataFile}`);
  console.log("Durdurmak için Ctrl+C kullanın.\n");
}

async function shutdown() {
  if (closing) return;
  closing = true;
  if (server) await new Promise((resolve) => server.close(resolve));
  process.exit(0);
}
