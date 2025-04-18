// frontend/pages/MapScreen/hex_map.js

const HEX_SIZE = 40;
const WIDTH = HEX_SIZE * 2;
const HEIGHT = Math.sqrt(3) * HEX_SIZE;

const TERRAIN_COLORS = {
  Plains:   '#aaa',
  Forest:   '#2e8b57',
  Hill:     '#a0522d',
  Mountain: '#696969',
  Water:    '#1e90ff',
};

/**
 * Calculate the corner point of a hexagon.
 * @param {number} cx - center x
 * @param {number} cy - center y
 * @param {number} i  - corner index (0–5)
 * @returns {{x:number,y:number}}
 */
function hexCorner(cx, cy, i) {
  const angleDeg = 60 * i - 30;
  const angleRad = Math.PI / 180 * angleDeg;
  return {
    x: cx + HEX_SIZE * Math.cos(angleRad),
    y: cy + HEX_SIZE * Math.sin(angleRad)
  };
}

/**
 * Draw a single hex tile into the SVG container.
 * @param {object} tile - { x, y, label, terrain, impassable }
 * @param {SVGElement} svg
 */
function drawHex(tile, svg) {
  const { x, y, label, terrain, impassable } = tile;
  const px = WIDTH * (x + 0.5 * (y % 2));
  const py = HEIGHT * y * 0.75;

  // Compute corner points
  const corners = Array.from({ length: 6 }, (_, i) => hexCorner(px, py, i));
  const pathD = corners
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`)
    .join(' ') + ' Z';

  // Draw hexagon
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathD);
  path.setAttribute('fill', TERRAIN_COLORS[terrain] || '#888');
  path.setAttribute('stroke', '#333');
  path.setAttribute('stroke-width', '1.5');
  svg.appendChild(path);

  // Draw impassable edges (e.g. rivers) in red
  if (Array.isArray(impassable)) {
    impassable.forEach(side => {
      const a = corners[(side - 1 + 6) % 6];
      const b = corners[side % 6];
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', a.x);
      line.setAttribute('y1', a.y);
      line.setAttribute('x2', b.x);
      line.setAttribute('y2', b.y);
      line.setAttribute('stroke', 'red');
      line.setAttribute('stroke-width', '3');
      svg.appendChild(line);
    });
  }

  // Draw label
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', px);
  text.setAttribute('y', py + 4);
  text.setAttribute('fill', 'white');
  text.setAttribute('font-size', '10');
  text.setAttribute('text-anchor', 'middle');
  text.textContent = label;
  svg.appendChild(text);
}

/**
 * Fetch map data from the backend, transform it, and render.
 */
async function loadMap() {
  const svg = document.getElementById('hexmap');
  // Clear any existing children (in case of reload)
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  try {
    const res = await fetch('/api/tiles'); // your real API endpoint
    if (!res.ok) throw new Error(`Fetch error ${res.status}`);
    const tiles = await res.json();

    tiles.forEach(raw => {
      // Transform API fields to what drawHex expects
      const tile = {
        x:          raw.x,
        y:          raw.y,
        label:      raw.label,
        terrain:    raw.terrain_type?.name ?? 'Plains',
        impassable: raw.impassable_sides ?? []
      };
      drawHex(tile, svg);
    });
  } catch (err) {
    console.error('Error loading map data:', err);
    // Optionally display an error message in the UI
    const errorText = document.createElement('text');
    errorText.setAttribute('x', 20);
    errorText.setAttribute('y', 20);
    errorText.setAttribute('fill', 'red');
    errorText.textContent = 'Failed to load map.';
    svg.appendChild(errorText);
  }
}

// Kick off map loading when this script is loaded
loadMap();
