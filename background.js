let thirdPartyConnections = [];
let localStorageItems = [];
let cookiesList = [];
let hijackingDetected = false;
let canvasFingerprintingDetected = false;

browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    let currentHost = new URL(details.originUrl || details.url).hostname;
    let requestHost = new URL(details.url).hostname;

    if (requestHost !== currentHost && !thirdPartyConnections.includes(requestHost)) {
      thirdPartyConnections.push(requestHost);
    }

    if (details.url.includes('eval(') || details.url.includes('javascript:void')) {
      hijackingDetected = true;
    }
  },
  { urls: ["<all_urls>"] }
);

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.type === 'localStorageData') {
    localStorageItems = message.data;
    sendResponse({ status: 'Local storage data received' });

  } else if (message.type === 'cookieData') {
    cookiesList = message.cookies;
    sendResponse({ status: 'Cookie data received' });

  } else if (message.type === 'canvasFingerprintingDetected') {
    canvasFingerprintingDetected = true;
    sendResponse({ status: 'Canvas fingerprinting detected' });

  }
});

function calculateRiskScore() {

  let cookiesRisk = calculateCookiesRisk(cookiesList);
  let localStorageRisk = calculateLocalStorageRisk(localStorageItems);
  let thirdPartyRisk = calculateThirdPartyRisk(thirdPartyConnections);
  let canvasRisk = canvasFingerprintingDetected ? 7 : 0;
  let hijackingRisk = hijackingDetected ? 7 : 0;

  let totalScore = cookiesRisk + localStorageRisk + thirdPartyRisk + canvasRisk + hijackingRisk;

  return Math.min(10, totalScore);
}

function calculateCookiesRisk(cookies) {
  let risk = 0;
  cookies.forEach(cookie => {
    if (cookie.isPersistent) {
      risk += cookie.isThirdParty ? 0.75 : 0.25;
    } else {
      risk += cookie.isThirdParty ? 0.5 : 0.1;
    }
  });
  return risk;
}

function calculateLocalStorageRisk(localStorageItems) {
  let risk = localStorageItems.length * 0.1;
  return risk;
}

function calculateThirdPartyRisk(thirdPartyConnections) {
  let risk = thirdPartyConnections.length * 0.1;
  return risk;
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.request === "getRiskScore") {
    let riskScore = calculateRiskScore();
    sendResponse({
      riskScore,
      cookiesList,
      localStorageItems,
      thirdPartyConnections,
      canvasFingerprintingDetected,
      hijackingDetected
    });
  }
});











