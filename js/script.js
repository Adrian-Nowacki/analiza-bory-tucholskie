var map = L.map( 'map', {
    center: [53.85, 17.5],
    minZoom: 7,
	maxZoom: 25,
    zoom: 9.7,
	zoomSnap:0.001,
});

var openstreetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

var mapbox = L.tileLayer('https://api.mapbox.com/styles/v1/adryanque/cl3d4aqvh002114nwim5raj6p/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWRyeWFucXVlIiwiYSI6ImNrZDk5bzd3YTAyMTkycG16MnVqeDJtOTEifQ.7tl32VrqOcLSfXMTj2X-YA', {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>"
}).addTo(map);

var satelita = L.tileLayer('https://api.mapbox.com/styles/v1/adryanque/ckqqyye3r4st018letzv7n099/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWRyeWFucXVlIiwiYSI6ImNrZDk5bzd3YTAyMTkycG16MnVqeDJtOTEifQ.7tl32VrqOcLSfXMTj2X-YA', {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>"
});

var wms_service = "https://poznan-gis.pl/geoserver/wms"
var wfs_service = "https://poznan-gis.pl/geoserver/ows"
var wfs_service_url = "https://poznan-gis.pl/geoserver/deforestacja_bory_tucholskie/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=deforestacja_bory_tucholskie%3Anadlesnictwa&outputFormat=application/json"

/*
async function getWFSgeojson(){
    try{
        const response = await fetch(wfs_service_url);
        console.log(response);
        return await response.json();
    } catch(err) {
        console.log(err);
    }

}
*/
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


var layer;

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 4,
        color: '#151515',
        dashArray: '2',
        fillOpacity: 0.9
    });
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

function resetHighlight(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 1.5,
        opacity: 0.7,
        color: '#222',
        dashArray: '4',
        fillOpacity: 0.7
    });
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
};



var geojsonLayer= new L.GeoJSON.AJAX("https://poznan-gis.pl/geoserver/deforestacja_bory_tucholskie/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=deforestacja_bory_tucholskie%3Anadlesnictwa&outputFormat=application/json",{onEachFeature:function forEachFeature (feature,layer){
},
style:style,
onEachFeature: function (feature, layer){
    console.log(feature);
    layer.bindPopup('<table id = "tabela_zespoly">\
    <caption>'+feature.properties.ins_name+'</caption>\
    <tr class = "wiersz">\
      <td id = "komorka_zespoly">Region: </td>\
      <td id = "komorka2_zespoly">'+feature.properties.reg_name+'</td>\
    </tr>\
    <tr class = "wiersz">\
      <td id = "komorka_zespoly">Pow. wycinek: </td>\
      <td id = "komorka2_zespoly">'+feature.properties.pow_wycinek_ha+' ha</td>\
    </tr>\
    </tr>\
    <tr class = "wiersz">\
      <td id = "komorka_zespoly">Pow. nadleśnictwa: </td>\
      <td id = "komorka2_zespoly">'+feature.properties.area_km2+' km<sup>2</sup></td>\
    </tr>\
    <tr class = "wiersz">\
      <td id = "komorka_zespoly">% pokrycia: </td>\
      <td id = "komorka2_zespoly">'+feature.properties.p_cover+'</td>\
    </tr>\
    <tr class = "wiersz">\
      <td id = "komorka_zespoly">% straty: </td>\
      <td id = "komorka2_zespoly">'+feature.properties.p_loss+'</td>\
    </tr>\
    <tr class = "wiersz">\
      <td id = "komorka_zespoly">% przyrostu: </td>\
      <td id = "komorka2_zespoly">'+feature.properties.p_gain+'</td>\
    </tr>\
    </table>')

    /*
    var popupContent = "<div><b>" + feature.properties.reg_name + "</b></br>"
    + "<b> Nadleśnictwo: </b>" + feature.properties.ins_name + "</br>" + "<b> Powierzchnia wycinek: </b>" + feature.properties.pow_wycinek_ha + "</br>" 
    + "<b> Powierzchnia nadleśnictwa: </b>" + feature.properties.area_km2 + "</br>" + "<b> % pokrycia: </b>" + feature.properties.p_cover + "</br>"
    + "<b> % straty: </b>" + feature.properties.p_loss + "</br>" + "<b> % przyrostu: </b>" + feature.properties.p_gain + "</div>";
    layer.bindPopup(popupContent);*/
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
}});

