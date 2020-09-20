const express = require('express');
const router = express.Router();
const statusUI = require('../../lib/statusUI');
const htmlHeader = require('../../lib/htmlHeader');

router.get('/', function(request,response){
    var html = htmlHeader + statusUI(request,response) + `
    <br><br>
    <div data-ok1=false data-ok2=false></div>
    <script>
    var submitPossible = () => document.querySelector('div').dataset.ok1=='true' && document.querySelector('div').dataset.ok2=='true';
    function check(str){
        var xhttp;
        if(str==""){
            document.getElementById("id").innerHTML = "";
            return;
        }
        var myarray = str.match(/[a-zA-Z0-9_-]/g);
        if(myarray==null || str.length!=myarray.length){
            document.getElementById("id").style.color = "red";
            document.getElementById("id").innerHTML = "사용할 수 없는 ID 입니다.";
            document.querySelector('div').dataset.ok1 = false;
            document.getElementById("submit").disabled=(submitPossible()!=true);
            return;
        }
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                if(this.responseText==='true'){
                    document.getElementById("id").style.color = "blue";
                    document.getElementById("id").innerHTML = "사용 가능한 ID 입니다.";
                    document.querySelector('div').dataset.ok1 = true;
                }
                else{
                    document.getElementById("id").style.color = "red";
                    document.getElementById("id").innerHTML = "이미 사용중인 ID 입니다.";
                    document.querySelector('div').dataset.ok1 = false;
                }
                document.getElementById("submit").disabled=(submitPossible()!=true);
            }
        };
        xhttp.open("GET", "/auth/checkId/"+str, true);
        xhttp.send();
    }
    function checkPassword(){
        if(document.getElementById("password1").value===""){
            document.querySelector('div').dataset.ok2 = false;
        }
        else if(document.getElementById("password2").value===document.getElementById("password1").value){
            document.getElementById("password").innerHTML = "";
            document.querySelector('div').dataset.ok2 = true;
        }
        else{
            document.getElementById("password").style.color = "red";
            document.getElementById("password").innerHTML = "비밀번호가 일치하지 않습니다";
            document.querySelector('div').dataset.ok2 = false;
        }
        document.getElementById("submit").disabled=(submitPossible()!=true);
    }
    </script>
    <form action='/auth/createUser' method='post'>
        <div>id를 입력하세요</div><br>
        <input type="text" name="id" placeholder="id" onchange="check(this.value)">
        <span id="id"></span><br><br>
        <div>password를 입력하세요</div><br>
        <input id="password1" type="password" name="password" placeholder="password" onchange="checkPassword()"><br><br>
        <div>password를 한 번 더 입력하세요</div><br>
        <input id="password2" type="password" placeholder="password" onchange="checkPassword()">
        <span id="password"></span><br><br>
        <input id="submit" type="submit" value="가입하기" disabled=true>
    </form>
    `;
    response.send(html);
});
module.exports = router;