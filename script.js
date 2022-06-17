var map = L.map( 'map', {
    center: [53.83, 17.98],
    minZoom: 7,
	maxZoom: 15,
    zoom: 9,
	zoomSnap:0.001,
});
var openstreetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
