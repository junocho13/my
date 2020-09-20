const express = require('express');
const favicon = require('serve-favicon');
const fs = require('fs');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const compression = require('compression');
const helmet = require('helmet');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
const info = require('./lib/private_info');
const dbConnection = require('./lib/auth_mysql');
const authRouter = require('./routes/auth');
const boardRouter = require('./routes/board');
const jonverRouter = require('./routes/jonver');
const statusUI = require('./lib/statusUI');
const htmlHeader = require('./lib/htmlHeader')
const DBUpdate = require('./lib/DBUpdate');
const request = require('request');
const schedule = require('node-schedule');
const { url } = require('inspector');
var parseString = require('xml2js').parseString;

var app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,//이새끼때문에 이벤트 작동 안함
  })
);
app.use('/source', express.static(__dirname + '/source'));
app.use(favicon(path.join(__dirname,'favicon.ico')));
app.use(express.json());//built in body parser 
app.use(compression());
app.use(session({
  secret: info.sessionSecretKey,
  resave: false,
  saveUninitialized: true,
  store:new FileStore()
}));


var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  done(null, id);
});

app.use('/auth', authRouter);
app.use('/board', boardRouter);
app.use('/jonver', jonverRouter);

app.get('/',function(req,res){
  var html =htmlHeader + statusUI(req,res);
  html+=`
    <div class="bg-image"></div>
    <div id="divId1">
      <img id="imgId1" src="/source/jonver.png" alt="jonver">
    </div>
 
  `
  res.send(html);
});

DBUpdate();

const DBUpdateRepeat = schedule.scheduleJob('10 */20 9-16 * * 1-5 ', function () {//mon-fri 9am-4pm every 20minutes 10second
  DBUpdate();
});




app.listen(3000);

