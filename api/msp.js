// Vercel Serverless Function
// Attempts to read the official CACP MSP page server-side.
// The browser must not scrape CACP directly because the page may reject
// cross-origin browser requests. A verified official snapshot is returned
// if the upstream page is temporarily unavailable.

const FALLBACK = [
  { name:"Rice", icon:"🌾", season:"kharif", seasonLabel:"KHARIF", msp:2441, status:"MSP Declared", period:"2026–27" },
  { name:"Jute", icon:"🌿", season:"commercial", seasonLabel:"COMMERCIAL", msp:5925, status:"MSP Declared", period:"2026–27" },
  { name:"Maize", icon:"🌽", season:"kharif", seasonLabel:"KHARIF", msp:2410, status:"MSP Declared", period:"2026–27" },
  { name:"Wheat", icon:"🌾", season:"rabi", seasonLabel:"RABI", msp:2585, status:"MSP Declared", period:"2026–27" },
  { name:"Mustard", icon:"🌱", season:"rabi", seasonLabel:"RABI", msp:6200, status:"MSP Declared", period:"2026–27" },
  { name:"Groundnut", icon:"🥜", season:"kharif", seasonLabel:"KHARIF", msp:7517, status:"MSP Declared", period:"2026–27" },
  { name:"Sunflower", icon:"🌻", season:"kharif", seasonLabel:"KHARIF", msp:8343, status:"MSP Declared", period:"2026–27" },
  { name:"Gram", icon:"🫘", season:"rabi", seasonLabel:"RABI", msp:5875, status:"MSP Declared", period:"2026–27" }
];

const CACP_URL = "https://cacp.da.gov.in/Home/MSP";

const aliases = {
  paddy: "Rice",
  rice: "Rice",
  jute: "Jute",
  maize: "Maize",
  wheat: "Wheat",
  "rapeseed & mustard": "Mustard",
  "rapeseed/mustard": "Mustard",
  mustard: "Mustard",
  groundnut: "Groundnut",
  "sunflower seed": "Sunflower",
  sunflower: "Sunflower",
  gram: "Gram",
  chana: "Gram"
};

const meta = {
  Rice: ["🌾", "kharif", "KHARIF"],
  Jute: ["🌿", "commercial", "COMMERCIAL"],
  Maize: ["🌽", "kharif", "KHARIF"],
  Wheat: ["🌾", "rabi", "RABI"],
  Mustard: ["🌱", "rabi", "RABI"],
  Groundnut: ["🥜", "kharif", "KHARIF"],
  Sunflower: ["🌻", "kharif", "KHARIF"],
  Gram: ["🫘", "rabi", "RABI"]
};

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseOfficialPage(html) {
  const found = new Map();

  // CACP is a government-rendered HTML table. This parser deliberately
  // extracts only the crop names and MSP numbers we use in the MVP.
  const rowPattern = /<tr[\s\S]*?<\/tr>/gi;
  const cellPattern = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;

  for (const row of html.match(rowPattern) || []) {
    const cells = [];
    let match;
    while ((match = cellPattern.exec(row))) {
      cells.push(normalize(match[1].replace(/<[^>]+>/g, " ")));
    }

    if (cells.length < 2) continue;

    const text = cells.join(" | ");
    let crop = null;

    for (const alias of Object.keys(aliases)) {
      if (text.includes(alias)) {
        crop = aliases[alias];
        break;
      }
    }

    if (!crop) continue;

    // Pick a rupee/integer-looking cell. Avoid years and percentage cells.
    const candidates = cells
      .map(cell => cell.replace(/,/g, "").match(/(?:^|\s)(\d{3,5})(?:\s|$)/))
      .filter(Boolean)
      .map(match => Number(match[1]))
      .filter(n => n >= 1000 && n <= 20000 && n !== 2024 && n !== 2025 && n !== 2026 && n !== 2027);

    if (!candidates.length) continue;

    // For the 2026–27 table, the first qualifying price is the MSP.
    found.set(crop, candidates[0]);
  }

  if (found.size < 3) return null;

  return FALLBACK.map(item => ({
    ...item,
    msp: found.get(item.name) || item.msp
  }));
}

module.exports = async function handler(req, res) {
  try {
    const upstream = await fetch(CACP_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; CropProcurementMVP/1.0)",
        "Accept": "text/html,application/xhtml+xml"
      }
    });

    if (upstream.ok) {
      const html = await upstream.text();
      const parsed = parseOfficialPage(html);

      if (parsed) {
        return res.status(200).json({
          source: CACP_URL,
          sourceStatus: "live",
          updatedAt: new Date().toISOString(),
          crops: parsed
        });
      }
    }

    return res.status(200).json({
      source: CACP_URL,
      sourceStatus: "official-fallback",
      updatedAt: "2026–27 official snapshot",
      crops: FALLBACK
    });
  } catch (error) {
    return res.status(200).json({
      source: CACP_URL,
      sourceStatus: "official-fallback",
      updatedAt: "2026–27 official snapshot",
      crops: FALLBACK
    });
  }
};
