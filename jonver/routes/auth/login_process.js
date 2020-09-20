const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const sanitizeHtml = require('sanitize-html');
const dbConnection = require('../../lib/auth_mysql');
const flash = require('connect-flash');


router.use(express.json());                         // post쓸때
router.use(express.urlencoded({ extended: true })); // 필수,,,,
router.use(flash());//flash 세션 밑에 선언

//passport는 세션 밑에 선언
var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;


passport.use(new LocalStrategy(
    function(username, password, done) {
        sanitizedUsername = sanitizeHtml(username);
        sanitizedPassword = sanitizeHtml(password);
        (async () => {
            dbConnection((db) => {
                db.query(`SELECT * FROM AUTH WHERE id='${sanitizedUsername}'`, async function (error, results, fields) {
                    if (error) console.log(error);
                    if(!results[0]){
                        return done(null, false, {message: 'Incorrect username.'});
                    }
                    const match = await bcrypt.compare(sanitizedPassword, results[0]['password']);
                    if(!match) {
                        return done(null, false, {message: 'Incorrect password.'});
                    }
                    return done(null, results[0]);
                });
                db.release();
            });
        })();
    }
));
 

router.post('/',
passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
}));

module.exports = router;