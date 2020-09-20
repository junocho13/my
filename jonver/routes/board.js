const express = require('express');
const router = express.Router();
const statusUI = require('../lib/statusUI');
const htmlHeader = require('../lib/htmlHeader')
const dbConnection = require('../lib/auth_mysql');
const sanitizeHtml = require('sanitize-html');
router.use(express.json());                         // post쓸때
router.use(express.urlencoded({ extended: true })); // 필수,,,,




router.get('/new', function (req, res) {
    var board = htmlHeader + statusUI(req, res) +`
    <br><br>
    <div id="divId5">
    <a style="float:right" href="/board/1">목록으로</a>
    <form action='/board/create' method='post'>
    `
    if (req.user) {
        board += `
        <div>작성자</div><br>
        <label>${req.user}</label><br><br>
        <input type="hidden" name="user" value="${req.user}">
        <input type="hidden" name="password" value="">
        `;
    }
    else{
        board += `
        <div>작성자</div><br>
        <input type="text" name="user" required><br><br>
        <div>비밀번호</div><br>
        <input type="password" name="password" required><br><br>
        `;
    }
        
    board+=`
    <div>제목</div><br>
    <input id="textId1" type="text" name="title" required><br><br>
    <div>본문</div><br>
    <textarea name="context" rows="20" cols="100" required></textarea><br><br>
    <input type="submit" value="글작성">
    </form>
    </div>
    `;
    res.send(board);
});

router.post('/update_process', function (req, res) {
    var sanitizedId = sanitizeHtml(req.body.id);
    var sanitizedTitle = sanitizeHtml(req.body.title);
    var sanitizedContext = sanitizeHtml(req.body.context); 
    dbConnection((db) => {
        db.query(`UPDATE BOARD SET title = '${sanitizedTitle}', context = '${sanitizedContext}' WHERE ID=${sanitizedId}`, function (error, results, fields) {
            if(error) console.log(error);
        });
        db.release();
    });
    res.redirect(`/board/view/${sanitizedId}`);
});


router.post('/create', function (req, res) {
    var sanitizedUser = sanitizeHtml(req.body.user);
    var sanitizedPassword = sanitizeHtml(req.body.password);
    var sanitizedTitle = sanitizeHtml(req.body.title);
    var sanitizedContext = sanitizeHtml(req.body.context); 
    dbConnection((db) => {
        db.query(`INSERT INTO BOARD(user, password, datetime, hit, title, context) VALUES ('${sanitizedUser}','${sanitizedPassword}',NOW(),0,'${sanitizedTitle}','${sanitizedContext}')`, function (error, results, fields) {
            if(error) console.log(error);
            db.query(`SELECT LAST_INSERT_ID()`, function (error, results, fields) {
                if(error) console.log(error);
                res.redirect(`/board/view/${results[0]['LAST_INSERT_ID()']}`);
            });
        });
        db.release();
    });
    
});



router.post('/update', function (req, res) {
    var sanitizedId = sanitizeHtml(req.body.id); 
    dbConnection((db) => {
        db.query(`SELECT * FROM BOARD WHERE ID = '${sanitizedId}'`, function (error, results, fields) {
            if(error) console.log(error);
            var board = htmlHeader + `<div class="header2">`+ statusUI(req, res) +
            `
            <script>
            checkToUpdate = () => {
                return confirm('정말 수정하시겠습니까?');
            }
            </script>
            <br><br>
            <form action='/board/update_process' method='post' onsubmit='return checkToUpdate();'>
            <input type="hidden" name="id" value=${sanitizedId}>
            <div>제목</div><br>
            <input type="text" name="title" value="${results[0]["title"]}" required><br><br>
            <div>본문</div><br>
            <textarea name="context" rows="20" cols="100" required>${results[0]["context"]}</textarea><br><br>
            <input type="submit" value="수정">
            </form>
            `;
            res.send(board);
        });
        db.release();
    });
});


router.post('/delete', function (req, res) {
    var sanitizedId = sanitizeHtml(req.body.id);
    dbConnection((db) => {
        db.query(`DELETE FROM BOARD WHERE ID = '${sanitizedId}'`, function (error, results, fields) {
            if(error) console.log(error);
        });
        db.release();
    });
    res.redirect('/board/1');
});


