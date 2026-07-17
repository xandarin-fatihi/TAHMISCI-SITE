"use strict";
// Developer: Uzeyir | System Key: xandar | Backend runtime marker

require("dotenv").config();

const path = require("path");
const crypto = require("crypto");
const fs = require("fs/promises");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const { config, validateConfig } = require("./config");
const { createAuthMiddleware } = require("./middleware/auth");
const { createFileStore } = require("./store/file-store");
const { seedStoreIfEmpty } = require("./store/seed-defaults");
const { reconcileRecipeCatalog } = require("./store/migrations");
const { buildPublicBootstrap } = require("./public-bootstrap");
const { migrateSiteState } = require("./site-state");
const simpleXlsx = require("./simple-xlsx");
const { validateMenuState, validateRecipeCatalog, validateRecipeState, validateSiteState, validatePassword } = require("./validators");

validateConfig();

const app = express();
const store = createFileStore(config.dataFile, {
  bcryptRounds: config.bcryptRounds,
  defaultPanelPassword: config.defaultPanelPassword,
  defaultRecipePassword: config.defaultRecipePassword
});
const auth = createAuthMiddleware(config);
const sseClients = new Set();
const recipeSseClients = new Set();
const siteSseClients = new Set();
const publicSseClients = new Set();
const feedbackSseClients = new Set();
const passwordResetCodes = new Map();
let passwordResetTransporter = null;
let xlsxModule = null;
const RECIPE_ACTIVITY_LIMIT = 5000;

const projectRoot = config.projectRoot;
const siteRoot = path.join(projectRoot, "apps", "website");
const adminRoot = path.join(projectRoot, "apps", "admin");
const recipeRoot = path.join(projectRoot, "apps", "recipe");
const qrMenuRoot = path.join(projectRoot, "apps", "qr-menu");
const mudavimRoot = path.join(siteRoot, "mudavim");
const authRoot = path.join(projectRoot, "apps", "auth");
const assetsRoot = path.join(projectRoot, "public", "assets");
const sharedRoot = path.join(projectRoot, "shared");
const staticOptions = {
  dotfiles: "deny",
  etag: true,
  index: false,
  maxAge: config.isProduction ? "1h" : 0
};

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "base-uri": ["'self'"],
      "connect-src": ["'self'", "https:"],
      "font-src": ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "data:"],
      "form-action": ["'self'"],
      "frame-src": ["'self'", "https:"],
      "img-src": ["'self'", "https:", "data:", "blob:"],
      "media-src": ["'self'", "https:", "data:", "blob:"],
      "object-src": ["'none'"],
      "script-src": ["'self'", "'unsafe-inline'"],
      "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"]
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan(config.isProduction ? "combined" : "dev"));
app.use(express.json({ limit: "8mb" }));
app.use(cors({
  origin: corsOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Manager-Key", "X-File-Name", "X-Media-Kind"],
  credentials: true
}));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => res.status(429).json({
    ok: false,
    message: "Cok fazla hatali giris denemesi yapildi. Lutfen 15 dakika sonra tekrar deneyin."
  })
});

const recipeLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => res.status(429).json({
    ok: false,
    message: "Cok fazla hatali recete giris denemesi yapildi. Lutfen 15 dakika sonra tekrar deneyin."
  })
});

const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false
});

const passwordResetRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false
});

const passwordResetConfirmLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    time: new Date().toISOString()
  });
});

app.get("/api/public/bootstrap", async (_req, res, next) => {
  try {
    const data = await store.read();
    const bootstrap = buildPublicBootstrap(data);
    res.set({
      "Cache-Control": "public, max-age=30, stale-while-revalidate=120",
      "Vary": "Accept-Language"
    });
    res.json({ ok: true, ...bootstrap });
  } catch (error) {
    next(error);
  }
});

