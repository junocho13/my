const fetch = require('node-fetch');
const querystring = require('querystring');
const express = require('express');
const router = express.Router();
const sanitizeHtml = require('sanitize-html');
const request = require('request');
var rp = require('request-promise');
const axios = require('axios');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var rp = require('request-promise');
// var t = /[a-zA-Z0-9_-]/g;
// var str = '-_-';
// var myarray = str.match(t);
// console.log(myarray.length);
// console.log(str.length);


// var d = new Date();
// document.getElementById("demo").innerHTML = d.getFullYear();

// getFullYear()	Get the year as a four digit number (yyyy)
// getMonth()	Get the month as a number (0-11)
// getDate()	Get the day as a number (1-31)
// getHours()	Get the hour (0-23)
// getMinutes()	Get the minute (0-59)
// getSeconds()	Get the second (0-59)
// getMilliseconds()	Get the millisecond (0-999)
// getTime()	Get the time (milliseconds since January 1, 1970)
// getDay()	Get the weekday as a number (0-6)
// Date.now()	Get the time. ECMAScript 5.

// var qs = {
//     crtfc_key:'a0162b77569f61972a78d428350d063298acf671',
//     corp_code:'00124151',
//     bgn_de:20170101,
//     end_de:20200917,
//     pblntf_ty:'A',
//   }
//   fetch(`https://opendart.fss.or.kr/api/list.json?${querystring.stringify(qs)}`)
//   .then(res => res.json())
//   .then(officialdata => {
//     console.log(officialdata);
//   });


// var qs = {
//     crtfc_key:'a0162b77569f61972a78d428350d063298acf671',
//     corp_code:'00124151',
//     bgn_de:20170101,
//     end_de:20200917,
//     pblntf_ty:'A',
//   }
//   fetch(`https://opendart.fss.or.kr/api/list.json?${querystring.stringify(qs)}`)
//   .then(res => {
//     console.log(res.ok);
//     console.log(res.status);
//     console.log(res.statusText);
//     console.log(res.headers.raw());
//     console.log(res.headers.get('content-type'));
//     });





//     axios. get ("https://opendart.fss.or.kr/api/list.json?crtfc_key=a0162b77569f61972a78d428350d063298acf671&corp_code=00124151&bgn_de=20170101&end_de=20200917&pblntf_ty=A") 
//   . then ((response) => { 
//       console.log(response.request.res);
//     return response; 
//   }) 
//   . catch ((err) => { 
//     console.log (err); 
//   }); 

// //Accept: 'application/json, text/plain, */*'
const options = {
    uri: "https://opendart.fss.or.kr/api/list.json",
    headers: {
      //'User-Agent': 'fff'
  },
    qs:{
        crtfc_key:'a0162b77569f61972a78d428350d063298acf671',
    corp_code:'00124151',
    bgn_de:20170101,
    end_de:20200917,
    pblntf_ty:'A',
    },
  };
request(options, function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
    console.log('success!');
  });

// function reqListener () {
//   console.log(this);
// }

// var oReq = new XMLHttpRequest();
// oReq.addEventListener("load", reqListener);
// oReq.open("GET", "https://opendart.fss.or.kr/api/list.json?crtfc_key=a0162b77569f61972a78d428350d063298acf671&corp_code=00124151&bgn_de=20170101&end_de=20200917&pblntf_ty=A");
// oReq.send();

// var request = require('sync-request');
// var res = request('GET', 'https://opendart.fss.or.kr/api/list.json?crtfc_key=a0162b77569f61972a78d428350d063298acf671&corp_code=00124151&bgn_de=20170101&end_de=20200917&pblntf_ty=A');
// console.log(res.getBody().toString());

// var request = require('sync-request');
// var res = request('GET', 'https://opendart.fss.or.kr/api/list.json?crtfc_key=a0162b77569f61972a78d428350d063298acf671&corp_code=00124151&bgn_de=20170101&end_de=20200917&pblntf_ty=A', {
//   headers: {
//     'Content-type': 'application/json',
//   },
// });
// console.log(res);
