// var dv = document.createElement('div');
// dv.id = 'myid';
// dv.innerHTML = 'test';
// document.body.appendChild(dv);
//const docx = require("docx");
//const fs = require('browserify-fs');
//import * as fs from "fs";
//import { Document, Packer, Paragraph, TextRun } from "docx";
var transcript = "result transcript";
var summary = "result summary";
var summaryArray = new Array();
var opar = "sample";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function arraylizeSummary() {
  summary = summary.slice(1, summary.length-2);
  summaryArray = summary.split('\",\"');
  console.log(summaryArray[0]);
  console.log(summaryArray[2]);
  console.log(summaryArray[summaryArray.length-1]);
}



async function highlight() {
  //console.log(index+item);
  var i = 0;
  while(i<summaryArray.length) {
  var paragraph = document.getElementById('transcript');
  var search = summaryArray[i];
  console.log(search);
//  console.log(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  //console.log(typeof search1);
  sleep(1000);
  //search = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); //https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
  //search = search.replace(/\\"/g, '"');
  var re = new RegExp(search, 'g');
  //var m;

  if (search.length > 0) {
    paragraph.innerHTML = opar.replace(re, `<mark>$&</mark>`);
    opar = document.getElementById("transcript").innerHTML;
  }
  else paragraph.innerHTML = opar;
i++;
}
}

// function saveDocx() {
//   chrome.runtime.sendMessage({message: 'download'});
// }

function saveDocx() {
  // Create document
const doc = new docx.Document();
// Documents contain sections, you can have multiple sections per document, go here to learn more about sections
// This simple example will only contain one section
doc.addSection({
    properties: {},
    children: [
        new docx.Paragraph({
            children: [
                new docx.TextRun("Hello World"),
                new docx.TextRun({
                    text: "Foo Bar",
                    bold: true,
                }),
                new docx.TextRun({
                    text: "\tGithub is the best",
                    bold: true,
                }),
            ],
        }),
    ],
});

// document.getElementById("saveDocx").onclick = function() {
//   saveDocx();
// }

chrome.runtime.onMessage.addListener(printData);

async function printData(data, sender, sendResponse) {
//  if(data.message == "print") {
  console.log(data);
  console.log(data.transcript);
  console.log(data.summary);
  transcript = data.transcript;
  summary = data.summary;
  arraylizeSummary();
  summary = summaryArray.join(" ");
  document.getElementById("transcript").innerHTML = transcript;
  document.getElementById("summary").innerHTML = summary;
  document.getElementById("saveDocx").innerHTML = "Save as .docx";
  opar = document.getElementById("transcript").innerHTML;
  //console.log(opar);
  await sleep(3000);
  highlight();

//}
}
