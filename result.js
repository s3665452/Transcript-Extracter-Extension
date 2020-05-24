const docx = require("docx");
const AWS = require("aws-sdk");

var transcript = "result transcript";
var summary = "result summary";
var summaryArray = new Array();
var translationLanguage = "default";
var comprehendTranscriptArray = " ";

//set up aws
//[5]"AWS Documentation", Docs.aws.amazon.com, 2020. [Online]. Available: https://docs.aws.amazon.com/. [Accessed: 24- May- 2020].
 AWS.config.update({
   region: 'us-east-1',
   accessKeyId: 'ASIA4CWIRGO4O5FGULHJ',
   secretAccessKey: 'Tw/+FBxBx1mSvgo7yWpVb+Gydbhijq96QE8Yow/x',
   sessionToken: 'FwoGZXIvYXdzECMaDKC1dRi5Kq9RosUEGiLLAXJtz8q/OV6rK5V7Xtxc8Yj2epL/jlAc671aJz83y2LhIBPK44ShCzZ7qMciJDIn3hBPe8ELjlb84jNxO3Z2Z9GEWdwe0Hv4Bs22LoJ6PbNTRknfnU0B4IcZn/x4q5u4WlJ5nkcsDim02C1Ei8s+KOg7/z61yqZZ9ebTHk6R4uGUASD5TuT/41ebZ5cFbmhQcdE2PIQWqKGP/VcDkLkznzLr9EuP075e6wxnKv4giVs2P2TsH44sg/+8QIAc5KP0e8JNn1bEnejD8QIOKLqVp/YFMi23Pmu1mk87hVlHMEIqLzgwX+URmnyF3KAWSBFSHMz8qrfSKFvz/Rz8alpPLy0='
 });
//function to wait ms millisecond
//[6]D. Dascalescu, "What is the JavaScript version of sleep()?", Stack Overflow, 2016. [Online]. Available: https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep. [Accessed: 24- May- 2020].
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
//function to put summary in an array
function arraylizeSummary() {
  summary = summary.replace("?,", "?\",\"");
  summary = summary.replace(".,", ".\",\"");
  summary = summary.slice(1, summary.length - 2);
  summaryArray = summary.split('\",\"');
}
//hightlight summary text in the transcript
//[7]Jrook, "Find and highlight word in text using JS", Stack Overflow, 2018. [Online]. Available: https://stackoverflow.com/questions/52743841/find-and-highlight-word-in-text-using-js. [Accessed: 24- May- 2020].
async function highlight(sourceArray, targetId) {

  var opar = document.getElementById(targetId).innerHTML;
  var i = 0;
  while (i < sourceArray.length) {
    var paragraph = document.getElementById(targetId);
    var search = sourceArray[i];
    var re = new RegExp(search, 'g');
    //place <mark></mark> around summary text search results
    if (search.length > 0) {
      paragraph.innerHTML = opar.replace(re, `<mark>$&</mark>`);
      opar = document.getElementById(targetId).innerHTML;
    }
    i++;
  }
}
//save transcript and summary in a .docx file
//[8]"docx - Generate .docx documents with JavaScript", Docx.js.org. [Online]. Available: https://docx.js.org/#/. [Accessed: 24- May- 2020].
function saveDocx() {
  // Create document
  const doc = new docx.Document();

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
            font: "arial",
          }),
        ],
      }),
    ],
  });
  //function to download a file
  function downloadFile(options) {
    if (!options.url) {
      var blob = new Blob([options.content], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      });
      options.url = window.URL.createObjectURL(blob);
    }
    chrome.downloads.download({
      url: options.url,
      filename: "transcript.docx"
    })
  }

  //export the file into a .docx file
  docx.Packer.toBuffer(doc).then((buffer) => {
    downloadFile({
      filename: "my\.docx",
      content: buffer
    });
  });
}
//link saveDocx() function to the button
document.getElementById("saveDocx").onclick = function() {
  saveDocx();
}

