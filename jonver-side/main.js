const express = require('express');
const favicon = require('serve-favicon');
const fs = require('fs');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const compression = require('compression');
const helmet = require('helmet');
const info = require('./lib/private_info');
const apiExplain = require('./lib/apiEx');
const dbConnection = require('./lib/auth_mysql');
const schedule = require('node-schedule');
let {google} = require('googleapis');
let privateKey = require('./lib/double-aleph-288621-55e1b6753ae1.json');
var app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(favicon(path.join(__dirname,'favicon.ico')));
app.use(express.json());//built in body parser 
app.use(compression());


let jwtClient = new google.auth.JWT(
  privateKey.client_email,
  null,
  privateKey.private_key,
  ['https://www.googleapis.com/auth/spreadsheets',
    //'https://www.googleapis.com/auth/drive',
    //'https://www.googleapis.com/auth/calendar'
  ]
);

//authenticate request
jwtClient.authorize(function (err, tokens) {
  if (err) {
    console.log(err);
    return;
  }
  else {
    console.log("Successfully connected!");
  }
});

app.get('/', function (req, res) {
  res.send(apiExplain);
});

app.get('/code/checkCode', function (req, res) {
  dbConnection((db) => {
    db.query(`SELECT code,name FROM STOCKINFO`, function (error, results, fields) { // 사용중
      if (error) console.log(error);
      res.send(results);
    });
    db.release();
  });
});

app.get('/code/all', function (req, res) {
  dbConnection((db) => {
    db.query(`SELECT * FROM STOCKINFO`, function (error, results, fields) { // 사용중
      if (error) console.log(error);
      res.send(results);
    });
    db.release();
  });
});

app.get('/code/:code', function (req, res) {
  var qry = req.params.code;
  console.log(qry);
  sanitizedQuery = sanitizeHtml(qry);
  dbConnection((db) => {
    db.query(`SELECT * FROM STOCKINFO WHERE code=${sanitizedQuery}`, function (error, results, fields) { // 사용중
      if (error) console.log(error);
      if(results[0]) res.status(200).send(results[0]);
      else res.status(404).send();
    });
    db.release();
  });
});

  
DBUpdate = () => {
  //Google Sheets API
  let spreadsheetId = '13epVtnkaW3bZJSCz2KRGaemA54zLuf86mHM-0CPyJIc';
  let sheetName = 'sheet1'
  let range = '!A3:S2368'
  let sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: jwtClient,
    spreadsheetId: spreadsheetId,
    range: sheetName + range,
  }, function (err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
    }
    else {
      for (let row of response.data.values) {
        row[0] = '\'' + row[0] + '\'';
        row[1] = '\'' + row[1] + '\'';
        if(row[8]!='NULL') row[8] = '\'' + row[8] + '\'';
        dbConnection((db) => {
          db.query(`DELETE FROM STOCKINFO WHERE code=${row[0]}`, function (error, results, fields) { // 사용중
            if (error) console.log(error);
          });
          db.query(`INSERT INTO STOCKINFO VALUES (${row})`, function (error, results, fields) { // 초기화
            if (error) console.log(error);
          });
          db.release();
        });
      }
      console.log('update complete');
    }
  });
}

DBUpdate();



const DBUpdateRepeat = schedule.scheduleJob('*/20 9-16 * * 1-5 ', function () {//mon-fri 9am-4pm every 20minutes
  DBUpdate();
});



app.listen(3001);

// //let today = new Date();   
// // let year = today.getFullYear(); // 년도
// // let month = today.getMonth() + 1;  // 월
// // let date = today.getDate();  // 날짜
// // let day = today.getDay();
// // let hours = today.getHours(); // 시
// // let minutes = today.getMinutes();  // 분
// // let seconds = today.getSeconds();  // 초
// // let milliseconds = today.getMilliseconds(); // 밀리초
// console.log(today.getHours());