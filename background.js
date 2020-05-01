console.log('background running');

chrome.browserAction.onClicked.addListener(buttonClicked);

function buttonClicked(tab){
    chrome.tabs.sendMessage(tab.id, "hello")
    console.log('message sent');
}

//Talk to api
async function getData(message, sender, sendResponse) {
  console.log(message);
  const api_url = 'https://1enk9j9ezl.execute-api.us-east-1.amazonaws.com/s1/transcript?link='+message;
  const response = await fetch(api_url);
  const data = await response.json();
  console.log(data);
}

chrome.runtime.onMessage.addListener(getData);
