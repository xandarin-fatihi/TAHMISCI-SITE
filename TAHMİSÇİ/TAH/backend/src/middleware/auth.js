"use strict";
// Developer: Uzeyir | System Key: xandar | Admin session marker

const jwt = require("jsonwebtoken");

function createAuthMiddleware(config) {
  function signAdminToken() {
    return jwt.sign(
      { sub: "admin", role: "admin" },
      config.jwtSecret,
      {
        expiresIn: config.jwtExpiresIn,
        issuer: config.jwtIssuer,
        audience: config.jwtAudience
      }
    );
  }

  function signRecipeToken(user) {
    const recipeUser = user && typeof user === "object" ? user : null;
    return jwt.sign(
      {
        sub: recipeUser && recipeUser.id ? String(recipeUser.id) : "recipe",
        role: "recipe",
        ...(recipeUser && recipeUser.id ? {
          userId: String(recipeUser.id),
          username: String(recipeUser.username || ""),
          name: String(recipeUser.name || "")
        } : {})
      },
      config.jwtSecret,
      {
        expiresIn: config.jwtExpiresIn,
        issuer: config.jwtIssuer,
        audience: config.jwtAudience
      }
    );
  }

  function requireAdmin(req, res, next) {
    const payload = verifyRequest(req);

    if (!payload) {
      return res.status(401).json({
        ok: false,
        message: "Panel oturumu gerekli."
      });
    }

    req.admin = payload;
    return next();
  }

  function requireAdminPage(req, res, next) {
    const payload = verifyRequest(req);

    if (!payload) {
      const nextUrl = encodeURIComponent(req.originalUrl || "/panel/");
      return res.redirect(302, `/login.html?next=${nextUrl}`);
    }

    req.admin = payload;
    return next();
  }

  function requireRecipe(req, res, next) {
    const payload = verifyRecipeRequest(req);

    if (!payload) {
      return res.status(401).json({
        ok: false,
        message: "Recete oturumu gerekli."
      });
    }

    req.recipe = payload;
    return next();
  }

  function redirectIfAdmin(req, res, next) {
    if (verifyRequest(req)) {
      return res.redirect(302, "/panel/");
    }

    return next();
  }

  function attachAdminCookie(res, token) {
    res.cookie(config.adminCookieName, token, {
      httpOnly: true,
      secure: config.cookieSecure,
      sameSite: config.cookieSameSite,
      path: "/",
      maxAge: durationToMs(config.jwtExpiresIn)
    });
  }

  function attachRecipeCookie(res, token) {
    res.cookie(config.recipeCookieName, token, {
      httpOnly: true,
      secure: config.cookieSecure,
      sameSite: config.cookieSameSite,
      path: "/",
      maxAge: durationToMs(config.jwtExpiresIn)
    });
  }

  function clearAdminCookie(res) {
    res.clearCookie(config.adminCookieName, {
      httpOnly: true,
      secure: config.cookieSecure,
      sameSite: config.cookieSameSite,
      path: "/"
    });
  }

  function clearRecipeCookie(res) {
    res.clearCookie(config.recipeCookieName, {
      httpOnly: true,
      secure: config.cookieSecure,
      sameSite: config.cookieSameSite,
      path: "/"
    });
  }

  function verifyRequest(req) {
    const token = bearerToken(req) || cookieToken(req);
    if (!token) return null;

    try {
      const payload = jwt.verify(token, config.jwtSecret, {
        issuer: config.jwtIssuer,
        audience: config.jwtAudience
      });

      return payload && payload.role === "admin" ? payload : null;
    } catch (_error) {
      return null;
    }
  }

  function verifyRecipeRequest(req) {
    const adminPayload = verifyRequest(req);
    if (adminPayload) return adminPayload;

    const token = bearerToken(req) || recipeCookieToken(req);
    if (!token) return null;

    try {
      const payload = jwt.verify(token, config.jwtSecret, {
        issuer: config.jwtIssuer,
        audience: config.jwtAudience
      });

      return payload && payload.role === "recipe" ? payload : null;
    } catch (_error) {
      return null;
    }
  }

  function sessionInfoFromToken(token) {
    try {
      return sessionInfoFromPayload(jwt.verify(token, config.jwtSecret, {
        issuer: config.jwtIssuer,
        audience: config.jwtAudience
      }));
    } catch (_error) {
      return { expiresAt: null, ttlSeconds: 0 };
    }
  }

  function sessionInfoFromPayload(payload) {
    const expiresAtMs = Number(payload && payload.exp || 0) * 1000;
    const issuedAtMs = Number(payload && payload.iat || 0) * 1000;
    return {
      expiresAt: expiresAtMs ? new Date(expiresAtMs).toISOString() : null,
      issuedAt: issuedAtMs ? new Date(issuedAtMs).toISOString() : null,
      ttlSeconds: expiresAtMs ? Math.max(0, Math.floor((expiresAtMs - Date.now()) / 1000)) : 0
    };
  }

  function bearerToken(req) {
    const header = String(req.header("Authorization") || "");
    return header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  }

  function cookieToken(req) {
    const cookies = parseCookieHeader(req.header("Cookie") || "");
    return cookies[config.adminCookieName] || "";
  }

  function recipeCookieToken(req) {
    const cookies = parseCookieHeader(req.header("Cookie") || "");
    return cookies[config.recipeCookieName] || "";
  }

  return {
    attachAdminCookie,
    attachRecipeCookie,
    clearAdminCookie,
    clearRecipeCookie,
    redirectIfAdmin,
    requireAdmin,
    requireAdminPage,
    requireRecipe,
    sessionInfoFromPayload,
    sessionInfoFromToken,
    signAdminToken,
    signRecipeToken,
    verifyRecipeRequest,
    verifyRequest
  };
}

function parseCookieHeader(header) {
  const cookies = {};
  String(header || "").split(";").forEach((part) => {
    const index = part.indexOf("=");
    if (index < 0) return;

    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (!key) return;

    try {
      cookies[key] = decodeURIComponent(value);
    } catch (_error) {
      cookies[key] = value;
    }
  });

  return cookies;
}

function durationToMs(value) {
  const text = String(value || "").trim();
  const match = text.match(/^(\d+)([smhd])?$/i);
  if (!match) return 2 * 60 * 60 * 1000;

  const amount = Number(match[1]);
  const unit = (match[2] || "s").toLowerCase();
  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  return amount * multipliers[unit];
}

module.exports = { createAuthMiddleware };
