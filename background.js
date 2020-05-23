console.log('background running');

//variables
var transcripts = "bg transcript";
var summary = "bg summary";
//open result.html in a new tab to print transcript and summary
function printData(transcript, summary) {
  console.log("tab opening 1");
//open result.html in a new tab
  chrome.tabs.create({
    active: true,
    url: chrome.runtime.getURL("result.html")
  }, (tab) => {
    //wait 3 seconds for the tab to load
    setTimeout(
      () => {
        //send message to the tab
        chrome.tabs.sendMessage(tab.id, {
          message: "print",
          transcript: transcript,
          summary: summary,
        })
      }, 3000);
  })
}
//Send link to the API, get transcript and summary
async function getData(message, sender, sendResponse) {
  console.log(message);
  if (message.message == 'link') {
    console.log("getting data")
    const api_url = 'https://1enk9j9ezl.execute-api.us-east-1.amazonaws.com/s1/transcript?link=' + message.link;
    const response = await fetch(api_url);
    const data = await response.json();
    //call printData() with transcript and summary returned
    printData(data.transcript, data.summary);
  }
  }
//call getData() when message received
chrome.runtime.onMessage.addListener(getData);
