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
var wfs_service_url = "http://localhost:8080/geoserver/projekt_bory_tucholskie/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=projekt_bory_tucholskie%3Anadlesnictwa_przyciete&outputFormat=application/json"

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
    return DN > 7000  ? '#1c4f60' :
           DN > 5000  ? '#246d70' :
           DN > 2000  ? '#358679' :
           DN > 1000  ? '#4da183' :
           DN > 500   ? '#6cbc90' :
           DN > 100   ? '#95d2a4' :
                      '#c4e6c3';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.pow_wycinek_ha),
        weight: 1.5,
        opacity: 0.7,
        color: '#222',
        dashArray: '4',
        fillOpacity: 0.7
    };
}

getWFSgeojson().then(data=> {
    var wfsPolylayer = L.geoJSON([data], {
        onEachFeature: function (feature, layer){
            console.log(feature);
            var popupContent = "<div><b>" + feature.properties.reg_name + "</b></br>"
            + "<b> Nadleśnictwo: </b>" + feature.properties.ins_name + "</br>" + "<b> Powierzchnia wycinek: </b>" + feature.properties.pow_wycinek_ha + "</br>" 
            + "<b> Powierzchnia nadleśnictwa: </b>" + feature.properties.area_km2 + "</br>" + "<b> % pokrycia: </b>" + feature.properties.p_cover + "</br>"
            + "<b> % straty: </b>" + feature.properties.p_loss + "</br>" + "<b> % przyrostu: </b>" + feature.properties.p_gain + "</div>";
            layer.bindPopup(popupContent);


            layer.on('click',function(e){
                    var d = document.getElementById("title");
                    d.innerHTML = "Adres: " + feature.properties.pow_wycinek_ha;
        });
            
            
        },
        style: style,
    }).addTo(geojsonLayer);
});




var sql_text = "DN=2000"

var nadlesnictwa = L.tileLayer.wms(wms_service, {
    layers: 'nadlesnictwa',
    format: 'image/png',
    zIndex: 4,
    transparent: true,
    opacity: 1
});

var bory_tucholskie = L.tileLayer.wms(wms_service, {
    layers: 'bory_tucholskie',
    format: 'image/png',
    zIndex: 4,
    transparent: true,
    opacity: 1
});


var wycinki = L.tileLayer.wms(wms_service, {
    layers: 'wycinki',
    format: 'image/png',
    zIndex: 10,
    transparent: true,
    opacity: 1,
    cql_filter:sql_text
})

var przyrost_drzew = L.tileLayer.wms(wms_service, {
    layers: 'przyrost_drzew',
    format: 'image/png',
    zIndex: 4,
    transparent: true,
    opacity: 1
    
});

var pokrycie_drzew_2000 = L.tileLayer.wms(wms_service, {
    layers: 'pokrycie_drzew_2000',
    format: 'image/png',
    zIndex: 4,
    transparent: true,
    opacity: 1
});

var pokrycie_drzew_2010 = L.tileLayer.wms(wms_service, {
    layers: 'pokrycie_drzew_2010',
    format: 'image/png',
    zIndex: 4,
    transparent: true,
    opacity: 1
});   

var zmiana_pokrycia_00_10 = L.tileLayer.wms(wms_service, {
    layers: 'zmiana_pokrycia_00_10',
    format: 'image/png',
    zIndex: 4,
    transparent: true,
    opacity: 1
});   


var baseMaps = {
    "OpenStreetMap": openstreetmap,
    "Mapbox": mapbox
};

document.getElementById("warstwa_dane").addEventListener("click", function () {
	if(!(map.hasLayer(geojsonLayer))){
        map.removeLayer(zmiana_pokrycia_00_10);
        map.removeLayer(wycinki) 
        map.removeLayer(przyrost_drzew);
		geojsonLayer.addTo(map);
        $(".ikona_tab").css("background-color", "#588c3a");
         $("#warstwa_dane").css("background-color", "#ffffff");
         map.removeLayer(warstwa_pokrycie)
	}
	else if(map.hasLayer(geojsonLayer)){
	map.removeLayer(geojsonLayer);
    $(".ikona_tab").css("background-color", "#588c3a");
}});

/*
document.getElementById("warstwa_granice").addEventListener("click", function () {
	if(!(map.hasLayer())){
		.addTo(map);
        $("#warstwa_granice").css("background-color", "#ffffff");
	}
	else if(map.hasLayer()){
	map.removeLayer(); 
    $(".ikona_tab").css("background-color", "#588c3a");
    
}});
*/

