const express = require('express');
const router = express.Router();
const dbConnection = require('../../lib/auth_mysql');
const url = require('url');
const sanitizeHtml = require('sanitize-html');
const statusUI = require('../../lib/statusUI');
const jonverUI = require('../../lib/jonverUI');
const htmlHeader = require('../../lib/htmlHeader')


router.get('/', function (req, res) {
    var html =htmlHeader + `<div class="header2">`+ statusUI(req,res) + jonverUI + `</div>`;
    html += `
    <br><br>
    <form id="formId1" action='/jonver/search/'>
        <br>
        <div>
        <div></div><div id="divId2">원하는 종목을 검색하세요</div><div></div>
        <div></div><div>
        <input id="text" type="text" name="name" onkeyup="getData(this.value)">
        <input id="submit" type="submit" value="검색">
        </div><div></div>
        <div></div><div>
        <select id="select" onchange="insert()"></select>
        </div><div></div>
        
    </form>
    <br><br>
    <table class="tableClass1">
        <tr>
            <th>
                <span>종목코드</span>
                <span>종목</span>
                <span>현재주식가격</span>
                <span>예상수익률</span>
                <span>재무제표</span>
            </th>
        </tr>
    <script>
    function insert(){
        document.forms[0].elements[0].value = document.forms[0].elements[2].value;
        document.forms[0].elements[2].style = "display:none";
    }
    function getData(str){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                var text = JSON.parse(this.responseText);
                document.forms[0].elements[2].options.length = 0;
                document.forms[0].elements[2].style = "display:none";
                var it = Math.min(text.length,5);
                document.forms[0].elements[2].size = it;
                if(it) document.forms[0].elements[2].style = "display:block";
                for(var i=0;i<it;++i){
                    var op = new Option();
                    op.value = text[i]["name"];
                    op.text = text[i]["name"];
                    op.on
                    document.forms[0].elements[2].add(op);
                }
            }
        };
        xhttp.open("GET", "/jonver/search/"+str, true);
        xhttp.send();
    }
    </script>
    `;
    var sanitizedStr = sanitizeHtml(url.parse(req.url, true).query.name);
    dbConnection((db) => {
        db.query(`SELECT code,name,price,pe,eps,corp_code FROM STOCKINFO WHERE name = '${sanitizedStr}'`, function (error, results, fields) { // 초기화
            if (error) console.log(error);
            if (results.length) {
                var prediction, increaseRate;
                if (results[0]["eps"] < 0) {
                    prediction = 0;
                    increaseRate = -100;
                }
                else {
                    prediction = results[0]["pe"] * results[0]["eps"];
                    increaseRate = (prediction - results[0]["price"]) / results[0]["price"] / 5 * 100;
                    increaseRate = increaseRate.toFixed(4);
                }
                html += `
                    <tr>
                        <td>
                            <span>${results[0]["code"]}</span>
                            <span>${results[0]["name"]}</span>
                            <span>${results[0]["price"]}</span>
                            <span>${increaseRate} %</span>
                            <span><a class="a2" href="/jonver/view_officials/${results[0]["corp_code"]}">재무제표</span>
                        </td>
                    </tr>
                    </table><br><br>`;
            }
            res.send(html);
        });
        db.release();
    });
});


router.get('/home', function (req, res) {
    var html = htmlHeader + `
    <br>
    <table class="tableClass1">
        <tr>
            <th>
                <span>종목코드</span>
                <span>종목</span>
                <span>현재주식가격</span>
                <span>예상수익률</span>
                <span>재무제표</span>
            </th>
        </tr>
    `;
    dbConnection((db) => {
        db.query(`SELECT code,name,price,pe,eps,corp_code FROM STOCKINFO WHERE price is NOT NULL`, function (error, results, fields) { // 초기화
            if (error) console.log(error);
            for(row of results){
                var prediction, increaseRate;
                if(row["eps"]<0) {
                    prediction = 0;
                    increaseRate = -100;
                }
                else {
                    prediction = row["pe"]*row["eps"];
                    increaseRate = (prediction-row["price"])/row["price"]/5*100;
                    increaseRate = increaseRate.toFixed(4);
                }
                html += `
                    <tr>
                        <td>
                            <span>${row["code"]}</span>
                            <span>${row["name"]}</span>
                            <span>${row["price"]}</span>
                            <span>${increaseRate} %</span>
                            <span><a class="a2" href="/jonver/view_officials/${row["corp_code"]}">재무제표</span>
                        </td>
                    </tr>
                    `;
            }
            html+=`</table><br><br>`;
            res.send(html);
        });
        db.release();
    });
});


router.get('/sort', function (req, res) {
    var html = htmlHeader + `
    <br>
    <table class="tableClass1">
        <tr>
            <th>
                <span>종목코드</span>
                <span>종목</span>
                <span>현재주식가격</span>
                <span>예상수익률</span>
                <span>재무제표</span>
            </th>
        </tr>
    `;
    dbConnection((db) => {
        db.query(`SELECT code,name,price,pe,eps,corp_code FROM STOCKINFO WHERE price is NOT NULL`, function (error, results, fields) { // 초기화
            if (error) console.log(error);
            results.sort((a,b)=>{
                if(a["eps"]<0 && b["eps"]<0) return -1;
                else if(a["eps"]<0) return 1;
                else if(b["eps"]<0) return -1;
                predictionA = (a["pe"]*a["eps"]-a["price"])/a["price"];
                predictionB = (b["pe"]*b["eps"]-b["price"])/b["price"];
                return predictionB-predictionA;
            })
            for(row of results){
                var prediction, increaseRate;
                if(row["eps"]<0) {
                    prediction = 0;
                    increaseRate = -100;
                }
                else {
                    prediction = row["pe"]*row["eps"];
                    increaseRate = (prediction-row["price"])/row["price"]/5*100;
                    increaseRate = increaseRate.toFixed(4);
                }
                html += `
                    <tr>
                        <td>
                            <span>${row["code"]}</span>
                            <span>${row["name"]}</span>
                            <span>${row["price"]}</span>
                            <span>${increaseRate} %</span>
                            <span><a class="a2" href="/jonver/view_officials/${row["corp_code"]}">재무제표</span>
                        </td>
                    </tr>
                    `;
            }
            res.send(html);
        });
        db.release();
    });
    
});

router.get('/:str', function (req, res) {
    var sanitizedStr = sanitizeHtml(req.params.str);
    dbConnection((db) => {
        db.query(`SELECT name FROM STOCKINFO WHERE name LIKE '%${sanitizedStr}%' LIMIT 5`, function (error, results, fields) { // 초기화
            if (error) console.log(error);
            res.send(JSON.stringify(results));
        });
        db.release();
    });
});



module.exports = router;