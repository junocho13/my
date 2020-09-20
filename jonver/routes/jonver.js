const express = require('express');
const router = express.Router();
const statusUI = require('../lib/statusUI');
const dbConnection = require('../lib/auth_mysql');
const sanitizeHtml = require('sanitize-html');
const searchRouter = require('../routes/jonver/search');
const viewOffifialsRouter = require('../routes/jonver/view_officials');
const jonverUI = require('../lib/jonverUI');
const htmlHeader = require('../lib/htmlHeader')
router.use(express.json());                         // post쓸때
router.use(express.urlencoded({ extended: true })); // 필수,,,,




router.use('/search', searchRouter);
router.use('/view_officials', viewOffifialsRouter);


router.get('/', function(request,response){
    var html = htmlHeader + `<div class="header2">`+ statusUI(request,response) + jonverUI + `</div>`;
    response.send(html);
});

router.get('/home', function(request,response){
    var html = htmlHeader + `<div class="header2">`+ statusUI(request,response) + jonverUI + `</div>`;
    html += `
    <div id="id1"></div>
    <script>
    function getOriginalData(){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                document.getElementById("id1").innerHTML = this.responseText;
            }
        };
        xhttp.open("GET", "/jonver/search/home", true);
        xhttp.send();
    }
    getOriginalData();
    </script>
    `;
    response.send(html);
});

router.get('/sort', function(request,response){
    var html = htmlHeader + `<div class="header2">`+ statusUI(request,response) + jonverUI + `</div>`;
    html += `
    <div id="id1"></div>
    <script>
    function getOriginalData(){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                document.getElementById("id1").innerHTML = this.responseText;
            }
        };
        xhttp.open("GET", "/jonver/search/sort", true);
        xhttp.send();
    }
    getOriginalData();
    </script>
    `;
    response.send(html);
});


module.exports = router;