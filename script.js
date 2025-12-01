// Declare apiKey and initialize after storage is read to avoid races
let apiKey = "";

// Format numbers with commas
function formatNumber(num) {
  return Number(num).toLocaleString('en-US');
}

// Show error message to user
function showError(message) {
  const errorAlert = document.getElementById('errorAlert');
  const errorMessage = document.getElementById('errorMessage');
  if (errorAlert && errorMessage) {
    errorMessage.textContent = message;
    errorAlert.style.display = 'block';
    errorAlert.classList.add('show');
    // Auto-hide after 5 seconds
    setTimeout(() => {
      errorAlert.style.display = 'none';
      errorAlert.classList.remove('show');
    }, 5000);
  }
}

// Show the intro/help modal
function showIntroModal() {
  const modalEl = document.getElementById("staticBackdrop");
  if (!modalEl) return;

  // Simple lightweight modal show/hide without Bootstrap JS (CSP-safe)
  // Create backdrop
  let backdrop = document.querySelector('.custom-modal-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'custom-modal-backdrop';
    Object.assign(backdrop.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: '1050'
    });
    document.body.appendChild(backdrop);
  }

  // Show modal element
  modalEl.style.display = 'block';
  modalEl.classList.add('show');
  modalEl.setAttribute('aria-hidden', 'false');

  // Wire up close buttons inside modal
  modalEl.querySelectorAll('[data-bs-dismiss="modal"], .btn-close').forEach((btn) => {
    btn.addEventListener('click', () => {
      modalEl.style.display = 'none';
      modalEl.classList.remove('show');
      modalEl.setAttribute('aria-hidden', 'true');
      if (backdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    });
  });
}

// Load API key and saved channels from chrome.storage.sync
function loadSettings(callback) {
  chrome.storage.sync.get(["apiKey", "savedChannels"], (res) => {
    callback(res || {});
  });
}

// Initialize the app after DOM is ready
function init() {
  showIntroModal();

  // Add event listener for error alert close button
  const errorAlertClose = document.getElementById('errorAlertClose');
  if (errorAlertClose) {
    errorAlertClose.addEventListener('click', () => {
      const errorAlert = document.getElementById('errorAlert');
      if (errorAlert) {
        errorAlert.style.display = 'none';
        errorAlert.classList.remove('show');
      }
    });
  }

  loadSettings((res) => {
    apiKey = res.apiKey || "";

    if (!apiKey) {
      console.warn("No API key found; redirecting to index.html");
      location.href = "index.html";
      return;
    }

    // Load demo channels packaged with the extension
    fetchJSONFileData();

    // Populate saved channels
    const saved = res.savedChannels || [];
    saved.forEach((id) => fetchAndDisplayChannel(id));
    // Attach table header listeners (sorting) after DOM is ready
    attachTableHeaderListeners();
  });
}

window.addEventListener("DOMContentLoaded", init);

//Function to load JSON file data.
function fetchJSONFileData() {
  fetch(chrome.runtime.getURL("savedChannels.json"))
    .then((response) => response.json())
    .then((channelIds) => {
      channelIds.forEach((id) => fetchAndDisplayChannel(id));
    })
    .catch((err) => console.error("Failed to load savedChannels.json:", err));
}

// Attach click listeners to table headers (CSP-safe alternative to inline onclick)
function attachTableHeaderListeners() {
  const headers = document.querySelectorAll('#myTable thead th');
  if (!headers || headers.length === 0) return;

  headers.forEach((th) => {
    const field = th.dataset.field || "";
    const idx = Number(th.dataset.index);
    if (field === "channel") {
      th.style.cursor = 'pointer';
      th.addEventListener("click", () => sortTable(idx));
    } else if (field === "subscribers" || field === "views" || field === "videos") {
      th.style.cursor = 'pointer';
      th.addEventListener("click", () => sortTableNumerically(idx));
    }
  });
}

//Function to load data from storage.
function fetchLocalStorageData() {
  chrome.storage.sync.get(["savedChannels"], (data) => {
    let stored = data.savedChannels || [];
    stored.forEach((id) => fetchAndDisplayChannel(id));
  });
}

//Logic to use the channel IDs and fetch information from the API and populate the table.
function fetchAndDisplayChannel(id) {
  fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${id}&key=${apiKey}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.error) {
        throw new Error(data.error.message || 'API Error');
      }
      if (!data.items || data.items.length === 0) {
        console.warn(`No data returned for channel ID: ${id}`);
        return;
      }
      let tbody = document.querySelector("#myTable tbody");
      let row = tbody.insertRow(-1);
      let channelNameCell = row.insertCell(0);
      let subscriberCell = row.insertCell(1);
      let viewCountCell = row.insertCell(2);
      let videoCountCell = row.insertCell(3);
      let channelIdCell = row.insertCell(4);

      channelNameCell.textContent = data.items[0].snippet.title;
      subscriberCell.textContent = formatNumber(data.items[0].statistics.subscriberCount);
      viewCountCell.textContent = formatNumber(data.items[0].statistics.viewCount);
      videoCountCell.textContent = formatNumber(data.items[0].statistics.videoCount);
      channelIdCell.textContent = data.items[0].id;
      channelIdCell.style.cursor = 'pointer';
      channelIdCell.style.textDecoration = 'underline';
      channelIdCell.addEventListener('click', () => {
        chrome.tabs.create({ url: `https://www.youtube.com/channel/${data.items[0].id}` });
      });
      row.addEventListener("dblclick", () => {
        row.remove();
        removeChannelIdFromLocalStorage(channelIdCell.textContent);
      });
    })
    .catch((error) => {
      console.error(`Failed to fetch channel ${id}:`, error);
      if (error.message.includes('403')) {
        showError('API quota exceeded. Please try again later.');
      } else if (error.message.includes('400')) {
        showError('Invalid API key. Please check your settings.');
      } else {
        showError(`Failed to load channel: ${error.message}`);
      }
    });
}

