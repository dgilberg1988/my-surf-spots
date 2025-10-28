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

// Get user's location
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser'));
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };
                resolve(userLocation);
            },
            (error) => {
                console.error('Error getting location:', error);
                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    });
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance);
}

function renderSurfSpots() {
    const container = document.getElementById('surfSpots');
    
    // Clear existing content
    container.innerHTML = '';
    
    // Sort spots by distance if user location is available
    let sortedSpots = [...surfSpots];
    if (userLocation) {
        sortedSpots = surfSpots.map(spot => ({
            ...spot,
            distance: calculateDistance(
                userLocation.lat, 
                userLocation.lon, 
                spot.coordinates.lat, 
                spot.coordinates.lon
            )
        })).sort((a, b) => a.distance - b.distance);
    }
    
    // Render each surf spot
    sortedSpots.forEach(spot => {
        const spotCard = document.createElement('div');
        spotCard.className = 'spot-card';
        
        const distanceText = spot.distance ? `${spot.distance.toLocaleString()} miles away` : '';
        
        spotCard.innerHTML = `
            <div class="spot-info">
                <h3 class="spot-name">${spot.name}</h3>
                <div class="wave-height">${spot.waveHeight}</div>
                ${distanceText ? `<div class="distance">${distanceText}</div>` : ''}
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
    const spot = surfSpots.find(s => s.name === spotName);
    if (!spot) return;
    
    // Create flight search URL for popular booking sites
    const destination = spot.airport;
    let searchUrl;
    
    if (userLocation) {
        // If we have user location, try to find nearest airport
        // For now, we'll use a generic search
        searchUrl = `https://www.kayak.com/flights?destination=${destination}`;
    } else {
        // Default search without origin
        searchUrl = `https://www.google.com/flights?destination=${destination}`;
    }
    
    // Open flight search in new tab
    window.open(searchUrl, '_blank');
}

// Enhanced flight search with more booking options
function showFlightOptions(spotName) {
    const spot = surfSpots.find(s => s.name === spotName);
    if (!spot) return;
    
    const bookingOptions = [
        { name: 'Google Flights', url: `https://www.google.com/flights?destination=${spot.airport}` },
        { name: 'Kayak', url: `https://www.kayak.com/flights?destination=${spot.airport}` },
        { name: 'Expedia', url: `https://www.expedia.com/Flights?destination=${spot.airport}` }
    ];
    
    // For demo purposes, just use the first option
    window.open(bookingOptions[0].url, '_blank');
}

// Show loading state
function showLoading() {
    const container = document.getElementById('surfSpots');
    container.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading epic surf spots...</p>
        </div>
    `;
    isLoading = true;
}

// Initialize the widget
async function initializeWidget() {
    showLoading();
    
    try {
        // Try to get user location (non-blocking)
        try {
            await getUserLocation();
            console.log('User location detected:', userLocation);
        } catch (locationError) {
            console.log('Location access denied or unavailable, continuing without location');
        }
        
        // Render initial spots
        renderSurfSpots();
        
        // Fetch real wave data
        await updateWaveData();
        
    } catch (error) {
        console.error('Error initializing widget:', error);
        // Fallback to static display
        renderSurfSpots();
    } finally {
        isLoading = false;
    }
}

// Initialize the widget when the page loads
document.addEventListener('DOMContentLoaded', initializeWidget);