/*
getWFSgeojson().then(data=> {
    var wfsPolylayer = L.geoJSON([data], {
        style:style,
        onEachFeature: function (feature, layer){
            console.log(feature);
            var popupContent = "<div><b>" + feature.properties.reg_name + "</b></br>"
            + "<b> Nadleśnictwo: </b>" + feature.properties.ins_name + "</br>" + "<b> Powierzchnia wycinek: </b>" + feature.properties.pow_wycinek_ha + "</br>" 
            + "<b> Powierzchnia nadleśnictwa: </b>" + feature.properties.area_km2 + "</br>" + "<b> % pokrycia: </b>" + feature.properties.p_cover + "</br>"
            + "<b> % straty: </b>" + feature.properties.p_loss + "</br>" + "<b> % przyrostu: </b>" + feature.properties.p_gain + "</div>";
            layer.bindPopup(popupContent);
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight
            });

/*
            layer.on('click',function(e){
                    var d = document.getElementById("title");
                    d.innerHTML = "Adres: " + feature.properties.pow_wycinek_ha;
        });
        */    
          /*
        }
       
    }).addTo(geojsonLayer);
});
*/


var sql_text = "DN<=2010"


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
        $(".imageopacity").html('100%');
        $(".opacity-slider").val(100);
        map.removeLayer(wycinki);
        map.removeLayer(przyrost_drzew);
        map.removeLayer(warstwa_pokrycie);
        map.removeLayer(zmiana_pokrycia_00_10);
        map.removeLayer(pokrycie_drzew_2010);
        map.removeLayer(pokrycie_drzew_2000);
		geojsonLayer.addTo(map);
        legend.addTo(map);
        $("#slider-container").css("display", "none");
        $(".ikona_tab").css("background-color", "#588c3a");
        $("#warstwa_dane").css("background-color", "#ffffff");
	}});



    document.getElementById("warstwa_pokrycie").addEventListener("click", function () {
        if(!(map.hasLayer(zmiana_pokrycia_00_10))){
            $(".imageopacity").html('100%');
            $(".opacity-slider").val(100);
            map.removeControl(legend);
            map.removeLayer(geojsonLayer);
            map.removeLayer(wycinki); 
            map.removeLayer(przyrost_drzew);
            $("#slider-container").css("display", "none");
            $(".ikona_tab").css("background-color", "#588c3a");
            $("#warstwa_pokrycie").css("background-color", "#ffffff");
        }});


document.getElementById("warstwa_wylesienie").addEventListener("click", function () {
	if(!(map.hasLayer(wycinki))){
        $("#slider-container").css("display", "flex");
        $(".imageopacity").html('100%');
        $(".opacity-slider").val(100);
        wycinki.setOpacity(100);
        map.removeControl(legend);
        map.removeLayer(zmiana_pokrycia_00_10);
        map.removeLayer(pokrycie_drzew_2010);
        map.removeLayer(pokrycie_drzew_2000);
        map.removeLayer(geojsonLayer);
        map.removeLayer(przyrost_drzew);
		wycinki.addTo(map);
        $(".ikona_tab").css("background-color", "#588c3a");
         $("#warstwa_wylesienie").css("background-color", "#ffffff");
	}});


