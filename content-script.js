let localStorageData = Object.keys(localStorage).map(key => ({ key, value: localStorage.getItem(key) }));

browser.runtime.sendMessage({
  type: 'localStorageData',
  data: localStorageData
}, function(response) {
  if (browser.runtime.lastError) {
    console.error('Error sending localStorage data:', browser.runtime.lastError);
  } else {
    console.log('LocalStorage data sent successfully:', response);
  }
});

let cookiesData = document.cookie.split(';').map(cookieString => {
  let [name, value] = cookieString.split('=');
  return {
    name: name.trim(),
    value: value ? value.trim() : '',
    isPersistent: document.cookie.includes('expires=')
  };
});

browser.runtime.sendMessage({
  type: 'cookieData',
  cookies: cookiesData
}, function(response) {
  if (browser.runtime.lastError) {
    console.error('Error sending cookie data:', browser.runtime.lastError);
  } else {
    console.log('Cookie data sent successfully:', response);
  }
});

(function() {
  let originalGetContext = HTMLCanvasElement.prototype.getContext;
  let originalToDataURL = HTMLCanvasElement.prototype.toDataURL;

  HTMLCanvasElement.prototype.getContext = function() {
    sendCanvasFingerprintingAlert('getContext');
    return originalGetContext.apply(this, arguments);
  };

  HTMLCanvasElement.prototype.toDataURL = function() {
    sendCanvasFingerprintingAlert('toDataURL');
    return originalToDataURL.apply(this, arguments);
  };

  function sendCanvasFingerprintingAlert(method) {
    browser.runtime.sendMessage({
      type: 'canvasFingerprintingDetected',
      method: method,
      url: window.location.href
    });
  }

})();


