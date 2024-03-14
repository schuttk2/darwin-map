
const markers = [];

// Leaflet map setup
const map = L.map('map', {
    center: [0, 0],
    zoom: 3
 });

markers.forEach(marker => {
    L.marker(marker.latlng).addTo(map).bindPopup(`<b>${marker.title}</b><br>${marker.description}`);
});

// Add a base layer (using a hard-coded image for demonstration)
const imageUrl = '1800s-map.svg',
   imageBounds = [
       [-100, -100],
       [100, 100]
   ];
L.imageOverlay(imageUrl, imageBounds).addTo(map);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
   maxZoom: 18,
   attribution: 'Le Monde, principales decouvertes ' +
       '<a href="https://www.davidrumsey.com/luna/servlet/detail/RUMSEY~8~1~22005~700037:Le-Monde%2C-principales-decouvertes-?sort=Pub_List_No_InitialSort%2CPub_Date%2CPub_List_No%2CSeries_No&qvq=q:Le%20Monde%2C%20principales%20decouvertes;sort:Pub_List_No_InitialSort%2CPub_Date%2CPub_List_No%2CSeries_No;lc:RUMSEY~8~1&mi=0&trs=1#" target="_blank">David Rumsey Map Collection</a>',
   id: 'le-monde'
}).addTo(map);

//L.control.bigImage({position: 'topright'}).addTo(map);

// Function to open About page modal
function openAboutPage() {
   document.getElementById('aboutModal').style.display = 'block';
}
// Function to close About page modal
function closeAboutPage() {
   document.getElementById('aboutModal').style.display = 'none';
}
// Function to open Help page modal
function openHelpPage() {
   document.getElementById('helpModal').style.display = 'block';
}
// Function to close Help page modal
function closeHelpPage() {
   document.getElementById('helpModal').style.display = 'none';
}
// Function to export and embed map
function exportAndEmbed() {
   const mapState = {
       center: map.getCenter(),
       zoom: map.getZoom(),
       markers: []
   };

   map.eachLayer(layer => {
       if(layer instanceof L.Marker){
           const markerInfo = {
               latlng: layer.getLatLng(),
               title: layer.getPopup().getContent(),
               color: layer.options.icon.options.iconUrl,
           };
           mapState.markers.push(markerInfo);
       }
   });
   const embedCode = generateEmbedCode(mapState);
   openEmbedCodeModal(embedCode);
   displayMarkersList(mapState.markers);
}

// Function to display markers list
function displayMarkersList(markers) {
    const markersList = markers.map(marker => `
        <li>
            <strong>Coordinates:</strong> ${marker.latlng.lat.toFixed(4)}, ${marker.latlng.lng.toFixed(4)}<br>
            <strong>Title:</strong> ${marker.title}<br>
            <strong>Description:</strong> ${marker.description}<br>
            <strong>Color:</strong> ${marker.color}<br>
        </li>
    `).join('');

    const markersListContainer = document.getElementById('markersList');
    markersListContainer.innerHTML = `<ul>${markersList}</ul>`;
}

function openEmbedCodeModal(embedCode) {
    document.getElementById('embedCodeModal').style.display = 'block';
    const textarea = document.getElementById('embedCodeTextarea');
    textarea.value = embedCode;
    const modal = document.getElementById('embedCodeModal');
    modal.style.display = 'block';
}
function closeEmbedCodeModal(){
   document.getElementById('embedCodeModal').style.display = 'none';
}
function copyEmbedCode(){
   const textarea = document.getElementById('embedCodeTextarea');
   textarea.select();
   document.execCommand('copy');
   alert('Embed code copied to clipboard!');
}

