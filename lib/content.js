var scriptTags = document.querySelectorAll("script[type='application/ld+json']")
var preTag =  document.body.querySelector("pre")
this.data = []

if(scriptTags) {
  Array.prototype.push.apply(
    this.data,
    Array.prototype.slice.call(scriptTags)
      .map(el => JSON.parse(el.innerHTML))
      .filter(o => o["@type"] == "BuyAction")
      .map(o => o["object"])
      .map(o => {
        var obj = {}
        obj["details"] = o["url"]
        obj["latitude"] = o["geo"]["latitude"]
        obj["longitude"] = o["geo"]["longitude"]
        return obj 
      })
  )
} 

if(preTag) {
  Array.prototype.push.apply(
    this.data, 
    JSON.parse(preTag.innerHTML)
      .response
      .docs
      .map(o => {
        var obj = {}
        obj["details"] = o["id"] + " " + o["ubicacion"]
        obj["latitude"] = o["coordenadas_0_coordinate"]
        obj["longitude"] = o["coordenadas_1_coordinate"]
        return obj 
      })
  )
}

chrome.runtime.sendMessage({
  from:    'content',
  subject: 'contentLoaded'
});

chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  if ((msg.from === 'mapo') && (msg.subject === 'PopupReady')) {
    response(this.data)
  }
});
