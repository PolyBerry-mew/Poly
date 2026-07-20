# ✿ Polymnia's Berry Garden — Team Méw website

A cute Catppuccin-Mocha site for the shop: art, a garden calendar with hover
details, farm stats counters, and the PolyBerry / PolyCare / Buying menus —
all editable from a Google Sheet you control.

## 1 · Put it on GitHub Pages (free)

1. Create a GitHub account if needed, then a new repository
   (name idea: `berry-garden`). Keep it **Public**.
2. Upload everything in this folder (`index.html`, `css/`, `js/`, `assets/`)
   to the repository root — drag & drop works on github.com.
3. Repo → **Settings → Pages** → Source: *Deploy from a branch* →
   Branch: `main`, folder `/ (root)` → Save.
4. After a minute your site is live at
   `https://<your-username>.github.io/berry-garden/`.

The site works immediately with built-in sample data.

## 2 · Hook up your Google Sheet (your editing interface)

1. Go to Google Drive → New → File upload → upload **WebsiteData.xlsx** →
   open it with Google Sheets. This is now your website control panel:
   * **Calendar** tab → what shows on the calendar (Date, Title, Details, Color)
   * **Stats** tab → the public counters (Emoji, Label, Value)
   * **Menu** tab → shop sections & prices (Section, Item, Details, Price)
2. In the Google Sheet: **File → Share → Publish to web**.
   Under *Link*, choose the **Calendar** tab, format **CSV** → Publish → copy the URL.
3. Open `js/config.js` in your repo (pencil icon to edit) and paste it into
   `CALENDAR_CSV: "..."`. Repeat for **Stats** → `STATS_CSV` and
   **Menu** → `MENU_CSV`. Commit.
4. Edit the sheet any time — the site updates on refresh (Google can take a
   couple of minutes to refresh published CSVs).

### The discrete 🔑
Bottom-right of the footer. It opens `STAFF_SHEET_URL` from `config.js` —
point it at your **private tracker sheet** (PolySheet). Google's own login
protects it, so only you get in. Visitors just see a tiny key.

## 3 · Privacy notes (important!)

* Only the tabs you explicitly *Publish to web* are public. Keep the tracker,
  seller log, and anything with names in **unpublished** tabs or a separate
  private sheet.
* Never put client names or private data in the Calendar/Stats/Menu tabs —
  they are readable by anyone once published.

## Files

```
index.html        the page
css/style.css     soft mocha theme
js/config.js      ← the only file you edit (sheet links)
js/app.js         calendar, tooltips, counters, shop
assets/           your art (banner, garden, chibis, menu card)
WebsiteData.xlsx  → import into Google Sheets (your control panel)
```

Calendar tips: dates as `YYYY-MM-DD` (or `M/D/YYYY`); Color column accepts
`pink`, `mauve`, or `teal` for the berry dot. Multiple events on the same
day all show in the hover card. Scroll or use ‹ › to move between months.
