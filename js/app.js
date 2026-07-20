/* Polymnia's Berry Garden | app logic v2 */
(function () {
  "use strict";

  /* ---------------- CSV parsing ---------------- */
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
    return rows.filter(r => r.some(c => String(c).trim() !== ""));
  }

  async function loadTab(url, fallbackRows) {
    if (!url) return fallbackRows;
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(res.status);
      const rows = parseCSV(await res.text());
      rows.shift();
      return rows.length ? rows : fallbackRows;
    } catch (e) {
      console.warn("Sheet tab unavailable, using sample data:", e);
      return fallbackRows;
    }
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* ---------------- site text overrides ---------------- */
  function applySiteText(rows) {
    const map = {};
    rows.forEach(r => { if (r[0] && String(r[1] || "").trim() !== "") map[String(r[0]).trim()] = r[1]; });
    document.querySelectorAll("[data-txt]").forEach(el => {
      const k = el.dataset.txt;
      if (map[k] != null) el.textContent = map[k];
    });
  }

  /* ---------------- dates ---------------- */
  function parseDate(s) {
    s = (s || "").trim();
    let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
    m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m) return new Date(+m[3], +m[1] - 1, +m[2]);
    const d = new Date(s);
    return isNaN(d) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  const keyOf = d => d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

  function materializeSample(rows) {
    const now = new Date();
    const Y = now.getFullYear(), M = String(now.getMonth() + 1).padStart(2, "0");
    return rows.map(r => [String(r[0]).replace("{Y}", Y).replace("{M}", M), r[1], r[2], r[3]]);
  }

  /* ================= CALENDAR ================= */
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const grid = document.getElementById("calGrid");
  const calTitle = document.getElementById("calTitle");
  const tip = document.getElementById("calTip");
  const frame = document.querySelector(".cal-frame");
  let view = new Date(); view.setDate(1);
  let eventsByDay = {};
  let openTipCell = null;

  function colorClass(c) {
    c = (c || "").toLowerCase();
    if (c.includes("mauve") || c.includes("purple")) return "b2";
    if (c.includes("teal") || c.includes("green")) return "b3";
    return "";
  }

  function renderCalendar() {
    calTitle.textContent = MONTHS[view.getMonth()] + " " + view.getFullYear();
    grid.innerHTML = "";
    hideTip();
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
        cell.addEventListener("mouseenter", () => showTip(cell, evs));
        cell.addEventListener("mouseleave", hideTip);
        cell.addEventListener("focus", () => showTip(cell, evs));
        cell.addEventListener("blur", hideTip);
        cell.addEventListener("click", (e) => {         // touch: tap toggles
          e.stopPropagation();
          if (openTipCell === cell) hideTip();
          else showTip(cell, evs);
        });
      }
      grid.appendChild(cell);
    }
  }

  function showTip(cell, evs) {
    openTipCell = cell;
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
  function hideTip() { tip.hidden = true; openTipCell = null; }
  document.addEventListener("click", (e) => {
    if (!tip.hidden && !frame.contains(e.target)) hideTip();
  });

  function step(n) { view.setMonth(view.getMonth() + n); renderCalendar(); }
  document.getElementById("calPrev").addEventListener("click", () => step(-1));
  document.getElementById("calNext").addEventListener("click", () => step(1));
  let wheelLock = 0;
  frame.addEventListener("wheel", (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now - wheelLock < 450) return;
    wheelLock = now;
    step(e.deltaY > 0 ? 1 : -1);
  }, { passive: false });

  /* ================= ALMANAC ================= */
  let almanacRows = [];
  const almGrid = document.getElementById("almGrid");
  const almSearch = document.getElementById("almSearch");
  const almChips = document.getElementById("almChips");
  const almCount = document.getElementById("almCount");
  let almTime = "";

  const TIME_CLS = { "16h": "t16", "20h": "t20", "42h": "t42", "44h": "t42", "67h": "t67" };

  function renderAlmanac() {
    const q = (almSearch.value || "").toLowerCase().trim();
    const times = almTime ? almTime.split(",") : null;
    let shown = 0;
    almGrid.innerHTML = "";
    almanacRows.forEach(r => {
      const [name, effect, combo, yld, time] = r;
      if (times && !times.includes(String(time).trim())) return;
      if (q && !(String(name) + " " + effect + " " + combo).toLowerCase().includes(q)) return;
      shown++;
      const card = document.createElement("article");
      card.className = "alm-card";
      card.innerHTML =
        '<div class="alm-top"><h3>' + esc(name) + ' <span class="alm-berry-emoji">🍒</span></h3>' +
        '<span class="time-badge ' + (TIME_CLS[String(time).trim()] || "") + '">' + esc(time) + "</span></div>" +
        '<p class="alm-effect">' + esc(effect) + "</p>" +
        '<p class="alm-combo">🌱 ' + esc(combo) + "</p>" +
        '<p class="alm-yield">yield ' + esc(yld) + "</p>";
      almGrid.appendChild(card);
    });
    almCount.textContent = shown + " of " + almanacRows.length + " berries";
  }
  almSearch.addEventListener("input", renderAlmanac);
  almChips.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    almChips.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    almTime = btn.dataset.time;
    renderAlmanac();
  });

  /* ================= GUIDE ================= */
  function renderGuide(rows) {
    const list = document.getElementById("guideList");
    list.innerHTML = "";
    rows
      .slice()
      .sort((a, b) => (Number(a[0]) || 0) - (Number(b[0]) || 0))
      .forEach((r, i) => {
        const [, title, body, badge] = r;
        const det = document.createElement("details");
        det.className = "guide-item" + (/coming soon/i.test(badge || "") ? " tbc" : "");
        if (i === 0) det.open = true;
        det.innerHTML =
          "<summary><span class='guide-t'>" + esc(title) + "</span>" +
          (badge ? "<span class='guide-badge'>" + esc(badge) + "</span>" : "") +
          "</summary><div class='guide-body'>" +
          esc(body).split(/\n+/).map(p => "<p>" + p + "</p>").join("") +
          "</div>";
        list.appendChild(det);
      });
  }

  /* ================= LINKS ================= */
  function renderLinks(rows) {
    const wrap = document.getElementById("linksGrid");
    wrap.innerHTML = "";
    rows.forEach(r => {
      const [label, url, note] = r;
      if (!label || !url) return;
      const a = document.createElement("a");
      a.className = "link-card";
      a.href = url; a.target = "_blank"; a.rel = "noopener";
      a.innerHTML = "<h3>" + esc(label) + " <span aria-hidden='true'>↗</span></h3>" +
        (note ? "<p>" + esc(note) + "</p>" : "");
      wrap.appendChild(a);
    });
  }

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
    "polyberry": { title: "🍒 PolyBerry | Berries & Items", cls: "c-pink" },
    "polycare":  { title: "🩺 PolyCare | Services",          cls: "c-mauve" },
    "buying":    { title: "🧺 Buying | I'll pay you for…",   cls: "c-teal" }
  };
  function renderShop(rows) {
    const wrap = document.getElementById("shopGrid");
    wrap.innerHTML = "";
    const groups = {}, order = [];
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

  /* ================= ORDER FORM ================= */
  const ordItem = document.getElementById("ordItem");
  const ordQty = document.getElementById("ordQty");
  const ordIGN = document.getElementById("ordIGN");
  const ordNotes = document.getElementById("ordNotes");
  const ordTotal = document.getElementById("ordTotal");
  const ordStatus = document.getElementById("ordStatus");
  const ordFallback = document.getElementById("ordFallback");
  const ordText = document.getElementById("ordText");
  let menuIndex = [];   // {label, section, unit (number|null), priceText}

  function unitPrice(priceText) {
    // first number in the cell, commas allowed; null if "GTL"-style quote
    const t = String(priceText || "");
    if (/gtl/i.test(t)) return null;
    const m = t.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
    return m ? Number(m[1]) : null;
  }

  function buildOrderItems(rows) {
    menuIndex = [];
    ordItem.innerHTML = "";
    const groups = {};
    rows.forEach(r => {
      const sec = (r[0] || "Other").trim();
      (groups[sec] = groups[sec] || []).push(r);
    });
    Object.keys(groups).forEach(sec => {
      const og = document.createElement("optgroup");
      og.label = /buying/i.test(sec) ? sec + " (you sell to Poly)" : sec;
      groups[sec].forEach(r => {
        const idx = menuIndex.length;
        menuIndex.push({ label: r[1] || "", section: sec, unit: unitPrice(r[3]), priceText: r[3] || "" });
        const opt = document.createElement("option");
        opt.value = idx;
        opt.textContent = (r[1] || "") + (r[3] ? " | " + r[3] : "");
        og.appendChild(opt);
      });
      ordItem.appendChild(og);
    });
    updateTotal();
  }

  function currentOrder() {
    const it = menuIndex[Number(ordItem.value)] || null;
    const qty = Math.max(1, Math.floor(Number(ordQty.value) || 1));
    let total = null;
    if (it && it.unit != null) total = it.unit * qty;
    return { it, qty, total };
  }

  function fmtYen(n) {
    return n.toLocaleString(undefined, { maximumFractionDigits: 2 }) + " P¥";
  }

  function updateTotal() {
    const { it, total } = currentOrder();
    if (!it) { ordTotal.textContent = " | "; return; }
    ordTotal.textContent = total != null ? fmtYen(total) : it.priceText + " (ask Poly)";
  }
  ordItem.addEventListener("change", updateTotal);
  ordQty.addEventListener("input", updateTotal);

  function orderSummary() {
    const { it, qty, total } = currentOrder();
    return [
      "✿ Berry Garden order ✿",
      "IGN: " + (ordIGN.value.trim() || " | "),
      "Item: " + (it ? it.label + " (" + it.section + ")" : " | "),
      "Amount: " + qty,
      "Estimated total: " + (total != null ? fmtYen(total) : (it ? it.priceText + " (quote)" : " | ")),
      ordNotes.value.trim() ? "Notes: " + ordNotes.value.trim() : ""
    ].filter(Boolean).join("\n");
  }

  document.getElementById("ordSubmit").addEventListener("click", async () => {
    ordStatus.textContent = "";
    ordFallback.hidden = true;
    if (!ordIGN.value.trim()) {
      ordStatus.textContent = "Please add your in-game name so Poly can find you! ✿";
      ordIGN.focus();
      return;
    }
    const { it, qty, total } = currentOrder();
    if (!it) { ordStatus.textContent = "Pick something from the menu first 🍓"; return; }
    const f = CONFIG.ORDER_FORM || {};
    if (f.FORM_ID && f.ENTRY_IGN && f.ENTRY_ITEM) {
      try {
        const body = new FormData();
        body.append(f.ENTRY_IGN, ordIGN.value.trim());
        body.append(f.ENTRY_ITEM, it.label + " (" + it.section + ")");
        if (f.ENTRY_QTY) body.append(f.ENTRY_QTY, String(qty));
        if (f.ENTRY_TOTAL) body.append(f.ENTRY_TOTAL, total != null ? fmtYen(total) : it.priceText + " (quote)");
        if (f.ENTRY_NOTES) body.append(f.ENTRY_NOTES, ordNotes.value.trim());
        await fetch("https://docs.google.com/forms/d/e/" + f.FORM_ID + "/formResponse",
          { method: "POST", mode: "no-cors", body });
        ordStatus.textContent = "Order sent to the garden! 🌸 Poly will reach out in game.";
        ordQty.value = 1; ordNotes.value = "";
        updateTotal();
      } catch (e) {
        ordStatus.textContent = "Hmm, the carrier Pidgey got lost | use the copy option below instead.";
        ordText.textContent = orderSummary();
        ordFallback.hidden = false;
      }
    } else {
      ordText.textContent = orderSummary();
      ordFallback.hidden = false;
      ordStatus.textContent = "";
    }
  });

  document.getElementById("ordCopy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(ordText.textContent);
      ordStatus.textContent = "Copied! Mail it to Poly in game 💌";
    } catch (e) {
      ordStatus.textContent = "Select the text above and copy it manually 💌";
    }
  });

  /* ================= staff key ================= */
  document.getElementById("staffKey").addEventListener("click", (e) => {
    e.preventDefault();
    window.open(CONFIG.STAFF_SHEET_URL, "_blank", "noopener");
  });

  /* ================= boot ================= */
  (async function init() {
    const S = CONFIG.SAMPLE;
    const [site, cal, stats, menu, almanac, guide, links] = await Promise.all([
      loadTab(CONFIG.SITE_CSV, S.site),
      loadTab(CONFIG.CALENDAR_CSV, materializeSample(S.calendar)),
      loadTab(CONFIG.STATS_CSV, S.stats),
      loadTab(CONFIG.MENU_CSV, S.menu),
      loadTab(CONFIG.ALMANAC_CSV, window.ALMANAC_FALLBACK || []),
      loadTab(CONFIG.GUIDE_CSV, S.guide),
      loadTab(CONFIG.LINKS_CSV, S.links)
    ]);
    applySiteText(site);
    eventsByDay = {};
    cal.forEach(r => {
      const d = parseDate(r[0]);
      if (!d) return;
      const k = keyOf(d);
      (eventsByDay[k] = eventsByDay[k] || []).push({ title: r[1] || "Event", details: r[2] || "", color: r[3] || "" });
    });
    renderCalendar();
    almanacRows = almanac;
    renderAlmanac();
    renderGuide(guide);
    renderLinks(links);
    renderStats(stats);
    renderShop(menu);
    buildOrderItems(menu);
  })();
})();
