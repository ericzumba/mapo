chrome.runtime.sendMessage({
  from:    'content',
  subject: 'contentLoaded'
});

chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  console.log('wooowoo')
  if ((msg.from === 'mapo') && (msg.subject === 'PopupReady')) {
    response('updated');
  }
});

