var express         = require('express');
var passport        = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var session         = require('express-session');
var User            = require('../models/users');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function (req, res) {
    res.render('auth', {title: 'Login'});
});

/*router.post('/login', function (req, res) {
    console.log('Username: '+req.body.username);
    console.log('Password: '+req.body.password);
});*/

//Register User
router.post('/register', function (req, res) {

    var username  = req.body.username;
    var password  = req.body.password;
    var password2 = req.body.password2;
    var firstname = req.body.firstname;
    var lastname  = req.body.lastname;

    //validation
    req.checkBody('username','Username is required').notEmpty();
    req.checkBody('firstname','First name is required').notEmpty();
    req.checkBody('lastname','Last name is required').notEmpty();
    req.checkBody('password','Password is required').notEmpty();
    req.checkBody('password2','Password do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if(errors){
        res.render('register',{ errors:errors});
    }else {

        var newUser = new User({
            username  : username,
            password  : password,
            firstname : firstname,
            lastname  : lastname
        });

        User.createUser(newUser, function (err, user) {
            if(err) throw err;
            //console.log(user);
        });

        req.flash('success_msg', 'You are registered and can now login');

        res.redirect('/users/login');
    }

});

passport.use(new LocalStrategy(
    function (username, password, done) {

    User.getUserByUsername(username, function (err, user) {

        if(err) throw err;
        if(!user){
            return done(null, false, {message: 'Unknown User'});
        }else{

            //console.log('--------------> User: '+user.username);
        }

        User.comparePassword(password, user.password, function (err, isMatch) {
            if(err) throw err;
            if(isMatch){
                return done(null, user);
            }else{
                return done(null, false, {message: 'Invalid password'});
            }
        });
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {

    var Id = {
        _id : id
    }

    User.getUserById(Id, function (err, user) {
        done(err, user);
    });
});

router.post('/login',
        passport.authenticate('local', {successRedirect:'/', failureRedirect: '/users/login', failureFlash: true}), function(req, res){
        res.redirect('/');
    });

router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success_message', 'You are logged out');
    res.redirect('/users/login');
});


module.exports = router;
