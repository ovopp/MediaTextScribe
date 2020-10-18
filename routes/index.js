
const { json } = require('body-parser');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Clickable tabs */
function openTab(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

  function translateText(){
    var data = document.getElementById("results").innerText;
    console.log(data.length);
    if(data.length > 10000){
      data = data.slice(0,5000);
    }
    fetch("https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=es"
    , {
      method: 'post',
      headers: {
        "Ocp-Apim-Subscription-Key": "5e622a87126b4e12be2b62c2ce791f53",
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Region": "eastus",
        "cache-control": "no-cache",
        "Postman-Token": "f0f34248-9715-4a29-8190-84f86533d2a0"
      },
      body: JSON.stringify([{"text": data}])
    }).then(function (resp){
      return resp.json();
    })
    .then(function (data) {
      console.log('Request succeeded with JSON response', data[0]['translations'][0]['text']);
      document.getElementById("results").innerText = data[0]['translations'][0]['text'];
    })
    .catch(function (error) {
      console.log('Request failed', error);
    });
    
    // var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;
    
    // xhr.addEventListener("readystatechange", function () {
    //   if (this.readyState === 4) {
    //     console.log(this.responseText);
    //   }
    // });
    
    // xhr.open("POST", "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=es");
    // xhr.setRequestHeader("Ocp-Apim-Subscription-Key", "5e622a87126b4e12be2b62c2ce791f53");
    // xhr.setRequestHeader("Content-Type", "application/json");
    // xhr.setRequestHeader("Ocp-Apim-Subscription-Region", "eastus");
    // xhr.setRequestHeader("cache-control", "no-cache");
    // xhr.setRequestHeader("Postman-Token", "f0f34248-9715-4a29-8190-84f86533d2a0");
    // xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    // xhr.setRequestHeader("Access-Control-Allow-Credentials", "true");
    // xhr.setRequestHeader("Access-Control-Allow-Methods")
    // xhr.send(data);
}

function readOutLoud(){
  if ('speechSynthesis' in window) {
    // Speech Synthesis supported 🎉
   }else{
     // Speech Synthesis Not Supported 😣
     alert("Sorry, your browser doesn't support text to speech!");
   }
   var msg = new SpeechSynthesisUtterance();
  msg.text = document.getElementById("results").innerText;
  window.speechSynthesis.speak(msg);
}

module.exports = router;
