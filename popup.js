//tell users the extension is working
function loadingState() {
  document.getElementById("mainDiv").innerHTML = "Analysing...<br>It usually takes 5-10 minutes...";
}
//send message to content.js to start
function popup() {
  loadingState();
  chrome.tabs.query({
    currentWindow: true,
    active: true
  }, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      "message": "start"
    });
    console.log("message sent to content")
  });
}
//link pupup() to the button
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("download").addEventListener("click", popup);
});
