/* Polymnia's Berry Garden — app logic */
(function () {
  "use strict";

  /* ---------------- tiny CSV parser (handles quoted fields) ---------------- */
  function parseCSV(text) {
    const rows = [];
    let row = [], field = "", inQ = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (inQ) {
        if (ch === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else inQ = false;
        } else field += ch;
      } else if (ch === '"') inQ = true;
      else if (ch === ",") { row.push(field); field = ""; }
      else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else if (ch !== "\r") field += ch;
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows.filter(r => r.some(c => c.trim() !== ""));
  }

  async function loadTab(url, fallbackRows) {
    if (!url) return fallbackRows;
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(res.status);
      const rows = parseCSV(await res.text());
      rows.shift(); // drop header row
      return rows.length ? rows : fallbackRows;
    } catch (e) {
      console.warn("Couldn't load sheet tab, using sample data:", e);
      return fallbackRows;
    }
  }

  /* ---------------- date helpers ---------------- */
  function parseDate(s) {
    s = (s || "").trim();
    let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);           // YYYY-MM-DD
    if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
    m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);             // M/D/YYYY
    if (m) return new Date(+m[3], +m[1] - 1, +m[2]);
    const d = new Date(s);
    return isNaN(d) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  const keyOf = d => d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

  /* ---------------- sample-data date templating ({Y}-{M} → current) ---------------- */
  function materializeSample(rows) {
    const now = new Date();
    const Y = now.getFullYear(), M = String(now.getMonth() + 1).padStart(2, "0");
    return rows.map(r => [String(r[0]).replace("{Y}", Y).replace("{M}", M), r[1], r[2], r[3]]);
  }

  /* ================= CALENDAR ================= */
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const grid = document.getElementById("calGrid");
  const title = document.getElementById("calTitle");
  const tip = document.getElementById("calTip");
  const frame = document.querySelector(".cal-frame");
  let view = new Date(); view.setDate(1);
  let eventsByDay = {};   // "Y-M-D" -> [{title, details, color}]

  function colorClass(c) {
    c = (c || "").toLowerCase();
    if (c.includes("mauve") || c.includes("purple")) return "b2";
    if (c.includes("teal") || c.includes("green")) return "b3";
    return "";
  }

  function renderCalendar() {
    title.textContent = MONTHS[view.getMonth()] + " " + view.getFullYear();
    grid.innerHTML = "";
    const today = new Date();
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const start = new Date(first); start.setDate(1 - first.getDay());
    for (let i = 0; i < 42; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);
      const cell = document.createElement("div");
      cell.className = "cal-day";
      if (d.getMonth() !== view.getMonth()) cell.classList.add("out");
      if (d.toDateString() === today.toDateString()) cell.classList.add("today");
      const evs = eventsByDay[keyOf(d)] || [];
      const dnum = document.createElement("span");
      dnum.className = "dnum"; dnum.textContent = d.getDate();
      cell.appendChild(dnum);
      if (evs.length) {
        cell.classList.add("has-event");
        cell.tabIndex = 0;
        cell.setAttribute("aria-label", d.toDateString() + ": " + evs.map(e => e.title).join("; "));
        const peek = document.createElement("span");
        peek.className = "ev-peek"; peek.textContent = evs[0].title;
        cell.appendChild(peek);
        const dots = document.createElement("span");
        dots.className = "berries";
        evs.slice(0, 4).forEach(e => {
          const b = document.createElement("span");
          b.className = "berry " + colorClass(e.color);
          dots.appendChild(b);
        });
        cell.appendChild(dots);
        cell.addEventListener("mouseenter", () => showTip(cell, d, evs));
        cell.addEventListener("mouseleave", hideTip);
        cell.addEventListener("focus", () => showTip(cell, d, evs));
        cell.addEventListener("blur", hideTip);
        cell.addEventListener("click", () => showTip(cell, d, evs)); // touch
      }
      grid.appendChild(cell);
    }
  }

  function showTip(cell, d, evs) {
    tip.innerHTML = evs.map(e =>
      '<div class="tip-item"><h4>' + esc(e.title) + "</h4>" +
      (e.details ? "<p>" + esc(e.details) + "</p>" : "") + "</div>"
    ).join("");
    tip.hidden = false;
    const fr = frame.getBoundingClientRect();
    const cr = cell.getBoundingClientRect();
    let left = cr.left - fr.left + cr.width / 2 - tip.offsetWidth / 2;
    left = Math.max(8, Math.min(left, fr.width - tip.offsetWidth - 8));
    let top = cr.top - fr.top - tip.offsetHeight - 10;
    if (top < 4) top = cr.bottom - fr.top + 10;
    tip.style.left = left + "px";
    tip.style.top = top + "px";
  }
  function hideTip() { tip.hidden = true; }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function step(n) {
    view.setMonth(view.getMonth() + n);
    hideTip();
    renderCalendar();
  }
  document.getElementById("calPrev").addEventListener("click", () => step(-1));
  document.getElementById("calNext").addEventListener("click", () => step(1));
  // scroll between months (throttled wheel over the calendar)
  let wheelLock = 0;
  frame.addEventListener("wheel", (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now - wheelLock < 450) return;
    wheelLock = now;
    step(e.deltaY > 0 ? 1 : -1);
  }, { passive: false });
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  /* ================= STATS ================= */
  function renderStats(rows) {
    const wrap = document.getElementById("statsGrid");
    wrap.innerHTML = "";
    rows.forEach(r => {
      const [emoji, label, value] = [r[0] || "✿", r[1] || "", r[2]];
      const num = Number(String(value).replace(/[^0-9.-]/g, ""));
      const card = document.createElement("div");
      card.className = "stat-card";
      card.innerHTML =
        '<div class="stat-emoji">' + esc(emoji) + "</div>" +
        '<div class="stat-value" data-target="' + (isNaN(num) ? "" : num) + '">' +
        (isNaN(num) ? esc(String(value)) : "0") + "</div>" +
        '<div class="stat-label">' + esc(label) + "</div>";
      wrap.appendChild(card);
    });
    countUpWhenVisible();
  }

  function countUpWhenVisible() {
    const els = document.querySelectorAll(".stat-value[data-target]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        const target = Number(en.target.dataset.target);
        if (!en.target.dataset.target || isNaN(target)) return;
        if (reduce) { en.target.textContent = target.toLocaleString(); return; }
        const t0 = performance.now(), dur = 1200;
        (function tick(t) {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          en.target.textContent = Math.round(target * eased).toLocaleString();
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.4 });
    els.forEach(el => io.observe(el));
  }

  /* ================= SHOP ================= */
  const SECTION_META = {
    "polyberry": { title: "🍒 PolyBerry — Berries & Items", cls: "c-pink" },
    "polycare":  { title: "🩺 PolyCare — Services",          cls: "c-mauve" },
    "buying":    { title: "🧺 Buying — I'll pay you for…",   cls: "c-teal" }
  };
  function renderShop(rows) {
    const wrap = document.getElementById("shopGrid");
    wrap.innerHTML = "";
    const groups = {};
    const order = [];
    rows.forEach(r => {
      const key = (r[0] || "other").trim().toLowerCase();
      if (!groups[key]) { groups[key] = []; order.push(key); }
      groups[key].push(r);
    });
    order.forEach(key => {
      const meta = SECTION_META[key] || { title: "✿ " + (groups[key][0][0] || "Shop"), cls: "c-peach" };
      const card = document.createElement("div");
      card.className = "shop-card " + meta.cls;
      const items = groups[key].map(r =>
        '<li><span class="shop-item"><b>' + esc(r[1] || "") + "</b>" +
        (r[2] ? "<small>" + esc(r[2]) + "</small>" : "") +
        '</span><span class="shop-price">' + esc(r[3] || "") + "</span></li>"
      ).join("");
      card.innerHTML = "<h3>" + esc(meta.title) + '</h3><ul class="shop-list">' + items + "</ul>";
      wrap.appendChild(card);
    });
  }

  /* ================= staff key ================= */
  document.getElementById("staffKey").addEventListener("click", (e) => {
    e.preventDefault();
    window.open(CONFIG.STAFF_SHEET_URL, "_blank", "noopener");
  });

  /* ================= boot ================= */
  (async function init() {
    const [cal, stats, menu] = await Promise.all([
      loadTab(CONFIG.CALENDAR_CSV, materializeSample(CONFIG.SAMPLE.calendar)),
      loadTab(CONFIG.STATS_CSV, CONFIG.SAMPLE.stats),
      loadTab(CONFIG.MENU_CSV, CONFIG.SAMPLE.menu)
    ]);
    eventsByDay = {};
    cal.forEach(r => {
      const d = parseDate(r[0]);
      if (!d) return;
      const k = keyOf(d);
      (eventsByDay[k] = eventsByDay[k] || []).push({ title: r[1] || "Event", details: r[2] || "", color: r[3] || "" });
    });
    renderCalendar();
    renderStats(stats);
    renderShop(menu);
  })();
})();
