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



var magnifiedTiles = L.tileLayer('https://api.mapbox.com/styles/v1/adryanque/cl3d4aqvh002114nwim5raj6p/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWRyeWFucXVlIiwiYSI6ImNrZDk5bzd3YTAyMTkycG16MnVqeDJtOTEifQ.7tl32VrqOcLSfXMTj2X-YA', {
attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>"
})



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

/* style dla warstw nadleśnictw, w zależności od wybranej zmiennej */
function getColor_nadlesnictwa_pow_wycinek(DN) {
    return DN > 7500  ? '#1c4f60' :
           DN > 6000  ? '#246d70' :
           DN > 4500  ? '#358679' :
           DN > 3000  ? '#4da183' :
           DN > 1500   ? '#6cbc90' :
           DN > 500   ? '#95d2a4' :
                      '#c4e6c3';
};

function getColor_nadlesnictwa_procent_straty(DN) {
  return DN > 60  ? '#1c4f60' :
         DN > 30  ? '#246d70' :
         DN > 25  ? '#358679' :
         DN > 20  ? '#4da183' :
         DN > 15  ? '#6cbc90' :
         DN > 10  ? '#95d2a4' :
         DN > 5   ? '#b9e4c4' :
                    '#c4e6c3';
};

function getColor_nadlesnictwa_procent_przyrostu(DN) {
  return DN > 4.5  ? '#1c4f60' :
         DN > 4    ? '#246d70' :
         DN > 3.5  ? '#358679' :
         DN > 3    ? '#4da183' :
         DN > 2.5  ? '#6cbc90' :
         DN > 2    ? '#95d2a4' :
         DN > 1.5  ? '#b9e4c4' :
                    '#c4e6c3';
};

function getColor_nadlesnictwa_powierzchnia(DN) {
  return DN > 400  ? '#1c4f60' :
         DN > 250  ? '#246d70' :
         DN > 200  ? '#358679' :
         DN > 150  ? '#4da183' :
         DN > 100  ? '#6cbc90' :
         DN > 50   ? '#95d2a4' :
         DN > 0    ? '#b9e4c4' :
                    '#c4e6c3';
};

function getColor_nadlesnictwa_proc_przykrycia_2000(DN) {
  return DN > 75  ? '#1c4f60' :
         DN > 70  ? '#246d70' :
         DN > 65  ? '#358679' :
         DN > 60  ? '#4da183' :
         DN > 55  ? '#6cbc90' :
         DN > 50   ? '#95d2a4' :
         DN > 40    ? '#b9e4c4' :
                    '#c4e6c3';
};


function getColor_pokrycie_00(DN) {
    return DN > 80   ? '#0c5246' :
           DN > 60    ? '#458566' :
           DN > 40    ? '#50ac75' :
           DN > 20    ? '#78bd74' :
           DN > 0    ? '#dce2a5' :
                        '#ffffff';
};


function getColor_zmiana_pokrycia(DN) {
    return DN > 75     ? '#0c5246' :
           DN > 50     ? '#458566' :
           DN > 25     ? '#50ac75' :
           DN > 0      ? '#5fba6c' :
           DN > -25      ? '#eccd8b' :
           DN > -50   ? '#e49562' :
           DN > -75    ? '#a33a3a' :
           DN > -100    ? '#6c2626' :
                        '#ffffff';
};


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




function style_stats_pow_wycinek(feature) {
    return {
        fillColor: getColor_nadlesnictwa_pow_wycinek(feature.properties.pow_wycinek_ha),
        weight: 1.5,
        opacity: 0.7,
        color: '#222',
        dashArray: '4',
        fillOpacity: 0.7
    };
}

function style_stats_strata(feature) {
  return {
      fillColor: getColor_nadlesnictwa_procent_straty(feature.properties.p_loss),
      weight: 1.5,
      opacity: 0.7,
      color: '#222',
      dashArray: '4',
      fillOpacity: 0.7
  };
}

function style_stats_przyrost(feature) {
  return {
      fillColor: getColor_nadlesnictwa_procent_przyrostu(feature.properties.p_gain),
      weight: 1.5,
      opacity: 0.7,
      color: '#222',
      dashArray: '4',
      fillOpacity: 0.7
  };
}

