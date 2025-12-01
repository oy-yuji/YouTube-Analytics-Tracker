// OAuth 2.0 authentication flow
document.getElementById("apiButton").addEventListener("click", () => {
  const errEl = document.getElementById('apiError');
  const button = document.getElementById('apiButton');
  
  // Clear any previous error
  if (errEl) errEl.textContent = '';
  
  // Disable button and show loading state
  button.disabled = true;
  button.textContent = 'Signing in...';

  // Request OAuth token interactively (will show Google sign-in)
  chrome.runtime.sendMessage(
    { action: 'getAuthToken', interactive: true },
    (response) => {
      if (response && response.success) {
        // Token obtained successfully — save flag and open tracker
        chrome.storage.sync.set({ isAuthenticated: true }, () => {
          chrome.tabs.create({ url: chrome.runtime.getURL('channeltracker.html') });
          window.close();
        });
      } else {
        // Authentication failed
        button.disabled = false;
        button.textContent = 'Sign in with Google';
        const errorMsg = response?.error || 'Authentication failed';
        if (errEl) errEl.textContent = `Sign-in failed: ${errorMsg}`;
        console.error('OAuth failed:', errorMsg);
      }
    }
  );
});