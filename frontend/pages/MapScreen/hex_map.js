const HEX_SIZE = 40;
const WIDTH = HEX_SIZE * 2;
const HEIGHT = Math.sqrt(3) * HEX_SIZE;

const TERRAIN_COLORS = {
  Plains: '#aaa',
  Forest: '#2e8b57',
  Hill: '#a0522d',
  Mountain: '#696969',
  Water: '#1e90ff',
};

function hexCorner(cx, cy, i) {
  const angleDeg = 60 * i - 30;
  const angleRad = Math.PI / 180 * angleDeg;
  return {
    x: cx + HEX_SIZE * Math.cos(angleRad),
    y: cy + HEX_SIZE * Math.sin(angleRad)
  };
}

function drawHex(tile, svg) {
  const { x, y, label, terrain, impassable } = tile;
  const px = WIDTH * (x + 0.5 * (y % 2));
  const py = HEIGHT * y * 0.75;

  const corners = Array.from({ length: 6 }, (_, i) => hexCorner(px, py, i));
  const pathData = corners.map((c, i) => `${i ? 'L' : 'M'} ${c.x} ${c.y}`).join(' ') + ' Z';

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathData);
  path.setAttribute('fill', TERRAIN_COLORS[terrain] || '#888');
  path.setAttribute('stroke', '#333');
  path.setAttribute('stroke-width', 1.5);
  svg.appendChild(path);

  // Impassable edges
  if (Array.isArray(impassable)) {
    impassable.forEach(side => {
      const a = corners[(side - 1) % 6];
      const b = corners[side % 6];
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', a.x);
      line.setAttribute('y1', a.y);
      line.setAttribute('x2', b.x);
      line.setAttribute('y2', b.y);
      line.setAttribute('stroke', 'red');
      line.setAttribute('stroke-width', 3);
      svg.appendChild(line);
    });
  }

  // Label
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', px);
  text.setAttribute('y', py + 4);
  text.setAttribute('fill', 'white');
  text.setAttribute('font-size', '10');
  text.setAttribute('text-anchor', 'middle');
  text.textContent = label;
  svg.appendChild(text);
}

async function loadMap() {
  const svg = document.getElementById('hexmap');

  const res = await fetch('/api/tiles'); // replace this with your real data path
  const tiles = await res.json();

  tiles.forEach(tile => drawHex(tile, svg));
}

loadMap();
