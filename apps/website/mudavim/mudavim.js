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

  const authTitle = document.getElementById("authTitle");
  const identity = document.getElementById("mudavimIdentity");
  const form = document.getElementById("mudavimAuthForm");

  document.querySelectorAll("[data-auth-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.dataset.authMode;
      if (authTitle) authTitle.textContent = mode === "register" ? "Müdavim kaydı oluştur" : "Müdavim kartına giriş yap";
      document.getElementById("auth")?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => identity?.focus(), 260);
    });
  });

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = identity?.value.trim();
      if (value) {
        member.contact = value;
        renderMember();
      }
      document.getElementById("profile")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
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
