/**
 * Component Loader & Router
 * Clean structure for loading pages, layout parts (header/footer), and more.
 * Handles navigation, history, and dynamic imports.
 */
import { getToken, getUser } from '../services/userStore.js';
import { RolePriority } from '../services/roleService.js';
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
  },
  layout: {
    header: `${LAYOUT_BASE}/Header/header`,
    footer: `${LAYOUT_BASE}/Footer/footer`
  }
};

let currentModule = null;
const PUBLIC_PAGES = ['welcome', 'login', 'signup'];
/**
 * Public API: Navigate to a page (with history tracking)
 */
export function navigateTo(name) {
  const token = getToken();
  const role = getUser()?.role || 'Guest';
  const requiredRoles = {
    adminPanel: 'Admin',
    gameMasterScreen: 'Game Master'
  };

  if (!token && !PUBLIC_PAGES.includes(name)) {
    name = 'login';
  }

  if (role === 'Guest' && !PUBLIC_PAGES.includes(name)) {
    name = 'welcome';
  }

  const needed = requiredRoles[name];
  if (needed && RolePriority[role] < RolePriority[needed]) {
    name = 'welcome';
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
  const def = COMPONENTS.pages[name] || COMPONENTS.pages.welcome;
  const jsPath = typeof def === 'string' ? def : def.js;
  const htmlPath = typeof def === 'string' ? def : def.html;
  //console.log(`[loader] loading page: ${jsPath}`);

  if (typeof currentModule?.cleanup === 'function') {
    currentModule.cleanup();
  }

  const html = await fetchFragment(`${htmlPath}.html`);
  APP_EL.innerHTML = html;

  const modPath = IS_NODE && !IS_JSDOM
    ? new URL(`../${jsPath}.js?v=${Date.now()}`, import.meta.url)
    : `/${jsPath}.js?v=${Date.now()}`;
  let mod;
  try {
    mod = await import(modPath);
  } catch (err) {
    try {
      mod = await import(new URL(`../${jsPath}.js?v=${Date.now()}`, import.meta.url));
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

// Boot on initial load
document.addEventListener('DOMContentLoaded', () => {
  const screen = location.pathname.slice(1) || 'welcome';
  history.replaceState({ screen }, location.pathname);
  loadPage(screen);
});

// Intercept navigation links
document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-page]');
  if (!link) return;
  e.preventDefault();
  navigateTo(link.dataset.page);
});

// expose for tests and inline scripts
window.navigateTo = navigateTo;
window.loadPage   = loadPage;
window.loadLayout = loadLayout;
