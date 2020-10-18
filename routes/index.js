var express = require('express');
var res = require('request');
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
                var options = { method: 'POST',
                    url: 'http://getimagetexts.azurewebsites.net/api/getimagetext',
                    headers:
                        {
                            'cache-control': 'no-cache',
                            'Content-Type': 'application/json' },
                    body: {'url': 'https://en.wikipedia.org/wiki/COVID-19_pandemic'},
                    json: true };
                    res(options, function (error, response) {
                    if (error) throw new Error(error);
                    if(response.body != undefined){
                      console.log(response.body);
                      document.getElementById("results").innerText = JSON.stringify(response.body);
                    }
                });

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
