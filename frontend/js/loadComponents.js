// frontend/js/loadComponents.js
export async function loadComponent(componentName) {
    const app = document.getElementById('app');
  
    // Resolve paths (absolute keeps it simple)
    const base = '/frontend/pages';
    const routes = {
      start:             `/${base}/Start/start`,
      kingdomCreation:   `/${base}/KingdomCreationScreen/kingdomCreationScreen`,
      kingdomOverview:   `/${base}/KingdomOverviewScreen/kingdomOverviewScreen`,
      mapScreen:         `/${base}/MapScreen/mapScreen`
    };
    const path = routes[componentName] || routes.start;
  
    try {
      /* ---------- fetch & parse HTML ---------- */
      const htmlText = await fetch(`${path}.html`).then(r => r.text());
      const doc      = new DOMParser().parseFromString(htmlText, 'text/html');
  
      // ♻️ inject only #page-content children
      const fragment = doc.querySelector('#page-content');
      if (!fragment) throw new Error('Missing #page-content wrapper');
      app.innerHTML = fragment.innerHTML;
  
      /* ---------- load corresponding JS ---------- */
      await loadScript(`${path}.js`);
    } catch (err) {
      console.error(err);
      app.innerHTML = '<p>Error loading content.</p>';
    }
  }
  
  /* helper – returns a Promise that resolves when script is loaded */
  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = Object.assign(document.createElement('script'), {
        src,
        type: 'module',
        onload: res,
        onerror: rej
      });
      document.body.append(s);
    });
  }
  
  window.loadComponent = loadComponent;
  
  /* boot screen */
  document.addEventListener('DOMContentLoaded', () => loadComponent('start'));
  