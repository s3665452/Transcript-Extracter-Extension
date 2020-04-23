let Download = document.getElementById('download');



Download.onclick = function(tab) {
    chrome.tabs.sendMessage(tab.id, "download");
  };
