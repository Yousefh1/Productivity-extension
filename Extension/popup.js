// popup.js
console.log("Popup script loaded.");

document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM content loaded.");

  // Declare variables in the scope of the event listener
  let currentUrl = "";
  let currentTitle = "";

  // Track data container
  const trackingDataContainer = document.getElementById('tracking-data');

  document.getElementById('start-button').addEventListener('click', function () {
    // Get information about the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        currentUrl = tabs[0].url || "";
        currentTitle = tabs[0].title || "";

        // Display real-time tracking data in the popup
        trackingDataContainer.textContent = `Tracking data: ${currentTitle} - ${currentUrl}`;

        // Send a request to the Flask server with the tracking data
        fetch('http://127.0.0.1:5000/api/website-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: currentUrl, title: currentTitle, duration: 0 }), // Duration is set to 0 for the start button click
        })
          .then(response => response.json())
          .then(data => console.log('Response from Flask:', data))
          .catch(error => console.error('Error communicating with Flask:', error));
      }
    });
  });
});