document.getElementById("warstwa_pokrycie").addEventListener("click", function () {
	if(!(map.hasLayer(zmiana_pokrycia_00_10))){
        map.removeLayer(geojsonLayer);
        map.removeLayer(wycinki) 
        map.removeLayer(przyrost_drzew);
		zmiana_pokrycia_00_10.addTo(map);
        $(".ikona_tab").css("background-color", "#588c3a");
        $("#warstwa_pokrycie").css("background-color", "#ffffff");
	}
	else if(map.hasLayer(zmiana_pokrycia_00_10)){
	map.removeLayer(zmiana_pokrycia_00_10);
    $(".ikona_tab").css("background-color", "#588c3a");
}});


document.getElementById("warstwa_wylesienie").addEventListener("click", function () {
	if(!(map.hasLayer(wycinki))){
        map.removeLayer(zmiana_pokrycia_00_10);
        map.removeLayer(geojsonLayer) 
        map.removeLayer(przyrost_drzew);
		wycinki.addTo(map);
        $(".ikona_tab").css("background-color", "#588c3a");
         $("#warstwa_wylesienie").css("background-color", "#ffffff");
	}
	else if(map.hasLayer(wycinki)){
	map.removeLayer(wycinki);
    $(".ikona_tab").css("background-color", "#588c3a");
}});


document.getElementById("warstwa_przyrost").addEventListener("click", function () {
	if(!(map.hasLayer(przyrost_drzew))){
        map.removeLayer(zmiana_pokrycia_00_10);
        map.removeLayer(wycinki) 
        map.removeLayer(geojsonLayer);
		przyrost_drzew.addTo(map);
        $(".ikona_tab").css("background-color", "#588c3a");
        $("#warstwa_przyrost").css("background-color", "#ffffff");
	}
	else if(map.hasLayer(przyrost_drzew)){
	map.removeLayer(przyrost_drzew);
    $(".ikona_tab").css("background-color", "#588c3a");
}});


document.getElementById("warstwa_tornado").addEventListener("click", function () {
	if(!(map.hasLayer())){
        $("#warstwa_tornado").css("background-color", "#ffffff");
	}
	else if(map.hasLayer()){
        $(".ikona_tab").css("background-color", "#588c3a");
}});



var bool = !bool;
$(".checkbox_granica").change(function(){
    if(!(map.hasLayer(bory_tucholskie))){
        map.addLayer(bory_tucholskie)
    }

    else{
        map.removeLayer(bory_tucholskie)
    }
  });

  function bory_remove(){
    map.removeLayer(bory_tucholskie);
  }
  $(".ikona_tab").bind("click", function () {
    map.removeLayer(bory_tucholskie);
  });
/*
var overlayMaps = {
    "Granica Borów Tucholskich": bory_tucholskie,
    "Nadleśnictwa": geojsonLayer,
    "Przyrost drzew": przyrost_drzew,
    "Pokrycie drzewami w 2000 r.": pokrycie_drzew_2000,
    "Pokrycie drzewami w 2010 r.": pokrycie_drzew_2010,
    "Zmiana pokrycia drzewami 2000-2010": zmiana_pokrycia_00_10

};
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
*/
var rangeSlider = document.getElementById("rs-range-line");
var rangeBullet = document.getElementById("rs-bullet");

rangeSlider.addEventListener("input", showSliderValue, false);
rangeSlider.addEventListener("input", showLayerInfo, false);

const cars = ["27 km", "1440 km", "twoja stara", "12.333 km"];


function showLayerInfo() {
    for(let i = rangeSlider.min - 1; i <= rangeSlider.max - 20; i++){
        document.getElementById("title").innerHTML = cars[rangeSlider.value - i];
        
    }
  
}

function showSliderValue() {
  rangeBullet.innerHTML = rangeSlider.value;
  var bulletPosition = ((rangeSlider.value - 2000) /(rangeSlider.max - 1809));
  rangeBullet.style.left = (bulletPosition * 6100) + "px";
}

rangeSlider.addEventListener("input", info, false);

function info(){
    for (let i = 2000; i <= 2020; i++){
        wycinki.setParams({CQL_FILTER:"DN <=" + rangeSlider.value})

    }
}

var skala = L.control.scale(imperial=false).addTo(map);

/*var admin = L.geoJson(gain, {color: 'blue', fillOpacity: 0.1, weight: 2
});*/




/* legenda do warstw*/

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    var grades = [100, 500, 1000, 2000, 5000, 7000];
    var labels = [];
    var from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? ' &ndash; ' + to : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};
legend.addTo(map);

map.zoomControl.setPosition('topright');
