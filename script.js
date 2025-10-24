//Display modal
window.addEventListener("DOMContentLoaded", () => {
  const modal = new bootstrap.Modal(document.getElementById("staticBackdrop"));
  modal.show();
});

const apiKey = localStorage.getItem("apiKey");

//Fetch JSON data to populate the table for demonstrational purposes.
window.addEventListener("DOMContentLoaded", fetchJSONFileData);

//Fetch data from local storage when window opens. 
window.addEventListener("DOMContentLoaded", fetchLocalStorageData);

//Function to load JSON file data.
function fetchJSONFileData() {
  fetch("savedChannels.json")
    .then((response) => response.json())
    .then((channelIds) => {
      channelIds.forEach((id) => fetchAndDisplayChannel(id));
    });
}

//Function to load data from local storage.
function fetchLocalStorageData() {
  let stored = JSON.parse(localStorage.getItem("savedChannels")) || [];
  stored.forEach((id) => fetchAndDisplayChannel(id));
}

//Logic to use the channel IDs and fetch information from the API and populate the table.
function fetchAndDisplayChannel(id) {
  fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${id}&key=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
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
      subscriberCell.textContent = data.items[0].statistics.subscriberCount;
      viewCountCell.textContent = data.items[0].statistics.viewCount;
      videoCountCell.textContent = data.items[0].statistics.videoCount;
      channelIdCell.textContent = data.items[0].id;
      row.addEventListener("dblclick", () => {
        row.remove();
        removeChannelIdFromLocalStorage(channelIdCell.textContent);
      });
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
        .then((response) => response.json())
        .then((data) => {
          let tbody = document.querySelector("#myTable tbody");
          let row = tbody.insertRow(-1);
          let channelNameCell = row.insertCell(0);
          let subscriberCell = row.insertCell(1);
          let viewCountCell = row.insertCell(2);
          let videoCountCell = row.insertCell(3);
          let channelIdCell = row.insertCell(4);

          channelNameCell.textContent = data.items[0].snippet.title;
          subscriberCell.textContent = data.items[0].statistics.subscriberCount;
          viewCountCell.textContent = data.items[0].statistics.viewCount;
          videoCountCell.textContent = data.items[0].statistics.videoCount;
          channelIdCell.textContent = data.items[0].id;
          saveChannelIdToLocalStorage(data.items[0].id);

          row.addEventListener("dblclick", () => {
            row.remove();
            removeChannelIdFromLocalStorage(channelIdCell.textContent);
          });

        });
    } else if (matchHandleURL) {
      handle = matchHandleURL[0];
      fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=${handle}&key=${apiKey}`
      )
        .then((response) => response.json())
        .then((data) => {
          let tbody = document.querySelector("#myTable tbody");
          let row = tbody.insertRow(-1);
          let channelNameCell = row.insertCell(0);
          let subscriberCell = row.insertCell(1);
          let viewCountCell = row.insertCell(2);
          let videoCountCell = row.insertCell(3);
          let channelIdCell = row.insertCell(4);

          channelNameCell.textContent = data.items[0].snippet.title;
          subscriberCell.textContent = data.items[0].statistics.subscriberCount;
          viewCountCell.textContent = data.items[0].statistics.viewCount;
          videoCountCell.textContent = data.items[0].statistics.videoCount;
          channelIdCell.textContent = data.items[0].id;

          saveChannelIdToLocalStorage(data.items[0].id);

          row.addEventListener("dblclick", () => {
            row.remove();
            removeChannelIdFromLocalStorage(channelIdCell.textContent);

          });

        })
        .catch((error) => console.error(error));
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
      if (dir == "asc") {
        if (Number(x.innerHTML) > Number(y.innerHTML)) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (Number(x.innerHTML) < Number(y.innerHTML)) {
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

//Local storage logic
function saveChannelIdToLocalStorage(id) {
  let storedArray = JSON.parse(localStorage.getItem("savedChannels")) || [];

  if (!storedArray.includes(id)) {
    storedArray.push(id);
    localStorage.setItem("savedChannels", JSON.stringify(storedArray));
  }
}

function removeChannelIdFromLocalStorage(id) {
  let storedArray = JSON.parse(localStorage.getItem("savedChannels")) || [];
  storedArray = storedArray.filter((storedId) => storedId !== id);
  localStorage.setItem("savedChannels", JSON.stringify(storedArray));
}
