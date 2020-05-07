// let Download = document.getElementById('download');
//
//
//
// Download.onclick = function (tab){
//       chrome.tabs.sendMessage(tab.id, "hello")
//       console.log('message sent');
//   }

  function popup() {
     chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
     var activeTab = tabs[0];
     chrome.tabs.sendMessage(activeTab.id, {"message": "start"});
     console.log("message sent to content")
    });
 }

 document.addEventListener("DOMContentLoaded", function() {
   document.getElementById("download").addEventListener("click", popup);
 });

//https://stackoverflow.com/questions/12265403/passing-message-from-background-js-to-popup-js
 chrome.runtime.onMessage.addListener(
     function(data, sender, sendResponse) {
         if (data.msg === "data") {
             //  To do something
             console.log(data.transcript);
             console.log(request.summary);
         }
     }
 );
