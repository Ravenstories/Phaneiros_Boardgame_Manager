export class UI {
    constructor() {
        this.goldElement = document.getElementById('gold');
        this.woodElement = document.getElementById('wood');
        this.foodElement = document.getElementById('food');
        this.populationElement = document.getElementById('population'); 
        this.buildingFarmElement = document.getElementById('farm-count');
        this.buildingBarracksElement = document.getElementById('barracks-count');
        this.armyElement = document.getElementById('army');

        // Log the elements to the console for debugging
        console.log('Gold Element:', this.goldElement);
        console.log('Wood Element:', this.woodElement);
        console.log('Food Element:', this.foodElement);
        console.log('Population Element:', this.populationElement);
        console.log('Army Element:', this.armyElement);

        // Check if any element is null
        if (!this.goldElement || !this.woodElement || !this.foodElement || !this.populationElement || !this.armyElement) {
            console.error('Error: One or more elements could not be found in the DOM.');
        }
    }

    updateResources(resources) {
        this.goldElement.textContent = resources.getResource('gold');
        this.woodElement.textContent = resources.getResource('wood');
        this.foodElement.textContent = resources.getResource('food');
        this.populationElement.textContent = resources.getResource('population');
        this.armyElement.textContent = resources.getResource('army');
    }

    updateBuildings(buildings) {
        document.getElementById('buildings').innerHTML = `
            <p>Farms: ${buildings.farm}</p>
            <p>Barracks: ${buildings.barracks}</p>
        `;
    }
}
