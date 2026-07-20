/* ============================================================
   Polymnia's Berry Garden | site configuration
   ------------------------------------------------------------
   Every visible feature is editable from your Google Sheet:
     Site tab     → headers, taglines, little lines (Key | Text)
     Calendar tab → calendar events
     Stats tab    → public counters
     Menu tab     → shop sections, items, prices (feeds the order form!)
     Almanac tab  → the berry almanac
     Guide tab    → guide chapters
     Links tab    → tools & resources

   Publish each tab to the web as CSV (File → Share → Publish to web,
   pick the tab, format CSV) and paste the links below. Empty links
   fall back to the built-in sample data so the site always works.

   ORDERS: create a Google Form with 5 short-answer questions
   (IGN, Item, Amount, Estimated Total, Notes), link its responses to
   your spreadsheet, then fill in ORDER_FORM below | full steps in
   README.md. Until then, the order button shows a copy-able order
   the customer can mail to you in game.
   ============================================================ */

const CONFIG = {
  SITE_CSV: "",
  CALENDAR_CSV: "",
  STATS_CSV: "",
  MENU_CSV: "",
  ALMANAC_CSV: "",
  GUIDE_CSV: "",
  LINKS_CSV: "",

  // the discrete 🔑 in the footer → your private tracker (Google login protects it)
  STAFF_SHEET_URL: "https://docs.google.com/spreadsheets/d/1BXtlREX7WGwR53pLX_P3c-W0iYYq_kqoQIlaOhabyug/edit",

  // Google Form plumbing for orders (see README → "Orders")
  ORDER_FORM: {
    FORM_ID: "",        // the long id from .../forms/d/e/FORM_ID/viewform
    ENTRY_IGN: "",      // e.g. "entry.1234567890"
    ENTRY_ITEM: "",
    ENTRY_QTY: "",
    ENTRY_TOTAL: "",
    ENTRY_NOTES: ""
  },

  SAMPLE: {
    /* ---- Site text overrides: Key | Text (edit in the Site tab) ---- */
    site: [],

    calendar: [
      ["{Y}-{M}-05", "Leppa harvest day 🍒", "Big harvest across the Leppa alts | fresh stock in the evening!", "pink"],
      ["{Y}-{M}-08", "Seed run 🌱", "Spicy & sweet seed alts get tooled today.", "teal"],
      ["{Y}-{M}-12", "GTL restock 🛍", "Leppas + EV berries relisted on the GTL.", "mauve"],
      ["{Y}-{M}-14", "EV training slots open 🩺", "PolyCare taking 3 EV training orders | first come first serve.", "pink"],
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

    /* Section, Item, Details, Price | the order form reads unit prices
       from here (first number in the Price cell). */
    menu: [
      ["PolyBerry", "Leppa Berry", "per berry · 65,000 P¥ per stack", "650 P¥"],
      ["PolyBerry", "PP Max", "", "15,000 P¥"],
      ["PolyBerry", "EV Reduction Berries", "Pomeg, Kelpsy, Qualot, Hondew, Grepa, Tamato", "700 P¥"],
      ["PolyBerry", "Status & Healing Berries", "Oran, Persim, Cheri, Rawst, Pecha, Aspear, Chesto", "600 P¥"],
      ["PolyBerry", "Lum & Sitrus", "", "800 P¥"],
      ["PolyBerry", "Happiness Berries", "Figy, Wiki, Mago, Aguav, Iapapa", "900 P¥"],
      ["PolyBerry", "Resistance Berries", "all 17 type-resist berries", "900 P¥"],
      ["PolyBerry", "Battle Berries", "Liechi, Ganlon, Salac, Petaya & friends", "900 P¥"],
      ["PolyCare", "EV Training (no Link)", "without Training Link", "20,000 P¥"],
      ["PolyCare", "EV Training (with Link)", "with Training Link", "25,000 P¥"],
      ["PolyCare", "EXP Training", "0.15 P¥ per EXP | amount = EXP", "0.15 P¥"],
      ["PolyCare", "Eevee Fruit Salad", "EV correction during training", "10,000 P¥"],
      ["Buying", "Leppa Berries", "stocking | always buying", "650 P¥"],
      ["Buying", "Fresh Amulet Coins", "", "GTL + 3,000 P¥"],
      ["Buying", "Male Field Boxes", "♂ field breeders", "140,000 P¥"],
      ["Buying", "Ditto Boxes", "", "330,000 P¥"],
      ["Buying", "Female Alpha Eevolutions", "any female Alpha Eevee or line", "50,000 P¥"]
    ],

    /* Order (number), Title, Body, Badge | edit in the Guide tab */
    guide: [
      [1, "“So I want to try berry farming?”", "Berry farming in PokeMMO is an investment of time and money, not instant profit. You'll follow a schedule: plant, water, harvest, repeat. To start you need three things | (1) a region with Berry Plots unlocked: Unova's Mistralton City Airport (72 plots, pre-G6) or Abundant Shrine (84 plots, post-E4), or Hoenn's Rt. 104 / 120 / 123 (33 small plots). (2) A Watering Pail from the gardening NPC (Mistralton Airport, or the Pretty Petal Flower Shop on Rt. 104). (3) Seeds | from the GTL, from tooling berries, or Pickup. Optional but lovely: Surf/Fly, an Intimidate lead with a Cleanse Tag, pokéyen, time… and sanity.", "start here"],
      [2, "Berries & Seeds 101", "There are 64 unique berries: HP/PP restoring, status curing, EV reducing, stat boosting, and cash crops. There are 5 seed flavors (Spicy, Dry, Sweet, Bitter, Sour) each in Plain and Very varieties | a combination of 3 seeds in a plot grows one plant, and plots remember your last combo for mass planting. Harvesting a berry with a Harvesting Tool ($350 each, one per berry) returns a seed of its flavor with about a 30% chance of the Very variant | that 3:7 ratio is the heartbeat of the whole economy.", "basics"],
      [3, "Watering 101", "Every fresh plant starts with two water droplets | roughly 7 hours of moisture. Never let a plant sit dry for 12 hours or it wilts. Put the pail on your hotbar (saves ~5 minutes per half region!). A ripe plant holds full yield for 7 hours, then loses yield per hour | plan harvests inside that window. Fastest to slowest: watering, planting, harvesting; plant-and-water each plot before moving to the next.", "basics"],
      [4, "Option A | Simple Cheri", "The gentle start: one seed type, no ratios, a 16-hour clock. Plant 3× Plain Spicy seeds → Cheri plant, harvestable in 16h, yielding 3–6 berries (avg 4.5). Water schedule: plant + water immediately, wait 4h+, water again (2 waterings) | or wait 4–7h, water once, harvest. Tool every Cheri: keep the Very Spicy seeds (the money-makers | Leppa farmers buy them), replant with the Plains, and sell the extras. Your first harvest runs negative; you're in profit by day 2–3.", "16h"],
      [5, "Option B | Leppa Purist", "Maximum directness: buy seeds, grow Leppas, sell Leppas. Each plant takes 1 Very Spicy + 1 Plain Sweet + 1 Plain Bitter, grows in 20 hours, and yields 5–7 (avg 6). Water at plant, then again 8–12h later | most purists plant before bed and water on waking. No Harvesting Tools involved, but GTL fees and seed-market swings eat margins: buy seeds low, sell Leppas high, and consider selling stacks privately (~700/berry) to skip fees.", "20h"],
      [6, "Option C | Leppa Fundamentals", "Full self-sufficiency: grow the seeds AND the Leppas. The Golden Leppa Ratio | 1 Pecha : 1 Rawst : 1.85 Cheri : 2.5 Leppa (round Cheri to 2) | keeps your Very Spicy supply flowing. Replant Cheri with 3× Plain Spicy; replant Rawst/Pecha with 1 Very + 1 Plain of their flavor to bank Plains for Leppa planting. Run the 16h trio and the 20h Leppas on offset schedules (2–3 waterings a day) and you generate Leppas perpetually. And remember: you NEVER tool a Leppa… unless, I don't know, you're a savage.", "20h"],
      [7, "Mind the GTL fees", "Listing an item costs $100 per unit; if the unit price is over $2,000 the fee is 5% of asking; fees cap at $25,000 for prices over $500,000. Fees are why private stack sales and bulk deals often beat the GTL | practice good business sense.", "economy"],
      [8, "Farmhand", "Coming soon | scaling up: multi-alt rotations, mailing pipelines, and market timing. 🌱", "coming soon"],
      [9, "Cropmaster", "Coming soon | for the veterans, number crunchers, and Ironmon masochists: Sinnoh's 102 scattered plots, shunting, and maximum-profit spreadsheeting. 👑", "coming soon"]
    ],

    /* Label, URL, Note | edit in the Links tab */
    links: [
      ["Berry Watering Tracker", "https://pokemmohub.com/tools/berries/", "Free PokeMMO Hub tool | track your berries & watering times anywhere, no login to the game needed."],
      ["Berry Plot Calculator", "https://public.tableau.com/app/profile/noonan.2579/viz/LeppaGuide_17205575268670/Dashboard1", "Noonan's Leppa dashboard | crunch plots, seeds & profits."],
      ["Poly's Berries | full charts", "https://docs.google.com/spreadsheets/d/1BXtlREX7WGwR53pLX_P3c-W0iYYq_kqoQIlaOhabyug/edit?usp=sharing", "Every berry, combination & watering time, lovingly charted."],
      ["Better Water Levels mod", "https://forums.pokemmo.com/index.php?/topic/187702-pc-mobile-better-water-levels/", "PC & mobile mod | see water droplets at a glance."],
      ["PokeMMO Wiki | Berries", "https://pokemmo.fandom.com/wiki/Berries", "Community wiki reference for berries & seeds."],
      ["The Berry Farming Guide", "https://forums.pokemmo.eu/index.php?/topic/62262-the-berry-farming-guide/", "xStarr's classic forum guide."],
      ["Advanced Berry Guide", "https://forums.pokemmo.eu/index.php?/topic/62683-advanced-berry-guide/", "LuciusTellus' deep-dive for the hardcore."]
    ]
  }
};
