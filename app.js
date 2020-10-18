var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var router = express.Router();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const people = require('./people.json');
const { render } = require('pug');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', {
      title: 'Media TextScribe', 
      people: people.profiles
    });
});

app.get('/video', (req, res) => {
    res.render('video', {
      title: `Video`
    });
  });

app.get('/totext', (req, res) =>{
  res.render('text', {
    title: 'text',
    words: 'Hello World'
  });
});

app.get('/video2', (req, res) => {
    res.render('video2', {
        title: `Video`
    });
});


app.post('/totext', (req, res) => {
    var form_data = req.body.address;
    var rp = require('request-promise');
    const cheerio = require('cheerio');
    var result_arr = [];
    rp(form_data, function (error, result, body){
            const $ = cheerio.load(result.body);
            $('header').remove();
            $('footer').remove();
            for (var i = 0 ; i < $('img').length; i++){
              var url = $('img')[i].attribs.src;
              if(url != undefined){
              if(url[0] !='h'){
                var http = 'https:'
                url = http.concat(url);
              }
              var request = require("request");
                var options = { method: 'POST',
                    url: 'http://getimagetexts.azurewebsites.net/api/getimagetext',
                    headers:
                        {
                            'cache-control': 'no-cache',
                            'Content-Type': 'application/json' },
                    body: {'url': url},
                    json: true };
                  request(options, function (error, response) {
                    if (error) throw new Error(error);
                    if(response.body != undefined){
                      console.log(response.body);
                      var r = JSON.stringify(response.body['description']);
                      if(r!=""){
                        var p = $('<p> Picture to Text: ' + r + '</p>');
                      }
                      else{
                        var p = $('<p></p>');
                      }
                      $('img').first().replaceWith(p);
                    }
                });
            }
          }

            setTimeout(function(){
              res.render('text', {
                title: 'Media TextScribe',
                words: $.html()
              })
            },15000);
          });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
