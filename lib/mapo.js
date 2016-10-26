function maxDigit(base) {
  return base - 1
}

function grad(row, base) {

  var r = digit(row, 0, base) 
  var g = digit(row, 1, base) 
  var b = digit(row, 2, base) 

  return [r, g, b]
}

function digit(row, col, base) { 
  if(col == 0)
    return Math.max(0, maxDigit(base) - row)
  else if (col == 1)
    if (row <= maxDigit(base))
      return row 
    else
      return Math.max(0, maxDigit(base) - (row - maxDigit(base)))
  else
    if (row <= maxDigit(base))
      return 0 
    else
      return Math.min(maxDigit(base), maxDigit(base) - digit(row, col -1, base))
}

function hexGrad(i) {
  return "#" + grad(i, 16).map(d => d.toString(16)).join('')
}

function toLatLon(doc) {
  var latf = "latitude"
  var lonf = "longitude"
  return {
    lat: doc[latf],
    lon: doc[lonf]
  }
}

function bounds(docs, comp, lat, lon) {
  return docs
    .map(toLatLon)
    .reduce((acc, cur) => {
      return {
        lat: comp(acc.lat, cur.lat), 
        lon: comp(acc.lon, cur.lon)
      }
    }, {
      lat: lat,
      lon: lon 
    })
}

function loadMap(docs) {
  var firstDoc = docs[0]
  
  var latf = "latitude"
  var lonf = "longitude"

  var mymap = L.map('mapid');

  var sw = bounds(docs, Math.min, firstDoc[latf], firstDoc[lonf]) 
  var ne = bounds(docs, Math.max, firstDoc[latf], firstDoc[lonf])

  mymap.fitBounds([[sw.lat, sw.lon], [ne.lat, ne.lon]])

  var z = mymap.getZoom()

  var radius = 1000 / z

  function toneDown(i, size, min, max) {
    var step = (max - min) / size
    return max - (i * step)
  }

  docs.forEach(function(doc, i) {
    L.circle([doc[latf], doc[lonf]], {
      color: hexGrad(i),
      fillColor: hexGrad(i),
      fillOpacity: toneDown(i, docs.length, 0.1, 1.0),
      radius: toneDown(i, docs.length, radius / docs.length, radius)
    }).bindPopup((i + 1) + ". " + doc.details).addTo(mymap)
  }) 

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
    maxZoom: 18,
    attribution:  
      '<span class="legend"><span style="color:#f00">&#9679;</span> &gt; <span style="color:#0f0">&#9679;</span> &gt; <span style="color:#00f">&#9679;</span></span> | ' + 
      'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
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
  notifyContentScript()
});
