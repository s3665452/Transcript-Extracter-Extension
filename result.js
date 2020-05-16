// var dv = document.createElement('div');
// dv.id = 'myid';
// dv.innerHTML = 'test';
// document.body.appendChild(dv);
const docx = require("docx");
const AWS = require("aws-sdk");
//const fs = require('fs');
//import * as fs from "fs";
//import { Document, Packer, Paragraph, TextRun } from "docx";
var transcript = "result transcript";
var summary = "result summary";
var summaryArray = new Array();
var opar = "sample";

/**
  * Change the region and endpoint.
  */
  AWS.config.update({region:'us-east-1',
  accessKeyId: 'ASIA4CWIRGO4AYR4TNLE',
    secretAccessKey: '7eOQq8FwGMxPTlnuEpjycciabKR5adVcVeLoYkq2',
    sessionToken: 'FwoGZXIvYXdzEGMaDECHBMgMnfAwI1Ls/yLLATb/2e0T27sShiKiQbnwx/d0W/GYo12/mPh4ycuPJu23bzCcVfwKnAVqdDtUnBsfZFlGzwIDls8LiE1n6OqqmgPAzSSSnDgdv9+aP7ROVzOItJsYUjD0rLHdGSgD6F+vEx0HxpgqZig8y0Y/cA3Ws/T6Jn5J05Hj5NjJaYeuLxQJ2LXWEEOHqL4ng+MwJ9g4N3LKzwWzaV6+0xPtf+rCSL7X8d0C4BM7QpDmAOnTXx7C1fMgMDZLPRgpSgzvFmlHmld770S+8CrWzgiUKMKG/fUFMi1n2c8G7qIcqdHQ8mSS0/vh0UXIwUx0yx8cx8AKRS2qght6PNW5r+pWIaYABnw='});

var translate = new AWS.Translate({region: AWS.config.region});

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
                new docx.TextRun({
                    text: "Transcript:",
                    bold: true,
                })
              ]
                }),

                new docx.Paragraph({
                    children: [
                        new docx.TextRun({
                            text: transcript,
                          //  bold: true,
                          font: "arial",
                        }),
            ],
        }),

        new docx.Paragraph({
            children: [
                new docx.TextRun({
                    text: " ",
                    bold: true,
                })
              ]
                }),

        new docx.Paragraph({
            children: [
                new docx.TextRun({
                    text: "Summary:",
                    bold: true,
                })
              ]
                }),

                new docx.Paragraph({
                    children: [
                        new docx.TextRun({
                            text: summary,
                          //  bold: true,
                          font: "arial",
                        }),
                ],
                }),



    ],
});

function downloadFile(options) {
    if(!options.url) {
        var blob = new Blob([ options.content ], {type : "application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
        options.url = window.URL.createObjectURL(blob);
    }
    chrome.downloads.download({
        url: options.url,
        filename: "transcript.docx"
    })
}

// Download file with custom content
// downloadFile({
//   filename: "foo.txt",
//   content: "bar"
// });

// Used to export the file into a .docx file
docx.Packer.toBuffer(doc).then((buffer) => {
    downloadFile({
      filename: "my\.docx",
      content: buffer
    });
});
}

document.getElementById("saveDocx").onclick = function() {
  saveDocx();
}

function translate

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
