const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const sanitizeHtml = require('sanitize-html');
const dbConnection = require('../../lib/auth_mysql');
const info = require('../../lib/private_info');
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

/*
bcrypt.hash(myPlaintextPassword, saltRounds).then(function(hash) {
    // Store hash in your password DB.
});
// Load hash from your password DB.
bcrypt.compare(myPlaintextPassword, hash).then(function(result) {
    // result == true
});
bcrypt.compare(someOtherPlaintextPassword, hash).then(function(result) {
    // result == false
});
This is also compatible with async/await

async function checkUser(username, password) {
    //... fetch user from a db etc.
 
    const match = await bcrypt.compare(password, user.passwordHash);
 
    if(match) {
        //login
    }
 
    //...
}
*/

router.post('/', function(request,response){
    var sanitizedId = sanitizeHtml(request.body.id);
    var sanitizedPassword = sanitizeHtml(request.body.password);
    //console.log(sanitizedId);
    //console.log(sanitizedPassword);
    (async () => {
        var hashedPassword = await bcrypt.hash(sanitizedPassword, info.saltRounds);
        dbConnection((db) => {
            console.log(hashedPassword);
            db.query(`INSERT INTO auth VALUES ('${sanitizedId}','${hashedPassword}')`, function (error, results, fields) {
                if (error) console.log(error);
                else console.log('complete');
            });
            db.release();
        });
    })();
    var html = `
    <h1>회원가입에 성공하셨습니다.</h1>
    <a href="/"><input type="button" value="홈으로"></a>
    `;
    response.send(html);
});
module.exports = router;