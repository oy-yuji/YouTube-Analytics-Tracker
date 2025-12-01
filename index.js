// Save API key into chrome.storage and navigate to main.html
document.getElementById("apiButton").addEventListener("click", () => {
  const apiKey = document.getElementById("apiForm").value.trim();
  if (!apiKey) {
    const errEl = document.getElementById('apiError');
    if (errEl) errEl.textContent = 'Please enter a valid API key.';
    return;
  }

  // Clear any previous error
  const errEl = document.getElementById('apiError');
  if (errEl) errEl.textContent = '';

  // Validate API key by making a lightweight request to the YouTube Data API.
  // Use a harmless search query with maxResults=1. If the key is invalid
  // the API will return an error response.
  const testUrl = `https://www.googleapis.com/youtube/v3/search?part=id&q=test&maxResults=1&key=${encodeURIComponent(
    apiKey
  )}`;

  fetch(testUrl)
    .then((res) => {
      if (!res.ok) throw new Error('Invalid API key or network error');
      return res.json();
    })
    .then(() => {
      // Key looks valid — save it and open the tracker in a new tab
      chrome.storage.sync.set({ apiKey }, () => {
        chrome.tabs.create({ url: chrome.runtime.getURL('channeltracker.html') });
        window.close();
      });
    })
    .catch((err) => {
      if (errEl) errEl.textContent = 'Invalid API key — please check and try again.';
      console.error('API key validation failed:', err);
    });
});