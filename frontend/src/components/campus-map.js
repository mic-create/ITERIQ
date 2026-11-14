export function renderCampusMap(container, options = { interactive: false }) {
    container.innerHTML = `<div id="leaflet-map-element" style="width: 100%; height: 100%;"></div>`;
    
    // Initialise Leaflet map centered around Bells University area (approximate coordinates pending provisioning)
    const map = L.map('leaflet-map-element', { zoomControl: options.interactive }).setView([6.6731, 3.1592], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Marker for Jeremiah Ojediran Hall / Central Campus Venues
    L.marker([6.6731, 3.1592]).addTo(map)
        .bindPopup('<b>Bells University Campus</b><br>Approved Geofence Venue Area')
        .openPopup();
}