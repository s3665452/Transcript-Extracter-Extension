//Send video link to background
function sendLink() {
  chrome.runtime.sendMessage({message: 'link', link: vids.item(0).src});
  console.log('message received, link sent');
  console.log(vids.item(0).src);
}
//Get video tags
var vids = document.getElementsByTagName('video');
//Event Listener
chrome.runtime.onMessage.addListener(gotMessage);
//when receiving message (from popup.js), get video link from page then send it to background
function gotMessage(message, sender, sendResponse) {
    console.log(message);
  sendLink();
}
