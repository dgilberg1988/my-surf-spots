const surfSpots = [
    {
        name: "Pipeline, Hawaii",
        coordinates: { lat: 21.6611, lon: -158.0522 },
        flightCost: "$400-600",
        region: "Pacific",
        waveHeight: "Loading...",
        airport: "HNL",
        country: "USA"
    },
    {
        name: "Jeffreys Bay, South Africa", 
        coordinates: { lat: -34.0489, lon: 24.9087 },
        flightCost: "$800-1200",
        region: "Africa",
        waveHeight: "Loading...",
        airport: "PLZ",
        country: "ZAF"
    },
    {
        name: "Mavericks, California",
        coordinates: { lat: 37.4936, lon: -122.4694 },
        flightCost: "$200-400",
        region: "Pacific",
        waveHeight: "Loading...",
        airport: "SFO",
        country: "USA"
    },
    {
        name: "Uluwatu, Bali",
        coordinates: { lat: -8.8290, lon: 115.0940 },
        flightCost: "$600-900",
        region: "Asia",
        waveHeight: "Loading...",
        airport: "DPS",
        country: "IDN"
    },
    {
        name: "Teahupo'o, Tahiti",
        coordinates: { lat: -17.8421, lon: -149.2674 },
        flightCost: "$700-1100",
        region: "Pacific",
        waveHeight: "Loading...",
        airport: "PPT",
        country: "PYF"
    }
];

// Global state
let userLocation = null;
let isLoading = false;

// API Configuration
const MARINE_API_BASE = 'https://marine-api.open-meteo.com/v1/marine';

// Fetch wave data for a specific location
async function fetchWaveData(lat, lon) {
    try {
        const response = await fetch(
            `${MARINE_API_BASE}?latitude=${lat}&longitude=${lon}&hourly=wave_height&timezone=auto&forecast_days=1`
        );
        
        if (!response.ok) {
            throw new Error('Wave data not available');
        }
        
        const data = await response.json();
        const currentWaveHeight = data.hourly.wave_height[0];
        
        // Convert meters to feet and format
        const waveHeightFt = Math.round(currentWaveHeight * 3.28084);
        return `${waveHeightFt}ft`;
    } catch (error) {
        console.error('Error fetching wave data:', error);
        return 'N/A';
    }
}

// Fetch wave data for all surf spots
async function updateWaveData() {
    const promises = surfSpots.map(async (spot, index) => {
        const waveHeight = await fetchWaveData(spot.coordinates.lat, spot.coordinates.lon);
        surfSpots[index].waveHeight = waveHeight;
    });
    
    await Promise.all(promises);
    renderSurfSpots(); // Re-render with updated data
}

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