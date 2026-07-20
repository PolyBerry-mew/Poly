# ✿ Polymnia's Berry Garden | Team Méw website

A cute Catppuccin-Mocha site for the shop: art, a garden calendar with hover
details, a 64-berry almanac, Poly's farming guide, farm stats, the shop menus,
and an order form | every word and price editable from your Google Sheet.

## 1 · Put it on GitHub Pages (free)

1. Create a GitHub account, then a new **Public** repository (e.g. `berry-garden`).
2. Upload everything in this folder (`index.html`, `css/`, `js/`, `assets/`)
   to the repository root | drag & drop on github.com works.
3. Repo → **Settings → Pages** → Source: *Deploy from a branch* →
   Branch `main`, folder `/ (root)` → Save.
4. Your site goes live at `https://<username>.github.io/berry-garden/` in ~1 min.

The site works immediately with built-in sample data (including the full almanac).

## 2 · Hook up your Google Sheet (your editing interface)

1. Google Drive → New → File upload → **WebsiteData.xlsx** → open with
   Google Sheets. Tabs:
   * **Site** | every header & little line on the page (Key | Text)
   * **Calendar** | events (hover details, dot color)
   * **Stats** | public counters (no client names!)
   * **Menu** | shop sections & prices; also powers the order form
   * **Almanac** | the berry almanac (64 rows pre-filled)
   * **Guide** | guide chapters (badge `coming soon` = to-be-continued)
   * **Links** | Tools & Resources cards
2. **File → Share → Publish to web** → under *Link* pick a tab, format
   **CSV**, Publish, copy the URL.
3. Edit `js/config.js` in your repo and paste each URL into the matching
   `*_CSV` slot (SITE_CSV, CALENDAR_CSV, STATS_CSV, MENU_CSV, ALMANAC_CSV,
   GUIDE_CSV, LINKS_CSV). Commit.
4. Edit the sheet any time | the site updates on refresh (published CSVs can
   take a couple of minutes to catch up).

## 3 · Orders → straight into your sheet

The order form auto-calculates totals from the **Menu** tab (first number in
the Price cell × amount). To receive orders:

1. Create a **Google Form** with five *Short answer* questions, in this order:
   `IGN`, `Item`, `Amount`, `Estimated Total`, `Notes`.
2. In the Form's **Responses** tab click the green Sheets icon →
   *Select existing spreadsheet* → pick your WebsiteData sheet.
   Orders now pop up there as a new "Form Responses" tab. ✨
3. Get the entry IDs: Form → ⋮ → **Get pre-filled link** → type something in
   every field → *Get link* → copy it. The URL contains pieces like
   `entry.1234567890=...` | one per question, in order.
4. In `js/config.js` fill `ORDER_FORM`:
   * `FORM_ID` | the long id from the form URL `…/forms/d/e/FORM_ID/viewform`
   * `ENTRY_IGN`, `ENTRY_ITEM`, `ENTRY_QTY`, `ENTRY_TOTAL`, `ENTRY_NOTES` | the `entry.…` codes in the same order as your questions.

Until the form is configured, the Send button shows a tidy order summary the
customer can copy and mail to you in game | nothing breaks.

Tip: keep Form availability on "Accepting responses" and turn OFF
"Require sign-in" so players without Google accounts can order.

## 4 · The discrete 🔑

Bottom-right of the footer. Opens `STAFF_SHEET_URL` from `config.js` | point
it at your **private tracker sheet**. Google's login protects it; visitors
just see a tiny key.

## 5 · Privacy notes

* Only tabs you explicitly *Publish to web* are public. Keep the tracker,
  seller log, and anything with names unpublished or in a separate sheet.
* The Form Responses tab is private automatically (it's only published if you
  publish it | don't!).

## Files

```
index.html          the page
css/style.css       soft mocha theme (mobile-friendly)
js/config.js        ← the file you edit (sheet links + order form)
js/app.js           calendar, almanac, guide, order form, counters
js/almanac-data.js  built-in berry data (fallback for the Almanac tab)
assets/             your art
WebsiteData.xlsx    → import into Google Sheets (your control panel)
```
