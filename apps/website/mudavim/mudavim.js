(function () {
  "use strict";

  const memberState = {
    code: "THM-4821",
    level: "Gold Müdavim",
    visitCount: 6,
    rewardTarget: 10,
    activeReward: "Tatlı hakkı",
    contactLabel: "Mock UI",
    recentVisits: [
      { title: "Ziyaret işlendi", text: "+1 içecek" },
      { title: "Ödül ilerlemesi", text: "6 / 10 ziyaret" },
      { title: "Kasada okutuldu", text: "Müdavim kodu kullanıldı" }
    ],
    rewards: [
      { title: "Tatlı hakkı", text: "10 içecekte 1 tatlı hakkı" },
      { title: "Doğum günü sürprizi", text: "Doğum günü ayında açılır" },
      { title: "Özel dönem kampanyası", text: "Aktif olduğunda burada görünür" }
    ]
  };

  const auth = {
    isAuthenticated: false,
    mode: "login",
    pendingMode: "login",
    lastFocus: null
  };

  const overlay = document.getElementById("mudavimAuthOverlay");
  const closeButton = overlay?.querySelector(".mudavim-auth-close");
  const steps = overlay ? Array.from(overlay.querySelectorAll("[data-auth-step]")) : [];
  const gate = document.getElementById("gate");
  const app = document.getElementById("app");
  const bottomNav = document.querySelector(".mudavim-bottom-nav");
  const otpInputs = overlay ? Array.from(overlay.querySelectorAll(".mudavim-otp input")) : [];

  document.querySelectorAll("[data-auth-open]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const target = trigger.dataset.authOpen || "login";
      if (target === "google") {
        openAuth("success", trigger, "login");
        return;
      }
      openAuth(target, trigger, target);
    });
  });

  document.querySelectorAll("[data-logout]").forEach((button) => {
    button.addEventListener("click", () => setAuthenticated(false));
  });

  overlay?.addEventListener("click", (event) => {
    if (event.target === overlay) closeAuth();
  });

  closeButton?.addEventListener("click", closeAuth);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay && !overlay.hidden) closeAuth();
  });

  overlay?.querySelectorAll("[data-auth-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.authOpen || "login";
      showAuthStep(target);
    });
  });

  overlay?.querySelector("[data-auth-resend]")?.addEventListener("click", (event) => {
    event.currentTarget.textContent = "Kod tekrar gönderildi";
    window.setTimeout(() => {
      event.currentTarget.textContent = "Kodu tekrar gönder";
    }, 1400);
  });

  overlay?.querySelector("[data-auth-step='login']")?.addEventListener("submit", (event) => {
    event.preventDefault();
    memberState.visitCount = 6;
    memberState.level = "Gold Müdavim";
    memberState.contactLabel = readValue("loginIdentity") || "Müdavim hesabı";
    completeAuth("existing");
  });

  overlay?.querySelector("[data-auth-step='register']")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const terms = document.getElementById("registerTerms");
    if (terms && !terms.checked) {
      terms.focus();
      return;
    }
    memberState.visitCount = 0;
    memberState.level = "Yeni Müdavim";
    memberState.contactLabel = readValue("registerPhone") || readValue("registerEmail") || "Yeni müdavim";
    completeAuth("new");
  });

  overlay?.querySelector("[data-auth-step='phone']")?.addEventListener("submit", (event) => {
    event.preventDefault();
    memberState.contactLabel = readValue("mudavimPhone") || "Telefon doğrulandı";
    auth.pendingMode = "phone";
    clearOtp();
    showAuthStep("otp");
  });

  overlay?.querySelector("[data-auth-step='otp']")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const code = otpInputs.map((input) => input.value).join("");
    if (code.length < 6) {
      const firstEmpty = otpInputs.find((input) => !input.value) || otpInputs[0];
      firstEmpty?.focus();
      return;
    }
    memberState.visitCount = 6;
    memberState.level = "Gold Müdavim";
    completeAuth("existing");
  });

  overlay?.querySelector("[data-auth-finish]")?.addEventListener("click", () => {
    closeAuth();
    setAuthenticated(true);
    document.getElementById("card")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  otpInputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "").slice(0, 1);
      if (input.value && otpInputs[index + 1]) otpInputs[index + 1].focus();
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && !input.value && otpInputs[index - 1]) {
        otpInputs[index - 1].focus();
      }
    });
    input.addEventListener("paste", (event) => {
      const text = event.clipboardData?.getData("text")?.replace(/\D/g, "").slice(0, 6);
      if (!text) return;
      event.preventDefault();
      otpInputs.forEach((field, fieldIndex) => {
        field.value = text[fieldIndex] || "";
      });
      otpInputs[Math.min(text.length, 6) - 1]?.focus();
    });
  });

  function openAuth(step, trigger, mode) {
    if (!overlay) return;
    auth.mode = mode || step || "login";
    auth.lastFocus = trigger || document.activeElement;
    overlay.hidden = false;
    document.body.classList.add("auth-open");
    showAuthStep(step || "login");
  }

  function closeAuth() {
    if (!overlay) return;
    overlay.hidden = true;
    document.body.classList.remove("auth-open");
    auth.lastFocus?.focus?.();
  }

  function showAuthStep(stepName) {
    const safeStep = steps.some((step) => step.dataset.authStep === stepName) ? stepName : "login";
    steps.forEach((step) => {
      step.hidden = step.dataset.authStep !== safeStep;
    });
    window.setTimeout(() => {
      const activeStep = steps.find((step) => step.dataset.authStep === safeStep);
      const focusTarget = activeStep?.querySelector("input:not([type='checkbox']), button:not(.mudavim-auth-close)");
      focusTarget?.focus?.();
    }, 30);
  }

  function completeAuth(kind) {
    const isNew = kind === "new";
    const progressText = isNew ? "0 / 10 başlangıç" : `${memberState.visitCount} / ${memberState.rewardTarget} ziyaret`;
    setText("authSuccessCode", memberState.code);
    setText("authSuccessProgress", progressText);
    renderDashboard();
    showAuthStep("success");
  }

  function setAuthenticated(value) {
    auth.isAuthenticated = Boolean(value);
    document.body.classList.toggle("is-member", auth.isAuthenticated);
    document.body.classList.toggle("is-guest", !auth.isAuthenticated);
    if (gate) gate.hidden = auth.isAuthenticated;
    if (app) app.hidden = !auth.isAuthenticated;
    if (bottomNav) bottomNav.hidden = !auth.isAuthenticated;
    document.querySelectorAll("[data-guest-nav]").forEach((item) => {
      item.hidden = auth.isAuthenticated;
    });
    document.querySelectorAll("[data-member-nav]").forEach((item) => {
      item.hidden = !auth.isAuthenticated;
    });
    renderDashboard();
    if (!auth.isAuthenticated) {
      document.getElementById("gate")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function renderDashboard() {
    const remaining = Math.max(0, memberState.rewardTarget - memberState.visitCount);
    const percent = Math.min(100, Math.max(0, (memberState.visitCount / memberState.rewardTarget) * 100));
    const remainingText = remaining === 0 ? "Ödülün hazır" : `${remaining} ziyaret kaldı`;

    setText("memberLevel", memberState.level);
    setText("memberVisits", `${memberState.visitCount} / ${memberState.rewardTarget}`);
    setText("memberCode", memberState.code);
    setText("progressCount", String(memberState.visitCount));
    setText("progressRemain", remainingText);
    setText("progressText", remainingText);
    setText("activeRewardTitle", remaining === 0 ? "Ödülün hazır" : memberState.activeReward);
    setText("activeRewardText", remaining === 0 ? "Tatlı hakkını kasada kullanabilirsin." : `${remaining} ziyaret sonra ödülün hazır.`);
    setText("profileLevel", memberState.level);
    setText("profileCode", memberState.code);
    setText("profileContact", memberState.contactLabel);

    const bar = document.getElementById("progressBar");
    if (bar) bar.style.width = `${percent}%`;

    const beans = document.getElementById("beanProgress");
    if (beans) {
      beans.innerHTML = Array.from({ length: memberState.rewardTarget }, (_, index) => (
        `<span class="bean${index < memberState.visitCount ? " is-filled" : ""}" aria-hidden="true"></span>`
      )).join("");
    }

    renderCards("rewardList", memberState.rewards, "reward-card");
    renderCards("visitHistory", memberState.recentVisits, "visit-item");
  }

  function renderCards(id, items, className) {
    const target = document.getElementById(id);
    if (!target) return;
    target.innerHTML = items.map((item) => (
      `<article class="${className}">
        <strong>${escapeHTML(item.title)}</strong>
        <span>${escapeHTML(item.text)}</span>
      </article>`
    )).join("");
  }

  function clearOtp() {
    otpInputs.forEach((input) => {
      input.value = "";
    });
  }

  function readValue(id) {
    return document.getElementById(id)?.value.trim() || "";
  }

  function setText(id, value) {
    const target = document.getElementById(id);
    if (target) target.textContent = value;
  }

  function escapeHTML(value) {
    return String(value || "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  renderDashboard();
  setAuthenticated(false);
})();
