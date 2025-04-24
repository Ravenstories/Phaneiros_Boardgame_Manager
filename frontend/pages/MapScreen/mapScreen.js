// Refactored mapScreen.js — now anchors map at (0,0) so every tile is visible
// ================================================================
// 2025‑04‑24 (v2)
// • Two‑pass build: compute pixel bounds, then offset all tiles so the
//   smallest x/y start at 0,0 (no more "everything in the corner")
// • Keeps the fast DocumentFragment rendering & helper exports
// • No API changes for callers

import { fetchMapTiles } from "../../js/api/mapAPI.js";

/* ------------------------------------------------------------------
  CONFIG
------------------------------------------------------------------ */
const HEX_SIZE = 50;                    // tip‑to‑tip width  (px)
const HEX_GAP  = 4;                     // gap between tiles (px)

const TERRAIN_COLORS = {
  plains:   "#b5d99c",
  forest:   "#6fbf73",
  mountain: "#9b9b9b",
  water:    "#6fa8dc",
  desert:   "#e8d28b",
  default:  "#dddddd",
};

/* Derived metrics (point‑top orientation) */
const HEX_WIDTH  = HEX_SIZE;
const HEX_HEIGHT = (Math.sqrt(3) / 2) * HEX_SIZE;
const VERT_SPACING = 0.75 * HEX_SIZE;          // vertical step between rows

/* ------------------------------------------------------------------ */
const $container = document.getElementById("map-container");
if (!$container) throw new Error("[mapScreen] Missing <div id='map-container'>");
$container.style.position = "relative";        // ensure children are absolutely positioned

init().catch(console.error);

/* ------------------------------------------------------------------
  MAIN
------------------------------------------------------------------ */
async function init() {
  const gameId = getCurrentGameId();
  if (!gameId) return alert("No game selected – missing gameId param or localStorage entry");

  const tiles = await fetchMapTiles(gameId);
  if (!Array.isArray(tiles) || !tiles.length) return alert("No tiles returned for this game.");

  const built = preprocessTiles(tiles);           // adds pixel coords & tracks bounds
  renderTiles(built.tiles, built.bounds);
}

/* ------------------------------------------------------------------
  HELPERS
------------------------------------------------------------------ */
function getCurrentGameId() {
  return new URLSearchParams(location.search).get("gameId") || localStorage.getItem("currentGameId");
}

function axialToPixel(q, r) {
  return {
    x: HEX_WIDTH * (q + r / 2) + HEX_GAP * q,
    y: VERT_SPACING * r + HEX_GAP * r,
  };
}

function deriveCoords(label = "") {
  const m = /^([A-Za-z]+)(\d+)$/.exec(label.trim());
  if (!m) return { q: 0, r: 0 };
  const letters = m[1].toUpperCase();
  let r = 0;
  for (let i = 0; i < letters.length; i++) r = r * 26 + (letters.charCodeAt(i) - 64);
  r -= 1; // zero‑based
  return { q: Number(m[2]), r };
}

/**
 * First pass: enrich each tile with pixel coords and compute min/max bounds.
 */
function preprocessTiles(tiles) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  const enriched = tiles.map(t => {
    const { q: rawQ, r: rawR } = t;
    const { q, r } = rawQ == null || rawR == null ? deriveCoords(t.label) : { q: rawQ, r: rawR };
    const { x, y } = axialToPixel(q, r);

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);

    return { ...t, q, r, x, y };
  });

  return { tiles: enriched, bounds: { minX, minY, maxX, maxY } };
}

function renderTiles(tiles, bounds) {
  const frag = new DocumentFragment();
  const offsetX = -bounds.minX + HEX_GAP;   // add a little padding
  const offsetY = -bounds.minY + HEX_GAP;

  for (const t of tiles) {
    const div = document.createElement("div");
    div.className = "hex";
    div.textContent = t.label ?? "";

    div.style.cssText = `
      position:absolute;
      width:${HEX_SIZE}px;height:${HEX_HEIGHT}px;
      left:${t.x + offsetX}px;
      top:${t.y + offsetY}px;
      line‑height:${HEX_HEIGHT}px;
      background:${TERRAIN_COLORS[t.terrain_name] ?? TERRAIN_COLORS.default};
      clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
      user-select:none;
    `;

    div.addEventListener("click", () => showTileInfo(t));
    frag.append(div);
  }

  $container.replaceChildren(frag);
  resizeContainer(bounds, offsetX, offsetY);
}

function resizeContainer({ maxX, maxY, minX, minY }, offsetX, offsetY) {
  const width  = maxX - minX + HEX_SIZE + offsetX + HEX_GAP;
  const height = maxY - minY + HEX_HEIGHT + offsetY + HEX_GAP;
  $container.style.width  = `${width}px`;
  $container.style.height = `${height}px`;
}

function showTileInfo(t) {
  alert(`Territory: ${t.label}\nTerrain: ${t.terrain_name ?? "unknown"}\nCoords: q=${t.q}, r=${t.r}`);
}

/* ------------------------------------------------------------------
  TEST HOOKS
------------------------------------------------------------------ */
export const _internal = { axialToPixel, deriveCoords, preprocessTiles };
