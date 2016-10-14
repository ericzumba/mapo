function grad(i) {
  var hex = function(x) {
      x = x.toString(16);
      return x 
  };

  var step = 1 
  var r = hex(15 - (i * step))
  var g = hex(0 + (i * step))
  var b = "0"
  return "#" + r + g + b 
}

function loadMap(info) {
  var docs = JSON.parse(info).response.docs
  var firstDoc = docs[0]
  
  var latf = "coordenadas_0_coordinate"
  var lonf = "coordenadas_1_coordinate"

  var mymap = L.map('mapid', {
    center: [firstDoc[latf], firstDoc[lonf]], 
    zoom: 11 
  });
  docs.forEach(function(doc, i) {
    L.circle([doc[latf], doc[lonf]], {
      color: grad(i),
      fillColor: grad(i),
      fillOpacity: 0.4,
      radius: 1000 
    }).addTo(mymap)
  }) 

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(mymap);

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
  // document.getElementById('debug').onclick = notifyContentScript
  notifyContentScript()
});
