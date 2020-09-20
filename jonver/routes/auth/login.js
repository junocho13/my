const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const statusUI = require('../../lib/statusUI');
const htmlHeader = require('../../lib/htmlHeader');

router.use(flash());

router.get('/',function(req,res){
    var fmsg = req.flash();
    var feedback = '';
    if(fmsg.error){
        feedback = fmsg.error[0];
    }
    var tmp = htmlHeader + statusUI(req,res) + `
    <br><br>
    <div style='color:red'>${feedback}</div>
    <form action='/auth/login_process' method='post'>
        <div>id</div><br>
        <input type="text" name="username" placeholder="id">
        <span></span><br><br>
        <div>password</div><br>
        <input type="password" name="password" placeholder="password"><br><br>
        <span></span><br>
        <input type="submit" value="로그인">
    </form>
    `;
    res.send(tmp);
  });

module.exports = router;