import { Resources } from '../../js/resources.js';
import { UI } from '../../js/ui.js';

// Function to initialize the game
function initializeGame() {
    const kingdomName = localStorage.getItem('kingdomName');
    const bannerColor = localStorage.getItem('bannerColor');

    // Check if kingdom data exists
    if (!kingdomName || !bannerColor) {
        alert("No kingdom data found. Redirecting to kingdom creation.");
        loadComponent('kingdomCreation');  // Redirect to kingdom creation screen
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

    window.game = game;  // Optional: make game globally accessible

    // Set up event listeners for resource gathering buttons
    document.getElementById('gather-gold-btn').addEventListener('click', () => {
        game.gatherResource('gold');
    });
    document.getElementById('gather-wood-btn').addEventListener('click', () => {
        game.gatherResource('wood');
    });

    // You can add more event listeners for other game actions
}

// Call initializeGame when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeGame);
