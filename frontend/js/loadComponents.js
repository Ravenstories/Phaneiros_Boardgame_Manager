// Function to load components dynamically into the #app container
export function loadComponent(componentName) {
    const appContainer = document.getElementById('app');
    
    // Define the file paths for the component HTML and its corresponding JS
    let componentHTMLPath = '';
    let componentJSPath = '';
    
    switch (componentName) {
        case 'start':
            componentHTMLPath       = 'frontend/pages/Start/start.html';
            componentJSPath         = 'frontend/pages/Start/start.js';
            break;
        case 'kingdomCreation':
            componentHTMLPath       = 'frontend/pages/KingdomCreationScreen/kingdomCreationScreen.html';
            componentJSPath         = 'frontend/pages/KingdomCreationScreen/kingdomCreationScreen.js';
            break;
        case 'kingdomOverview':
            componentHTMLPath       = 'frontend/pages/KingdomOverviewScreen/kingdomOverviewScreen.html';
            componentJSPath         = 'frontend/pages/KingdomOverviewScreen/kingdomOverviewScreen.js';
            break;
        case 'mapScreen':
            componentHTMLPath       = 'frontend/pages/MapScreen/mapScreen.html';
            componentJSPath         = 'frontend/pages/MapScreen/mapScreen.js';
            break;
        default:
            componentHTMLPath       = 'frontend/pages/Start/start.html';
            componentJSPath         = 'frontend/pages/Start/start.js';
    }

    // Fetch the component HTML and inject it into the app container
    fetch(componentHTMLPath)
        .then(response => response.text())
        .then(data => {
            appContainer.innerHTML = data;  // Inject the HTML into the app container

            // Now that the HTML is loaded, dynamically load the corresponding JS
            loadScript(componentJSPath);
        })
        .catch(error => {
            console.error('Error loading component:', error);
            appContainer.innerHTML = '<p>Error loading content. Please try again later.</p>';
        });
}

// Function to dynamically load a script
function loadScript(scriptPath) {
    const script = document.createElement('script');
    script.src = scriptPath;
    script.type = 'module';
    script.defer = true;
    document.body.appendChild(script);  // Add the script to the body
}

window.loadComponent = loadComponent;

// Load the default component (start) on page load
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('start');  // Load the start component by default
});
