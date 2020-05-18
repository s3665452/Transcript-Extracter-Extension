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
  accessKeyId: 'ASIA4CWIRGO4FN66MMNL',
    secretAccessKey: 'DJQNw/fPYgXmfXKi9KZcyOC6x87lt5h4g59vI8Fs',
    sessionToken: 'FwoGZXIvYXdzEHkaDMaMG0Y836bMvBEHOiLLAf8rtdqVNbtyq8ahVMj/9R+xC7pt3jWt8d1DqXMUtH1AF1QHMKvUKDSCw2YiIozolzR3gw9VzNFE/bsKwjKKzGWPPUXUOXYeUCq3JoJ4Vs6RbLRX+ZiD5zv+I79h3FSrKWWfTYC4jZdD9IkrOpXdPE480WlGHFqMY+HCnmltPc23/uOE90rHxU4wE2NTgoZIiKPqTAzE5Ba+eTRIJhIRo/OBUrcSulDqokSBjDda6miWaGl/995udsIHyvGUtuyb471ECkPlXxi4rwsTKP7jgfYFMi28Kf1WBTnlyMKcRja4cMhL7sMU8WzRA9xGrP97VUQzcCbzgvrpGrFy4/uE6s4='});

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

function tokenizeText(text, limit) {

    var waitingArray = new Array();
    textArray = text.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|");
    while(textArray.join(" ").length>=limit) {
    //  console.log(transcriptArray.join("").length);

      var part = textArray[0];
      var i = 1;
      while(part.length + textArray[i].length < limit) {
        part = part + " " + textArray[i];
        i += 1;
      }
      waitingArray.push(part);
      textArray = textArray.slice(i);
    }
    //console.log(transcriptArray.join("")+"last");
    waitingArray.push(textArray.join(" "));

    return waitingArray;

}

async function translate(text, language, targetId) {

  console.log("Start");

var translatedText = "";
var waitingArray = await tokenizeText(text, 5000);
var resultArray = await new Array(waitingArray.length);

console.log(waitingArray.join("|"));

  var translate = new AWS.Translate({region: AWS.config.region});

  if (!text) {
          alert("Input text cannot be empty.");
          exit();
      }

      waitingArray.forEach(doTranslate);

async function doTranslate(item, index) {

  //  await sleep(300*index);

    var params = {
      Text: item,
      SourceLanguageCode: "auto",
      TargetLanguageCode: language
    };

  translate.translateText(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                alert("Error calling Amazon Translate. " + err.message);
                return;
            }
            if (data) {
              console.log(data);
            //  translatedText = translatedText + data.TranslatedText;
            resultArray[index] = data.TranslatedText;
            console.log(resultArray.join(" "));
            document.getElementById(targetId).innerHTML = resultArray.join(" ");
            }
        });

  }

  // while(i<waitingArray.length) {
//  await sleep(6000);
// }

}

var languageDropdown = document.getElementById("languages");
document.getElementById("change").addEventListener("click", function(){
//  console.log("clicked")
  translate(transcript, languageDropdown.options[languageDropdown.selectedIndex].value, "translatedTranscript");
});

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
