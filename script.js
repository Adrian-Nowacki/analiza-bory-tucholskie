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
var sql_text = ""

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
zIndex: 4,
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
    "Bory Tucholskie": bory_tucholskie
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
    if (rangeSlider.value == '2001'){
        wycinki.setParams({CQL_FILTER:"DN <=" + rangeSlider.value});
    }
    else if (rangeSlider.value == '2002'){
        wycinki.setParams({CQL_FILTER:"DN <=" + rangeSlider.value});
    }
    else if (rangeSlider.value == '2003'){
        wycinki.setParams({CQL_FILTER:"DN <=" + rangeSlider.value});
    }
    else if (rangeSlider.value == '2004'){
        wycinki.setParams({CQL_FILTER:"DN <=" + rangeSlider.value});
    }
    else if (rangeSlider.value == '2005'){
        wycinki.setParams({CQL_FILTER:"DN <=" + rangeSlider.value});
    }
    else if (rangeSlider.value == '2006'){
        wycinki.setParams({CQL_FILTER:"DN <=" + rangeSlider.value});
    }
    else if (rangeSlider.value == '2007'){
        wycinki.setParams({CQL_FILTER:"DN <=" + rangeSlider.value});
    }
    else if (rangeSlider.value == '2008'){
        wycinki.setParams({CQL_FILTER:"DN <=" + rangeSlider.value});
    }
    else if (rangeSlider.value == '2009'){
        wycinki.setParams({CQL_FILTER:"DN <=" + rangeSlider.value});
    }
    else if (rangeSlider.value == '2010'){
        wycinki.setParams({CQL_FILTER:"DN <=" + rangeSlider.value});
    }
    else if (rangeSlider.value == '2011'){
        wycinki.setParams({CQL_FILTER:"DN <=" + rangeSlider.value});
    }
    else if (rangeSlider.value == '2012'){
        wycinki.setParams({CQL_FILTER:"DN <=" + rangeSlider.value});
    }
    else if (rangeSlider.value == '2013'){
        wycinki.setParams({CQL_FILTER:"DN <=" + rangeSlider.value});
    }
    else if (rangeSlider.value == '2014'){
        wycinki.setParams({CQL_FILTER:"DN <=" + rangeSlider.value});
    }
    else if (rangeSlider.value == '2015'){
        wycinki.setParams({CQL_FILTER:"DN <=" + rangeSlider.value});
    }
    else if (rangeSlider.value == '2016'){
        wycinki.setParams({CQL_FILTER:"DN <=" + rangeSlider.value});
    }
    else if (rangeSlider.value == '2017'){
        wycinki.setParams({CQL_FILTER:"DN <=" + rangeSlider.value});
    }
    else if (rangeSlider.value == '2018'){
        wycinki.setParams({CQL_FILTER:"DN <=" + rangeSlider.value});
    }
    else if (rangeSlider.value == '2019'){
        wycinki.setParams({CQL_FILTER:"DN <=" + rangeSlider.value});
    }
    else if (rangeSlider.value == '2020'){
        wycinki.setParams({CQL_FILTER:"DN <=" + rangeSlider.value});
    }
}

/*var admin = L.geoJson(lossyear, {color: 'blue', fillOpacity: 0.1, weight: 2
});*/