//cut text in size of limit, then store them in an array
//[9]R. Poon, "Split string into sentences in javascript", Stack Overflow, 2013. [Online]. Available: https://stackoverflow.com/questions/18914629/split-string-into-sentences-in-javascript. [Accessed: 24- May- 2020].
function tokenizeText(text, limit) {
  var waitingArray = new Array();
  textArray = text.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|");

  while (textArray.join(" ").length >= limit) {
    var part = textArray[0];
    var i = 1;
    while (new Blob([part]).size + new Blob([textArray[i]]).size < limit) {
      part = part + " " + textArray[i];
      i += 1;
    }
    waitingArray.push(part);
    textArray = textArray.slice(i);
  }
  waitingArray.push(textArray.join(" "));

  return waitingArray;
}

//translate text to the specified language
async function translate(text, language, targetId) {
  var translate = new AWS.Translate({
    region: AWS.config.region
  });

  translationLanguage = language;
  var translatedText = "";
  var waitingArray = await tokenizeText(text, 5000);
  var resultArray = await new Array(waitingArray.length);

  if (!text) {
    alert("Input text cannot be empty.");
    exit();
  }
  //translate every element in the waitingArray
  waitingArray.forEach(doTranslate);
  //function to translate text using Amazon Translate
  async function doTranslate(item, index) {

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
        resultArray[index] = data.TranslatedText;
        document.getElementById(targetId).innerHTML = resultArray.join(" ");
        //highlight summary text in translated transcript
        var translatedSummaryArray = document.getElementById("translatedSummary").innerHTML.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|");
        console.log(translatedSummaryArray.join("&&&"));
        highlight(translatedSummaryArray, "translatedTranscript");
      }
    });
    //if translated into supported languages, call Amazon Comprehend then bold key phrases
    if (language == "de" || language == "en" || language == "es" || language == "it" || language == "pt" || language == "fr") { // || language == "ja" || language == "ko" || language == "hi" || language == "ar" || language == "zh" || language == "zh-TW") {
      await sleep(5000);
      console.log(document.getElementById("translatedTranscript").innerHTML);
      comprehendText("translatedTranscript", language);
      comprehendText("translatedSummary", language);
    }
  }
}
//get selected language from dropdown
var languageDropdown = document.getElementById("languages");
//when button clicked, translate transcript and summary
document.getElementById("change").addEventListener("click", function() {
  translate(transcript, languageDropdown.options[languageDropdown.selectedIndex].value, "translatedTranscript");
  translate(summary, languageDropdown.options[languageDropdown.selectedIndex].value, "translatedSummary");
});

//Amazon Comprehend
var comprehend = new AWS.Comprehend({
  apiVersion: '2017-11-27'
});

function comprehendText(targetId, language) {
  var limit = 4900;
  var text = document.getElementById(targetId).innerHTML;
  //cut text, put them in waitingArray
  var waitingArray = tokenizeText(text, limit);
  var resultArray = new Array(waitingArray.length);
  //get key phrases for each element in the waitingArray
  waitingArray.forEach(doComprehend);
  //function to get key phrases
  async function doComprehend(item, index) {
    await sleep(100 * index);

    var params = {
      "LanguageCode": language,
      "Text": item
    }

    comprehend.detectKeyPhrases(params, function(err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
      } else {
        console.log(data); // successful response
        var phrasesArray = data.KeyPhrases;
        phrasesArray.forEach(function(phrase, index) {
          //bold high score key phrases
          if (phrase.Score > 0.9999) {
            item = item.replace(phrase.Text, "<b>" + phrase.Text + "</b>"); // item.replace(RegExp(phrase.text, 'g'), `<b>${b}</b>`);
          }
        })
        resultArray[index] = item;
        document.getElementById(targetId).innerHTML = resultArray.join(" ");
      }
    });
  }
}

//call printData() when message received
chrome.runtime.onMessage.addListener(printData);

//function to write transcript and summary
async function printData(data, sender, sendResponse) {
  console.log(data);


  if(data.transcript == null && transcript.length<60){
    document.getElementById("transcript").innerHTML = "Analysing the video... Please try again in 10 minutes...";
  }
  else {
  transcript = data.transcript;
  summary = data.summary;
  arraylizeSummary();
  summary = summaryArray.join(" ");
  //put data on the page
  document.getElementById("transcript").innerHTML = transcript;
  document.getElementById("saveDocx").innerHTML = "Save as .docx";
  document.getElementById("summary").innerHTML = summary;
  //highlight summary text, bold key phrases
  highlight(summaryArray, "transcript");
  comprehendText("transcript", "en");
  comprehendText("summary", "en");
}
}
