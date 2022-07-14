var map = L.map( 'map', {
    center: [53.85, 17.5],
    minZoom: 7,
	maxZoom: 25,
    zoom: 9.7,
	zoomSnap:0.001,
});
var openstreetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


var mapbox = L.tileLayer('https://api.mapbox.com/styles/v1/adryanque/cl3d4aqvh002114nwim5raj6p/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWRyeWFucXVlIiwiYSI6ImNrZDk5bzd3YTAyMTkycG16MnVqeDJtOTEifQ.7tl32VrqOcLSfXMTj2X-YA', {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>"
}).addTo(map);

var wms_service = "http://localhost:8080/geoserver/wms"
var wfs_service = "http://localhost:8080/geoserver/ows"
var wfs_service_url = "http://localhost:8080/geoserver/projekt_bory_tucholskie/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=projekt_bory_tucholskie%3Anadlesnictwa&outputFormat=application/json"

async function getWFSgeojson(){
    try{
        const response = await fetch(wfs_service_url);
        console.log(response);
        return await response.json();
    } catch(err) {
        console.log(err);
    }

}

var geojsonLayer = new L.GeoJSON();

function getColor(DN) {
    return DN > 7000  ? '#BD0026' :
           DN > 5000  ? '#E31A1C' :
           DN > 2000  ? '#FC4E2A' :
           DN > 1000   ? '#FD8D3C' :
           DN > 500   ? '#FEB24C' :
           DN > 100   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.pow_wycinek_ha),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

getWFSgeojson().then(data=> {
    var wfsPolylayer = L.geoJSON([data], {
        onEachFeature: function (feature, layer){
            console.log(feature);
            var popupContent = "<div><b>" + feature.properties.reg_name + "</b></br>"
            + feature.properties.ins_name + "</br>" + feature.properties.pow_wycinek_ha + "</div>";
            layer.bindPopup(popupContent);
        },
        style: style,
    }).addTo(geojsonLayer);
});



var sql_text = "DN=2001"

var nadlesnictwa = L.tileLayer.wms(wms_service, {
layers: 'nadlesnictwa',
format: 'image/png',
zIndex: 4,
transparent: true,
opacity: 1
})

var bory_tucholskie = L.tileLayer.wms(wms_service, {
layers: 'bory_tucholskie',
format: 'image/png',
zIndex: 4,
transparent: true,
opacity: 1
})


var wycinki = L.tileLayer.wms(wms_service, {
layers: 'wycinki',
format: 'image/png',
zIndex: 10,
transparent: true,
opacity: 1,
cql_filter:sql_text
}).addTo(map);





var baseMaps = {
    "OpenStreetMap": openstreetmap,
    "Mapbox": mapbox
};

var overlayMaps = {
    "Nadleśnictwa": nadlesnictwa,
    "Bory Tucholskie": bory_tucholskie,
    "eeee": geojsonLayer
};
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);



var rangeSlider = document.getElementById("rs-range-line");
var rangeBullet = document.getElementById("rs-bullet");

rangeSlider.addEventListener("input", showSliderValue, false);

function showSliderValue() {
  rangeBullet.innerHTML = rangeSlider.value;
  var bulletPosition = ((rangeSlider.value - 2001) /(rangeSlider.max - 1820));
  rangeBullet.style.left = (bulletPosition * 6100) + "px";
}

rangeSlider.addEventListener("input", info, false);

function info(){
    for (let i = 2001; i <= 2020; i++){
        wycinki.setParams({CQL_FILTER:"DN <=" + rangeSlider.value})

    }
}

var skala = L.control.scale().addTo(map);

/*var admin = L.geoJson(lossyear, {color: 'blue', fillOpacity: 0.1, weight: 2
});*/

