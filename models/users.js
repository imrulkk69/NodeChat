/**
 * Created by IMRUL on 6/17/2017.
 */
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');

var userSchema = new mongoose.Schema({
    username  : {type: String, unique: true},
    password  : {type: String},
    firstname : String,
    lastname  : String
});

var User = module.exports  = mongoose.model('myusers', userSchema);

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash){
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserByUsername = function (username, callback){
    var query = {username : username};

    User.findOne(query, callback);
}

module.exports.getUserById = function (id, callback){

    User.findOne(id, callback);
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
       if(err) throw err;
       else{
           callback(null, isMatch);
       }

    });
};