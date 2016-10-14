var data = document.body.innerHTML;
chrome.runtime.sendMessage({
  from:    'content',
  subject: 'contentLoaded'
});

chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  if ((msg.from === 'mapo') && (msg.subject === 'PopupReady')) {
    response(data);
  }
});

