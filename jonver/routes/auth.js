const express = require('express');
const router = express.Router();
const newaccountRouter = require('../routes/auth/newAccount');
const checkIdRouter = require('../routes/auth/checkId');
const createUserRouter = require('../routes/auth/createUser');
const loginRouter = require('../routes/auth/login');
const loginProcessRouter = require('../routes/auth/login_process');
const logoutRouter = require('../routes/auth/logout');
router.use('/newaccount', newaccountRouter);
router.use('/checkId', checkIdRouter);
router.use('/createUser',createUserRouter);
router.use('/login', loginRouter);
router.use('/login_process',loginProcessRouter);
router.use('/logout', logoutRouter);

module.exports = router;