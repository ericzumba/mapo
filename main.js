chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('mapo.html', {
    id: 'weather',
    innerBounds: {
      height: 450,
      width: 300,
    },
    resizable: false
  });
});
