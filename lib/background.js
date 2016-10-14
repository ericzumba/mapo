chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  if ((msg.from === 'content') && (msg.subject === 'contentLoaded')) {
    chrome.pageAction.show(sender.tab.id);
  }
});
