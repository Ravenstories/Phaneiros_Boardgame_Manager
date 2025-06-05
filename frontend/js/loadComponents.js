/**
 * Scan all <script data-component> tags, dynamically import them,
 * and call their default export ({target}) => void ONLY if target exists.
 */
const PAGE_BASE = 'pages';          // root folder
const ROUTES = {                    // map link name → folder
  start:             `${PAGE_BASE}/Start/start`,
  kingdomCreation:   `${PAGE_BASE}/KingdomCreationScreen/kingdomCreationScreen`,
  kingdomOverview:   `${PAGE_BASE}/KingdomOverviewScreen/kingdomOverviewScreen`,
  mapScreen:         `${PAGE_BASE}/MapScreen/mapScreen`
};

const APP_EL = document.getElementById('app');
if (!APP_EL) throw new Error('[loadComponents] #app element not found');

export async function loadComponent(name = 'start') {
  const path = ROUTES[name] || ROUTES.start;
  try {
    /* 1 – HTML fragment */
    const html = await fetchFragment(`${path}.html`);
    APP_EL.innerHTML = html;

    /* 2 – page logic (cache-bust so edits reload in dev) */
    await import(`/${path}.js?v=${Date.now()}`);
    pushHistory(name);              // update URL
  } catch (err) {
    console.error('[loadComponents] failed:', err);
    APP_EL.innerHTML = '<p class="error-loading-content">Error loading content.</p>';
  }
}

/* helpers --------------------------------------------------------------- */
async function fetchFragment(url) {
  const res = await fetch(url, { cache:'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status} while fetching ${url}`);
  const txt = await res.text();
  const doc = new DOMParser().parseFromString(txt, 'text/html');
  const main = doc.querySelector('main[id="page-content"]');
  if (!main) throw new Error(`${url} is missing <main id="page-content">`);
  return main.innerHTML;
}

function pushHistory(name) {
  const url = `/${name}`;
  if (location.pathname !== url) history.pushState({ screen:name }, '', url);
}

window.addEventListener('popstate', ev => {
  const screen = ev.state?.screen || 'start';
  loadComponent(screen);
});

/* expose globally for navbar onclick="" */
window.loadComponent = loadComponent;

/* load initial screen */
document.addEventListener('DOMContentLoaded', () => loadComponent('start'));






// frontend/js/loadComponents.js
// ------------------------------------------------------------------
// Tiny in‑house router / component loader
// ------------------------------------------------------------------
//  * Each screen lives in /frontend/pages/<Screen>/<file>.html + .js
//  * The HTML file must wrap its visible content in
//      <main id="page-content"> … </main>
//  * loadComponent(screen) fetches the fragment and the matching JS
//  * We keep history.pushState so the back‑button works.
// ------------------------------------------------------------------

/*

const APP_EL = document.getElementById('app');
if (!APP_EL) {
  throw new Error('[loadComponents] #app element not found – check index.html');
}

// Map logical names to files (without extension). KEEP THESE IN SYNC
// with folder names under /frontend/pages
const PAGE_BASE = 'pages'; // resolved relative to site root
const ROUTES = {
  start:             `${PAGE_BASE}/Start/start`,
  kingdomCreation:   `${PAGE_BASE}/KingdomCreationScreen/kingdomCreationScreen`,
  kingdomOverview:   `${PAGE_BASE}/KingdomOverviewScreen/kingdomOverviewScreen`,
  mapScreen:         `${PAGE_BASE}/MapScreen/mapScreen`
};


  //Load a component (HTML fragment + JS) into #app.
  //@param {keyof typeof ROUTES} name
 
export async function loadComponent(name = 'start') {
  const path = ROUTES[name] || ROUTES.start;

  try {
    const html = await fetchFragment(`${path}.html`);
    APP_EL.innerHTML = html; // replace panel content

    await loadScript(`${path}.js`);

    // Update address bar so reload/back keeps state
    pushHistory(name);
  } catch (err) {
    console.error('[loadComponents] failed:', err);
    APP_EL.innerHTML = '<p class="error-loading-content">Error loading content.</p>';
  }
}

// HELPERS

// Fetch HTML, extract #page-content innerHTML.
async function fetchFragment(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status} while fetching ${url}`);

  const txt  = await res.text();
  const doc  = new DOMParser().parseFromString(txt, 'text/html');
  const main = doc.querySelector('#page-content');
  if (!main) throw new Error(`${url} is missing <main id=\"page-content\">`);
  return main.innerHTML;
}

function loadScript(src) {
  return import(`/${src}?v=${Date.now()}`); // cache‑bust to ensure latest
}

function pushHistory(name) {
  // Build pretty URL like /start or /mapScreen
  const url = `/${name}`;
  if (location.pathname !== url) {
    history.pushState({ screen: name }, '', url);
  }
}

// Handle back/forward navigation
window.addEventListener('popstate', (ev) => {
  const screen = ev.state?.screen || 'start';
  loadComponent(screen);
});

// Expose globally for inline onclick="" handlers
window.loadComponent = loadComponent;

// Initial screen
document.addEventListener('DOMContentLoaded', () => loadComponent('start'));

*/