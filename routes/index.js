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
  document.getElementById("result").innerHTML = "Translated";
}

function readOutLoud(){
  if ('speechSynthesis' in window) {
    // Speech Synthesis supported 🎉
   }else{
     // Speech Synthesis Not Supported 😣
     alert("Sorry, your browser doesn't support text to speech!");
   }
   var msg = new SpeechSynthesisUtterance();
  msg.text = document.getElementById("result").innerHTML;
  window.speechSynthesis.speak(msg);
}
module.exports = router;