app.get("/api/public/events", async (req, res, next) => {
  try {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no"
    });
    res.write("retry: 5000\n\n");
    const data = await store.read();
    sendSse(res, "bootstrap", { reason: "connected", ...buildPublicBootstrap(data) });
    const client = { res, heartbeat: setInterval(() => res.write(": keepalive\n\n"), 25000) };
    publicSseClients.add(client);
    req.on("close", () => {
      clearInterval(client.heartbeat);
      publicSseClients.delete(client);
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/login", requireAdminOrMainRequestOrigin, loginLimiter, async (req, res, next) => {
  try {
    const password = String(req.body && req.body.password || "");
    if (!password || password.length > 72) {
      return res.status(401).json({ ok: false, message: "Panel sifresi hatali." });
    }

    const data = await store.read();
    const passwordHash = data && data.admin && data.admin.passwordHash;
    const valid = Boolean(passwordHash) && await bcrypt.compare(password, passwordHash);

    if (!valid) {
      return res.status(401).json({ ok: false, message: "Panel sifresi hatali." });
    }

    const token = auth.signAdminToken();
    auth.attachAdminCookie(res, token);
    res.json({
      ok: true,
      token,
      tokenType: "Bearer",
      expiresIn: config.adminJwtExpiresIn || config.jwtExpiresIn,
      ...auth.sessionInfoFromToken(token)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/logout", requireAdminRequestOrigin, (_req, res) => {
  auth.clearAdminCookie(res);
  res.json({ ok: true });
});

app.post("/api/admin/session/refresh", requireAdminRequestOrigin, auth.requireAdmin, (_req, res) => {
  const token = auth.signAdminToken();
  auth.attachAdminCookie(res, token);
  res.json({
    ok: true,
    role: "admin",
    token,
    tokenType: "Bearer",
    expiresIn: config.adminJwtExpiresIn || config.jwtExpiresIn,
    ...auth.sessionInfoFromToken(token)
  });
});

app.get("/api/admin/me", requireAdminOrMainRequestOrigin, auth.requireAdmin, (req, res) => {
  res.json({
    ok: true,
    role: "admin",
    ...auth.sessionInfoFromPayload(req.admin)
  });
});

app.post("/api/recipe/login", requireAdminOrMainRequestOrigin, recipeLoginLimiter, async (req, res, next) => {
  try {
    const username = normalizeRecipeUsername(req.body && req.body.username);
    const password = String(req.body && req.body.password || "");
    if (!password || password.length > 72) {
      return res.status(401).json({ ok: false, message: "Recete sifresi hatali." });
    }

    const data = await store.read();
    const users = Array.isArray(data.recipeUsers) ? data.recipeUsers : [];

    if (users.length) {
      if (!username) {
        return res.status(401).json({ ok: false, message: "Kullanici adi ve sifre gerekli." });
      }

      const user = users.find((item) => item.username === username);
      const validUser = Boolean(user && user.active !== false && user.passwordHash)
        && await bcrypt.compare(password, user.passwordHash);

      if (!validUser) {
        await recordRecipeActivity({
          type: "login_failed",
          username,
          req
        });
        return res.status(401).json({ ok: false, message: "Kullanici adi veya sifre hatali." });
      }

      const now = new Date().toISOString();
      await store.update((nextData) => {
        const storedUser = (nextData.recipeUsers || []).find((item) => item.id === user.id);
        if (storedUser) {
          storedUser.lastLoginAt = now;
          storedUser.updatedAt = storedUser.updatedAt || now;
        }
        appendRecipeActivity(nextData, makeRecipeActivity({
          type: "login",
          user: storedUser || user,
          req,
          createdAt: now
        }));
        return nextData;
      });

      const token = auth.signRecipeToken(user);
      auth.attachRecipeCookie(res, token);
      return res.json({
        ok: true,
        token,
        tokenType: "Bearer",
        expiresIn: config.recipeJwtExpiresIn || config.jwtExpiresIn,
        ...auth.sessionInfoFromToken(token),
        user: publicRecipeUser(user)
      });
    }

    const passwordHash = data && data.admin && data.admin.recipePasswordHash;
    const valid = Boolean(passwordHash) && await bcrypt.compare(password, passwordHash);

    if (!valid) {
      return res.status(401).json({ ok: false, message: "Recete sifresi hatali." });
    }

    const token = auth.signRecipeToken();
    auth.attachRecipeCookie(res, token);
    res.json({
      ok: true,
      token,
      tokenType: "Bearer",
      expiresIn: config.recipeJwtExpiresIn || config.jwtExpiresIn,
      ...auth.sessionInfoFromToken(token),
      user: null
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/recipe/me", requireAdminOrMainRequestOrigin, auth.requireRecipe, requireActiveRecipeUser, (req, res) => {
  const payload = req.recipe || {};
  const user = req.recipeUser || {};
  const hasNamedRecipeUser = payload.role === "recipe" && Boolean(req.recipeUser);
  res.json({
    ok: true,
    role: payload.role || "recipe",
    ...auth.sessionInfoFromPayload(payload),
    user: hasNamedRecipeUser ? {
      id: user.id || payload.userId || payload.sub || "",
      username: user.username || payload.username || "",
      name: user.name || payload.name || ""
    } : null
  });
});

app.post("/api/recipe/session/refresh", requireAdminOrMainRequestOrigin, auth.requireRecipe, requireActiveRecipeUser, (req, res) => {
  const payload = req.recipe || {};

  if (payload.role === "admin") {
    const token = auth.signAdminToken();
    auth.attachAdminCookie(res, token);
    return res.json({
      ok: true,
      role: "admin",
      token,
      tokenType: "Bearer",
      expiresIn: config.adminJwtExpiresIn || config.jwtExpiresIn,
      ...auth.sessionInfoFromToken(token),
      user: null
    });
  }

  const user = req.recipeUser || {
    id: payload.userId || payload.sub || "recipe",
    username: payload.username || "",
    name: payload.name || ""
  };
  const token = auth.signRecipeToken(user);
  auth.attachRecipeCookie(res, token);
  return res.json({
    ok: true,
    role: "recipe",
    token,
    tokenType: "Bearer",
    expiresIn: config.recipeJwtExpiresIn || config.jwtExpiresIn,
    ...auth.sessionInfoFromToken(token),
    user: req.recipeUser ? publicRecipeUser(user) : null
  });
});

app.get("/api/admin/recipe-access", requireAdminRequestOrigin, auth.requireAdmin, async (_req, res, next) => {
  try {
    const data = await store.read();
    res.json({
      ok: true,
      users: (data.recipeUsers || []).map(publicRecipeUser),
      activity: publicRecipeActivity(data.recipeActivity || []),
      assignments: publicRecipeAssignments(data.recipeAssignments || [], true)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/recipe-users", requireAdminRequestOrigin, auth.requireAdmin, async (req, res, next) => {
  try {
    const name = String(req.body && req.body.name || "").trim().slice(0, 80);
    const username = normalizeRecipeUsername(req.body && req.body.username);
    const password = String(req.body && req.body.password || "");

    const userError = validateRecipeUserInput({ name, username, password, requirePassword: true });
    if (userError) return res.status(400).json({ ok: false, message: userError });

    const passwordHash = await bcrypt.hash(password, config.bcryptRounds);
    const now = new Date().toISOString();
    const user = {
      id: `barista-${Date.now()}-${crypto.randomBytes(5).toString("hex")}`,
      name: name || username,
      username,
      passwordHash,
      active: true,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null
    };

    const nextStore = await store.update((data) => {
      if ((data.recipeUsers || []).some((item) => item.username === username)) {
        const error = new Error("Bu kullanici adi zaten kayitli.");
        error.status = 409;
        throw error;
      }
      data.recipeUsers = (data.recipeUsers || []).concat(user);
      return data;
    });

    res.status(201).json({
      ok: true,
      user: publicRecipeUser(user),
      users: (nextStore.recipeUsers || []).map(publicRecipeUser)
    });
  } catch (error) {
    next(error);
  }
});

app.put("/api/admin/recipe-users/:id", requireAdminRequestOrigin, auth.requireAdmin, async (req, res, next) => {
  try {
    const id = String(req.params.id || "").trim();
    const name = String(req.body && req.body.name || "").trim().slice(0, 80);
    const username = normalizeRecipeUsername(req.body && req.body.username);
    const password = String(req.body && req.body.password || "");
    const active = req.body && req.body.active !== false;

    const userError = validateRecipeUserInput({ name, username, password, requirePassword: false });
    if (userError) return res.status(400).json({ ok: false, message: userError });

    const passwordHash = password ? await bcrypt.hash(password, config.bcryptRounds) : "";
    const now = new Date().toISOString();
    let updatedUser = null;

    const nextStore = await store.update((data) => {
      const users = data.recipeUsers || [];
      const user = users.find((item) => item.id === id);
      if (!user) {
        const error = new Error("Kullanici bulunamadi.");
        error.status = 404;
        throw error;
      }
      if (users.some((item) => item.id !== id && item.username === username)) {
        const error = new Error("Bu kullanici adi zaten kayitli.");
        error.status = 409;
        throw error;
      }

      const wasActive = user.active !== false;
      user.name = name || username;
      user.username = username;
      user.active = active;
      user.updatedAt = now;
      if (passwordHash) user.passwordHash = passwordHash;
      syncRecipeUserReferences(data, user);
      if (wasActive !== active) {
        appendRecipeActivity(data, makeRecipeActivity({
          type: active ? "recipe_user_reactivated" : "recipe_user_deactivated",
          user,
          req,
          createdAt: now
        }));
      }
      updatedUser = user;
      return data;
    });

    if (updatedUser && updatedUser.active === false) {
      closeRecipeClientsForUser(updatedUser.id);
    }

    res.json({
      ok: true,
      user: publicRecipeUser(updatedUser),
      users: (nextStore.recipeUsers || []).map(publicRecipeUser),
      assignments: publicRecipeAssignments(nextStore.recipeAssignments || [], true),
      activity: publicRecipeActivity(nextStore.recipeActivity || [])
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/admin/recipe-users/:id", requireAdminRequestOrigin, auth.requireAdmin, async (req, res, next) => {
  try {
    const id = String(req.params.id || "").trim();
    const now = new Date().toISOString();
    const nextStore = await store.update((data) => {
      const user = (data.recipeUsers || []).find((item) => item.id === id);
      if (!user) {
        const error = new Error("Kullanici bulunamadi.");
        error.status = 404;
        throw error;
      }
      const wasActive = user.active !== false;
      user.active = false;
      user.updatedAt = now;
      if (wasActive) {
        appendRecipeActivity(data, makeRecipeActivity({
          type: "recipe_user_deactivated",
          user,
          req,
          createdAt: now
        }));
      }
      return data;
    });

    closeRecipeClientsForUser(id);

    res.json({
      ok: true,
      users: (nextStore.recipeUsers || []).map(publicRecipeUser),
      assignments: publicRecipeAssignments(nextStore.recipeAssignments || [], true),
      activity: publicRecipeActivity(nextStore.recipeActivity || [])
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/admin/recipe-users/:id/permanent", requireAdminRequestOrigin, auth.requireAdmin, async (req, res, next) => {
  try {
    const id = String(req.params.id || "").trim();
    const confirmation = String(req.body && req.body.confirmation || "").trim();
    if (confirmation !== "KALICI SIL") {
      return res.status(400).json({ ok: false, message: "Kalici silme icin KALICI SIL onayi gerekli." });
    }

    const now = new Date().toISOString();
    let removedUser = null;
    const nextStore = await store.update((data) => {
      const users = data.recipeUsers || [];
      removedUser = users.find((item) => item.id === id) || null;
      if (!removedUser) {
        const error = new Error("Kullanici bulunamadi.");
        error.status = 404;
        throw error;
      }
      data.recipeUsers = users.filter((item) => item.id !== id);
      appendRecipeActivity(data, makeRecipeActivity({
        type: "recipe_user_permanently_deleted",
        user: removedUser,
        req,
        createdAt: now
      }));
      return data;
    });

    closeRecipeClientsForUser(id);

    res.json({
      ok: true,
      users: (nextStore.recipeUsers || []).map(publicRecipeUser),
      assignments: publicRecipeAssignments(nextStore.recipeAssignments || [], true),
      activity: publicRecipeActivity(nextStore.recipeActivity || [])
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/recipe-assignments", requireAdminRequestOrigin, auth.requireAdmin, async (req, res, next) => {
  try {
    const userId = String(req.body && req.body.userId || "").trim();
    const category = String(req.body && req.body.category || "").trim();
    const product = String(req.body && req.body.product || "").trim();
    const size = String(req.body && req.body.size || "").trim();
    const assignmentKind = normalizeAssignmentKind(req.body && (req.body.assignmentKind || req.body.assignmentType));
    const assignmentType = normalizeAssignmentType(req.body && req.body.assignmentType);
    const scopeType = normalizeScopeType(req.body && req.body.scopeType);
    const questionCount = normalizeQuestionCount(req.body && req.body.questionCount, assignmentKind === "quick_quiz" ? 3 : 8);
    const difficulty = normalizeDifficulty(req.body && req.body.difficulty);
    const passingScore = normalizePassingScore(req.body && req.body.passingScore);
    const adminNote = String(req.body && req.body.adminNote || "").trim().slice(0, 1000);
    const now = new Date().toISOString();
    let assignment = null;

    const nextStore = await store.update((data) => {
      const user = (data.recipeUsers || []).find((item) => item.id === userId);
      if (!user || user.active === false) {
        const error = new Error("Aktif barista kullanicisi secin.");
        error.status = 400;
        throw error;
      }

      const targets = resolveAssignmentTargets(data, {
        userId,
        scopeType,
        category,
        product,
        size,
        selectedProducts: req.body && req.body.selectedProducts
      });
      if (!targets.length) {
        const error = new Error("Gecerli recete, urun ve olcu secin.");
        error.status = 400;
        throw error;
      }
      const primary = targets[0];
      const title = assignmentTitleFor({ assignmentKind, scopeType, category, product: primary.product, size: primary.size, count: targets.length });
      const needsQuestions = ["quick_quiz", "exam", "retraining"].includes(assignmentKind);
      const questions = needsQuestions
        ? buildRecipeAssignmentQuestions(data.recipeState, {
          targets,
          questionCount,
          difficulty
        })
        : [];
      if (needsQuestions && !questions.length) {
        const error = new Error("Bu kapsam icin yeterli soru uretilemedi.");
        error.status = 400;
        throw error;
      }

      assignment = {
        id: `odev-${Date.now()}-${crypto.randomBytes(5).toString("hex")}`,
        userId: user.id,
        username: user.username,
        name: user.name,
        title,
        category: primary.category,
        product: primary.product,
        size: primary.size,
        assignmentKind,
        assignmentType,
        scopeType,
        recipeItems: targets.map(publicRecipeItem),
        questionCount,
        difficulty,
        passingScore,
        trainingContent: buildAssignmentTrainingContent(data.recipeState, targets, { adminNote }),
        adminNote,
        questions,
        status: "pending",
        score: 0,
        total: questions.length,
        answers: [],
        viewedItems: [],
        completedItems: [],
        failedItems: [],
        percent: 0,
        passed: null,
        startedAt: null,
        completedAt: null,
        reviewedAt: null,
        retryCount: 0,
        createdAt: now,
        updatedAt: now
      };
      data.recipeAssignments = (data.recipeAssignments || []).concat(assignment);
      appendRecipeActivity(data, makeRecipeActivity({
        type: assignmentAssignedEvent(assignmentKind),
        user,
        category: assignment.category,
        product: assignment.product,
        size: assignment.size,
        assignment,
        status: assignment.status,
        req,
        createdAt: now
      }));
      return data;
    });

    res.status(201).json({
      ok: true,
      assignment: publicRecipeAssignment(assignment, true),
      assignments: publicRecipeAssignments(nextStore.recipeAssignments || [], true),
      activity: publicRecipeActivity(nextStore.recipeActivity || [])
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/admin/recipe-assignments/:id", requireAdminRequestOrigin, auth.requireAdmin, async (req, res, next) => {
  try {
    const id = String(req.params.id || "").trim();
    const nextStore = await store.update((data) => {
      data.recipeAssignments = (data.recipeAssignments || []).filter((item) => item.id !== id);
      return data;
    });

    res.json({
      ok: true,
      assignments: publicRecipeAssignments(nextStore.recipeAssignments || [], true)
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/recipe/assignments", requireAdminOrMainRequestOrigin, auth.requireRecipe, requireActiveRecipeUser, async (req, res, next) => {
  try {
    const payload = req.recipe || {};
    if (payload.role !== "recipe" || !payload.userId) {
      return res.json({ ok: true, assignments: [] });
    }

    const data = await store.read();
    const assignments = (data.recipeAssignments || [])
      .filter((item) => item.userId === payload.userId);
    res.json({
      ok: true,
      assignments: publicRecipeAssignments(assignments, false)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/recipe/assignments/:id/start", requireAdminOrMainRequestOrigin, auth.requireRecipe, requireActiveRecipeUser, async (req, res, next) => {
  try {
    const payload = req.recipe || {};
    if (payload.role !== "recipe" || !payload.userId) {
      return res.status(403).json({ ok: false, message: "Barista oturumu gerekli." });
    }

    const id = String(req.params.id || "").trim();
    const now = new Date().toISOString();
    let updatedAssignment = null;

    const nextStore = await store.update((data) => {
      const assignment = (data.recipeAssignments || []).find((item) => item.id === id && item.userId === payload.userId);
      if (!assignment) {
        const error = new Error("Odev bulunamadi.");
        error.status = 404;
        throw error;
      }

      if (assignment.status !== "completed") {
        assignment.status = "in_progress";
        assignment.startedAt = assignment.startedAt || now;
        assignment.updatedAt = now;
      }
      updatedAssignment = assignment;

      appendRecipeActivity(data, makeRecipeActivity({
        type: assignmentStartedEvent(assignment.assignmentKind || assignment.assignmentType),
        user: {
          id: payload.userId,
          username: payload.username,
          name: payload.name
        },
        assignment,
        status: assignment.status,
        category: assignment.category,
        product: assignment.product,
        size: assignment.size,
        req,
        createdAt: now
      }));
      return data;
    });

    res.json({
      ok: true,
      assignment: publicRecipeAssignment(updatedAssignment, false),
      assignments: publicRecipeAssignments((nextStore.recipeAssignments || []).filter((item) => item.userId === payload.userId), false)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/recipe/assignments/:id/submit", requireAdminOrMainRequestOrigin, auth.requireRecipe, requireActiveRecipeUser, async (req, res, next) => {
  try {
    const payload = req.recipe || {};
    if (payload.role !== "recipe" || !payload.userId) {
      return res.status(403).json({ ok: false, message: "Barista oturumu gerekli." });
    }

    const id = String(req.params.id || "").trim();
    const answers = Array.isArray(req.body && req.body.answers)
      ? req.body.answers.map((answer) => Number(answer))
      : [];
    const now = new Date().toISOString();
    let updatedAssignment = null;

    const nextStore = await store.update((data) => {
      const assignment = (data.recipeAssignments || []).find((item) => item.id === id && item.userId === payload.userId);
      if (!assignment) {
        const error = new Error("Odev bulunamadi.");
        error.status = 404;
        throw error;
      }
      if (assignment.status === "completed") {
        const error = new Error("Bu odev zaten tamamlandi.");
        error.status = 400;
        throw error;
      }

      const kind = normalizeAssignmentKind(assignment.assignmentKind || assignment.assignmentType);
      const itemKeys = (assignment.recipeItems || []).map((item) => item.key).filter(Boolean);
      if (kind === "training") {
        assignment.status = "completed";
        assignment.viewedItems = itemKeys;
        assignment.completedItems = itemKeys;
        assignment.percent = 100;
        assignment.passed = true;
        assignment.completedAt = now;
        assignment.updatedAt = now;
        updatedAssignment = assignment;

        appendRecipeActivity(data, makeRecipeActivity({
          type: "training_completed",
          user: {
            id: payload.userId,
            username: payload.username,
            name: payload.name
          },
          assignment,
          status: assignment.status,
          category: assignment.category,
          product: assignment.product,
          size: assignment.size,
          req,
          createdAt: now
        }));
        return data;
      }

      if (kind === "homework") {
        const requestedCompleted = Array.isArray(req.body && req.body.completedItems)
          ? req.body.completedItems.map((item) => String(item || "").trim()).filter(Boolean)
          : itemKeys;
        const allowed = new Set(itemKeys);
        const completedItems = [...new Set(requestedCompleted.filter((item) => allowed.has(item)))];
        assignment.viewedItems = [...new Set((assignment.viewedItems || []).concat(completedItems))];
        assignment.completedItems = completedItems;
        assignment.percent = itemKeys.length ? Math.round((completedItems.length / itemKeys.length) * 100) : 100;
        assignment.status = assignment.percent >= 100 ? "completed" : "in_progress";
        assignment.completedAt = assignment.status === "completed" ? now : null;
        assignment.updatedAt = now;
        updatedAssignment = assignment;

        appendRecipeActivity(data, makeRecipeActivity({
          type: assignment.status === "completed" ? "homework_completed" : "homework_started",
          user: {
            id: payload.userId,
            username: payload.username,
            name: payload.name
          },
          assignment,
          status: assignment.status,
          category: assignment.category,
          product: assignment.product,
          size: assignment.size,
          req,
          createdAt: now
        }));
        return data;
      }

      const normalizedAnswers = assignment.questions.map((_question, index) => {
        const answer = Number(answers[index]);
        return Number.isInteger(answer) ? answer : -1;
      });
      const score = assignment.questions.reduce((total, question, index) => (
        total + (question.correctIndex === normalizedAnswers[index] ? 1 : 0)
      ), 0);
      const total = assignment.questions.length;
      const passingScore = normalizePassingScore(assignment.passingScore);
      const scorePercent = total ? Math.round((score / total) * 100) : 0;
      const passed = scorePercent >= passingScore;
      const failedItems = assignment.questions
        .map((question, index) => question.correctIndex === normalizedAnswers[index] ? null : failedItemFromQuestion(question, normalizedAnswers[index]))
        .filter(Boolean);

      assignment.status = passed ? "completed" : "retry_required";
      assignment.score = score;
      assignment.total = total;
      assignment.passingScore = passingScore;
      assignment.answers = normalizedAnswers;
      assignment.percent = scorePercent;
      assignment.passed = passed;
      assignment.failedItems = failedItems;
      assignment.completedAt = now;
      assignment.updatedAt = now;
      assignment.retryCount = passed ? (assignment.retryCount || 0) : (Number(assignment.retryCount || 0) + 1);
      updatedAssignment = assignment;

      appendRecipeActivity(data, makeRecipeActivity({
        type: assignmentCompletedEvent(kind, passed),
        user: {
          id: payload.userId,
          username: payload.username,
          name: payload.name
        },
        assignment,
        status: assignment.status,
        score,
        total,
        category: assignment.category,
        product: assignment.product,
        size: assignment.size,
        req,
        createdAt: now
      }));
      return data;
    });

    res.json({
      ok: true,
      assignment: publicRecipeAssignment(updatedAssignment, false),
      assignments: publicRecipeAssignments((nextStore.recipeAssignments || []).filter((item) => item.userId === payload.userId), false)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/recipe/activity", requireAdminOrMainRequestOrigin, auth.requireRecipe, requireActiveRecipeUser, async (req, res, next) => {
  try {
    const payload = req.recipe || {};
    if (payload.role !== "recipe" || !payload.userId) {
      return res.json({ ok: true });
    }

    await recordRecipeActivity({
      type: String(req.body && req.body.type || "view_recipe").trim().slice(0, 60),
      user: {
        id: payload.userId,
        username: payload.username,
        name: payload.name
      },
      category: req.body && req.body.category,
      product: req.body && req.body.product,
      size: req.body && req.body.size,
      panel: req.body && req.body.panel,
      req
    });

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/password", requireAdminRequestOrigin, passwordLimiter, async (req, res, next) => {
  try {
    if (!config.managerKey) {
      return res.status(503).json({
        ok: false,
        message: "PASSWORD_MANAGER_KEY server ortaminda tanimli degil."
      });
    }

    const providedKey = String(req.header("X-Manager-Key") || req.body.managerKey || "");
    if (!safeEqual(providedKey, config.managerKey)) {
      return res.status(401).json({ ok: false, message: "Yetkili anahtar hatali." });
    }

    const newPassword = String(req.body && req.body.newPassword || "");
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return res.status(400).json({ ok: false, message: passwordError });
    }

    const passwordHash = await bcrypt.hash(newPassword, config.bcryptRounds);
    await store.update((data) => {
      data.admin.passwordHash = passwordHash;
      data.admin.updatedAt = new Date().toISOString();
      return data;
    });

    res.json({ ok: true, message: "Panel sifresi guncellendi." });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/password-reset/request", requireAdminOrMainRequestOrigin, passwordResetRequestLimiter, async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body && req.body.email);
    if (!isEmailLike(email)) {
      return res.status(400).json({ ok: false, message: "Gecerli bir e-posta adresi girin." });
    }

    if (!isPasswordResetConfigured()) {
      return res.status(503).json({
        ok: false,
        message: "E-posta ile sifre sifirlama henuz yapilandirilmamis."
      });
    }

    if (!isAuthorizedResetEmail(email)) {
      return res.json({
        ok: true,
        message: "Eger e-posta yetkiliyse dogrulama kodu gonderildi."
      });
    }

    const code = String(crypto.randomInt(0, 1000000)).padStart(6, "0");
    passwordResetCodes.set(email, {
      codeHash: hashResetCode(email, code),
      attempts: 0,
      expiresAt: Date.now() + resetCodeTtlMs()
    });

    await sendPasswordResetEmail(email, code);

    res.json({
      ok: true,
      message: `Dogrulama kodu gonderildi. Kod ${config.passwordResetCodeTtlMinutes} dakika gecerlidir.`
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/password-reset/confirm", requireAdminOrMainRequestOrigin, passwordResetConfirmLimiter, async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body && req.body.email);
    const code = String(req.body && req.body.code || "").replace(/\D/g, "");
    const newPassword = String(req.body && req.body.newPassword || "");
    const scope = normalizePasswordScope(req.body && req.body.scope);

    if (!isPasswordResetConfigured()) {
      return res.status(503).json({
        ok: false,
        message: "E-posta ile sifre sifirlama henuz yapilandirilmamis."
      });
    }

    if (!isAuthorizedResetEmail(email) || code.length !== 6) {
      return res.status(400).json({ ok: false, message: "Dogrulama bilgileri gecersiz." });
    }

    if (!scope) {
      return res.status(400).json({ ok: false, message: "Panel veya recete secimi gerekli." });
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return res.status(400).json({ ok: false, message: passwordError });
    }

    const resetEntry = passwordResetCodes.get(email);
    if (!resetEntry || resetEntry.expiresAt < Date.now()) {
      passwordResetCodes.delete(email);
      return res.status(400).json({ ok: false, message: "Dogrulama kodu suresi doldu." });
    }

    resetEntry.attempts += 1;
    if (resetEntry.attempts > 5) {
      passwordResetCodes.delete(email);
      return res.status(429).json({ ok: false, message: "Cok fazla hatali deneme yapildi. Yeni kod isteyin." });
    }

    if (!safeEqual(resetEntry.codeHash, hashResetCode(email, code))) {
      return res.status(401).json({ ok: false, message: "Dogrulama kodu hatali." });
    }

    const passwordHash = await bcrypt.hash(newPassword, config.bcryptRounds);
    await store.update((data) => {
      if (scope === "recipe") {
        data.admin.recipePasswordHash = passwordHash;
        data.admin.recipeUpdatedAt = new Date().toISOString();
      } else {
        data.admin.passwordHash = passwordHash;
        data.admin.updatedAt = new Date().toISOString();
      }
      return data;
    });

    passwordResetCodes.delete(email);
    if (scope === "recipe") {
      auth.clearRecipeCookie(res);
      return res.json({ ok: true, message: "Recete sifresi guncellendi." });
    }

    auth.clearAdminCookie(res);
    res.json({ ok: true, message: "Panel sifresi guncellendi." });
  } catch (error) {
    next(error);
  }
});

app.get("/api/menu", async (_req, res, next) => {
  try {
    const data = await store.read();
    res.json({ ok: true, menuState: data.menuState, updatedAt: data.menuUpdatedAt || null });
  } catch (error) {
    next(error);
  }
});

app.put("/api/menu", requireAdminRequestOrigin, auth.requireAdmin, async (req, res, next) => {
  try {
    const menuState = req.body && req.body.menuState;
    const validationError = validateMenuState(menuState);

    if (validationError) {
      return res.status(400).json({ ok: false, message: validationError });
    }

    const updatedAt = new Date().toISOString();
    const nextStore = await store.update((data) => {
      data.menuState = menuState;
      data.menuUpdatedAt = updatedAt;
      return data;
    });

    broadcastMenuUpdate(nextStore.menuState, updatedAt);
    broadcastPublicUpdate(nextStore, "menu");
    res.json({ ok: true, menuState: nextStore.menuState, recipeLinkReview: nextStore.recipeLinkReview, updatedAt });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/products/import-excel", requireAdminRequestOrigin, auth.requireAdmin, express.raw({
  type: () => true,
  limit: "20mb"
}), async (req, res, next) => {
  try {
    if (!req.body || !req.body.length) {
      return res.status(400).json({ ok: false, message: "Excel dosyasi gerekli." });
    }

    const workbook = readExcelWorkbook(req.body, req.headers["x-file-name"]);
    const rows = workbookToProductImportRows(workbook);
    const backup = await createProductImportBackup();
    const updatedAt = new Date().toISOString();
    const report = createProductImportReport(rows);
    let importedMenuState = null;

    const nextStore = await store.update((data) => {
      const result = applyProductImportRows(data.menuState || {}, rows);
      const validationError = validateMenuState(result.menuState);
      if (validationError) {
        const error = new Error(validationError);
        error.status = 400;
        throw error;
      }
      data.menuState = result.menuState;
      data.menuUpdatedAt = updatedAt;
      importedMenuState = result.menuState;
      Object.assign(report, result.report, {
        totalRows: rows.length,
        backupFile: backup && backup.fileName || "",
        backupPath: backup && backup.path || "",
        updatedAt
      });
      return data;
    });

    broadcastMenuUpdate(importedMenuState || nextStore.menuState, updatedAt);
    broadcastPublicUpdate(nextStore, "menu");
    res.json({
      ok: true,
      menuState: importedMenuState || nextStore.menuState,
      report
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/media", requireAdminRequestOrigin, auth.requireAdmin, express.raw({
  type: () => true,
  limit: "120mb"
}), async (req, res, next) => {
  try {
    const file = validateMediaUpload(req);
    await fs.mkdir(config.mediaDir, { recursive: true });
    await fs.writeFile(path.join(config.mediaDir, file.fileName), req.body);

    const mediaPath = `/media/${file.fileName}`;
    res.status(201).json({
      ok: true,
      media: {
        id: file.id,
        url: absoluteUrl(req, mediaPath),
        src: mediaPath,
        name: file.originalName,
        kind: file.kind,
        type: file.contentType,
        size: req.body.length
      }
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/media", requireAdminRequestOrigin, auth.requireAdmin, async (_req, res, next) => {
  try {
    await fs.mkdir(config.mediaDir, { recursive: true });
    const names = await fs.readdir(config.mediaDir);
    const media = await Promise.all(names.filter(isSafeMediaFileName).map(async (name) => {
      const stats = await fs.stat(path.join(config.mediaDir, name));
      return { name, src: `/media/${name}`, size: stats.size, updatedAt: stats.mtime.toISOString() };
    }));
    res.json({ ok: true, media: media.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)) });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/media/:name", requireAdminRequestOrigin, auth.requireAdmin, async (req, res, next) => {
  try {
    const name = String(req.params.name || "");
    if (!isSafeMediaFileName(name)) return res.status(400).json({ ok: false, message: "Gecersiz medya adi." });
    const data = await store.read();
    const reference = `/media/${name}`;
    const publishedData = JSON.stringify({ menuState: data.menuState, siteState: data.siteState });
    if (publishedData.includes(reference)) {
      return res.status(409).json({ ok: false, message: "Bu medya yayindaki menu veya site tarafindan kullaniliyor." });
    }
    await fs.unlink(path.join(config.mediaDir, name));
    res.json({ ok: true });
  } catch (error) {
    if (error && error.code === "ENOENT") return res.status(404).json({ ok: false, message: "Medya bulunamadi." });
    next(error);
  }
});

app.get("/api/menu/events", async (req, res, next) => {
  try {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    });

    const data = await store.read();
    sendSse(res, "menu", {
      menuState: data.menuState,
      updatedAt: data.menuUpdatedAt || null
    });

    const client = { res };
    sseClients.add(client);

    req.on("close", () => {
      sseClients.delete(client);
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/recipes", requireAdminOrMainRequestOrigin, auth.requireRecipe, requireActiveRecipeUser, async (_req, res, next) => {
  try {
    const data = await store.read();
    res.json({
      ok: true,
      recipeState: data.recipeState,
      recipeCatalog: data.recipeCatalog || [],
      recipeLinkReview: data.recipeLinkReview || [],
      updatedAt: data.recipeUpdatedAt || null
    });
  } catch (error) {
    next(error);
  }
});

app.put("/api/recipes", requireAdminRequestOrigin, auth.requireAdmin, async (req, res, next) => {
  try {
    const recipeState = req.body && req.body.recipeState;
    const requestedCatalog = req.body && req.body.recipeCatalog;
    const validationError = validateRecipeState(recipeState);

    if (validationError) {
      return res.status(400).json({ ok: false, message: validationError });
    }

    const recipeCatalog = reconcileRecipeCatalog(recipeState, requestedCatalog);
    const catalogError = validateRecipeCatalog(recipeCatalog, recipeState);
    if (catalogError) {
      return res.status(400).json({ ok: false, message: catalogError });
    }

    const updatedAt = new Date().toISOString();
    const nextStore = await store.update((data) => {
      data.recipeState = recipeState;
      data.recipeCatalog = recipeCatalog;
      data.recipeUpdatedAt = updatedAt;
      return data;
    });

    broadcastRecipeUpdate(nextStore.recipeState, updatedAt, nextStore.recipeCatalog);
    broadcastPublicUpdate(nextStore, "recipes");
    res.json({
      ok: true,
      recipeState: nextStore.recipeState,
      recipeCatalog: nextStore.recipeCatalog,
      recipeLinkReview: nextStore.recipeLinkReview,
      updatedAt
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/recipes/import-excel", requireAdminRequestOrigin, auth.requireAdmin, express.raw({
  type: () => true,
  limit: "20mb"
}), async (req, res, next) => {
  try {
    if (!req.body || !req.body.length) {
      return res.status(400).json({ ok: false, message: "Excel dosyasi gerekli." });
    }

    const workbook = readExcelWorkbook(req.body, req.headers["x-file-name"]);
    const rows = workbookToRows(workbook);
    const backup = await createRecipeImportBackup();
    const updatedAt = new Date().toISOString();
    const report = createRecipeImportReport(rows);
    let importedRecipeState = null;

    const nextStore = await store.update((data) => {
      const result = applyRecipeImportRows(data.recipeState || {}, rows);
      data.recipeState = result.recipeState;
      data.recipeUpdatedAt = updatedAt;
      importedRecipeState = result.recipeState;
      Object.assign(report, result.report, {
        totalRows: rows.length,
        backupFile: backup && backup.fileName || "",
        backupPath: backup && backup.path || "",
        updatedAt
      });
      return data;
    });

    broadcastRecipeUpdate(importedRecipeState || nextStore.recipeState, updatedAt, nextStore.recipeCatalog);
    broadcastPublicUpdate(nextStore, "recipes");
    res.json({
      ok: true,
      recipeState: importedRecipeState || nextStore.recipeState,
      recipeCatalog: nextStore.recipeCatalog || [],
      recipeLinkReview: nextStore.recipeLinkReview || [],
      report
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/recipes/events", requireAdminOrMainRequestOrigin, auth.requireRecipe, requireActiveRecipeUser, async (req, res, next) => {
  try {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    });

    const data = await store.read();
    sendSse(res, "recipes", {
      recipeState: data.recipeState,
      recipeCatalog: data.recipeCatalog || [],
      updatedAt: data.recipeUpdatedAt || null
    });

    const client = { res, userId: req.recipe && req.recipe.userId || "" };
    recipeSseClients.add(client);

    req.on("close", () => {
      recipeSseClients.delete(client);
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/feedback", requireAdminRequestOrigin, auth.requireAdmin, async (_req, res, next) => {
  try {
    const data = await store.read();
    res.json({ ok: true, feedbackItems: data.feedbackItems || [], updatedAt: data.feedbackUpdatedAt || null });
  } catch (error) {
    next(error);
  }
});

app.post("/api/feedback", async (req, res, next) => {
  try {
    const item = normalizeFeedbackItem(req.body && req.body.feedback || req.body || {});
    if (!item) {
      return res.status(400).json({ ok: false, message: "Geri bildirim icin mesaj, favori icecek veya puan gerekli." });
    }

    const updatedAt = new Date().toISOString();
    const nextStore = await store.update((data) => {
      data.feedbackItems = (data.feedbackItems || []).concat(item).slice(-1000);
      data.feedbackUpdatedAt = updatedAt;
      return data;
    });

    broadcastFeedbackUpdate(nextStore.feedbackItems, updatedAt);
    res.status(201).json({ ok: true, feedback: item, updatedAt });
  } catch (error) {
    next(error);
  }
});

app.put("/api/feedback", requireAdminRequestOrigin, auth.requireAdmin, async (req, res, next) => {
  try {
    const items = Array.isArray(req.body && req.body.feedbackItems)
      ? req.body.feedbackItems.map(normalizeFeedbackItem).filter(Boolean)
      : [];
    const updatedAt = new Date().toISOString();
    await store.update((data) => {
      data.feedbackItems = items.slice(-1000);
      data.feedbackUpdatedAt = updatedAt;
      return data;
    });

    broadcastFeedbackUpdate(items, updatedAt);
    res.json({ ok: true, feedbackItems: items, updatedAt });
  } catch (error) {
    next(error);
  }
});

app.get("/api/feedback/events", requireAdminRequestOrigin, auth.requireAdmin, async (req, res, next) => {
  try {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    });

    const data = await store.read();
    sendSse(res, "feedback", {
      feedbackItems: data.feedbackItems || [],
      updatedAt: data.feedbackUpdatedAt || null
    });

    const client = { res };
    feedbackSseClients.add(client);

    req.on("close", () => {
      feedbackSseClients.delete(client);
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/site", async (_req, res, next) => {
  try {
    const data = await store.read();
    res.json({ ok: true, siteState: data.siteState, updatedAt: data.siteUpdatedAt || null });
  } catch (error) {
    next(error);
  }
});

app.put("/api/site", requireAdminRequestOrigin, auth.requireAdmin, async (req, res, next) => {
  try {
    const siteState = migrateSiteState(req.body && req.body.siteState);
    const validationError = validateSiteState(siteState);

    if (validationError) {
      return res.status(400).json({ ok: false, message: validationError });
    }

    const updatedAt = new Date().toISOString();
    siteState.updatedAt = updatedAt;
    const nextStore = await store.update((data) => {
      if (data.siteState && Object.keys(data.siteState).length) {
        data.siteRevisions = (data.siteRevisions || []).concat({
          id: `site-revision-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
          createdAt: updatedAt,
          siteState: data.siteState
        }).slice(-10);
      }
      data.siteState = siteState;
      data.siteUpdatedAt = updatedAt;
      return data;
    });

    broadcastSiteUpdate(nextStore.siteState, updatedAt);
    broadcastPublicUpdate(nextStore, "site");
    res.json({ ok: true, siteState: nextStore.siteState, updatedAt });
  } catch (error) {
    next(error);
  }
});

app.get("/api/site/events", async (req, res, next) => {
  try {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    });

    const data = await store.read();
    sendSse(res, "site", {
      siteState: data.siteState,
      updatedAt: data.siteUpdatedAt || null
    });

    const client = { res };
    siteSseClients.add(client);

    req.on("close", () => {
      siteSseClients.delete(client);
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/site/revisions", requireAdminRequestOrigin, auth.requireAdmin, async (_req, res, next) => {
  try {
    const data = await store.read();
    res.json({
      ok: true,
      revisions: (data.siteRevisions || []).map((item) => ({ id: item.id, createdAt: item.createdAt })).reverse()
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/site/revisions/:id/restore", requireAdminRequestOrigin, auth.requireAdmin, async (req, res, next) => {
  try {
    const revisionId = String(req.params.id || "");
    const updatedAt = new Date().toISOString();
    let restored = null;
    const nextStore = await store.update((data) => {
      const revision = (data.siteRevisions || []).find((item) => item.id === revisionId);
      if (!revision) {
        const error = new Error("Site revizyonu bulunamadi.");
        error.status = 404;
        throw error;
      }
      data.siteRevisions = (data.siteRevisions || []).concat({
        id: `site-revision-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
        createdAt: updatedAt,
        siteState: data.siteState
      }).slice(-10);
      restored = migrateSiteState(revision.siteState);
      data.siteState = restored;
      data.siteUpdatedAt = updatedAt;
      return data;
    });
    broadcastSiteUpdate(restored, updatedAt);
    broadcastPublicUpdate(nextStore, "site");
    res.json({ ok: true, siteState: restored, updatedAt });
  } catch (error) {
    next(error);
  }
});

app.use("/admin-password", requireAdminHost, express.static(path.join(config.backendRoot, "public"), {
  ...staticOptions,
  index: "index.html",
  maxAge: 0
}));

app.get("/login.html", requireAdminHost, auth.redirectIfAdmin, sendAuthFile("login.html"));
app.get("/password-reset", requireKnownHost, sendAuthFile("password-reset/index.html"));
app.get("/password-reset/", requireKnownHost, sendAuthFile("password-reset/index.html"));
app.get("/index.html", (req, res, next) => {
  if (isAdminHost(req) && config.publicSiteUrl) {
    return redirectToPublicSite(req, res, "index.html");
  }

  return requireMainHost(req, res, () => res.redirect(301, "/"));
});

app.get("/panel/panel.html", (req, res) => {
  if (!isAdminHost(req)) return redirectToAdmin(req, res, "/panel/", 301);
  return res.redirect(301, "/panel/");
});

app.get("/recete/index.html", (req, res) => {
  if (!isMainHost(req) && !isAdminHost(req)) return notFound(req, res);
  return res.redirect(301, "/recete/");
});

app.get("/", (req, res, next) => {
  if (isConfiguredAdminHost(req)) {
    return auth.requireAdminPage(req, res, () => res.redirect(302, "/panel/"));
  }

  if (!isMainHost(req)) return notFound(req, res);

  return sendSiteFile("index.html")(req, res, next);
});

app.get("/site", requireMainHost, (_req, res) => res.redirect(301, "/"));
app.get("/site/", requireMainHost, (_req, res) => res.redirect(301, "/"));

app.use("/mudavim", requireMainHost, express.static(mudavimRoot, {
  ...staticOptions,
  index: "index.html"
}));

app.use("/assets", requireKnownHost, express.static(assetsRoot, staticOptions));
app.use("/shared", requireKnownHost, express.static(sharedRoot, staticOptions));
app.use("/styles", requireMainHost, express.static(path.join(siteRoot, "styles"), staticOptions));
app.use("/scripts", requireMainHost, express.static(path.join(siteRoot, "scripts"), staticOptions));
app.get("/sw.js", requireMainHost, sendSiteFile("sw.js"));

app.use("/qr-menu", requireMainHost, express.static(qrMenuRoot, {
  ...staticOptions,
  index: "index.html"
}));

app.use("/panel", (req, res, next) => {
  if (!isAdminHost(req)) return redirectToAdmin(req, res);
  return auth.requireAdminPage(req, res, next);
}, express.static(adminRoot, {
  ...staticOptions,
  index: "index.html"
}));

app.use("/recete", (req, res, next) => {
  if (isConfiguredAdminHost(req)) return auth.requireAdminPage(req, res, next);
  if (isMainHost(req)) return next();
  if (isAdminHost(req)) return auth.requireAdminPage(req, res, next);
  return notFound(req, res);
}, express.static(recipeRoot, {
  ...staticOptions,
  index: "index.html"
}));

app.get("/recipe-data.js", (req, res, next) => {
  if (!isMainHost(req) && !isAdminHost(req)) return notFound(req, res);
  return auth.requireAdminPage(req, res, () => sendProjectFile("data/seeds/recipe-data.js")(req, res, next));
});
app.get("/favicon.png", requireKnownHost, (_req, res, next) => {
  res.sendFile(path.join(assetsRoot, "brand", "favicon.png"), (error) => {
    if (error) next(error);
  });
});
app.get("/menu-data.js", (req, res, next) => {
  if (!isMainHost(req) && !isAdminHost(req)) return notFound(req, res);
  return auth.requireAdminPage(req, res, () => sendProjectFile("data/seeds/menu-data.js")(req, res, next));
});

app.get("/menu.js", requireMainHost, (_req, res) => res.redirect(301, "/qr-menu/scripts/app.js"));
app.get("/styles.css", requireMainHost, (_req, res) => res.redirect(301, "/qr-menu/styles/qr-menu.css"));


app.use("/media", requireKnownHost, express.static(config.mediaDir, {
  ...staticOptions,
  maxAge: config.isProduction ? "30d" : 0
}));

app.use(notFound);

app.use((error, req, res, _next) => {
  const status = error.status || 500;
  if (status >= 500) console.error(error);
  return sendError(req, res, status, error.status ? error.message : "Backend hatasi olustu.");
});

async function prepareRuntime() {
  await Promise.all([
    store.ensure(),
    fs.mkdir(config.mediaDir, { recursive: true })
  ]);
  await seedStoreIfEmpty(store, projectRoot);
}

async function startServer() {
  await prepareRuntime();
  return app.listen(config.port, () => {
    console.log(`Tahmisci backend listening on port ${config.port}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Backend baslatilamadi:", error);
    process.exit(1);
  });
}

function corsOrigin(origin, callback) {
  if (!origin) return callback(null, true);
  if (config.allowedOrigins.includes("*") && !config.isProduction) return callback(null, true);
  if (config.allowedOrigins.includes(origin)) return callback(null, true);

  if (config.allowLocalhostOrigins && isLocalOrigin(origin)) {
    return callback(null, true);
  }

  return callback(null, false);
}

function requireAdminHost(req, res, next) {
  if (isAdminHost(req) || isMainHost(req)) return next();
  return notFound(req, res);
}

function requireMainHost(req, res, next) {
  if (isMainHost(req)) return next();
  return notFound(req, res);
}

function requireKnownHost(req, res, next) {
  if (isMainHost(req) || isAdminHost(req)) return next();
  return notFound(req, res);
}

function requireAdminRequestOrigin(req, res, next) {
  const origin = req.header("Origin");
  if (!origin || isAdminOrigin(origin) || isMainOrigin(origin)) return next();

  return res.status(403).json({
    ok: false,
    message: "Admin API yalnizca yetkili origin uzerinden kullanilabilir."
  });
}

function requireAdminOrMainRequestOrigin(req, res, next) {
  const origin = req.header("Origin");
  if (!origin || isAdminOrigin(origin) || isMainOrigin(origin)) return next();

  return res.status(403).json({
    ok: false,
    message: "Bu API yalnizca yetkili origin uzerinden kullanilabilir."
  });
}

async function requireActiveRecipeUser(req, res, next) {
  try {
    const payload = req.recipe || {};
    if (payload.role === "admin") return next();

    const userId = String(payload.userId || payload.sub || "").trim();
    const data = await store.read();
    const users = Array.isArray(data.recipeUsers) ? data.recipeUsers : [];

    if (!users.length && userId === "recipe") return next();

    const user = users.find((item) => item.id === userId);
    if (!user || user.active === false) {
      auth.clearRecipeCookie(res);
      return res.status(403).json({
        ok: false,
        message: "Recete erisimi pasif. Lutfen yonetici ile gorusun."
      });
    }

    req.recipeUser = user;
    req.recipe = Object.assign({}, payload, {
      userId: user.id,
      username: user.username,
      name: user.name
    });
    return next();
  } catch (error) {
    return next(error);
  }
}

function isConfiguredAdminHost(req) {
  return Boolean(config.adminDomain && isAdminHost(req));
}

function isAdminHost(req) {
  return isAdminHostname(requestHostname(req));
}

function isMainHost(req) {
  return isMainHostname(requestHostname(req));
}

function isAdminHostname(host) {
  const normalized = normalizeHost(host);
  if (config.adminDomain) return normalized === normalizeHost(config.adminDomain);
  return isLocalHost(normalized);
}

function isMainHostname(host) {
  const normalized = normalizeHost(host);
  if (config.mainDomain) {
    const main = normalizeHost(config.mainDomain);
    return normalized === main || normalized === `www.${main}`;
  }

  return isLocalHost(normalized);
}

function requestHostname(req) {
  return normalizeHost(req.hostname || req.header("host") || "");
}

function normalizeHost(value) {
  const host = String(value || "").toLowerCase().trim();
  if (host.startsWith("[")) {
    const bracketEnd = host.indexOf("]");
    return bracketEnd > -1 ? host.slice(1, bracketEnd) : host;
  }
  if (host === "::1") return host;
  if ((host.match(/:/g) || []).length === 1) return host.split(":")[0];
  return host;
}

function isLocalHost(host) {
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

function isLocalOrigin(origin) {
  try {
    return isLocalHost(new URL(origin).hostname);
  } catch (_error) {
    return false;
  }
}

function isAdminOrigin(origin) {
  try {
    const url = new URL(origin);
    return isAdminHostname(url.hostname) || (config.allowLocalhostOrigins && isLocalHost(url.hostname));
  } catch (_error) {
    return false;
  }
}

function isMainOrigin(origin) {
  try {
    const url = new URL(origin);
    return isMainHostname(url.hostname) || (config.allowLocalhostOrigins && isLocalHost(url.hostname));
  } catch (_error) {
    return false;
  }
}

function redirectToAdmin(req, res, pathName, status) {
  if (!config.adminDomain) return notFound(req, res);
  const protocol = config.cookieSecure ? "https" : req.protocol;
  return res.redirect(status || 302, `${protocol}://${config.adminDomain}${pathName || req.originalUrl || "/"}`);
}

function redirectToPublicSite(_req, res, fileName) {
  const pathName = fileName === "index.html" ? "/" : `/${fileName}`;
  return res.redirect(302, new URL(pathName, config.publicSiteUrl).toString());
}

function sendProjectFile(fileName) {
  return (_req, res, next) => {
    res.sendFile(path.join(projectRoot, fileName), (error) => {
      if (error) next(error);
    });
  };
}

function sendSiteFile(fileName) {
  return (_req, res, next) => {
    res.sendFile(path.join(siteRoot, fileName), (error) => {
      if (error) next(error);
    });
  };
}

function sendAuthFile(fileName) {
  return (_req, res, next) => {
    res.sendFile(path.join(authRoot, fileName), (error) => {
      if (error) next(error);
    });
  };
}

function notFound(req, res) {
  return sendError(req, res, 404, `${req.method} ${req.path} bulunamadi.`);
}

function sendError(req, res, status, message) {
  if (wantsJson(req)) {
    return res.status(status).json({ ok: false, message });
  }

  return res
    .status(status)
    .type("html")
    .send(`<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${status}</title></head><body><main style="font-family:Arial,sans-serif;max-width:620px;margin:12vh auto;padding:24px"><h1>${status}</h1><p>${escapeHtml(message)}</p></main></body></html>`);
}

function wantsJson(req) {
  return req.path.startsWith("/api/") || String(req.get("Accept") || "").includes("application/json");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function readExcelWorkbook(buffer, fileName) {
  try {
    if (!xlsxModule) {
      try {
        xlsxModule = require("xlsx");
      } catch (_error) {
        xlsxModule = {
          read: simpleXlsx.readWorkbook,
          utils: { sheet_to_json: simpleXlsx.sheetToJson }
        };
      }
    }
  } catch (error) {
    error.message = "Excel aktarımı için XLSX okuyucu başlatılamadı.";
    error.status = 500;
    throw error;
  }

  try {
    return xlsxModule.read(buffer, {
      type: "buffer",
      cellDates: false,
      raw: false,
      WTF: false
    });
  } catch (error) {
    error.message = `${fileName || "Excel"} dosyasi okunamadi. XLSX, XLS, CSV veya TSV dosyasi yukleyin.`;
    error.status = 400;
    throw error;
  }
}

function workbookToRows(workbook) {
  const sheetName = workbook && workbook.SheetNames && workbook.SheetNames[0];
  const sheet = sheetName && workbook.Sheets[sheetName];
  if (!sheet) return [];
  return xlsxModule.utils.sheet_to_json(sheet, {
    defval: "",
    raw: false,
    blankrows: false
  });
}

function workbookToProductImportRows(workbook) {
  const sheetNames = workbook && Array.isArray(workbook.SheetNames) ? workbook.SheetNames : [];
  const rows = [];

  sheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets && workbook.Sheets[sheetName];
    if (!sheet) return;
    const sheetRows = xlsxModule.utils.sheet_to_json(sheet, {
      defval: "",
      raw: false,
      blankrows: false
    });
    sheetRows.forEach((row, index) => {
      if (!Object.values(row || {}).some((value) => String(value ?? "").trim())) return;
      rows.push({
        sheetName,
        rowNumber: index + 2,
        values: row
      });
    });
  });

  return rows;
}

async function createRecipeImportBackup() {
  const backupDir = path.join(path.dirname(config.dataFile), "backups", "recipe-imports");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `recipe-import-${stamp}.json`;
  const target = path.join(backupDir, fileName);
  try {
    await fs.mkdir(backupDir, { recursive: true });
    await fs.copyFile(config.dataFile, target);
    return { fileName, path: target };
  } catch (_error) {
    return { fileName: "", path: "" };
  }
}

async function createProductImportBackup() {
  const backupDir = path.join(path.dirname(config.dataFile), "backups", "product-imports");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `product-import-${stamp}.json`;
  const target = path.join(backupDir, fileName);
  try {
    await fs.mkdir(backupDir, { recursive: true });
    await fs.copyFile(config.dataFile, target);
    return { fileName, path: target };
  } catch (_error) {
    return { fileName: "", path: "" };
  }
}

function createRecipeImportReport(rows) {
  return {
    totalRows: Array.isArray(rows) ? rows.length : 0,
    updatedCount: 0,
    createdCount: 0,
    unchangedCount: 0,
    errorCount: 0,
    changes: [],
    errors: [],
    backupFile: "",
    backupPath: "",
    updatedAt: ""
  };
}

function createProductImportReport(rows) {
  return {
    totalRows: Array.isArray(rows) ? rows.length : 0,
    updatedCount: 0,
    createdCount: 0,
    unchangedCount: 0,
    errorCount: 0,
    changes: [],
    errors: [],
    backupFile: "",
    backupPath: "",
    updatedAt: ""
  };
}

function applyProductImportRows(menuState, rows) {
  const nextState = cloneJson(menuState || {});
  if (!Array.isArray(nextState.categories)) nextState.categories = [];

  const report = createProductImportReport(rows);
  const changedKeys = new Set();
  const unchangedKeys = new Set();

  rows.forEach((row) => {
    const parsed = normalizeProductImportRow(row);
    const rowPreview = productImportRowPreview(row);
    if (!parsed.category || !parsed.product) {
      report.errors.push({
        sheetName: row.sheetName || "",
        rowNumber: row.rowNumber || "-",
        category: parsed.category || row.sheetName || "",
        product: parsed.product || "",
        rowPreview,
        message: "Sayfa/kategori ve Urun Adi zorunludur."
      });
      return;
    }

    const category = findProductImportCategory(nextState.categories, parsed.category);
    if (!category) {
      report.errors.push({
        sheetName: row.sheetName || parsed.category,
        rowNumber: row.rowNumber || "-",
        category: parsed.category,
        product: parsed.product,
        rowPreview,
        message: `Kategori bulunamadi: ${parsed.category}`
      });
      return;
    }

    const product = findProductImportProduct(category.products, parsed.product);
    if (!product) {
      report.errors.push({
        sheetName: row.sheetName || parsed.category,
        rowNumber: row.rowNumber || "-",
        category: category.name || parsed.category,
        product: parsed.product,
        rowPreview,
        message: `Urun bulunamadi: ${parsed.product}`
      });
      return;
    }

    if (!product.details || typeof product.details !== "object" || Array.isArray(product.details)) {
      product.details = {};
    }

    const recordKey = productImportRecordKey(category.name || parsed.category, product.name || parsed.product);
    const fieldChanges = [];

    PRODUCT_IMPORT_FIELDS.forEach((field) => {
      if (!Object.prototype.hasOwnProperty.call(parsed.values, field)) return;
      const nextValue = parsed.values[field];
      const oldValue = product.details[field] ?? "";
      if (String(oldValue ?? "") === String(nextValue ?? "")) return;
      product.details[field] = nextValue;
      fieldChanges.push({
        row: row.rowNumber || "-",
        sheetName: row.sheetName || "",
        category: category.name || parsed.category,
        product: product.name || parsed.product,
        field: productImportFieldLabel(field),
        oldValue: summarizeImportValue(oldValue),
        newValue: summarizeImportValue(nextValue),
        status: "Güncellendi",
        changeType: `${productImportFieldLabel(field)} değişti`
      });
    });

    if (fieldChanges.length) {
      changedKeys.add(recordKey);
      report.changes.push(...fieldChanges);
    } else {
      unchangedKeys.add(recordKey);
      report.changes.push({
        row: row.rowNumber || "-",
        sheetName: row.sheetName || "",
        category: category.name || parsed.category,
        product: product.name || parsed.product,
        field: "-",
        oldValue: "",
        newValue: "",
        status: "Aynı kaldı",
        changeType: "Değişiklik yok"
      });
    }
  });

  report.updatedCount = changedKeys.size;
  report.createdCount = 0;
  report.unchangedCount = Array.from(unchangedKeys).filter((key) => !changedKeys.has(key)).length;
  report.errorCount = report.errors.length;

  return { menuState: nextState, report };
}

function applyRecipeImportRows(recipeState, rows) {
  const nextState = cloneJson(recipeState || {});
  const report = createRecipeImportReport(rows);
  const changedRecordKeys = new Set();
  const createdRecordKeys = new Set();
  const unchangedRecordKeys = new Set();

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const parsed = normalizeRecipeImportRow(row);
    if (!parsed.category || !parsed.product || !parsed.size) {
      report.errors.push({
        rowNumber,
        message: "Kategori, Ürün Adı ve Ölçü alanları zorunludur."
      });
      return;
    }
    if (parsed.error) {
      report.errors.push({
        rowNumber,
        category: parsed.category,
        product: parsed.product,
        size: parsed.size,
        message: parsed.error
      });
      return;
    }

    const recordKey = recipeImportRecordKey(parsed);
    if (!nextState[parsed.category]) nextState[parsed.category] = {};
    if (!nextState[parsed.category][parsed.product]) nextState[parsed.category][parsed.product] = {};
    const sizes = nextState[parsed.category][parsed.product];
    const existed = Object.prototype.hasOwnProperty.call(sizes, parsed.size);
    const current = normalizeRecipeImportItem(sizes[parsed.size]);
    const nextItem = Object.assign({}, current);
    const fieldChanges = [];

    RECIPE_IMPORT_FIELDS.forEach((field) => {
      if (!Object.prototype.hasOwnProperty.call(parsed.values, field)) return;
      const nextValue = parsed.values[field];
      const oldValue = current[field];
      if (String(oldValue ?? "") === String(nextValue ?? "")) return;
      nextItem[field] = nextValue;
      fieldChanges.push({
        row: rowNumber,
        category: parsed.category,
        product: parsed.product,
        size: parsed.size,
        field: recipeImportFieldLabel(field),
        oldValue: summarizeImportValue(oldValue),
        newValue: summarizeImportValue(nextValue),
        status: existed ? "Güncellendi" : "Yeni eklendi",
        changeType: recipeImportChangeType(field, existed)
      });
    });

    if (!existed) {
      sizes[parsed.size] = nextItem;
      createdRecordKeys.add(recordKey);
      report.changes.push({
        row: rowNumber,
        category: parsed.category,
        product: parsed.product,
        size: parsed.size,
        field: "Yeni kayıt",
        oldValue: "",
        newValue: summarizeImportValue(nextItem.content || nextItem.preparation || parsed.product),
        status: "Yeni eklendi",
        changeType: "Yeni ölçü eklendi"
      }, ...fieldChanges);
      return;
    }

    if (fieldChanges.length) {
      sizes[parsed.size] = nextItem;
      changedRecordKeys.add(recordKey);
      report.changes.push(...fieldChanges);
    } else {
      unchangedRecordKeys.add(recordKey);
      report.changes.push({
        row: rowNumber,
        category: parsed.category,
        product: parsed.product,
        size: parsed.size,
        field: "-",
        oldValue: "",
        newValue: "",
        status: "Aynı kaldı",
        changeType: "Değişiklik yok"
      });
    }
  });

  report.updatedCount = changedRecordKeys.size;
  report.createdCount = createdRecordKeys.size;
  report.unchangedCount = Array.from(unchangedRecordKeys).filter((key) => !changedRecordKeys.has(key) && !createdRecordKeys.has(key)).length;
  report.errorCount = report.errors.length;

  return { recipeState: nextState, report };
}

const RECIPE_IMPORT_FIELDS = [
  "content",
  "preparation",
  "note",
  "active",
  "order"
];

const PRODUCT_IMPORT_FIELDS = [
  "calories",
  "allergens",
  "ingredients"
];

const PRODUCT_IMPORT_HEADER_MAP = {
  kategori: "category",
  "urun adi": "product",
  urun: "product",
  product: "product",
  "urun kalorisi": "calories",
  kalori: "calories",
  calories: "calories",
  kcal: "calories",
  "urun alerjeni": "allergens",
  alerjen: "allergens",
  allergens: "allergens",
  allergen: "allergens",
  "urun icerigi": "ingredients",
  icerik: "ingredients",
  ingredients: "ingredients",
  content: "ingredients"
};

const RECIPE_IMPORT_HEADER_MAP = {
  kategori: "category",
  "urun adi": "product",
  urun: "product",
  olcu: "size",
  icerik: "content",
  "icerik olcusuz": "content",
  hazirlanisi: "preparation",
  hazirlanis: "preparation",
  "hazirlanis olculer dahil": "preparation",
  "hazirlanisi olculer dahil": "preparation",
  "urun notu": "note",
  "urun not": "note",
  productnote: "note",
  "product note": "note",
  not: "note",
  aktif: "active",
  siralama: "order"
};

function normalizeProductImportRow(row) {
  const normalized = {
    category: String(row && row.sheetName || "").trim(),
    product: "",
    values: {}
  };

  Object.entries(row && row.values || {}).forEach(([header, value]) => {
    const key = PRODUCT_IMPORT_HEADER_MAP[normalizeImportHeader(header)];
    if (!key) return;
    const rawText = String(value ?? "");
    const text = rawText.trim();
    if (key === "category") normalized.category = text || normalized.category;
    else if (key === "product") normalized.product = text;
    else {
      if (!text) return;
      normalized.values[key] = isClearToken(text) ? "" : rawText;
    }
  });

  return normalized;
}

function productImportRowPreview(row) {
  const entries = Object.entries(row && row.values || {})
    .map(([header, value]) => {
      const text = summarizeImportValue(value);
      if (!text) return "";
      return `${header}: ${text}`;
    })
    .filter(Boolean)
    .slice(0, 6);

  return entries.join(" | ");
}

function normalizeRecipeImportRow(row) {
  const normalized = {
    category: "",
    product: "",
    size: "",
    values: {},
    error: ""
  };

  Object.entries(row || {}).forEach(([header, value]) => {
    const key = RECIPE_IMPORT_HEADER_MAP[normalizeImportHeader(header)];
    if (!key) return;
    const rawText = String(value ?? "");
    const text = rawText.trim();
    if (key === "category") normalized.category = text;
    else if (key === "product") normalized.product = text;
    else if (key === "size") normalized.size = text;
    else if (key === "active") {
      if (!text) return;
      if (isClearToken(text)) {
        normalized.values.active = true;
        return;
      }
      const activeValue = parseImportBoolean(text);
      if (activeValue === null) normalized.error = "Aktif alanı evet/hayır, aktif/pasif veya 1/0 olmalı.";
      else normalized.values.active = activeValue;
    } else if (key === "order") {
      if (!text) return;
      if (isClearToken(text)) {
        normalized.values.order = 0;
        return;
      }
      const orderValue = Number(String(text).replace(",", "."));
      if (!Number.isFinite(orderValue)) normalized.error = "Sıralama alanı sayı olmalı.";
      else normalized.values.order = orderValue;
    } else {
      if (!text) return;
      normalized.values[key] = isClearToken(text) ? "" : rawText;
    }
  });

  return normalized;
}

function findProductImportCategory(categories, categoryName) {
  const normalizedName = normalizeImportHeader(categoryName);
  if (!normalizedName || !Array.isArray(categories)) return null;
  const exact = categories.find((category) => normalizeImportHeader(category && category.name) === normalizedName);
  if (exact) return exact;

  if (normalizedName.length < 8) return null;
  const prefixMatches = categories.filter((category) => {
    const candidate = normalizeImportHeader(category && category.name);
    return candidate.startsWith(normalizedName) || normalizedName.startsWith(candidate);
  });
  return prefixMatches.length === 1 ? prefixMatches[0] : null;
}

function findProductImportProduct(products, productName) {
  const normalizedName = normalizeImportHeader(productName);
  if (!normalizedName || !Array.isArray(products)) return null;
  return products.find((product) => normalizeImportHeader(product && product.name) === normalizedName) || null;
}

function productImportRecordKey(category, product) {
  return [category, product]
    .map((part) => normalizeImportHeader(part))
    .join("|");
}

function productImportFieldLabel(field) {
  return {
    calories: "Kalori",
    allergens: "Alerjen",
    ingredients: "Ürün içeriği"
  }[field] || field;
}

function normalizeImportHeader(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0131/g, "i")
    .replace(/\u0130/g, "I")
    .replace(/\u00c4\u00b1/g, "i")
    .replace(/\u00c4\u00b0/g, "I")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function parseImportBoolean(value) {
  const normalized = normalizeImportHeader(value);
  if (["1", "evet", "true", "aktif", "active", "yes"].includes(normalized)) return true;
  if (["0", "hayir", "false", "pasif", "inactive", "no"].includes(normalized)) return false;
  return null;
}

function isClearToken(value) {
  return normalizeImportHeader(value) === "bosalt";
}

function normalizeRecipeImportItem(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const content = String(value.content ?? value.recipe ?? value.ingredients ?? "");
    const preparation = String(value.preparation ?? value.method ?? value.steps ?? value.description ?? "");
    return {
      content,
      preparation,
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

function recipeImportRecordKey(row) {
  return [row.category, row.product, row.size]
    .map((part) => normalizeImportHeader(part))
    .join("|");
}

function recipeImportFieldLabel(field) {
  return {
    content: "İçerik",
    preparation: "Hazırlanışı",
    note: "Ürün Notu",
    active: "Aktif",
    order: "Sıralama"
  }[field] || field;
}

function recipeImportChangeType(field, existed) {
  if (!existed) return "Yeni ölçü eklendi";
  return {
    content: "İçerik değişti",
    preparation: "Hazırlanışı değişti",
    note: "Ürün notu değişti",
    active: "Aktiflik değişti",
    order: "Sıralama değişti"
  }[field] || "Alan değişti";
}

function summarizeImportValue(value) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  return text.length > 120 ? `${text.slice(0, 117)}...` : text;
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value || {}));
}

function broadcastMenuUpdate(menuState, updatedAt) {
  const payload = { menuState, updatedAt };
  for (const client of sseClients) {
    sendSse(client.res, "menu", payload);
  }
}

function broadcastRecipeUpdate(recipeState, updatedAt, recipeCatalog = []) {
  const payload = { recipeState, recipeCatalog, updatedAt };
  for (const client of recipeSseClients) {
    sendSse(client.res, "recipes", payload);
  }
}

function closeRecipeClientsForUser(userId) {
  const targetId = String(userId || "").trim();
  if (!targetId) return;

  for (const client of Array.from(recipeSseClients)) {
    if (client.userId !== targetId) continue;
    try {
      sendSse(client.res, "recipes", { recipeState: {}, updatedAt: new Date().toISOString(), revoked: true });
      client.res.end();
    } catch (_error) {}
    recipeSseClients.delete(client);
  }
}

function broadcastSiteUpdate(siteState, updatedAt) {
  const payload = { siteState, updatedAt };
  for (const client of siteSseClients) {
    sendSse(client.res, "site", payload);
  }
}

function broadcastPublicUpdate(data, reason) {
  const payload = { reason, ...buildPublicBootstrap(data) };
  for (const client of publicSseClients) {
    sendSse(client.res, "bootstrap", payload);
  }
}

function broadcastFeedbackUpdate(feedbackItems, updatedAt) {
  const payload = { feedbackItems, updatedAt };
  for (const client of feedbackSseClients) {
    sendSse(client.res, "feedback", payload);
  }
}

function sendSse(res, event, payload) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function isPasswordResetConfigured() {
  return Boolean(config.passwordResetEmail && config.smtpUser && config.smtpPass);
}

function isAuthorizedResetEmail(email) {
  const current = normalizeEmail(email);
  return Boolean(current && safeEqual(current, config.passwordResetEmail));
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizePasswordScope(value) {
  const scope = String(value || "").toLowerCase().trim();
  if (["admin", "panel"].includes(scope)) return "admin";
  if (["recipe", "recete", "reçete"].includes(scope)) return "recipe";
  return "";
}

function isEmailLike(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""));
}

function resetCodeTtlMs() {
  return config.passwordResetCodeTtlMinutes * 60 * 1000;
}

function hashResetCode(email, code) {
  return crypto
    .createHmac("sha256", config.jwtSecret)
    .update(`${normalizeEmail(email)}:${String(code || "")}`)
    .digest("hex");
}

async function sendPasswordResetEmail(email, code) {
  const transporter = passwordResetMailTransporter();
  const minutes = config.passwordResetCodeTtlMinutes;
  const from = config.smtpFrom || config.smtpUser;

  await transporter.sendMail({
    from,
    to: email,
    subject: "Tahmisci sifre dogrulama kodu",
    text: [
      "Tahmisci panel ve recete sifresini degistirmek icin dogrulama kodunuz:",
      "",
      code,
      "",
      `Bu kod ${minutes} dakika gecerlidir.`,
      "Bu istegi siz yapmadiysaniz bu e-postayi yok sayin."
    ].join("\n"),
    html: [
      "<div style=\"font-family:Arial,sans-serif;line-height:1.5;color:#152016\">",
      "<h2>Tahmisci sifre dogrulama</h2>",
      "<p>Panel ve recete sifresini degistirmek icin dogrulama kodunuz:</p>",
      `<p style=\"font-size:30px;font-weight:800;letter-spacing:0.18em\">${code}</p>`,
      `<p>Bu kod ${minutes} dakika gecerlidir.</p>`,
      "<p>Bu istegi siz yapmadiysaniz bu e-postayi yok sayin.</p>",
      "</div>"
    ].join("")
  });
}

function passwordResetMailTransporter() {
  if (passwordResetTransporter) return passwordResetTransporter;

  passwordResetTransporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass
    }
  });

  return passwordResetTransporter;
}

function validateRecipeUserInput({ name, username, password, requirePassword }) {
  if (!name || name.length < 2) return "Ad soyad en az 2 karakter olmali.";
  if (!username || username.length < 3) return "Kullanici adi en az 3 karakter olmali.";
  if (!/^[a-z0-9._-]{3,40}$/.test(username)) {
    return "Kullanici adi sadece kucuk harf, rakam, nokta, tire veya alt tire icermeli.";
  }
  if (requirePassword || password) {
    return validatePassword(password);
  }
  return "";
}

function normalizeRecipeUsername(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 40);
}

function publicRecipeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name || user.username,
    username: user.username,
    active: user.active !== false,
    createdAt: user.createdAt || null,
    updatedAt: user.updatedAt || null,
    lastLoginAt: user.lastLoginAt || null
  };
}

function publicRecipeActivity(items) {
  return (items || []).slice(-300).reverse().map((item) => ({
    id: item.id,
    type: item.type,
    userId: item.userId || "",
    username: item.username || "",
    name: item.name || "",
    category: item.category || "",
    product: item.product || "",
    size: item.size || "",
    panel: item.panel || "",
    assignmentId: item.assignmentId || "",
    assignmentTitle: item.assignmentTitle || "",
    assignmentKind: item.assignmentKind || "",
    status: item.status || "",
    score: Number(item.score || 0) || 0,
    total: Number(item.total || 0) || 0,
    createdAt: item.createdAt || null
  }));
}

function publicRecipeAssignments(items, includeAnswers) {
  return (items || []).slice().reverse().map((item) => publicRecipeAssignment(item, includeAnswers));
}

function publicRecipeAssignment(item, includeAnswers) {
  if (!item) return null;
  return {
    id: item.id,
    userId: item.userId,
    username: item.username || "",
    name: item.name || "",
    title: item.title || `${item.product || "Recete"} / ${item.size || ""}`,
    category: item.category || "",
    product: item.product || "",
    size: item.size || "",
    assignmentKind: normalizeAssignmentKind(item.assignmentKind || item.assignmentType),
    assignmentType: normalizeAssignmentType(item.assignmentType),
    scopeType: normalizeScopeType(item.scopeType),
    recipeItems: normalizeRecipeItemsForPublic(item.recipeItems, item),
    questionCount: normalizeQuestionCount(item.questionCount, (item.questions || []).length || 3),
    difficulty: normalizeDifficulty(item.difficulty),
    passingScore: normalizePassingScore(item.passingScore),
    trainingContent: normalizeTrainingContent(item.trainingContent),
    adminNote: item.adminNote || "",
    status: normalizeAssignmentStatus(item.status),
    score: Number(item.score || 0) || 0,
    total: Number(item.total || (item.questions || []).length) || 0,
    answers: includeAnswers ? (item.answers || []) : undefined,
    viewedItems: item.viewedItems || [],
    completedItems: item.completedItems || [],
    failedItems: item.failedItems || [],
    percent: Number(item.percent || 0) || 0,
    passed: typeof item.passed === "boolean" ? item.passed : null,
    startedAt: item.startedAt || null,
    completedAt: item.completedAt || null,
    reviewedAt: item.reviewedAt || null,
    retryCount: Number(item.retryCount || 0) || 0,
    createdAt: item.createdAt || null,
    updatedAt: item.updatedAt || null,
    questions: (item.questions || []).map((question) => ({
      text: question.text,
      options: question.options,
      category: question.category || "",
      product: question.product || "",
      size: question.size || "",
      key: question.key || "",
      questionType: question.questionType || "",
      correctIndex: includeAnswers ? question.correctIndex : undefined
    }))
  };
}

async function recordRecipeActivity({ type, user, username, category, product, size, panel, assignment, status, score, total, req, createdAt }) {
  await store.update((data) => {
    appendRecipeActivity(data, makeRecipeActivity({
      type,
      user,
      username,
      category,
      product,
      size,
      panel,
      assignment,
      status,
      score,
      total,
      req,
      createdAt
    }));
    return data;
  });
}

function appendRecipeActivity(data, item) {
  data.recipeActivity = (data.recipeActivity || []).concat(item).slice(-RECIPE_ACTIVITY_LIMIT);
}

function makeRecipeActivity({ type, user, username, category, product, size, panel, assignment, status, score, total, req, createdAt }) {
  const source = user && typeof user === "object" ? user : {};
  const assignmentSource = assignment && typeof assignment === "object" ? assignment : {};
  return {
    id: `activity-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
    type: String(type || "activity").trim().slice(0, 60),
    userId: String(source.id || source.userId || "").trim(),
    username: normalizeRecipeUsername(source.username || username),
    name: String(source.name || "").trim().slice(0, 80),
    category: String(category || "").trim().slice(0, 160),
    product: String(product || "").trim().slice(0, 160),
    size: String(size || "").trim().slice(0, 80),
    panel: String(panel || "").trim().slice(0, 40),
    assignmentId: String(assignmentSource.id || "").trim().slice(0, 80),
    assignmentTitle: String(assignmentSource.title || assignmentSource.product || "").trim().slice(0, 160),
    assignmentKind: assignmentSource.assignmentKind ? normalizeAssignmentKind(assignmentSource.assignmentKind || assignmentSource.assignmentType) : "",
    status: status || assignmentSource.status ? normalizeAssignmentStatus(status || assignmentSource.status) : "",
    score: Math.max(0, Number(score || assignmentSource.score || 0) || 0),
    total: Math.max(0, Number(total || assignmentSource.total || 0) || 0),
    ip: req ? String(req.ip || "").slice(0, 80) : "",
    userAgent: req ? String(req.get("User-Agent") || "").slice(0, 220) : "",
    createdAt: createdAt || new Date().toISOString()
  };
}

function syncRecipeUserReferences(data, user) {
  (data.recipeAssignments || []).forEach((item) => {
    if (item.userId !== user.id) return;
    item.username = user.username;
    item.name = user.name;
  });
  (data.recipeActivity || []).forEach((item) => {
    if (item.userId !== user.id) return;
    item.username = user.username;
    item.name = user.name;
  });
}

function normalizeAssignmentType(value) {
  const type = String(value || "").trim();
  if (type === "training_quiz" || type === "retraining") return type;
  return "quiz";
}

function normalizeAssignmentKind(value) {
  const kind = String(value || "").trim();
  if (["quick_quiz", "training", "homework", "exam", "retraining"].includes(kind)) return kind;
  if (kind === "training_quiz") return "retraining";
  return "quick_quiz";
}

function normalizeScopeType(value) {
  const scopeType = String(value || "").trim();
  if (["all", "category", "products", "failed_items"].includes(scopeType)) return scopeType;
  return "products";
}

function normalizeQuestionCount(value, fallback) {
  const count = Number(value);
  if (!Number.isFinite(count)) return Math.max(1, Math.min(30, Number(fallback || 3) || 3));
  return Math.max(1, Math.min(30, Math.round(count)));
}

function normalizeDifficulty(value) {
  const difficulty = String(value || "").trim();
  if (["easy", "normal", "hard"].includes(difficulty)) return difficulty;
  return "normal";
}

function normalizeAssignmentStatus(value) {
  const status = String(value || "").trim();
  if (["pending", "in_progress", "completed", "failed", "retry_required"].includes(status)) {
    return status;
  }
  return "pending";
}

function normalizePassingScore(value) {
  const score = Number(value);
  if (!Number.isFinite(score)) return 70;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function normalizeTrainingContent(value) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return {
    generatedFromRecipe: source.generatedFromRecipe !== false,
    productName: String(source.productName || "").trim().slice(0, 160),
    category: String(source.category || "").trim().slice(0, 160),
    size: String(source.size || "").trim().slice(0, 80),
    shortDescription: String(source.shortDescription || "").trim().slice(0, 600),
    criticalMeasures: normalizeTextList(source.criticalMeasures, 8, 180),
    preparationSteps: normalizeTextList(source.preparationSteps, 12, 220),
    cautions: normalizeTextList(source.cautions, 8, 220),
    commonMistakes: normalizeTextList(source.commonMistakes, 8, 220),
    adminNote: String(source.adminNote || "").trim().slice(0, 1000),
    items: normalizeTrainingItems(source.items)
  };
}

function normalizeTextList(value, limit, itemLimit) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item || "").trim().slice(0, itemLimit))
    .filter(Boolean)
    .slice(0, limit);
}

function normalizeTrainingItems(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      const source = item && typeof item === "object" && !Array.isArray(item) ? item : {};
      const category = String(source.category || "").trim().slice(0, 160);
      const product = String(source.product || "").trim().slice(0, 160);
      const size = String(source.size || "").trim().slice(0, 80);
      if (!category || !product || !size) return null;
      return {
        key: source.key || recipeItemKey({ category, product, size }),
        category,
        product,
        size,
        content: normalizeTextList(source.content, 12, 220),
        preparation: normalizeTextList(source.preparation, 12, 220)
      };
    })
    .filter(Boolean)
    .slice(0, 120);
}

function buildRecipeTrainingContent(recipeValue, target) {
  const recipe = normalizeRecipeForQuestion(recipeValue);
  const contentSteps = splitTrainingText(recipe.content);
  const preparationSteps = splitTrainingText(recipe.preparation);
  const missingText = "Belirsiz / admin tarafindan tamamlanmali";
  const shortDescription = contentSteps[0] || recipe.content || missingText;
  return normalizeTrainingContent({
    generatedFromRecipe: true,
    productName: target.product,
    category: target.category,
    size: target.size,
    shortDescription,
    criticalMeasures: uniqueStrings([target.size].concat(contentSteps)).slice(0, 6),
    preparationSteps: preparationSteps.length ? preparationSteps : [missingText],
    cautions: [missingText],
    commonMistakes: [missingText],
    adminNote: target.adminNote || ""
  });
}

function splitTrainingText(value) {
  const text = String(value || "").trim();
  if (!text) return [];
  return text
    .split(/\n+|;\s+|\s+-\s+|\s+\+\s+/g)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function resolveAssignmentTargets(data, options) {
  const recipeState = data.recipeState || {};
  const allEntries = recipeEntries(recipeState);
  const scopeType = normalizeScopeType(options.scopeType);
  let targets = [];

  if (scopeType === "all") {
    targets = allEntries;
  } else if (scopeType === "category") {
    targets = allEntries.filter((item) => item.category === options.category);
  } else if (scopeType === "failed_items") {
    const failedKeys = new Set();
    (data.recipeAssignments || []).forEach((assignment) => {
      if (assignment.userId !== options.userId) return;
      (assignment.failedItems || []).forEach((item) => {
        if (item && item.key) failedKeys.add(item.key);
        else if (item) failedKeys.add(recipeItemKey(item));
      });
    });
    targets = allEntries.filter((item) => failedKeys.has(item.key));
  } else {
    const selected = normalizeSelectedProducts(options.selectedProducts);
    if (!selected.length && options.category && options.product && options.size) {
      selected.push({
        category: options.category,
        product: options.product,
        size: options.size
      });
    }
    const selectedKeys = new Set(selected.map(recipeItemKey));
    targets = allEntries.filter((item) => selectedKeys.has(item.key));
  }

  return uniqueRecipeEntries(targets);
}

function recipeEntries(recipeState) {
  const entries = [];
  for (const [category, products] of Object.entries(recipeState || {})) {
    for (const [product, sizes] of Object.entries(products || {})) {
      for (const [size, recipe] of Object.entries(sizes || {})) {
        if (!category || !product || !size) continue;
        entries.push({
          key: recipeItemKey({ category, product, size }),
          category,
          product,
          size,
          recipe
        });
      }
    }
  }
  return entries;
}

function normalizeSelectedProducts(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      const source = item && typeof item === "object" && !Array.isArray(item) ? item : {};
      const category = String(source.category || "").trim();
      const product = String(source.product || "").trim();
      const size = String(source.size || "").trim();
      return category && product && size ? { category, product, size } : null;
    })
    .filter(Boolean)
    .slice(0, 120);
}

function uniqueRecipeEntries(entries) {
  const seen = new Set();
  return (entries || []).filter((item) => {
    if (!item || !item.key || seen.has(item.key)) return false;
    seen.add(item.key);
    return true;
  });
}

function publicRecipeItem(item) {
  return {
    key: item.key || recipeItemKey(item),
    category: item.category || "",
    product: item.product || "",
    size: item.size || ""
  };
}

function recipeItemKey(item) {
  return [item.category, item.product, item.size].map((part) => String(part || "").trim()).join("::");
}

function normalizeRecipeItemsForPublic(items, fallback) {
  const normalized = Array.isArray(items)
    ? items.map((item) => {
      const source = item && typeof item === "object" ? item : {};
      const category = String(source.category || "").trim();
      const product = String(source.product || "").trim();
      const size = String(source.size || "").trim();
      return category && product && size ? publicRecipeItem({ category, product, size }) : null;
    }).filter(Boolean)
    : [];
  if (normalized.length) return normalized;
  if (fallback && fallback.category && fallback.product && fallback.size) {
    return [publicRecipeItem(fallback)];
  }
  return [];
}

function assignmentTitleFor({ assignmentKind, scopeType, category, product, size, count }) {
  const kindLabel = {
    quick_quiz: "Hizli Quiz",
    training: "Egitim Paketi",
    homework: "Calisma Odevi",
    exam: "Hakimiyet Sinavi",
    retraining: "Tekrar Egitimi"
  }[assignmentKind] || "Gorev";
  if (scopeType === "all") return `${kindLabel} / Tum receteler`;
  if (scopeType === "category") return `${kindLabel} / ${category || "Kategori"}`;
  if (count > 1) return `${kindLabel} / ${count} recete`;
  return `${kindLabel} / ${product || "Recete"} / ${size || ""}`.trim();
}

function buildAssignmentTrainingContent(recipeState, targets, options = {}) {
  return {
    generatedFromRecipe: true,
    productName: targets.length === 1 ? targets[0].product : `${targets.length} recete`,
    category: targets.length === 1 ? targets[0].category : "Karma",
    size: targets.length === 1 ? targets[0].size : "Coklu",
    shortDescription: "Bu egitim icerigi recete verisinden otomatik olusturuldu.",
    criticalMeasures: targets.map((item) => `${item.product} / ${item.size}`).slice(0, 12),
    preparationSteps: targets.flatMap((item) => {
      const recipe = normalizeRecipeForQuestion(item.recipe);
      return splitTrainingText(recipe.preparation).map((step) => `${item.product}: ${step}`);
    }).slice(0, 18),
    cautions: ["Belirsiz / admin tarafindan tamamlanmali"],
    commonMistakes: ["Belirsiz / admin tarafindan tamamlanmali"],
    adminNote: String(options.adminNote || "").trim().slice(0, 1000),
    items: targets.map((item) => {
      const recipe = normalizeRecipeForQuestion(recipeState[item.category][item.product][item.size]);
      return {
        key: item.key,
        category: item.category,
        product: item.product,
        size: item.size,
        content: splitTrainingText(recipe.content),
        preparation: splitTrainingText(recipe.preparation),
        note: splitTrainingText(recipe.note)
      };
    })
  };
}

function assignmentAssignedEvent(kind) {
  return {
    quick_quiz: "assignment_created",
    training: "training_assigned",
    homework: "homework_assigned",
    exam: "exam_assigned",
    retraining: "retry_training_suggested"
  }[normalizeAssignmentKind(kind)] || "assignment_created";
}

function assignmentStartedEvent(kind) {
  return {
    quick_quiz: "assignment_started",
    training: "training_started",
    homework: "homework_started",
    exam: "exam_started",
    retraining: "training_started"
  }[normalizeAssignmentKind(kind)] || "assignment_started";
}

function assignmentCompletedEvent(kind, passed) {
  if (normalizeAssignmentKind(kind) === "exam") return passed ? "exam_completed" : "exam_failed";
  if (normalizeAssignmentKind(kind) === "retraining") return passed ? "training_completed" : "exam_failed";
  return passed ? "assignment_completed" : "assignment_retry_required";
}

function buildRecipeAssignmentQuestions(recipeState, target) {
  const targets = uniqueRecipeEntries((target.targets || []).length ? target.targets : recipeEntries(recipeState).slice(0, 1));
  const allEntries = recipeEntries(recipeState);
  const questionCount = normalizeQuestionCount(target.questionCount, 3);
  const questionPool = [];

  targets.forEach((entry) => {
    const recipe = normalizeRecipeForQuestion(entry.recipe);
    const contentTerms = extractQuestionTerms(recipe.content);
    const preparationTerms = extractQuestionTerms(recipe.preparation);
    const otherTerms = collectRecipeQuestionTerms(recipeState, entry);
    const otherProducts = collectRecipeProducts(recipeState, entry);

    if (contentTerms.length) {
      questionPool.push(makeQuestion(
        `${entry.product} / ${entry.size} icin dogru icerik hangisidir?`,
        contentTerms[0],
        otherTerms,
        entry,
        "content"
      ));
      questionPool.push(makeQuestion(
        `${entry.product} / ${entry.size} recetesinde eksik kalan icerik hangisidir?`,
        contentTerms[contentTerms.length > 1 ? 1 : 0],
        otherTerms,
        entry,
        "missing_content"
      ));
      const wrongTerm = otherTerms.find((term) => !contentTerms.some((item) => normalizeComparable(item) === normalizeComparable(term)));
      if (wrongTerm) {
        questionPool.push(makeQuestion(
          `${entry.product} / ${entry.size} icin yanlis icerik hangisidir?`,
          wrongTerm,
          contentTerms,
          entry,
          "wrong_content"
        ));
      }
      questionPool.push(makeQuestion(
        `"${contentTerms[0]}" icerigi hangi urune aittir?`,
        entry.product,
        otherProducts,
        entry,
        "content_to_product"
      ));
      questionPool.push(makeTrueFalseQuestion(
        `${entry.product} / ${entry.size} recetesinde "${contentTerms[0]}" bilgisi dogrudur.`,
        true,
        entry,
        "true_false_recipe"
      ));
    }

    if (preparationTerms.length) {
      questionPool.push(makeQuestion(
        `${entry.product} / ${entry.size} hazirlanisinda dogru adim hangisidir?`,
        preparationTerms[0],
        otherTerms.concat(contentTerms),
        entry,
        "preparation"
      ));
      questionPool.push(makeQuestion(
        `"${preparationTerms[0]}" hazirlanis adimi hangi urune aittir?`,
        entry.product,
        otherProducts,
        entry,
        "preparation_to_product"
      ));
    }
  });

  while (questionPool.filter(Boolean).length < questionCount && allEntries.length) {
    const entry = allEntries[questionPool.length % allEntries.length];
    questionPool.push(makeQuestion(
      `${entry.product} / ${entry.size} icin dogru recete bilgisi hangisidir?`,
      entry.product,
      collectRecipeProducts(recipeState, entry),
      entry,
      "recipe_product"
    ));
  }

  return orderQuestionsForDifficulty(questionPool.filter(Boolean), target.difficulty).slice(0, questionCount);
}

function orderQuestionsForDifficulty(questions, difficulty) {
  const level = normalizeDifficulty(difficulty);
  if (level === "normal") return shuffle(questions);
  const priority = level === "easy"
    ? ["content", "preparation", "true_false_recipe", "missing_content"]
    : ["wrong_content", "content_to_product", "preparation_to_product", "missing_content"];
  const rank = (question) => {
    const index = priority.indexOf(question.questionType);
    return index === -1 ? priority.length : index;
  };
  return shuffle(questions).sort((a, b) => rank(a) - rank(b));
}

function makeQuestion(text, correct, candidates, target, questionType) {
  const correctText = String(correct || "").trim();
  if (!correctText) return null;

  const fallback = [
    "Double shot espresso",
    "Soguk sut",
    "Buz",
    "3 dakika",
    "Krema",
    "Filtre kahve",
    "Kakao"
  ];
  const options = uniqueStrings([correctText].concat(candidates || [], fallback))
    .filter((item) => normalizeComparable(item) !== normalizeComparable(correctText))
    .slice(0, 2);

  while (options.length < 2) {
    options.push(`Secenek ${options.length + 2}`);
  }

  const allOptions = shuffle([correctText].concat(options)).slice(0, 3);
  return {
    text,
    options: allOptions,
    correctIndex: allOptions.findIndex((item) => normalizeComparable(item) === normalizeComparable(correctText)),
    category: target && target.category || "",
    product: target && target.product || "",
    size: target && target.size || "",
    key: target && target.key || "",
    questionType: questionType || ""
  };
}

function makeTrueFalseQuestion(text, correct, target, questionType) {
  return {
    text,
    options: ["Dogru", "Yanlis", "Belirsiz"],
    correctIndex: correct ? 0 : 1,
    category: target && target.category || "",
    product: target && target.product || "",
    size: target && target.size || "",
    key: target && target.key || "",
    questionType: questionType || "true_false_recipe"
  };
}

function failedItemFromQuestion(question, selectedIndex) {
  if (!question || !question.category || !question.product || !question.size) return null;
  const options = Array.isArray(question.options) ? question.options : [];
  return {
    key: question.key || recipeItemKey(question),
    category: question.category,
    product: question.product,
    size: question.size,
    question: question.text || "",
    selected: options[Number(selectedIndex)] || "",
    correct: options[Number(question.correctIndex)] || ""
  };
}

function normalizeRecipeForQuestion(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const preparation = String(value.preparation || value.method || value.steps || value.description || "").trim();
    return {
      content: String(value.content || value.recipe || value.ingredients || "").trim(),
      preparation,
      note: String(value.note || value.productNote || "").trim()
    };
  }
  return {
    content: String(value || "").trim(),
    preparation: "",
    note: ""
  };
}

function collectRecipeQuestionTerms(recipeState, target) {
  const terms = [];
  for (const [category, products] of Object.entries(recipeState || {})) {
    for (const [product, sizes] of Object.entries(products || {})) {
      for (const [size, recipe] of Object.entries(sizes || {})) {
        if (category === target.category && product === target.product && size === target.size) continue;
        const item = normalizeRecipeForQuestion(recipe);
        terms.push(...extractQuestionTerms(item.content), ...extractQuestionTerms(item.preparation));
      }
    }
  }
  return terms;
}

function collectRecipeProducts(recipeState, target) {
  const products = [];
  for (const categoryProducts of Object.values(recipeState || {})) {
    products.push(...Object.keys(categoryProducts || {}));
  }
  return products.filter((product) => product !== target.product);
}

function extractQuestionTerms(text) {
  return uniqueStrings(String(text || "")
    .split(/\n+|;|\+|\s+-\s+|,|\//g)
    .map((part) => part.trim())
    .filter((part) => part.length >= 2 && part.length <= 80)
    .filter((part) => !/kaynakta yok|hen.?z girilmedi/i.test(part)))
    .slice(0, 8);
}

function uniqueStrings(values) {
  const seen = new Set();
  const result = [];
  (values || []).forEach((value) => {
    const text = String(value || "").trim();
    const key = normalizeComparable(text);
    if (!text || seen.has(key)) return;
    seen.add(key);
    result.push(text);
  });
  return result;
}

function normalizeComparable(value) {
  return String(value || "").trim().toLocaleLowerCase("tr-TR");
}

function shuffle(values) {
  const list = values.slice();
  for (let index = list.length - 1; index > 0; index -= 1) {
    const next = crypto.randomInt(0, index + 1);
    [list[index], list[next]] = [list[next], list[index]];
  }
  return list;
}

function validateMediaUpload(req) {
  const body = req.body;
  if (!Buffer.isBuffer(body) || !body.length) {
    const error = new Error("Medya dosyasi gerekli.");
    error.status = 400;
    throw error;
  }

  const kind = String(req.header("X-Media-Kind") || "").toLowerCase();
  if (!['image', 'video'].includes(kind)) {
    const error = new Error("Medya turu image veya video olmali.");
    error.status = 400;
    throw error;
  }
  const contentType = String(req.get("content-type") || "application/octet-stream").split(";")[0].trim().toLowerCase();
  const originalName = decodeHeaderValue(req.header("X-File-Name")) || (kind === "image" ? "image" : "video");
  const ext = mediaExtension(kind, contentType, originalName);
  const maxBytes = kind === "image" ? 15 * 1024 * 1024 : 120 * 1024 * 1024;

  if (body.length > maxBytes) {
    const error = new Error(kind === "image" ? "Gorsel en fazla 15 MB olabilir." : "Video en fazla 120 MB olabilir.");
    error.status = 413;
    throw error;
  }

  if (!ext) {
    const error = new Error(kind === "image"
      ? "Desteklenmeyen gorsel formati."
      : "Desteklenmeyen video formati. MP4 veya WebM kullanin.");
    error.status = 400;
    throw error;
  }

  if (contentType !== "application/octet-stream" && !contentType.startsWith(`${kind}/`)) {
    const error = new Error("Medya turu dosya tipiyle uyusmuyor.");
    error.status = 400;
    throw error;
  }

  const mimeExtension = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "video/mp4": ".mp4",
    "video/webm": ".webm"
  }[contentType];
  if (contentType !== "application/octet-stream" && (!mimeExtension || mimeExtension !== ext)) {
    const error = new Error("Dosya uzantisi ile MIME turu uyusmuyor.");
    error.status = 400;
    throw error;
  }

  if (!matchesMediaSignature(body, ext)) {
    const error = new Error("Dosya icerigi bildirilen medya formatıyla uyusmuyor.");
    error.status = 400;
    throw error;
  }

  const id = `${kind}-${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
  return {
    id,
    kind,
    originalName,
    contentType,
    fileName: `${id}${ext}`
  };
}

function normalizeFeedbackItem(raw) {
  const source = raw && typeof raw === "object" ? raw : {};
  const type = normalizeFeedbackType(source.type);
  const text = String(source.text || "").trim().slice(0, 1200);
  const favorite = String(source.favorite || source.favoriteDrink || "").trim().slice(0, 120);
  const rating = Math.max(0, Math.min(5, Number(source.rating || 0) || 0));
  if (!text && !favorite && !rating) return null;
  return {
    id: String(source.id || `feedback-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`).trim(),
    createdAt: String(source.createdAt || new Date().toISOString()),
    type,
    text: text || (type === "favori" ? "Favori icecek bildirimi" : "Puanlama kaydi"),
    favorite,
    rating
  };
}

function normalizeFeedbackType(value) {
  const type = String(value || "").toLowerCase().trim();
  if (type === "sikayet" || type === "şikayet") return "sikayet";
  if (type === "oneri" || type === "öneri") return "oneri";
  if (type === "favori" || type === "favorite") return "favori";
  if (type === "puanlama" || type === "rating") return "puanlama";
  return "istek";
}

function mediaExtension(kind, contentType, originalName) {
  const allowed = kind === "image"
    ? new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"])
    : new Set([".mp4", ".webm"]);
  const fromName = path.extname(String(originalName || "")).toLowerCase();
  if (allowed.has(fromName)) return fromName === ".jpeg" ? ".jpg" : fromName;

  const byType = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "video/mp4": ".mp4",
    "video/webm": ".webm"
  };
  const ext = byType[contentType];
  return allowed.has(ext) ? ext : "";
}

function matchesMediaSignature(buffer, extension) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return false;
  if (extension === ".jpg") return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (extension === ".png") return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (extension === ".gif") return ["GIF87a", "GIF89a"].includes(buffer.subarray(0, 6).toString("ascii"));
  if (extension === ".webp") return buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
  if (extension === ".mp4") return buffer.subarray(4, 8).toString("ascii") === "ftyp";
  if (extension === ".webm") return buffer.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]));
  return false;
}

function isSafeMediaFileName(value) {
  const name = String(value || "");
  return /^[a-z0-9][a-z0-9._-]{2,180}$/i.test(name) && path.basename(name) === name;
}

function decodeHeaderValue(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  try {
    return decodeURIComponent(text);
  } catch (_error) {
    return text;
  }
}

function absoluteUrl(req, pathname) {
  const origin = req.header("Origin");
  if (origin) {
    try {
      return new URL(pathname, origin).toString();
    } catch (_error) {}
  }

  return `${req.protocol}://${req.get("host")}${pathname}`;
}

function safeEqual(first, second) {
  const firstBuffer = Buffer.from(first);
  const secondBuffer = Buffer.from(second);

  if (firstBuffer.length !== secondBuffer.length) return false;

  return crypto.timingSafeEqual(firstBuffer, secondBuffer);
}

module.exports = { app, prepareRuntime, startServer, store };
