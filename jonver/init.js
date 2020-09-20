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



  // corp_code: [ '01070972' ],
  // corp_name: [ 'AdvancePhotonicsInvestmentsLimited' ],
  // stock_code: [ ' ' ],
  // modify_date: [ '20170630' ]

(init = () => {
    request('http://3.133.120.25:3001/code/all', function (error, response, body) {
        //console.error('error:', error); // Print the error if one occurred
        //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //console.log('body:', body); // Print the HTML for the Google homepage.
        if (error) return;
        var parsedBody = JSON.parse(body);
        dbConnection((db) => {
            (async () => {
                for await (row of parsedBody) {
                    for (key in row) {
                        if(row[key] == null || row[key] == '') row[key]='null';
                        else {
                            if (key == "code" || key == "name") {
                                row[key] = `'${row[key]}'`;
                            }
                            else if (key == "tradetime") {
                                row[key] = row[key].substr(0, 10) + " " + row[key].substr(11, 8);
                                row[key] = `'${row[key]}'`;
                            }
                        }
                    }
                    var rowArray = Object.values(row);
                    rowArray.push('null');
                    db.query(`INSERT INTO STOCKINFO VALUES (${rowArray})`, function (error, results, fields) { // 초기화
                        if (error) console.log(error);
                    });

                }
                db.release();
            })();
        });
        fs.readFile('./CORPCODE.xml', null, (err, data) => {
            if (err) console.log(err);
            parseString(data, function (err, result) {
              dbConnection((db) => {
                (async () => {
                  var i=0;
                  for await(row of result.result.list) {
                    db.query(`UPDATE STOCKINFO SET corp_code = '${row.corp_code[0]}' WHERE code = '${row.stock_code[0]}'`, function (error, results, fields) {
                      if (error) console.log(error);
                    });
                  }
                  db.release();
                  console.log('success');
                })();
              });
            });
          });
        console.log('update success!');
    });
})();