router.get('/view/:id', function (req, res) {
    dbConnection((db) => {
        db.query(`UPDATE BOARD SET hit = hit+1 WHERE ID='${req.params.id}'`, function (error, results, fields) {
            if(error) console.log(error);
            db.query(`SELECT * FROM BOARD WHERE ID='${req.params.id}'`, function (error, results, fields) {
                if (error) console.log(error);
                var view = htmlHeader + `<div class="header2">`+ statusUI(req, res) +
                `
                <a class="header1 left" href="/board/new">글쓰기</a>
                <br><br><br><br><hr>
                </div>
                <script>
                    var check = 1;
                    var user, password;
                `
                if (results[0]["password"]) {
                    view += `
                    check = 0;
                    password = '${results[0]["password"]}'
                    `
                }
                if (req.user) {
                    view += `
                    user = '${req.user}';
                    `
                }
                view +=
                `
                checkAuthToDelete = () =>{
                    if(check==1){
                        if(user == '${results[0]["user"]}'){
                            return confirm('정말 삭제하시겠습니까?');
                        }
                        else{
                            alert('작성자만 삭제할 수 있습니다.');
                            return false;
                        }
                    }
                    else{
                        var checkPassword = prompt('비밀번호를 입력하세요');
                        if(checkPassword==password){
                            return confirm('정말 삭제하시겠습니까?');
                        }
                        else{
                            alert('비밀번호가 올바르지 않습니다.');
                            return false;
                        }
                    }
                }
                checkAuthToUpdate = () =>{
                    if(check==1){
                        if(user == '${results[0]["user"]}'){
                            return true;
                        }
                        else{
                            alert('작성자만 삭제할 수 있습니다.');
                            return false;
                        }
                    }
                    else{
                        var checkPassword = prompt('비밀번호를 입력하세요');
                        if(checkPassword==password){
                            return true;
                        }
                        else{
                            alert('비밀번호가 올바르지 않습니다.');
                            return false;
                        }
                    }
                }
                </script>
                `;
                view += `
                <br><br>
                <div id="divId6">
                <div></div><div>
                <form style="display:inline" action='/board/update' method='post' onsubmit='return checkAuthToUpdate();'>
                    <input type="hidden" name="id" value = ${req.params.id}>
                    <input type="submit" value="수정">
                </form>
                <div style="display:inline">&nbsp;&nbsp;</div>
                <form style="display:inline" action='/board/delete' method='post' onsubmit='return checkAuthToDelete();'>
                    <input type="hidden" name="id" value = ${req.params.id}>
                    <input type="submit" value="삭제">
                </form>
                <a style="float:right" href="/board/1">목록으로</a>
                <br><br>
                <div id="divId7">
                <span style="width:30px">id</span><!--
                --><label id="labelId1">${results[0]["id"]}</label><!--
                --><span>작성자</span><!--
                --><label id="labelId2">${results[0]["user"]}</label><!--
                --><span>작성시간</span><!--
                --><label id="labelId3">${results[0]["datetime"].toISOString().replace(/T/, ' ').replace(/\..+/, '')}</label><!--
                --><span>조회수</span><!--
                --><label id="labelId4">${results[0]["hit"]}</label><!--
                --><span style="width:30px">제목</span><!--
                --><label id="labelId5">${results[0]["title"]}</label><!--
                --><span style="width:30px">내용</span><!--
                --><label id="labelId6">${results[0]["context"]}</label>
                </div>
                </div><div></div>
                `;
                res.send(view);
            });
        });
        db.release();
    });
});

router.get('/:ofset', function (req, res) {
    var board = htmlHeader + `<div class="header2">`+ statusUI(req, res) +
    `
    <a class="header1 left" href="/board/new">글쓰기</a>
    <br><br><br><br><hr>
    </div>
    <div class="grid-container">
        <div></div>
        <div class="grid-item">
        <table class="tableClass2">
            <tr>
                <th class="thtdClass1">ID</th>
                <th class="thtdClass2">제목</th>
                <th class="thtdClass3">작성자</th>
                <th class="thtdClass4">작성시간</th>
                <th class="thtdClass5">조회수</th>
            </tr>
    `;
    var count = 10;
    var offset = (req.params.ofset-1)*count;
    dbConnection((db) => {
        db.query(`SELECT COUNT(*) AS cnt FROM BOARD`, function (error, results0, fields) {
            if (error) console.log(error);
            db.query(`SELECT * FROM BOARD ORDER BY id DESC LIMIT ${offset}, ${count}`, function (error, results, fields) {
                if (error) console.log(error);
                results.forEach((value, index, array) => {
                    board += `
                    <tr>
                        <td class="thtdClass1">${value["id"]}</td>
                        <td class="thtdClass2"><a href="/board/view/${value["id"]}">${value["title"]}</a></td>
                        <td class="thtdClass3">${value["user"]}</td>
                        <td class="thtdClass4">${value["datetime"].toISOString().replace(/T/, ' ').replace(/\..+/, '')}</td>
                        <td class="thtdClass5">${value["hit"]}</td>
                    </tr>
                    `;
                });
                board+=`
                </table class="tableClass2"><br>
                <div>
                `;
                var tot = Math.ceil(results0[0]['cnt']/(count*10));
                var loc = Math.ceil(req.params.ofset/10);
                if(loc > 1){
                    board+=` <span>&nbsp;&nbsp;</span><a href="/board/${(loc-2)*10+1}">◀</a> `;
                }
                else{
                    board+=` <span>&nbsp;&nbsp;◀</span> `;
                }
                var i;
                for(i=1;i<Math.min(results0[0]['cnt']/count-(loc-1)*10,10);i++){
                    board += `<a href="/board/${i+(loc-1)*10}">${i+(loc-1)*10}</a> | `;
                }
                board += `<a href="/board/${i+(loc-1)*10}">${i+(loc-1)*10}</a>`;
                if(loc < tot){
                    board+=` <a href="/board/${loc*10+1}">▶</a> `;
                }
                else{
                    board+=` <span>▶</span> `;
                }
                board+=`<br>
                    </div>
                    </div>
                </div>
                `
                res.send(board);
            });
        });
        db.release();
    });
});

module.exports = router;