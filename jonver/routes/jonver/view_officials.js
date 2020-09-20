const express = require('express');
const router = express.Router();
const sanitizeHtml = require('sanitize-html');
const request = require('request');
const info = require('../../lib/private_info');
const fetch = require('node-fetch');
const querystring = require('querystring');
const statusUI = require('../../lib/statusUI');
const jonverUI = require('../../lib/jonverUI');
const htmlHeader = require('../../lib/htmlHeader')


function getFormatDate(date, yearBefore = 0){
    var year = date.getFullYear()-yearBefore;              //yyyy
    var month = (1 + date.getMonth());          //M
    month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
    var day = date.getDate();                   //d
    day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
    return  year + '' + month + '' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
}

router.get('/:code', function (req, res) {
    var d = new Date();
    var today = getFormatDate(d);
    var past =getFormatDate(d,3);
    var sanitizedCode = sanitizeHtml(req.params.code);
    const options = {
        uri: "https://opendart.fss.or.kr/api/list.json",

        qs:{
            crtfc_key:info.dartKey,
            corp_code:sanitizedCode,
            bgn_de:past,
            end_de:today,
            pblntf_ty:'A',
        },
      };
    request(options, function (error, response, body) {
      console.error('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', body); // Print the HTML for the Google homepage.
      if (error) return;
      var parsedBody = JSON.parse(body);
      console.log(parsedBody);
      for (let row of parsedBody) {
        for (key in row) {
          if (row[key] != "NULL") row[key] = `${row[key]}`;
          dbConnection((db) => {
            db.query(`UPDATE STOCKINFO SET ${key}=${row[key]} WHERE code='${row["code"]}'`, function (error, results, fields) { // 초기화
              if (error) console.log(error);
            });
            db.release();
          });

        }
      }
      console.log('success!');
    }).pipe(res);
    // var qs = {
    //   crtfc_key:info.dartKey,
    //   corp_code:sanitizedCode,
    //   bgn_de:past,
    //   end_de:today,
    //   pblntf_ty:'A',
    // }
    // fetch(`https://opendart.fss.or.kr/api/list.json?${querystring.stringify(qs)}`)
    // .then(res => res.json())
    // .then(officialdata => {
    //   var html = htmlHeader + statusUI(req,res)+jonverUI + `
    //   <br><br>
    //   <div id="divId3">
    //   <div id="divId4">${officialdata["list"][0]["corp_name"]}</div><Br><Br>
    //   `;
    //   for(row of officialdata["list"]){
    //     html+=`<a href="http://dart.fss.or.kr/dsaf001/main.do?rcpNo=${row["rcept_no"]}">${row["report_nm"]}</a> | 
    //     <a href="http://dart.fss.or.kr/dsaf001/main.do?rcpNo=${row["rcept_no"]}" target="_blank">[ 새창에서 열기 ]</a><br><br>`
    //     //모바일모드 : http://m.dart.fss.or.kr/html_mdart/MD1007.html?rcpNo=접수번호
    //   }
    //   html+=`</div>`;
    //   res.send(html);
    // });
});



module.exports = router;