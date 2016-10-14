function loadMap(info) {
  var docs = JSON.parse(info).response.docs
  var firstDoc = docs[0]
  
  var latf = "coordenadas_0_coordinate"
  var lonf = "coordenadas_1_coordinate"

  var mymap = L.map('mapid').setView([firstDoc[latf], firstDoc[lonf]], 13);
  docs.forEach(function(doc) {
    L.marker([doc[latf], doc[lonf]]).addTo(mymap)
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
