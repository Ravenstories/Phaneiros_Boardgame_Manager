// kingdomCreationScreen.js

function createKingdom() {
    const kingdomName = document.getElementById('kingdom-name').value;
    const bannerColor = document.getElementById('banner-color').value;

    if (!kingdomName) {
        alert('Please enter a kingdom name!');
        return;
    }

    // Store kingdom details in localStorage
    localStorage.setItem('kingdomName', kingdomName);
    localStorage.setItem('bannerColor', bannerColor);

    alert(`Kingdom created! Name: ${kingdomName}, Banner Color: ${bannerColor}`);

    // Redirect to the game screen
    loadComponent('kingdomOverview');
}

// Set up event listener for the 'Create Kingdom' button
document.getElementById('kingdom-form').addEventListener('submit', createKingdom);
