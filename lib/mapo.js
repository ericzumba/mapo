function grad(i) {
  var hex = function(x) {
      x = x.toString(16);
      return x 
  };

  var step = 1 
  var r = hex(15)
  var g = hex(0 + (i * step))
  var b = hex(0)
  return "#" + r + g + b 
}

function toLatLon(doc) {
  var latf = "coordenadas_0_coordinate"
  var lonf = "coordenadas_1_coordinate"
  return {
    lat: doc[latf],
    lon: doc[lonf]
  }
}

function bounds(docs, comp) {
  return docs
    .map(toLatLon)
    .reduce((acc, cur) => {
      return {
        lat: comp(acc.lat, cur.lat), 
        lon: comp(acc.lon, cur.lon)
      }
    }, {
      lat: 0,
      lon: 0
    })
}

function loadMap(info) {
  var docs = JSON.parse(info).response.docs
  var firstDoc = docs[0]
  
  var latf = "coordenadas_0_coordinate"
  var lonf = "coordenadas_1_coordinate"

  var mymap = L.map('mapid');

  docs.forEach(function(doc, i) {
    L.circle([doc[latf], doc[lonf]], {
      color: grad(i),
      fillColor: grad(i),
      fillOpacity: 0.4,
      radius: 1000 
    }).bindPopup((i + 1) + ". " + doc.id).addTo(mymap)
  }) 

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(mymap);


  var sw = bounds(docs, Math.min) 
  var ne = bounds(docs, Math.max) 
  console.log(sw)
  console.log(ne)
  mymap.fitBounds([[sw.lat, sw.lon], [ne.lat, ne.lon]])
}

function notifyContentScript() {
  console.log('talking to content script');
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.sendMessage(
        tabs[0].id,
        { from: 'mapo', subject: 'PopupReady' }, 
        loadMap);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  notifyContentScript()
});