function style_stats_powierzchnia(feature) {
  return {
      fillColor: getColor_nadlesnictwa_powierzchnia(feature.properties.area_km2),
      weight: 1.5,
      opacity: 0.7,
      color: '#222',
      dashArray: '4',
      fillOpacity: 0.7
  };
}

function style_stats_proc_przykrycia_2000(feature) {
  return {
      fillColor: getColor_nadlesnictwa_proc_przykrycia_2000(feature.properties.p_cover),
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
style:style_stats_pow_wycinek,
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



var nadlesnictwa_button = new L.GeoJSON.AJAX("https://poznan-gis.pl/geoserver/deforestacja_bory_tucholskie/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=deforestacja_bory_tucholskie%3Anadlesnictwa&outputFormat=application/json",{onEachFeature:function forEachFeature (feature,layer){
}, style:{
  fill: '#444444',
  weight: 2,
  opacity: 0.8,
  color: '#222222',
  dashArray: '4',
  fillOpacity: 0.2
},
onEachFeature: function (feature, layer){
    layer.bindPopup('<caption>'+feature.properties.ins_name+'</caption>')
}});





var wichura_2017= new L.GeoJSON.AJAX("https://raw.githubusercontent.com/Adrian-Nowacki/analiza-bory-tucholskie/main/poligony/geojson/wichura_2017.geojson",{onEachFeature:function forEachFeature (feature,layer){
}, style:{
      fill: '#444444',
      weight: 2,
      opacity: 0.8,
      color: '#222222',
      dashArray: '4',
      fillOpacity: 0.7
  }
});

var wichura_2012= new L.GeoJSON.AJAX("https://raw.githubusercontent.com/Adrian-Nowacki/analiza-bory-tucholskie/main/poligony/geojson/wichura_2012.geojson",{onEachFeature:function forEachFeature (feature,layer){
}, style:{
  fill: '#444444',
  weight: 2,
  opacity: 0.8,
  color: '#222222',
  dashArray: '4',
  fillOpacity: 0.7
}
});



var marker_2017 = new L.marker([53.930813, 17.712754], { opacity: 0 }); //opacity may be set to zero
marker_2017.bindTooltip("Wichura w 2017 r.", {
  permanent: true, 
  className: "my-label",
  fill:"#222222", 
  offset: [0, 0] });


var marker_2012 = new L.marker([53.638, 18.319], { opacity: 0 }); //opacity may be set to zero
marker_2012.bindTooltip("Trąba powietrzna w 2012 r.", {
  permanent: true, 
  className: "my-label", 
  offset: [0, 0] });

var wichury = L.layerGroup([wichura_2012, wichura_2017, marker_2012, marker_2017]);
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


/* alternatywa dla nie działającej opcji na geoserverze z pojemnością stylów .sld*/

var wycinki = L.tileLayer.wms(wms_service, {
    layers: 'wycinki',
    format: 'image/png',
    zIndex: 10,
    transparent: true,
    opacity: 1,
    cql_filter:sql_text
});



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
        map.removeLayer(wichury);
        map.removeControl(magnifyingGlass);
		    geojsonLayer.addTo(map);
        legend_nadlesnictwa_pow_wycinek.addTo(map);
        map.removeControl(legend_pokrycie_00);
        map.removeControl(legend_zmiana_pokrycia);
        $("#slider-container").css("display", "none");
        $(".ikona_tab").css("background-color", "#588c3a");
        $("#warstwa_dane").css("background-color", "#ffffff");
	}});



    document.getElementById("warstwa_pokrycie").addEventListener("click", function () {
        if(!(map.hasLayer(zmiana_pokrycia_00_10))){
            $(".imageopacity").html('100%');
            $(".opacity-slider").val(100);
            map.removeControl(legend_nadlesnictwa_pow_wycinek);
            map.removeLayer(geojsonLayer);
            map.removeLayer(wycinki); 
            map.removeLayer(przyrost_drzew);
            map.removeLayer(wichury);
            map.removeControl(magnifyingGlass);
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
        map.removeControl(legend_nadlesnictwa_pow_wycinek);
        map.removeControl(legend_pokrycie_00);
        map.removeControl(legend_zmiana_pokrycia);
        map.removeLayer(zmiana_pokrycia_00_10);
        map.removeLayer(pokrycie_drzew_2010);
        map.removeLayer(pokrycie_drzew_2000);
        map.removeLayer(geojsonLayer);
        map.removeLayer(przyrost_drzew);
        map.removeLayer(wichury);
        map.removeControl(magnifyingGlass);
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
        map.removeControl(legend_nadlesnictwa_pow_wycinek);
        map.removeControl(legend_pokrycie_00);
        map.removeControl(legend_zmiana_pokrycia);
        map.removeLayer(zmiana_pokrycia_00_10);
        map.removeLayer(pokrycie_drzew_2010);
        map.removeLayer(pokrycie_drzew_2000);
        map.removeLayer(wycinki); 
        map.removeLayer(geojsonLayer);
        map.removeLayer(wichury);
        map.removeControl(magnifyingGlass);
        $("#slider-container").css("display", "none");
		
        $(".ikona_tab").css("background-color", "#588c3a");
        $("#warstwa_przyrost").css("background-color", "#ffffff");
	}});


