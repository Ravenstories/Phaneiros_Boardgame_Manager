export class Resources {
    constructor() {
        this.resources = {
            gold: 0,
            wood: 0,
            food: 0,
            population: 10,
            army: 0
        };
    }

    increaseResource(type) {
        switch (type) {
            case 'gold':
                this.resources.gold += 10;
                break;
            case 'wood':
                this.resources.wood += 5;
                break;
            case 'food':
                this.resources.food += 3;
                break;
            case 'population':
                if (this.resources.food >= this.resources.population) {
                    this.resources.population += 1;  // Increase population if enough food is available
                    this.resources.food -= this.resources.population;  // Consume food
                }
                break;
            case 'army':
                if (this.resources.food >= this.resources.army) {
                    this.resources.army += 1;  // Increase army size if enough food is available
                    this.resources.food -= this.resources.army;  // Consume food
                }
                break;
            default:
                console.error('Unknown resource type: ' + type);
        }
    }

    getResource(type) {
        return this.resources[type];
    }
}
