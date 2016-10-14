chrome.runtime.onMessage.addListener(function (msg, sender) {
  if ((msg.from === 'content') && (msg.subject === 'contentLoaded')) {
    chrome.pageAction.show(sender.tab.id);
  }
});
