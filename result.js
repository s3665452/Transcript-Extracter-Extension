// var dv = document.createElement('div');
// dv.id = 'myid';
// dv.innerHTML = 'test';
// document.body.appendChild(dv);

var transcript = "result transcript";
var summary = "result summary";
var summaryArray = new Array();

function arraylizeSummary() {
  summaryArray = summary.split(','));
  console.log(summaryArray[0]);
  console.log(summaryArray[2]);
}

function highlight() {

}

chrome.runtime.onMessage.addListener(printData);

function printData(data, sender, sendResponse) {
//  if(data.message == "print") {
  console.log(data);
  console.log(data.transcript);
  console.log(data.summary);
  transcript = data.transcript;
  summary = data.summary;
  arraylizeSummary();
  document.getElementById("transcript").innerHTML = transcript;
  document.getElementById("summary").innerHTML = summary;
//}
}
