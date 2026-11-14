export function renderCampusMap(container, options = { interactive: false }) {
    container.innerHTML = `<div id="leaflet-map-element" style="width: 100%; height: 100%;"></div>`;
    
    // Bells University default coordinates
    const bellsCenter = [6.6731, 3.1592];
    const map = L.map('leaflet-map-element', { zoomControl: options.interactive }).setView(bellsCenter, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Approved Venues Data (matching backend configuration status)
    const venues = [
        { name: "JEREMIAH OJEDIRAN HALL", lat: 6.684387, lon: 3.173601, active: true },
        { name: "EDOZIEN LECTURE THEATRE (ELT)", lat: 6.684081, lon: 3.1684382, active: true },
        { name: "BUPF CONFERENCE CENTER (BUPF CC)", lat: 6.685361, lon: 3.169830, active: true },
        { name: "BUPF LT", lat: null, lon: null, active: false },
        { name: "LECTURE THEATRE (LT) 1", lat: null, lon: null, active: false },
        { name: "LECTURE THEATRE (LT) 2", lat: null, lon: null, active: false }
    ];

    venues.forEach(v => {
        if (v.lat && v.lon) {
            L.marker([v.lat, v.lon]).addTo(map)
                .bindPopup(`<b>${v.name}</b><br><span style="color: #38a169; font-weight: 600;">Active Geofence Venue</span>`);
        }
    });

    // Expose method to update student marker on map if needed
    container._leafletMap = map;
}