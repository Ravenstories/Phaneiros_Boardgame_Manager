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