document.getElementById("warstwa_przyrost").addEventListener("click", function () {
	if(!(map.hasLayer(przyrost_drzew))){
        $(".imageopacity").html('100%');
        $(".opacity-slider").val(100);
        przyrost_drzew.addTo(map);
        przyrost_drzew.setOpacity(100);
        map.removeControl(legend);
        map.removeLayer(zmiana_pokrycia_00_10);
        map.removeLayer(pokrycie_drzew_2010);
        map.removeLayer(pokrycie_drzew_2000);
        map.removeLayer(wycinki); 
        map.removeLayer(geojsonLayer);
        $("#slider-container").css("display", "none");
		
        $(".ikona_tab").css("background-color", "#588c3a");
        $("#warstwa_przyrost").css("background-color", "#ffffff");
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

 
  $(".ikona_tab").bind("click", function () {
    map.removeLayer(bory_tucholskie);
    document.getElementById("check_1").checked = false;
    document.getElementById("check_2").checked = false;
    document.getElementById("check_3").checked = false;
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



const defoarea_eachyear = ["0", "223,36", "429,81", "1102,97", "1003,38", "970,01", "1102,74", "1629,73", "727,56", "1775,82", "1831,46", 
"1587,05", "2006,06", "1097,21", "1568,98", "1308,33", "2068,66", "5056,62", "18 052,55", "4047,5", "2224,48"];

const defoarea_sumyear = ["0", "223,36", "653,17", "1756,14", "2759,52", "3729,53", "4832,27", "6462", "7189,56", "8965,38", "10 796,84", 
"12 383,89", "14 389,95", "15 487,16", "17 056,14", "18 364,47", "20 433,13", "25 489,75", "43 542,3", "47 589,8", "49 814,28"]

var powierzchnia = 0;

function showLayerInfo() {
    
    for(let i = rangeSlider.min - 1; i <= rangeSlider.max - 20; i++){
        document.getElementById("wylesienie_statystyki").innerHTML = "<b>Łącznie od 2000 roku: </b>" + defoarea_sumyear[rangeSlider.value - i] + " ha</br></br>"
        + "<b>Rok " + rangeSlider.value + ": </b>" + defoarea_eachyear[rangeSlider.value - i] + " ha";
        
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

/*var skala = */ 
L.control.scale({metric: true,
imperial: false,
position: "bottomright"}).addTo(map);


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

map.zoomControl.setPosition('topright');

document.getElementById("mapa_bazowa_1").addEventListener("click", function(){
	openstreetmap.addTo(map);
	map.removeLayer(satelita);
	map.removeLayer(mapbox);
});
document.getElementById("mapa_bazowa_2").addEventListener("click", function(){
	satelita.addTo(map);
	map.removeLayer(openstreetmap);
	map.removeLayer(mapbox);
});
document.getElementById("mapa_bazowa_3").addEventListener("click", function(){
	mapbox.addTo(map);
	map.removeLayer(openstreetmap);
	map.removeLayer(satelita);
});



/* warstwy pokrycia dla guzikow*/
document.getElementById("guzik_1").addEventListener("click", function(){
	pokrycie_drzew_2000.addTo(map);
    map.removeLayer(pokrycie_drzew_2010);
    map.removeLayer(zmiana_pokrycia_00_10);
});

document.getElementById("guzik_2").addEventListener("click", function(){
	pokrycie_drzew_2010.addTo(map);
    map.removeLayer(pokrycie_drzew_2000);
    map.removeLayer(zmiana_pokrycia_00_10);
});

document.getElementById("guzik_3").addEventListener("click", function(){
	zmiana_pokrycia_00_10.addTo(map);
    map.removeLayer(pokrycie_drzew_2010);
    map.removeLayer(pokrycie_drzew_2000);
});

/*
//przeźroczystość warstw rastrowych
$(document).ready(function(){
	$("#opacity-slider").on('change', function(){
        var output = Math.abs($(this).val());
	$("#image-opacity").html(output.toFixed(2));
	wycinki.setOpacity(this.value * (-1));
	})
});
*/

//przeźroczystość warstw rastrowych
$(document).ready(function(){
	$(".opacity-slider").on('input', function(value){
	$(".imageopacity").html(this.value + "%");
	wycinki.setOpacity(this.value / 100);
    pokrycie_drzew_2000.setOpacity(this.value / 100);
    pokrycie_drzew_2010.setOpacity(this.value / 100);
    przyrost_drzew.setOpacity(this.value / 100);
    zmiana_pokrycia_00_10.setOpacity(this.value / 100);
	})
});