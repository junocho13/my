const request = require('request');
const dbConnection = require('../lib/auth_mysql');

module.exports = DBUpdate = () => {
    request('http://120.50.72.243:1235/code/all', function (error, response, body) {
      //console.error('error:', error); // Print the error if one occurred
      //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      //console.log('body:', body); // Print the HTML for the Google homepage.
      if (error) return;
      var parsedBody = JSON.parse(body);
      dbConnection((db) => {
        (async () => {
          for await (row of parsedBody) {
            var pk = row["code"];
            for (key in row) {
              var key1 = key;
              if(key1=="change") key1 = "`change`"; 
              if(row[key] != null) {
                if(key == "code" || key == "name"){
                  row[key] = `'${row[key]}'`;
                }
                else if(key=="tradetime") {
                  row[key] = row[key].substr(0,10)+" "+row[key].substr(11,8);
                  row[key] = `'${row[key]}'`;
                }
              }
              db.query(`UPDATE STOCKINFO SET ${key1}=${row[key]} WHERE code='${pk}'`, function (error, results, fields) { // 초기화
                if (error) console.log(error);
              });
            }
          }
          db.release();
        })();
      });
      console.log('update success!');
    });
  }