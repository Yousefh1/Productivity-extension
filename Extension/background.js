// background.js
let tracking = false;
let startTime = null;
let currentUrl = "";
let currentTitle = "";
let userActivities = []; // Array to store user activities

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "startTracking") {
    tracking = true;
    console.log("Tracking started.");
    startTime = Date.now();
    updateCurrentTabInfo();
  } else if (message.action === "stopTracking") {
    tracking = false;
    console.log("Tracking stopped.");

    // Calculate duration for the last visited website
    const duration = Date.now() - startTime;

    // Save information about the last visited website
    saveVisitedWebsite(currentUrl, duration);

    // Send user data to the Flask app
    sendUserData();
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  if (tracking) {
    startTime = Date.now();
    updateCurrentTabInfo();
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  if (tracking && tabId === activeTabId) {
    const duration = Date.now() - startTime;
    saveVisitedWebsite(currentUrl, duration);
  }
});

function updateCurrentTabInfo() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0]) {
      currentUrl = tabs[0].url || "";
      currentTitle = tabs[0].title || "";
    }
  });
}

function saveVisitedWebsite(url, duration) {
  const visitedWebsite = {
    website: url,
    duration: duration,
  };
  userActivities.push(visitedWebsite);
}

function sendUserData() {
  const userId = "123"; // Replace with actual user ID if available
  const goals = {
    daily: 120,
    weekly: 600,
  };

  // Send data to your backend endpoint using fetch API
  fetch("http://127.0.0.1:5000/api/user-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
      activities: userActivities,
      goals: goals,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("User data sent to Flask:", data);
    })
    .catch((error) => {
      console.error("Error sending user data to Flask:", error);
    });
}
