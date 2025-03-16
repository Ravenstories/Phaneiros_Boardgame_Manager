import { Resources } from './resources.js';
import { UI } from './ui.js';

// Initialize the game after checking for the kingdom's details
export function initializeGame() {
    const kingdomName = localStorage.getItem('kingdomName');
    const bannerColor = localStorage.getItem('bannerColor');

    if (!kingdomName || !bannerColor) {
        alert("No kingdom data found. Redirecting to kingdom creation.");
        window.location.href = 'kingdomCreationScreen.html';
        return;
    }

    // Display the kingdom name and banner color in the header
    document.getElementById('header').innerHTML = `
        <h1>${kingdomName}</h1>
        <div style="background-color: ${bannerColor}; width: 100px; height: 20px;"></div>
    `;

    // Initialize the game objects
    const game = {
        resources: new Resources(),
        ui: new UI(),
        buildings: {
            farm: 0,
            barracks: 0
        }, 
        

        // Example resource management
        gatherResource: function(resourceType) {
            this.resources.increaseResource(resourceType);
            this.ui.updateResources(this.resources);
        },

        // Example building management
        build: function(buildingType) {
            if (buildingType === 'farm' && this.resources.wood >= 50) {
                this.resources.wood -= 50;
                this.buildings.farm++;
                this.ui.updateBuildings(this.buildings);
                this.ui.updateResources(this.resources);
            } else {
                alert('Not enough wood to build a farm.');
            }
        }
    };

    window.game = game; // Optional: make game globally accessible
}