document.getElementById("warstwa_tornado").addEventListener("click", function () {
	if(!(map.hasLayer(wichury))){
        map.removeControl(legend_nadlesnictwa_pow_wycinek);
        map.removeControl(legend_pokrycie_00);
        map.removeControl(legend_zmiana_pokrycia);
        map.removeLayer(zmiana_pokrycia_00_10);
        map.removeLayer(pokrycie_drzew_2010);
        map.removeLayer(pokrycie_drzew_2000);
        map.removeLayer(geojsonLayer);
        map.removeLayer(przyrost_drzew);
        map.removeLayer(wycinki);
        map.removeControl(magnifyingGlass);
		    wichury.addTo(map);
        $("#slider-container").css("display", "none");
        $(".ikona_tab").css("background-color", "#588c3a");
        $("#warstwa_tornado").css("background-color", "#ffffff");
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

$(".checkbox_nadlesnictwa").change(function(){
    if(!(map.hasLayer(nadlesnictwa_button))){
        map.addLayer(nadlesnictwa_button)
    }
    else{
        map.removeLayer(nadlesnictwa_button)
    }
  });

 
  $(".ikona_tab").bind("click", function () {
    map.removeLayer(bory_tucholskie);
    map.removeLayer(nadlesnictwa_button);
    document.getElementById("check_1").checked = false;
    document.getElementById("check_2").checked = false;
    document.getElementById("check_3").checked = false;
    document.getElementById("check_4").checked = false;
    document.getElementById("check_nadlesnictwo_1").checked = false;
    document.getElementById("check_nadlesnictwo_2").checked = false;
    document.getElementById("check_nadlesnictwo_3").checked = false;
    document.getElementById("check_nadlesnictwo_4").checked = false;
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
        document.getElementById("wylesienie_stats").innerHTML = "<tr id='wylesienie_tabela'><td><b>Łącznie od 2000 roku: </b></td><td>" + defoarea_sumyear[rangeSlider.value - i] + " ha</td></tr><tr>"
        + "<td><b>Rok " + rangeSlider.value + ": </b></td><td>" + defoarea_eachyear[rangeSlider.value - i] + " ha</td></tr>";
        
    }
  
}

function showSliderValue() {
  rangeBullet.innerHTML = rangeSlider.value;
  var bulletPosition = ((rangeSlider.value - 2000) /(rangeSlider.max - 1809));
  rangeBullet.style.left = (bulletPosition * 6100) + "px";
}

rangeSlider.addEventListener("input", info, false);



/* alternatywa dla nie działającej opcji na geoserverze z pojemnością stylów .sld*/

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

var legend_nadlesnictwa_pow_wycinek = L.control({position: 'bottomright'});
var legend_pokrycie_00 = L.control({position: 'bottomright'});
var legend_zmiana_pokrycia = L.control({position: 'bottomright'});
var legend_nadlesnictwa_strata = L.control({position: 'bottomright'});
var legend_nadlesnictwa_przyrost = L.control({position: 'bottomright'});
var legend_nadlesnictwa_powierzchnia = L.control({position: 'bottomright'});
var legend_nadlesnictwa_proc_przykrycia_2000 = L.control({position: 'bottomright'});


legend_nadlesnictwa_pow_wycinek.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var grades = [500, 1500, 3000, 4500, 6000, 7500];
    var labels = [];
    var from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColor_nadlesnictwa_pow_wycinek(from + 1) + '"></i> ' +
            from + (to ? ' &ndash; ' + to : '+'));
    }
    div.innerHTML = labels.join('<br>');
    return div;
};



