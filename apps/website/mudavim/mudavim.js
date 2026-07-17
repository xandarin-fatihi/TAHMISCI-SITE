(function () {
  "use strict";

  const member = {
    name: "Elif Yılmaz",
    contact: "elif@example.com",
    level: "Gold Müdavim",
    visits: 6,
    usedRewards: 0,
    code: "THM-4821",
    rewards: {
      active: [
        { title: "Tatlı hakkı", text: "10 içecekte 1 tatlı hakkı" }
      ],
      locked: [
        { title: "4 ziyaret kaldı", text: "Bir sonraki tatlı hakkına yaklaşıyorsun." },
        { title: "Doğum günü hediyesi", text: "Doğum günü ayında açılır." }
      ],
      used: [
        { title: "Kullanıldı", text: "Geçmiş ödül bulunmuyor." }
      ]
    }
  };

  const overlay = document.getElementById("mudavimAuthOverlay");
  const modal = overlay?.querySelector(".mudavim-auth-modal");
  const closeButton = overlay?.querySelector(".mudavim-auth-close");
  const steps = overlay ? Array.from(overlay.querySelectorAll("[data-auth-step]")) : [];
  const phoneInput = document.getElementById("mudavimPhone");
  const emailInput = document.getElementById("mudavimEmail");
  const fullNameInput = document.getElementById("mudavimFullName");
  const profileEmailInput = document.getElementById("mudavimProfileEmail");
  const termsInput = document.getElementById("mudavimTerms");
  const otpInputs = overlay ? Array.from(overlay.querySelectorAll(".mudavim-otp input")) : [];
  const authState = {
    contact: member.contact,
    provider: "phone",
    lastFocus: null
  };

  document.querySelectorAll("[data-auth-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.dataset.authMode || "welcome";
      openAuth(mode === "welcome" ? "welcome" : "phone", button);
    });
  });

  overlay?.addEventListener("click", (event) => {
    if (event.target === overlay) closeAuth();
  });

  closeButton?.addEventListener("click", closeAuth);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay && !overlay.hidden) closeAuth();
  });

  overlay?.querySelectorAll("[data-auth-next]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = button.dataset.authNext || "welcome";
      if (button.dataset.authProvider === "google") {
        authState.provider = "google";
        if (fullNameInput && !fullNameInput.value) fullNameInput.value = member.name;
        if (profileEmailInput && !profileEmailInput.value) profileEmailInput.value = "elif@example.com";
      }
      showAuthStep(next);
    });
  });

  overlay?.querySelector("[data-auth-resend]")?.addEventListener("click", (event) => {
    event.currentTarget.textContent = "Kod tekrar gönderildi";
    window.setTimeout(() => {
      event.currentTarget.textContent = "Kodu tekrar gönder";
    }, 1400);
  });

  overlay?.querySelector("[data-auth-step='phone']")?.addEventListener("submit", (event) => {
    event.preventDefault();
    authState.provider = "phone";
    authState.contact = phoneInput?.value.trim() || "0552 295 46 34";
    clearOtp();
    showAuthStep("otp");
  });

  overlay?.querySelector("[data-auth-step='email']")?.addEventListener("submit", (event) => {
    event.preventDefault();
    authState.provider = "email";
    authState.contact = emailInput?.value.trim() || member.contact;
    if (profileEmailInput && !profileEmailInput.value) profileEmailInput.value = authState.contact;
    if (fullNameInput && !fullNameInput.value) fullNameInput.value = member.name;
    showAuthStep("profile");
  });

  overlay?.querySelector("[data-auth-step='otp']")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const code = otpInputs.map((input) => input.value).join("");
    if (code.length < 6) {
      const firstEmpty = otpInputs.find((input) => !input.value) || otpInputs[0];
      firstEmpty?.focus();
      return;
    }
    if (fullNameInput && !fullNameInput.value) fullNameInput.value = member.name;
    if (profileEmailInput && !profileEmailInput.value && authState.provider !== "phone") {
      profileEmailInput.value = authState.contact;
    }
    showAuthStep("profile");
  });

  overlay?.querySelector("[data-auth-step='profile']")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!fullNameInput?.value.trim()) {
      fullNameInput?.focus();
      return;
    }
    if (!termsInput?.checked) {
      termsInput?.focus();
      return;
    }
    completeMockRegistration();
    showAuthStep("success");
  });

  overlay?.querySelector("[data-auth-finish]")?.addEventListener("click", () => {
    closeAuth();
    document.getElementById("profile")?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  function openAuth(step, trigger) {
    if (!overlay) return;
    authState.lastFocus = trigger || document.activeElement;
    overlay.hidden = false;
    document.body.classList.add("auth-open");
    showAuthStep(step || "welcome");
  }

  function closeAuth() {
    if (!overlay) return;
    overlay.hidden = true;
    document.body.classList.remove("auth-open");
    authState.lastFocus?.focus?.();
  }

  function showAuthStep(stepName) {
    steps.forEach((step) => {
      step.hidden = step.dataset.authStep !== stepName;
    });
    window.setTimeout(() => {
      const activeStep = steps.find((step) => step.dataset.authStep === stepName);
      const focusTarget = activeStep?.querySelector("input:not([type='checkbox']), button:not(.mudavim-auth-close)");
      focusTarget?.focus?.();
    }, 30);
  }

  function clearOtp() {
    otpInputs.forEach((input) => {
      input.value = "";
    });
  }

  function completeMockRegistration() {
    member.name = fullNameInput.value.trim();
    member.contact = profileEmailInput?.value.trim() || authState.contact;
    member.level = "Yeni Müdavim";
    member.visits = 0;
    member.usedRewards = 0;
    member.code = "THM-4821";
    member.rewards = {
      active: [
        { title: "Kartım hazır", text: "Kasada kodunu okut." }
      ],
      locked: [
        { title: "10 ziyaret kaldı", text: "10 içecekte 1 tatlı hakkı." },
        { title: "Doğum günü sürprizi", text: "Doğum günü ayında açılır." }
      ],
      used: [
        { title: "Kullanıldı", text: "Henüz kullanılan ödül yok." }
      ]
    };
    setText("authSuccessName", member.name);
    setText("authSuccessCode", member.code);
    renderMember();
  }

  function renderMember() {
    setText("memberName", member.name);
    setText("memberContact", member.contact);
    setText("memberLevel", member.level);
    setText("memberVisits", `${member.visits} / 10`);
    setText("memberRewards", String(member.usedRewards));
    setText("memberCode", member.code);
    setText("progressCount", String(member.visits));
    setText("progressRemain", `${Math.max(0, 10 - member.visits)} ziyaret kaldı`);

    const percent = Math.min(100, Math.max(0, member.visits * 10));
    const bar = document.getElementById("progressBar");
    if (bar) bar.style.width = `${percent}%`;

    const beans = document.getElementById("beanProgress");
    if (beans) {
      beans.innerHTML = Array.from({ length: 10 }, (_, index) => (
        `<span class="bean${index < member.visits ? " is-filled" : ""}" aria-hidden="true"></span>`
      )).join("");
    }

    renderRewards("activeRewards", member.rewards.active, "is-active");
    renderRewards("lockedRewards", member.rewards.locked, "is-locked");
    renderRewards("usedRewards", member.rewards.used, "is-used");
  }

  function renderRewards(id, items, className) {
    const target = document.getElementById(id);
    if (!target) return;
    target.innerHTML = items.map((item) => (
      `<article class="reward-card ${className}">
        <strong>${escapeHTML(item.title)}</strong>
        <span>${escapeHTML(item.text)}</span>
      </article>`
    )).join("");
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

  renderMember();
})();
