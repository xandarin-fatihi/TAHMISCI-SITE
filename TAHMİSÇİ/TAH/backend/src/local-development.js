"use strict";

const path = require("path");

const backendRoot = path.resolve(__dirname, "..");
const localDataRoot = path.join(backendRoot, "data");

const LOCAL_DEFAULTS = Object.freeze({
  adminPassword: "Tahmisci-Local-Admin-2026!",
  recipePassword: "Tahmisci-Local-Recete-2026!",
  jwtSecret: "tahmisci-local-development-jwt-secret-2026-never-production",
  managerKey: "tahmisci-local-development-manager-key-2026-never-production"
});

function getLocalPaths(kind = "dev") {
  if (!new Set(["dev", "smoke"]).has(kind)) throw new Error("Geçersiz lokal çalışma türü.");
  const prefix = kind === "dev" ? "local-dev" : "local-smoke";
  return {
    dataFile: path.join(localDataRoot, `${prefix}-store.json`),
    mediaDir: path.join(localDataRoot, `${prefix}-media`)
  };
}

function getLocalCredentials(environment = process.env) {
  return {
    adminPassword: String(environment.TAHMISCI_LOCAL_ADMIN_PASSWORD || LOCAL_DEFAULTS.adminPassword),
    recipePassword: String(environment.TAHMISCI_LOCAL_RECIPE_PASSWORD || LOCAL_DEFAULTS.recipePassword)
  };
}

function buildLocalEnvironment({ port = 8080, kind = "dev", environment = process.env } = {}) {
  const safePort = parseLocalPort([], port);
  const paths = getLocalPaths(kind);
  const credentials = getLocalCredentials(environment);
  const localhostOrigin = `http://localhost:${safePort}`;
  const loopbackOrigin = `http://127.0.0.1:${safePort}`;
  return {
    NODE_ENV: "development",
    TAHMISCI_LOCAL_DEV: "true",
    PORT: String(safePort),
    MAIN_DOMAIN: "",
    ADMIN_DOMAIN: "",
    PUBLIC_SITE_URL: localhostOrigin,
    ALLOWED_ORIGINS: `${localhostOrigin},${loopbackOrigin}`,
    ALLOW_LOCALHOST_ORIGINS: "true",
    COOKIE_SECURE: "false",
    COOKIE_SAME_SITE: "lax",
    DATA_FILE: paths.dataFile,
    MEDIA_DIR: paths.mediaDir,
    DEFAULT_PANEL_PASSWORD: credentials.adminPassword,
    DEFAULT_RECIPE_PASSWORD: credentials.recipePassword,
    JWT_SECRET: LOCAL_DEFAULTS.jwtSecret,
    PASSWORD_MANAGER_KEY: LOCAL_DEFAULTS.managerKey,
    PASSWORD_RESET_EMAIL: "",
    SMTP_USER: "",
    SMTP_PASS: "",
    SMTP_FROM: "",
    BCRYPT_ROUNDS: "10"
  };
}

function parseLocalPort(args = process.argv.slice(2), fallback = process.env.PORT || 8080) {
  let candidate = fallback;
  for (let index = 0; index < args.length; index += 1) {
    const argument = String(args[index] || "");
    if (argument.startsWith("--port=")) candidate = argument.slice(7);
    if (argument === "--port" && args[index + 1]) candidate = args[index + 1];
  }
  const port = Number(candidate);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Geçersiz lokal port: ${candidate}`);
  }
  return port;
}

function assertOwnedLocalTarget(candidate, expected) {
  const resolved = path.resolve(candidate);
  const exact = path.resolve(expected);
  const relative = path.relative(localDataRoot, resolved);
  if (resolved !== exact || !relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Lokal güvenlik kontrolü hedefi reddetti: ${resolved}`);
  }
  return resolved;
}

function isKnownLocalDataPath(value) {
  if (!value) return false;
  const resolved = path.resolve(value);
  return ["dev", "smoke"].some((kind) => {
    const paths = getLocalPaths(kind);
    return resolved === path.resolve(paths.dataFile) || resolved === path.resolve(paths.mediaDir);
  });
}

function isKnownLocalCredential(value) {
  return Object.values(LOCAL_DEFAULTS).includes(String(value || ""));
}

module.exports = {
  LOCAL_DEFAULTS,
  assertOwnedLocalTarget,
  buildLocalEnvironment,
  getLocalCredentials,
  getLocalPaths,
  isKnownLocalCredential,
  isKnownLocalDataPath,
  localDataRoot,
  parseLocalPort
};