legend_pokrycie_00.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var grades = [0, 20, 40, 60, 80];
    var labels = [];
    var from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColor_pokrycie_00(from + 1) + '"></i> ' +
            from + (to ? ' &ndash; ' + to : '+'));
    }
    div.innerHTML = labels.join('<br>');
    return div;
};



legend_zmiana_pokrycia.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var grades = [-100, -75, -50, -25, 0, 25, 50, 75];
    var labels = [];
    var from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i id = "clr_zmiana_pokrycia_' + i + '" style="background:' + getColor_zmiana_pokrycia(from + 1) + '"></i> ' +
            from + (to ? ' &ndash; ' + to : '+'));
            labels.id = 'aaa'
    }
    div.innerHTML = labels.join('<br>');
    return div;
};


legend_nadlesnictwa_strata.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  var grades = [5, 10, 15, 20, 25, 30, 60];
  var labels = [];
  var from, to;

  for (var i = 0; i < grades.length; i++) {
      from = grades[i];
      to = grades[i + 1];

      labels.push(
          '<i id = "clr_zmiana_pokrycia_' + i + '" style="background:' + getColor_nadlesnictwa_procent_straty(from + 1) + '"></i> ' +
          from + (to ? ' &ndash; ' + to : '+'));
          labels.id = 'aaa'
  }
  div.innerHTML = labels.join('<br>');
  return div;
};


legend_nadlesnictwa_przyrost.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  var grades = [1.5, 2, 2.5, 3, 3.5, 4, 4.5];
  var labels = [];
  var from, to;

  for (var i = 0; i < grades.length; i++) {
      from = grades[i];
      to = grades[i + 1];

      labels.push(
          '<i id = "clr_zmiana_pokrycia_' + i + '" style="background:' + getColor_nadlesnictwa_procent_przyrostu(from + 0.5) + '"></i> ' +
          from + (to ? ' &ndash; ' + to : '+'));
          labels.id = 'aaa'
  }
  div.innerHTML = labels.join('<br>');
  return div;
};


legend_nadlesnictwa_powierzchnia.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  var grades = [0, 50, 100, 150, 200, 250, 400];
  var labels = [];
  var from, to;

  for (var i = 0; i < grades.length; i++) {
      from = grades[i];
      to = grades[i + 1];

      labels.push(
          '<i id = "clr_zmiana_pokrycia_' + i + '" style="background:' + getColor_nadlesnictwa_powierzchnia(from + 1) + '"></i> ' +
          from + (to ? ' &ndash; ' + to : '+'));
          labels.id = 'aaa'
  }
  div.innerHTML = labels.join('<br>');
  return div;
};

legend_nadlesnictwa_proc_przykrycia_2000.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  var grades = [40, 50, 55, 60, 65, 70, 75];
  var labels = [];
  var from, to;

  for (var i = 0; i < grades.length; i++) {
      from = grades[i];
      to = grades[i + 1];

      labels.push(
          '<i id = "clr_zmiana_pokrycia_' + i + '" style="background:' + getColor_nadlesnictwa_proc_przykrycia_2000(from + 1) + '"></i> ' +
          from + (to ? ' &ndash; ' + to : '+'));
          labels.id = 'aaa'
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
    legend_pokrycie_00.addTo(map);
    magnifyingGlass.addTo(map);
    map.removeLayer(pokrycie_drzew_2010);
    map.removeLayer(zmiana_pokrycia_00_10);
    map.removeControl(legend_zmiana_pokrycia);
});

document.getElementById("guzik_2").addEventListener("click", function(){
	pokrycie_drzew_2010.addTo(map);
    legend_pokrycie_00.addTo(map);
    magnifyingGlass.addTo(map);
    map.removeLayer(pokrycie_drzew_2000);
    map.removeLayer(zmiana_pokrycia_00_10);
    map.removeControl(legend_zmiana_pokrycia);
});

