console.log('background running');


//chrome.browserAction.onClicked.addListener(buttonClicked);
var transcripts = "bg transcript";
var summary = "bg summary";

//function buttonClicked(tab){
    // chrome.tabs.sendMessage(tab.id, "hello")
    // console.log('message sent');
  //  chrome.windows.create({
//url: chrome.runtime.getURL("popup.html"),
        // width:  430,
        // height: 430,
      //  type: "popup"
//    }, function(win) {
    //    chrome.windows.update(tab.windowId, { focused: true });
//    });
//}

// function sendData(transcript, summary) {
// chrome.runtime.sendMessage({
//     message: "data",
//     transcript: transcript,
//     summary: summary
// });
// }

function printData(transcript, summary) {
    console.log("tab opening 1");
  // chrome.tabs.create({
  //   active: true,
  //   url: chrome.runtime.getURL("result.html"),
  // }, function(win) {
  //   win.body = "result is here2";
  //   document.innerHTML = "result is here1";
  //   document.body = "result is here 3";
  // console.log("window opened");
  // });
  chrome.tabs.create(
    {active: true,
      url: //"https:www.google.com/"
    chrome.runtime.getURL("result.html")
    }, (tab) =>
    {
        setTimeout(
          () => {
            //use your message data here.
            chrome.tabs.sendMessage(tab.id, {
                 message: "print",
                 transcript: transcript,
                 summary: summary
             })
        }, 3000);
      }
)}

//Talk to api
async function getData(message, sender, sendResponse) {
  console.log(message);
  console.log("getting data")
  const api_url = 'https://1enk9j9ezl.execute-api.us-east-1.amazonaws.com/s1/transcript?link='+message;
  const response = await fetch(api_url);
  const data = await response.json();
  console.log(data);
  console.log(data.transcript);
  console.log(data.summary);
//  sendData(data.transcript, data.summary)
printData(data.transcript, data.summary);
}

chrome.runtime.onMessage.addListener(getData);