function generateEmbedCode(mapState){
    const { center, zoom, markers } = mapState;
    const embedCode = `
        ${markers.map(marker => `
            L.marker([${marker.latlng.lat}, ${marker.latlng.lng}]).addTo(viewMap).bindPopup('${marker.title}').openPopup();
        `).join('\n')}
    `;
    return embedCode;
}
function addPin(){
   alert('Click where you would like the pin to be on the map');
   map.on('click', function (e) {
       const titleInput = document.getElementById('pinTitle');
       const descriptionInput = document.getElementById('pinDescription');
       const colorCheckboxGroup = document.getElementById('colorCheckboxGroup');
       const title = titleInput.value.trim();
       const description = descriptionInput.value.trim();
       let color;
       const radio = colorCheckboxGroup.querySelectorAll('input[type="radio"]:checked');
       if(radio.length > 0){
           color = radio[0].value;
       }else{
           color = 'https://schuttk2.github.io/darwin-map/Black_Icon.png';
       }
       if(!title){
           alert('Please enter a title for this pin.');
           return;
       }
       const markerIcon = L.icon({
           iconUrl: `https://schuttk2.github.io/darwin-map/Black_Icon.png`,
           iconSize: [31, 46], // size of the icon
           iconAnchor: [0, 46], // point of the icon which will correspond to marker's location
           popupAnchor: [0, -45] // point from which the popup should open relative to the iconAnchor
       });
       if(color === 'https://schuttk2.github.io/darwin-map/Red_Icon.png'){
           const markerIcon = L.icon({
               iconUrl: `https://schuttk2.github.io/darwin-map/Red_Icon.png`,
               iconSize: [31, 46], // size of the icon
               iconAnchor: [0, 46], // point of the icon which will correspond to marker's location
               popupAnchor: [0, -45] // point from which the popup should open relative to the iconAnchor
           });
           const newMarker = L.marker(e.latlng, {
               icon: markerIcon
           });
           map.addLayer(newMarker);
           newMarker.bindPopup(`<b>${title}</b><br>${description}`).openPopup();
   
           newMarker.on('contextmenu', function(e){
               map.removeLayer(newMarker);
           });

           // Store marker information including color
           const markerInfo = {
                latlng: newMarker.getLatLng(),
                title: newMarker.getPopup().getContent(),
                color: color
            };

            // Add the marker information to the markers array
            markers.push(markerInfo);
       }else if(color === 'https://schuttk2.github.io/darwin-map/Orange_Icon.png'){
           const markerIcon = L.icon({
               iconUrl: `https://schuttk2.github.io/darwin-map/Orange_Icon.png`,
               iconSize: [31, 46], // size of the icon
               iconAnchor: [0, 46], // point of the icon which will correspond to marker's location
               popupAnchor: [0, -45] // point from which the popup should open relative to the iconAnchor
           });
           const newMarker = L.marker(e.latlng, {
               icon: markerIcon
           });
           map.addLayer(newMarker);
           newMarker.bindPopup(`<b>${title}</b><br>${description}`).openPopup();
   
           newMarker.on('contextmenu', function(e){
               map.removeLayer(newMarker);
           });
           // Store marker information including color
           const markerInfo = {
            latlng: newMarker.getLatLng(),
            title: newMarker.getPopup().getContent(),
            color: color
            };

            // Add the marker information to the markers array
            markers.push(markerInfo);
       }else{
            const markerIcon = L.icon({
                iconUrl: `https://schuttk2.github.io/darwin-map/Black_Icon.png`,
                iconSize: [31, 46], // size of the icon
                iconAnchor: [0, 46], // point of the icon which will correspond to marker's location
                popupAnchor: [0, -45] // point from which the popup should open relative to the iconAnchor
            });

           const newMarker = L.marker(e.latlng, {
               icon: markerIcon
           });
           map.addLayer(newMarker);
           newMarker.bindPopup(`<b>${title}</b><br>${description}`).openPopup();
   
           newMarker.on('contextmenu', function(e){
               map.removeLayer(newMarker);
           });

            // Store marker information including color
            const markerInfo = {
                latlng: newMarker.getLatLng(),
                title: newMarker.getPopup().getContent(),
                color: color
            };

            // Add the marker information to the markers array
            markers.push(markerInfo);
       }
       
       titleInput.value = '';
       descriptionInput.value = '';
       radio.forEach(radio => {
           radio.checked = false;
       });
       
       map.off('click');

   })
}

window.onload = addMarkersToMap;

// Function to add markers to the viewing page's map
function addMarkersToMap() {

    // Add markers to the map
    markers.forEach(marker => {
        L.marker(marker.latlng).addTo(map).bindPopup(`<b>${marker.title}</b><br>${marker.description}`);
    });
}