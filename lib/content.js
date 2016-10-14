this.data = document.body.querySelector("pre").innerHTML;

chrome.runtime.sendMessage({
  from:    'content',
  subject: 'contentLoaded'
});

chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  if ((msg.from === 'mapo') && (msg.subject === 'PopupReady')) {
    response(this.data);
  }
});