//Logic so user can add a channel in the box and add it to the table.
document
  .getElementById("channelSearchForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    let youtubeURL = document.getElementById("userId").value.trim();
    let matchchannelIdURL = youtubeURL.match(/UC[a-zA-Z0-9_-]{22}/);
    let matchHandleURL = youtubeURL.match(/@[a-zA-Z0-9_-]+/);

    let id = null;
    let handle = null;

    if (matchchannelIdURL) {
      id = matchchannelIdURL[0];
      fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${id}&key=${apiKey}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.error.message || 'API Error');
          }
          if (!data.items || data.items.length === 0) {
            showError('Channel not found. Please check the URL and try again.');
            return;
          }
          let tbody = document.querySelector("#myTable tbody");
          let row = tbody.insertRow(-1);
          let channelNameCell = row.insertCell(0);
          let subscriberCell = row.insertCell(1);
          let viewCountCell = row.insertCell(2);
          let videoCountCell = row.insertCell(3);
          let channelIdCell = row.insertCell(4);

          channelNameCell.textContent = data.items[0].snippet.title;
          subscriberCell.textContent = formatNumber(data.items[0].statistics.subscriberCount);
          viewCountCell.textContent = formatNumber(data.items[0].statistics.viewCount);
          videoCountCell.textContent = formatNumber(data.items[0].statistics.videoCount);
          channelIdCell.textContent = data.items[0].id;
          channelIdCell.style.cursor = 'pointer';
          channelIdCell.style.textDecoration = 'underline';
          channelIdCell.addEventListener('click', () => {
            chrome.tabs.create({ url: `https://www.youtube.com/channel/${data.items[0].id}` });
          });
          saveChannelIdToLocalStorage(data.items[0].id);

          row.addEventListener("dblclick", () => {
            row.remove();
            removeChannelIdFromLocalStorage(channelIdCell.textContent);
          });
        })
        .catch((error) => {
          console.error('Error adding channel:', error);
          if (error.message.includes('403')) {
            showError('API quota exceeded. Please try again later.');
          } else if (error.message.includes('400')) {
            showError('Invalid API key. Please check your settings.');
          } else {
            showError(`Failed to add channel: ${error.message}`);
          }
        });
    } else if (matchHandleURL) {
      handle = matchHandleURL[0];
      fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=${handle}&key=${apiKey}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.error.message || 'API Error');
          }
          if (!data.items || data.items.length === 0) {
            showError('Channel not found. Please check the handle and try again.');
            return;
          }
          let tbody = document.querySelector("#myTable tbody");
          let row = tbody.insertRow(-1);
          let channelNameCell = row.insertCell(0);
          let subscriberCell = row.insertCell(1);
          let viewCountCell = row.insertCell(2);
          let videoCountCell = row.insertCell(3);
          let channelIdCell = row.insertCell(4);

          channelNameCell.textContent = data.items[0].snippet.title;
          subscriberCell.textContent = formatNumber(data.items[0].statistics.subscriberCount);
          viewCountCell.textContent = formatNumber(data.items[0].statistics.viewCount);
          videoCountCell.textContent = formatNumber(data.items[0].statistics.videoCount);
          channelIdCell.textContent = data.items[0].id;
          channelIdCell.style.cursor = 'pointer';
          channelIdCell.style.textDecoration = 'underline';
          channelIdCell.addEventListener('click', () => {
            chrome.tabs.create({ url: `https://www.youtube.com/channel/${data.items[0].id}` });
          });

          saveChannelIdToLocalStorage(data.items[0].id);

          row.addEventListener("dblclick", () => {
            row.remove();
            removeChannelIdFromLocalStorage(channelIdCell.textContent);
          });
        })
        .catch((error) => {
          console.error('Error adding channel:', error);
          if (error.message.includes('403')) {
            showError('API quota exceeded. Please try again later.');
          } else if (error.message.includes('400')) {
            showError('Invalid API key. Please check your settings.');
          } else {
            showError(`Failed to add channel: ${error.message}`);
          }
        });
    } else {
      showError('Invalid channel URL. Please enter a valid YouTube channel URL or handle.');
    }
  });

//Sorting alphabetically when clicking on the header.
function sortTable(n) {
  var table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementById("myTable");
  switching = true;
  dir = "asc";
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

//Sorting numerically when clicking on the header.
function sortTableNumerically(n) {
  var table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementById("myTable");
  switching = true;
  dir = "asc";
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      // Remove commas before converting to number
      var xNum = Number(x.innerHTML.replace(/,/g, ''));
      var yNum = Number(y.innerHTML.replace(/,/g, ''));
      if (dir == "asc") {
        if (xNum > yNum) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (xNum < yNum) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

//Storage logic
function saveChannelIdToLocalStorage(id) {
  chrome.storage.sync.get(["savedChannels"], (data) => {
    let storedArray = data.savedChannels || [];
    if (!storedArray.includes(id)) {
      storedArray.push(id);
      chrome.storage.sync.set({ savedChannels: storedArray });
    }
  });
}

function removeChannelIdFromLocalStorage(id) {
  chrome.storage.sync.get(["savedChannels"], (data) => {
    let storedArray = data.savedChannels || [];
    storedArray = storedArray.filter((storedId) => storedId !== id);
    chrome.storage.sync.set({ savedChannels: storedArray });
  });
}