document.getElementById("guzik_3").addEventListener("click", function(){
	zmiana_pokrycia_00_10.addTo(map);
    legend_zmiana_pokrycia.addTo(map);
    magnifyingGlass.addTo(map);
    map.removeLayer(pokrycie_drzew_2010);
    map.removeLayer(pokrycie_drzew_2000);
    map.removeControl(legend_pokrycie_00);
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



/* warstwy do wyświetlania w lupie*/
var lupa_1= L.tileLayer.wms(wms_service, {
  layers: 'zmiana_pokrycia_00_10',
  format: 'image/png',
  zIndex: 10,
  transparent: true,
  opacity: 1,
  cql_filter:sql_text
});

var lupa_2= L.tileLayer.wms(wms_service, {
  layers: 'pokrycie_drzew_2010',
  format: 'image/png',
  zIndex: 10,
  transparent: true,
  opacity: 1,
  cql_filter:sql_text
});



var magnifyingGlass = L.magnifyingGlass({
  layers: [lupa_1, lupa_2,  magnifiedTiles],
  zoomOffset: 2,
  radius: 90
  });


document.getElementById("strata_stats").addEventListener("click", function () {
  $(".stats").css("border", "none");
  $(".stats").css("border-left", "none");
  document.getElementById("strata_stats").style.border = "0.5px solid #222222";
  document.getElementById("strata_stats").style.borderLeft = "12px solid #588c3a";
  geojsonLayer.setStyle(style_stats_strata);
  legend_nadlesnictwa_strata.addTo(map);
  map.removeControl(legend_nadlesnictwa_pow_wycinek);
  map.removeControl(legend_nadlesnictwa_powierzchnia);
  map.removeControl(legend_nadlesnictwa_przyrost);
  map.removeControl(legend_nadlesnictwa_proc_przykrycia_2000);
});

document.getElementById("przyrost_stats").addEventListener("click", function () {
  $(".stats").css("border", "none");
  $(".stats").css("border-left", "none");
  document.getElementById("przyrost_stats").style.border = "0.5px solid #222222";
  document.getElementById("przyrost_stats").style.borderLeft = "12px solid #588c3a";
  geojsonLayer.setStyle(style_stats_przyrost);
  legend_nadlesnictwa_przyrost.addTo(map);
  map.removeControl(legend_nadlesnictwa_pow_wycinek);
  map.removeControl(legend_nadlesnictwa_strata);
  map.removeControl(legend_nadlesnictwa_powierzchnia);
  map.removeControl(legend_nadlesnictwa_proc_przykrycia_2000);
});

document.getElementById("powierzchnia_stats").addEventListener("click", function () {
  $(".stats").css("border", "none");
  $(".stats").css("border-left", "none");
  document.getElementById("powierzchnia_stats").style.border = "0.5px solid #222222";
  document.getElementById("powierzchnia_stats").style.borderLeft = "12px solid #588c3a";
  geojsonLayer.setStyle(style_stats_powierzchnia);
  legend_nadlesnictwa_powierzchnia.addTo(map);
  map.removeControl(legend_nadlesnictwa_pow_wycinek);
  map.removeControl(legend_nadlesnictwa_przyrost);
  map.removeControl(legend_nadlesnictwa_strata);
  map.removeControl(legend_nadlesnictwa_proc_przykrycia_2000);
});


document.getElementById("przykrycie_2000_stats").addEventListener("click", function () {
  $(".stats").css("border", "none");
  $(".stats").css("border-left", "none");
  document.getElementById("przykrycie_2000_stats").style.border = "0.5px solid #222222";
  document.getElementById("przykrycie_2000_stats").style.borderLeft = "12px solid #588c3a";
  geojsonLayer.setStyle(style_stats_proc_przykrycia_2000);
  legend_nadlesnictwa_proc_przykrycia_2000.addTo(map);
  map.removeControl(legend_nadlesnictwa_pow_wycinek);
  map.removeControl(legend_nadlesnictwa_powierzchnia);
  map.removeControl(legend_nadlesnictwa_przyrost);
  map.removeControl(legend_nadlesnictwa_strata);
});

document.getElementById("powierzchnia_strat_stats").addEventListener("click", function () {
  $(".stats").css("border", "none");
  $(".stats").css("border-left", "none");
  document.getElementById("powierzchnia_strat_stats").style.border = "0.5px solid #222222";
  document.getElementById("powierzchnia_strat_stats").style.borderLeft = "12px solid #588c3a";
  
  geojsonLayer.setStyle(style_stats_pow_wycinek);
  legend_nadlesnictwa_pow_wycinek.addTo(map);
  map.removeControl(legend_nadlesnictwa_powierzchnia);
  map.removeControl(legend_nadlesnictwa_przyrost);
  map.removeControl(legend_nadlesnictwa_strata);
  map.removeControl(legend_nadlesnictwa_proc_przykrycia_2000);
});
