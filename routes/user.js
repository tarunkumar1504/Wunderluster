const express = require('express');
const user = require('../models/user');
const WrapAsync = require('../utils/WrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const { signupuser, signupform, loginform, loginuser, logoutuser } = require('../controllers/user');
const router = express.Router();

router.get("/signup", signupform)

router.post("/signup", WrapAsync(signupuser))

router.get("/login", loginform)

router.post("/login", saveRedirectUrl, passport.authenticate('local', {failureRedirect: '/login' , failureFlash:true}) , WrapAsync(loginuser))

router.get("/logout", logoutuser)

module.exports = router;
