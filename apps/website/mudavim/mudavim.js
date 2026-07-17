(function () {
  "use strict";

  const memberState = {
    code: "THM-4821",
    level: "Gold Müdavim",
    visitCount: 6,
    rewardTarget: 10,
    activeReward: "10 içecekte 1 tatlı hakkı",
    profile: {
      fullName: "",
      alias: "",
      phone: "",
      birthDate: "",
      email: ""
    },
    recentVisits: [
      { title: "12 Mayıs 2025", text: "Americano" },
      { title: "9 Mayıs 2025", text: "Latte" },
      { title: "6 Mayıs 2025", text: "Cappuccino" }
    ],
    rewards: [
      { title: "10 içecekte 1 tatlı hakkı", text: "Ödülüne az kaldı." },
      { title: "Doğum günü avantajı", text: "Doğum gününde kasada özel avantajını sor." },
      { title: "İlk kayıt bonusu", text: "Kartını ilk kullanımda aktif hale getir." }
    ],
    campaigns: [
      { title: "Doğum günü avantajı", text: "Doğum gününde kasada özel avantajını sor." },
      { title: "Çift puan günleri", text: "Seçili günlerde ziyaretlerin daha hızlı ilerler." },
      { title: "Müdavimlere özel tatlı indirimi", text: "Aktif kampanyalar burada görünür." }
    ]
  };

  const auth = {
    isAuthenticated: false,
    registrationPhone: "",
    lastFocus: null
  };

  const overlay = document.getElementById("mudavimAuthOverlay");
  const closeButton = overlay?.querySelector(".mudavim-auth-close");
  const steps = overlay ? Array.from(overlay.querySelectorAll("[data-auth-step]")) : [];
  const gate = document.getElementById("gate");
  const app = document.getElementById("app");
  const bottomNav = document.querySelector(".mudavim-bottom-nav");

  document.querySelectorAll("[data-auth-open]").forEach((trigger) => {
    if (trigger.closest("#mudavimAuthOverlay")) return;
    trigger.addEventListener("click", () => {
      const target = trigger.dataset.authOpen || "login";
      if (target === "google") {
        completeAuth("existing");
        openAuth("success", trigger);
        return;
      }
      openAuth(target, trigger);
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
      if (target === "google") {
        completeAuth("existing");
        showAuthStep("success");
        return;
      }
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
    const phone = readValue("loginPhone");
    const password = readValue("loginPassword");
    if (!phone || !password) return focusFirstEmpty(["loginPhone", "loginPassword"]);
    memberState.visitCount = 6;
    memberState.level = "Gold Müdavim";
    memberState.profile.phone = phone;
    completeAuth("existing");
  });

  overlay?.querySelector("[data-auth-step='register-phone']")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const phone = readValue("registerPhone");
    if (!phone) return focusById("registerPhone");
    auth.registrationPhone = phone;
    clearOtp("register");
    showAuthStep("register-otp");
  });

  overlay?.querySelector("[data-auth-step='register-otp']")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!isOtpComplete("register")) return focusFirstOtp("register");
    showAuthStep("register-password");
  });

  overlay?.querySelector("[data-auth-step='register-password']")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const password = readValue("registerPassword");
    const confirm = readValue("registerPasswordConfirm");
    const error = document.getElementById("passwordError");
    const valid = password.length >= 6 && password === confirm;
    if (error) error.hidden = valid;
    if (!valid) return focusById(password.length < 6 ? "registerPassword" : "registerPasswordConfirm");
    showAuthStep("register-profile");
  });

  overlay?.querySelector("[data-auth-step='register-profile']")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const terms = document.getElementById("registerTerms");
    const required = ["registerName", "registerAlias", "registerBirthDate"];
    if (!required.every(readValue)) return focusFirstEmpty(required);
    if (terms && !terms.checked) {
      terms.focus();
      return;
    }
    memberState.profile = {
      fullName: readValue("registerName"),
      alias: readValue("registerAlias"),
      phone: auth.registrationPhone,
      birthDate: readValue("registerBirthDate"),
      email: readValue("registerEmail") || "Belirtilmedi"
    };
    completeAuth("new");
  });

  overlay?.querySelector("[data-auth-step='phone']")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const phone = readValue("mudavimPhone");
    if (!phone) return focusById("mudavimPhone");
    memberState.profile.phone = phone;
    clearOtp("login");
    showAuthStep("otp");
  });

  overlay?.querySelector("[data-auth-step='otp']")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!isOtpComplete("login")) return focusFirstOtp("login");
    memberState.visitCount = 6;
    memberState.level = "Gold Müdavim";
    completeAuth("existing");
  });

  overlay?.querySelector("[data-auth-finish]")?.addEventListener("click", () => {
    closeAuth();
    setAuthenticated(true);
    document.getElementById("card")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  initOtpInputs();

  function openAuth(step, trigger) {
    if (!overlay) return;
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
    if (kind === "new") {
      memberState.visitCount = 0;
      memberState.level = "Gold Müdavim";
    }
    const progressText = `${memberState.visitCount} / ${memberState.rewardTarget} ziyaret`;
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
    setText("activeRewardTitle", memberState.activeReward);
    setText("activeRewardText", remaining === 0 ? "Tatlı hakkını kasada kullanabilirsin." : `Ödülüne az kaldı. ${remaining} ziyaret kaldı.`);
    setText("profileLevel", memberState.level);
    setText("profileCode", memberState.code);
    setText("profileAlias", memberState.profile.alias || "Belirtilmedi");
    setText("profilePhone", memberState.profile.phone || "Belirtilmedi");
    setText("profileBirthDate", formatDate(memberState.profile.birthDate));
    setText("profileEmail", memberState.profile.email || "Belirtilmedi");

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
    renderCards("campaignList", memberState.campaigns, "campaign-card");
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

  function initOtpInputs() {
    if (!overlay) return;
    overlay.querySelectorAll(".mudavim-otp").forEach((group) => {
      const inputs = Array.from(group.querySelectorAll("input"));
      inputs.forEach((input, index) => {
        input.addEventListener("input", () => {
          input.value = input.value.replace(/\D/g, "").slice(0, 1);
          if (input.value && inputs[index + 1]) inputs[index + 1].focus();
        });
        input.addEventListener("keydown", (event) => {
          if (event.key === "Backspace" && !input.value && inputs[index - 1]) {
            inputs[index - 1].focus();
          }
        });
        input.addEventListener("paste", (event) => {
          const text = event.clipboardData?.getData("text")?.replace(/\D/g, "").slice(0, inputs.length);
          if (!text) return;
          event.preventDefault();
          inputs.forEach((field, fieldIndex) => {
            field.value = text[fieldIndex] || "";
          });
          inputs[Math.min(text.length, inputs.length) - 1]?.focus();
        });
      });
    });
  }

  function otpInputs(groupName) {
    return Array.from(overlay?.querySelectorAll(`[data-otp-group='${groupName}'] input`) || []);
  }

  function clearOtp(groupName) {
    otpInputs(groupName).forEach((input) => {
      input.value = "";
    });
  }

  function isOtpComplete(groupName) {
    return otpInputs(groupName).map((input) => input.value).join("").length === 6;
  }

  function focusFirstOtp(groupName) {
    const target = otpInputs(groupName).find((input) => !input.value) || otpInputs(groupName)[0];
    target?.focus();
  }

  function focusFirstEmpty(ids) {
    const targetId = ids.find((id) => !readValue(id));
    if (targetId) focusById(targetId);
  }

  function focusById(id) {
    document.getElementById(id)?.focus();
  }

  function readValue(id) {
    return document.getElementById(id)?.value.trim() || "";
  }

  function formatDate(value) {
    if (!value) return "Belirtilmedi";
    const date = new Date(`${value}T12:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
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
