/**
 * Component Loader & Router
 * Clean structure for loading pages, layout parts (header/footer), and more.
 * Handles navigation, history, and dynamic imports.
 */
import { getToken } from '../services/userStore.js';
const IS_NODE = typeof window === 'undefined';
const IS_JSDOM = !IS_NODE && navigator.userAgent?.includes('jsdom');
const APP_EL = document.getElementById('app');
if (!APP_EL) throw new Error('[loader] #app element not found');
const PAGE_BASE = 'pages';
const LAYOUT_BASE = 'layout';
const COMPONENTS = {
  pages: {
    welcome:            `${PAGE_BASE}/Welcome/welcome`,
    mapScreen:          `${PAGE_BASE}/MapScreen/mapScreen`,
    login:              `${PAGE_BASE}/Login/login`,
    signup:             `${PAGE_BASE}/Signup/signup`,
    gameChooser:        `${PAGE_BASE}/GameChooser/gameChooser`,
    userDashboard:      `${PAGE_BASE}/UserDashboard/userDashboard`,
    adminPanel:         `${PAGE_BASE}/AdminPanel/adminPanel`,
    gameMasterScreen:   `${PAGE_BASE}/GameMasterScreen/gameMasterScreen`,
    gameMaster:         `${PAGE_BASE}/GameMasterScreen/gameMasterScreen`,
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
  // Login redirect if no token for test
   if (name === 'gameChooser' && !getToken()) {
    name = 'login';
  }
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
  //console.log(`[loader] loading page: ${path}`);

  if (typeof currentModule?.cleanup === 'function') {
    currentModule.cleanup();
  }

  const html = await fetchFragment(`${path}.html`);
  APP_EL.innerHTML = html;

  const modPath = IS_NODE && !IS_JSDOM
    ? new URL(`../${path}.js?v=${Date.now()}`, import.meta.url)
    : `/${path}.js?v=${Date.now()}`;
  let mod;
  try {
    mod = await import(modPath);
  } catch (err) {
    try {
      mod = await import(new URL(`../${path}.js?v=${Date.now()}`, import.meta.url));
    } catch (err2) {
      throw err;
    }
  }
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

  const modPath = IS_NODE && !IS_JSDOM
    ? new URL(`../${path}.js?v=${Date.now()}`, import.meta.url)
    : `/${path}.js?v=${Date.now()}`;
  let mod;
  try {
    mod = await import(modPath);
  } catch (err) {
    try {
      mod = await import(new URL(`../${path}.js?v=${Date.now()}`, import.meta.url));
    } catch (err2) {
      throw err;
    }
  }
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