// SAVE GAME -------------------------------------------------------------
export function saveGame(){
    const gameState = {
        kingdomName: localStorage.getItem('kingdomName'),
        bannerColor: localStorage.getItem('bannerColor'),
        resources: {
            gold: 100,
            wood: 200,
            food: 150
        },
        buildings: {
            farm: 2,
            barracks: 1
        }
    };
    saveGameToFile(gameState);
}

function saveGameToFile(gameState) {
    // Create XML Document
    const xmlDoc = document.implementation.createDocument('', '', null);
    const gameElement = xmlDoc.createElement('game');

    // Kingdom Info
    const kingdomElement = xmlDoc.createElement('kingdom');
    const nameElement = xmlDoc.createElement('name');
    nameElement.textContent = gameState.kingdomName;
    const bannerColorElement = xmlDoc.createElement('bannerColor');
    bannerColorElement.textContent = gameState.bannerColor;
    kingdomElement.appendChild(nameElement);
    kingdomElement.appendChild(bannerColorElement);
    gameElement.appendChild(kingdomElement);

    // Resources
    const resourcesElement = xmlDoc.createElement('resources');
    for (let resource in gameState.resources) {
        const resourceElement = xmlDoc.createElement(resource);
        resourceElement.textContent = gameState.resources[resource];
        resourcesElement.appendChild(resourceElement);
    }
    gameElement.appendChild(resourcesElement);

    // Buildings
    const buildingsElement = xmlDoc.createElement('buildings');
    for (let building in gameState.buildings) {
        const buildingElement = xmlDoc.createElement(building);
        buildingElement.textContent = gameState.buildings[building];
        buildingsElement.appendChild(buildingElement);
    }
    gameElement.appendChild(buildingsElement);

    // Serialize XML to string
    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(gameElement);

    // Create a Blob from the XML string
    const blob = new Blob([xmlString], { type: 'application/xml' });

    // Create a link element for downloading the file
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'kingdom_save.xml';  // Filename
    document.body.appendChild(a);
    a.click();  // Simulate a click to download the file
    document.body.removeChild(a);  // Clean up

    console.log("Game saved to file:", xmlString);
}

// LOAD GAME -------------------------------------------------------------
export function loadGame(event) {
    const file = event.target.files[0];  // Get the selected file
    if (file) {
        loadGameFromFile(file);  // Load the game from the file
    }
}
function loadGameFromFile(file) {
    const reader = new FileReader();

    // Define the file read event
    reader.onload = function(event) {
        const xmlString = event.target.result;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "application/xml");

        const gameState = {
            kingdomName: xmlDoc.querySelector('kingdom > name').textContent,
            bannerColor: xmlDoc.querySelector('kingdom > bannerColor').textContent,
            resources: {
                gold: xmlDoc.querySelector('resources > gold').textContent,
                wood: xmlDoc.querySelector('resources > wood').textContent,
                food: xmlDoc.querySelector('resources > food').textContent
            },
            buildings: {
                farm: xmlDoc.querySelector('buildings > farm').textContent,
                barracks: xmlDoc.querySelector('buildings > barracks').textContent
            }
        };

        console.log("Game loaded from file:", gameState);

        // Restore game state (you can update your game logic/UI here)
        document.getElementById('kingdom-name').textContent = gameState.kingdomName;
        document.body.style.backgroundColor = gameState.bannerColor;  // Example for banner color
        // Continue restoring resources, buildings, etc.
    };

    // Read the file as a text string (XML)
    reader.readAsText(file);
}


// Bind the save game button
document.getElementById('saveGameButton').addEventListener('click', saveGame);

// Bind the load game file input
document.getElementById('loadFile').addEventListener('change', loadGame);
