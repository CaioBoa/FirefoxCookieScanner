document.addEventListener('DOMContentLoaded', () => {
  
    browser.runtime.sendMessage({ request: "getRiskScore" }).then(response => {
  
      const riskScoreElement = document.getElementById('risk-score');
      riskScoreElement.textContent = `Risk Score: ${response.riskScore}/10`;
  
      if (response.riskScore <= 3) {
        riskScoreElement.style.color = 'green';
      } else if (response.riskScore <= 6) {
        riskScoreElement.style.color = 'orange';
      } else {
        riskScoreElement.style.color = 'red';
      }
  
      const detailsSection = document.getElementById('details');
      const showDetailsButton = document.getElementById('show-details-button');
  
      showDetailsButton.addEventListener('click', () => {
        if (detailsSection.style.display === 'none') {
          detailsSection.style.display = 'block';
          showDetailsButton.textContent = 'Hide';
        } else {
          detailsSection.style.display = 'none';
          showDetailsButton.textContent = 'Details';
        }
      });
  
      const thirdPartyConnectionsList = document.getElementById('third-party-list');
      if (response.thirdPartyConnections.length > 0) {
        thirdPartyConnectionsList.innerHTML = '';
        response.thirdPartyConnections.forEach(connection => {
          let li = document.createElement('li');
          li.textContent = connection;
          thirdPartyConnectionsList.appendChild(li);
        });
      } else {
        thirdPartyConnectionsList.textContent = 'No third-party connections detected.';
      }
  
      const cookieList = document.getElementById('cookie-list').getElementsByTagName('tbody')[0];
      if (response.cookiesList.length > 0) {
        cookieList.innerHTML = ''; 
        response.cookiesList.forEach(cookie => {
          let row = document.createElement('tr');
          let nameCell = document.createElement('td');
          nameCell.textContent = cookie.name;
          let typeCell = document.createElement('td');
          typeCell.textContent = cookie.isThirdParty ? 'Third-Party' : 'First-Party';
          let sessionTypeCell = document.createElement('td');
          sessionTypeCell.textContent = cookie.isPersistent ? 'Persistent' : 'Session';
          row.appendChild(nameCell);
          row.appendChild(typeCell);
          row.appendChild(sessionTypeCell);
          cookieList.appendChild(row);
        });
      } else {
        cookieList.innerHTML = `<tr><td colspan="3">No cookies detected.</td></tr>`;
      }
  
      const localStorageList = document.getElementById('local-storage-list').getElementsByTagName('tbody')[0];
      if (response.localStorageItems.length > 0) {
        localStorageList.innerHTML = '';
        response.localStorageItems.forEach(item => {
          let row = document.createElement('tr');
          let keyCell = document.createElement('td');
          keyCell.textContent = item.key;
          let valueCell = document.createElement('td');
          valueCell.textContent = item.value;
          row.appendChild(keyCell);
          row.appendChild(valueCell);
          localStorageList.appendChild(row);
        });
      } else {
        localStorageList.innerHTML = `<tr><td colspan="2">No local storage data detected.</td></tr>`;
      }
  
      const canvasFingerprintingElement = document.getElementById('canvas-fingerprinting');
      if (response.canvasFingerprintingDetected) {
        canvasFingerprintingElement.textContent = 'Canvas Fingerprinting attempt detected!';
        canvasFingerprintingElement.style.color = 'red';
      } else {
        canvasFingerprintingElement.textContent = 'No Canvas Fingerprinting detected.';
        canvasFingerprintingElement.style.color = 'green';
      }
  
      const hijackingElement = document.getElementById('hijacking');
      if (response.hijackingDetected) {
        hijackingElement.textContent = 'Hijacking attempt detected!';
        hijackingElement.style.color = 'red';
      } else {
        hijackingElement.textContent = 'No hijacking attempts detected.';
        hijackingElement.style.color = 'green';
      }
    }).catch(error => {
      console.error('Error receiving data from background.js:', error); 
    });
  });
  
  
  
  
  
  
  
  

  
  
  