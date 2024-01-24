const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/usersModel');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password, done)=>{
            User.findOne({email}).then((user)=>{
                if(!user) done(null, false, {msg: "user does not exist"})
                bcrypt.compare(password, user.password, (err,success)=>{
                    if(err) throw err;

                    if(!success) done(null, false, {message: "Password doesn't match"});
                    else done(null, user)
                })
            }).catch()
        }
    ))

    passport.serializeUser(function(user, done) {
        process.nextTick(function() {
          return done(null, user);
        });
      });
      
      passport.deserializeUser(function(user, done) {
        process.nextTick(function() {
          return done(null, user);
        });
      });
}