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


var mapbox = L.tileLayer('https://api.mapbox.com/styles/v1/adryanque/cl3d4aqvh002114nwim5raj6p/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWRyeWFucXVlIiwiYSI6ImNrZDk5bzd3YTAyMTkycG16MnVqeDJtOTEifQ.7tl32VrqOcLSfXMTj2X-YA', {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>"
}).addTo(map);




var rangeSlider = document.getElementById("rs-range-line");
var rangeBullet = document.getElementById("rs-bullet");

rangeSlider.addEventListener("input", showSliderValue, false);

function showSliderValue() {
  rangeBullet.innerHTML = rangeSlider.value;
  var bulletPosition = ((rangeSlider.value - 2001) /(rangeSlider.max - 1820));
  rangeBullet.style.left = (bulletPosition * 6100) + "px";
}




var marker = L.marker([53.83, 17.98]).addTo(map)
marker.bindPopup("siema siema o tej porze").addTo(map)

var nadlesnictwa = L.tileLayer.wms("http://localhost:8080/geoserver/wms", {
layers: 'nadlesnictwa',
format: 'image/png',
zIndex: 4,
transparent: true,
opacity: 1
}).addTo(map);


var baseMaps = {
    "OpenStreetMap": openstreetmap,
    "Mapbox": mapbox
};

var overlayMaps = {
    "Nadleśnictwa": nadlesnictwa
};
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

