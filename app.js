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

app.get('/profile', (req, res) => {
    const person = people.profiles.find(p => p.id === req.query.id);
    res.render('profile', {
      title: `About ${person.firstname} ${person.lastname}`,
      person,
    });
  });



const url = 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States';



app.post('/totext', (req, res) => {
    var form_data = req.body.address;
    console.log(form_data);
    var rp = require('request-promise');
    const $ = require('cheerio');
    var images = [];
    rp(form_data)
        .then(function(html){
            //success!
            const imagesLength = $('div > img', html).length;
            for (let i = 0; i < imagesLength; i++) {
                images.push($('div > img', html)[i].attribs.src);
                console.log("done number " + (i+1));
            }
            console.log("inside rq: " + images);
        })
        .catch(function(err){
            //handle error
        });
    console.log("outside rq: " + images);
    for(let image in images){
        var request = require("request");
        var options = { method: 'POST',
            url: 'http://getimagetexts.azurewebsites.net/api/getimagetext',
            headers:
                {
                    'cache-control': 'no-cache',
                    'Content-Type': 'application/json' },
            body: { url: image},
            json: true };
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
            res.render('text', {
                title: 'Media TextScribe',
                words: body.description
            });
        });
    }
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
