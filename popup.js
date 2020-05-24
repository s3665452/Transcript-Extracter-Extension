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

/*
[1]"Getting Started Tutorial - Google Chrome", Developer.chrome.com, 2020. [Online]. Available: https://developer.chrome.com/extensions/getstarted. [Accessed: 24- May- 2020].
[2]"Develop Extensions - Google Chrome", Developer.chrome.com, 2020. [Online]. Available: https://developer.chrome.com/extensions/devguide. [Accessed: 24- May- 2020].
[3]The Coding Train, "Session 11: Chrome Extensions - Programming with Text - YouTube", YouTube, 2020. [Online]. Available: https://www.youtube.com/playlist?list=PLRqwX-V7Uu6bL9VOMT65ahNEri9uqLWfS. [Accessed: 24- May- 2020].
*/
