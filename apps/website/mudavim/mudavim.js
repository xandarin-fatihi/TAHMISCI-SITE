(function () {
  "use strict";

  const member = {
    name: "Derya Yılmaz",
    contact: "derya@example.com",
    level: "Altın",
    visits: 6,
    totalVisits: 18,
    earnedRewards: 1,
    code: "MUD-2406",
    rewards: {
      active: [
        { title: "Ödülün hazır", text: "10 içecekte 1 tatlı hakkı kasada kullanılabilir." }
      ],
      locked: [
        { title: "4 ziyaret kaldı", text: "Bir sonraki tatlı hakkına yaklaşiyorsun." },
        { title: "Doğum günü hediyesi", text: "Doğum günü ayında aktifleşir." }
      ],
      used: [
        { title: "Limonlu cheesecake", text: "12 Temmuz 2026 tarihinde kullanıldı." }
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
      window.setTimeout(() => identity?.focus(), 300);
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
    setText("memberVisits", String(member.totalVisits));
    setText("memberRewards", String(member.earnedRewards));
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
