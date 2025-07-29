/**
 * Component Loader & Router
 * Clean structure for loading pages, layout parts (header/footer), and more.
 * Handles navigation, history, and dynamic imports.
 */
const APP_EL = document.getElementById('app');
if (!APP_EL) throw new Error('[loader] #app element not found');
const PAGE_BASE = 'pages';
const LAYOUT_BASE = 'layout';
const COMPONENTS = {
  pages: {
    welcome:       `${PAGE_BASE}/Welcome/welcome`,
    mapScreen:      `${PAGE_BASE}/MapScreen/mapScreen`,
    login:          `${PAGE_BASE}/Login/login`,
    signup:         `${PAGE_BASE}/Signup/signup`,
    gameChooser:    `${PAGE_BASE}/GameChooser/gameChooser`,
    userDashboard:  `${PAGE_BASE}/UserDashboard/userDashboard`,
  },
  layout: {
    header: `${LAYOUT_BASE}/Header/header`,
    footer: `${LAYOUT_BASE}/Footer/footer`
  }
};

let currentModule = null;

/**
 * Public API: Navigate to a page (with history tracking)
 */
export function navigateTo(name) {
  const url = `/${name}`;
  if (location.pathname !== url) {
    history.pushState({ screen: name }, '', url);
  }
  loadPage(name);
}

/**
 * Load a page component into #app
 */
export async function loadPage(name) {
  const path = COMPONENTS.pages[name] || COMPONENTS.pages.welcome;
  console.log(`[loader] loading page: ${path}`);

  if (typeof currentModule?.cleanup === 'function') {
    currentModule.cleanup();
  }

  const html = await fetchFragment(`${path}.html`);
  APP_EL.innerHTML = html;

  const mod = await import(`/${path}.js?v=${Date.now()}`);
  currentModule = mod;

  if (typeof mod.default === 'function') {
    mod.default({ target: APP_EL });
  }
}

/**
 * Load a layout component into a given target element
 */
export async function loadLayout(name, targetSelector) {
  const path = COMPONENTS.layout[name];
  const target = document.querySelector(targetSelector);
  if (!path || !target) return;

  const html = await fetchFragment(`${path}.html`);
  target.innerHTML = html;

  const mod = await import(`/${path}.js?v=${Date.now()}`);
  if (typeof mod.default === 'function') {
    mod.default({ target });
  }
}

/**
 * Utility: Fetch an HTML fragment and extract <main id="page-content">
 */
async function fetchFragment(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status} while fetching ${url}`);
  const txt = await res.text();
  const doc = new DOMParser().parseFromString(txt, 'text/html');
  const main = doc.querySelector('main#page-content') || doc.body;
  return main.innerHTML;
}

/**
 * Popstate: Back/forward browser buttons
 */
window.addEventListener('popstate', (ev) => {
  const screen = ev.state?.screen || 'welcome';
  loadPage(screen);
});

/**
 * Initial page load
 */
document.addEventListener('DOMContentLoaded', () => {
  const screen = location.pathname.slice(1) || 'welcome';
  history.replaceState({ screen }, location.pathname);
  loadPage(screen);
});

document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-page]');
  if (!link) return;

  e.preventDefault(); // ← THIS prevents browser from touching history
  const page = link.dataset.page;
  navigateTo(page);
});


/**
 * Expose for global use in inline handlers
 */
window.navigateTo = navigateTo;
window.loadPage = loadPage;
window.loadLayout = loadLayout;
