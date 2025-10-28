const surfSpots = [
    {
        name: "Pipeline, Hawaii",
        coordinates: { lat: 21.6611, lon: -158.0522 },
        flightCost: "$400-600",
        region: "Pacific",
        waveHeight: "8-12ft"
    },
    {
        name: "Jeffreys Bay, South Africa", 
        coordinates: { lat: -34.0489, lon: 24.9087 },
        flightCost: "$800-1200",
        region: "Africa",
        waveHeight: "6-8ft"
    },
    {
        name: "Mavericks, California",
        coordinates: { lat: 37.4936, lon: -122.4694 },
        flightCost: "$200-400",
        region: "Pacific",
        waveHeight: "15-25ft"
    },
    {
        name: "Uluwatu, Bali",
        coordinates: { lat: -8.8290, lon: 115.0940 },
        flightCost: "$600-900",
        region: "Asia",
        waveHeight: "4-6ft"
    },
    {
        name: "Teahupo'o, Tahiti",
        coordinates: { lat: -17.8421, lon: -149.2674 },
        flightCost: "$700-1100",
        region: "Pacific",
        waveHeight: "6-10ft"
    }
];

function renderSurfSpots() {
    const container = document.getElementById('surfSpots');
    
    // Clear existing content
    container.innerHTML = '';
    
    // Render each surf spot
    surfSpots.forEach(spot => {
        const spotCard = document.createElement('div');
        spotCard.className = 'spot-card';
        
        spotCard.innerHTML = `
            <div class="spot-info">
                <h3 class="spot-name">${spot.name}</h3>
                <div class="wave-height">${spot.waveHeight}</div>
            </div>
            <div class="flight-info">
                <div class="flight-cost">Est. Flight: ${spot.flightCost}</div>
                <button class="flight-btn" onclick="findFlights('${spot.name}')">Find Flights →</button>
            </div>
        `;
        
        container.appendChild(spotCard);
    });
}

function findFlights(spotName) {
    // Placeholder for flight booking functionality
    alert(`Finding flights to ${spotName}...`);
    // This will be enhanced in Stage 4 with actual flight booking integration
}

// Initialize the widget when the page loads
document.addEventListener('DOMContentLoaded', renderSurfSpots);