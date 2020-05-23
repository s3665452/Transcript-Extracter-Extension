const docx = require("docx");
const AWS = require("aws-sdk");

var transcript = "result transcript";
var summary = "result summary";
var summaryArray = new Array();
var translationLanguage = "default";
var comprehendTranscriptArray = " ";

//set up aws
 AWS.config.update({
   region: 'us-east-1',
   accessKeyId: 'ASIA4CWIRGO4MHDDEV6D',
   secretAccessKey: '8kTfIFUtJKJO+AxIMCnEd10rBsOQgI8JfsHWKuMI',
   sessionToken: 'FwoGZXIvYXdzEAoaDOZONRb9qPjTpXh2XSLLAT/bmtfF0S8d+a4Jw38j3Ze+xzuCz8FiWcYNFFEQdpn9RGL9ru2cGwgyghjb8t+5Wls6CGuPjDXj2lJ9nxCcCkosjTvCFGWHqlxu9I7XF12tj3zRvvSS0pSPNoKCsh4KwT+0pktV5m3mEoJi8mzmG3izuNxEBHsmoD58A0Ed+ZOV5p3I8k9lciefHtx2ZymlDuFUXXpB5hqwJxji2kdPzCfRfppJn4WlTkx/3T6hWICBOwU2TzzYpLDvRV8/63Dx/nzD+j8jDEJhWYncKM7RofYFMi2pH6R7JQ1j6FU8+SyLvDuhE8XVYzQJXPhQOgixVLAHjmrkL9Y6oYrlyNLMGCg='
  });
//function to wait ms millisecond
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
    if (language == "de" || language == "en" || language == "es" || language == "it" || language == "pt" || language == "fr" || language == "ja" || language == "ko") { //|| language == "hi" || language == "ar" || language == "zh" || language == "zh-TW") {
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

  transcript = data.transcript;
  summary = data.summary;
  arraylizeSummary();
  summary = summaryArray.join(" ");
  //put data on the page
  document.getElementById("transcript").innerHTML = transcript;
  document.getElementById("summary").innerHTML = summary;
  document.getElementById("saveDocx").innerHTML = "Save as .docx";
  //highlight summary text, bold key phrases
  highlight(summaryArray, "transcript");
  comprehendText("transcript", "en");
  comprehendText("summary", "en");
}
