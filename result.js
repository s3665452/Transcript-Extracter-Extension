// var dv = document.createElement('div');
// dv.id = 'myid';
// dv.innerHTML = 'test';
// document.body.appendChild(dv);

chrome.runtime.onMessage.addListener(printData);

function printData(data, sender, sendResponse) {
//  if(data.message == "print") {
  console.log(data);
  console.log(data.transcript);
  console.log(data.summary);
  document.getElementById("transcript").innerHTML = data.transcript;
  document.getElementById("summary").innerHTML = data.summary;
//}
}
