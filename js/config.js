/* ============================================================
   Polymnia's Berry Garden — site configuration
   ------------------------------------------------------------
   HOW TO CONNECT YOUR GOOGLE SHEET (5 minutes):
   1. Import WebsiteData.xlsx into Google Sheets
      (drive.google.com → New → File upload → open with Google Sheets).
   2. In the Google Sheet: File → Share → Publish to web.
   3. Under "Link", pick the *Calendar* tab, format = CSV, click Publish,
      copy the link and paste it into CALENDAR_CSV below.
   4. Repeat for the Stats tab → STATS_CSV, and the Menu tab → MENU_CSV.
   5. Put your private tracker tabs in the same file if you like —
      only the tabs you explicitly publish become visible. Never
      publish tabs with client names or private data.

   While the three URLs are empty, the site shows the built-in
   sample data, so you can preview everything right away.
   ============================================================ */

const CONFIG = {
  // published-to-web CSV links (one per tab) — paste yours here:
  CALENDAR_CSV: "",
  STATS_CSV: "",
  MENU_CSV: "",

  // the discrete 🔑 in the footer opens this (Google handles the login —
  // only you can get in). Point it at your private tracker sheet:
  STAFF_SHEET_URL: "https://docs.google.com/spreadsheets/d/1BXtlREX7WGwR53pLX_P3c-W0iYYq_kqoQIlaOhabyug/edit",

  // fallback sample data (used until the CSV links above are filled in)
  SAMPLE: {
    calendar: [
      // date (YYYY-MM-DD), title, details, color: pink | mauve | teal
      ["{Y}-{M}-05", "Leppa harvest day 🍒", "Big harvest across the Leppa alts — fresh stock in the evening!", "pink"],
      ["{Y}-{M}-08", "Seed run 🌱", "Spicy & sweet seed alts get tooled today.", "teal"],
      ["{Y}-{M}-12", "GTL restock 🛍", "Leppas + EV berries relisted on the GTL.", "mauve"],
      ["{Y}-{M}-14", "EV training slots open 🩺", "PolyCare taking 3 EV training orders — first come first serve.", "pink"],
      ["{Y}-{M}-20", "Apricorn trade day 🍑", "Trading in the apricorn stash in Johto.", "teal"],
      ["{Y}-{M}-26", "Shop maintenance ✨", "Prices reviewed & menu updated.", "mauve"]
    ],
    stats: [
      ["🌾", "Accounts Farmed", 14],
      ["🍒", "Leppas Farmed", 128500],
      ["🫐", "Berries Farmed", 342000],
      ["🌱", "Seeds Collected", 96400],
      ["🩺", "EVs Trained", 260],
      ["🤝", "Trades Completed", 1180]
    ],
    menu: [
      // section, item, details, price   (sections: PolyBerry, PolyCare, Buying)
      ["PolyBerry", "Leppa Berry", "per berry · 65,000 P¥ per stack", "650 P¥"],
      ["PolyBerry", "PP Max", "", "15,000 P¥"],
      ["PolyBerry", "EV Reduction Berries", "Pomeg, Kelpsy, Qualot, Hondew, Grepa, Tamato", "700 P¥"],
      ["PolyBerry", "Status & Healing Berries", "Oran, Persim, Cheri, Rawst, Pecha, Aspear, Chesto", "600 P¥"],
      ["PolyBerry", "Lum & Sitrus", "", "800 P¥"],
      ["PolyBerry", "Happiness Berries", "Figy, Wiki, Mago, Aguav, Iapapa", "900 P¥"],
      ["PolyBerry", "Resistance Berries", "all 17 type-resist berries", "900 P¥"],
      ["PolyBerry", "Battle Berries", "Liechi, Ganlon, Salac, Petaya & friends", "900 P¥"],
      ["PolyCare", "EV Training", "without Training Link", "20,000 P¥"],
      ["PolyCare", "EV Training", "with Training Link", "25,000 P¥"],
      ["PolyCare", "EXP Training", "0.15 P¥ per EXP", "from 90,000 P¥"],
      ["PolyCare", "Eevee Fruit Salad", "EV correction during training", "10,000 P¥"],
      ["Buying", "Leppa Berries", "stocking — always buying", "+650 P¥ · +65,000/stack"],
      ["Buying", "Fresh Amulet Coins", "", "GTL + 3,000 P¥"],
      ["Buying", "Male Field Boxes", "♂ field breeders", "+140,000 P¥"],
      ["Buying", "Ditto Boxes", "", "+330,000 P¥"],
      ["Buying", "Female Alpha Eevolutions", "any female Alpha Eevee or line", "+50,000 P¥"]
    ]
  }
};
