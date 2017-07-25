var express           = require('express');
var passport          = require('passport');
var LocalStrategy     = require('passport-local').Strategy;
var session           = require('express-session');
var User              = require('../models/users');
var router = express.Router();

/* GET home page. */
router.get('/', checkAuth,function(req, res, next) {

    //console.log('------------->User: '+req.user.username);

  res.render('index', {
      title: 'myChat',
      name : req.user.username
  });
});

function checkAuth(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error_msg", "You are not logged in.");
        res.redirect("/users/login");
    }
}

module.exports = router;
