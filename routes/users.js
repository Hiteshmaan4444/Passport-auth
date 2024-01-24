const express = require('express');
const User = require('../models/usersModel');
const bcrypt = require('bcryptjs');
const passport = require('passport')
const router = express.Router();

//Login Page
router.get('/login',(req,res)=>{
    res.render("login")
})

//Register Page
router.get('/register',(req,res)=>{
    res.render("register")
})

router.post('/register', (req, res)=>{
    const {name, email, password, password2 } = req.body;
    const errors = [];
    //Check all the fields are filled
    if(!name || !email || !password ||!password2){
        errors.push({msg: "Please fill all the fields"});
    }

    //Check if the passwords match
    if(password!=password2){
        errors.push({msg: "password and confirm password does not match"});
    }

    //Check if the password length is atleast 6
    if(password.length<6){
        errors.push({msg: "min password length should be 6"});
    }

    if(errors.length){
        res.render("register",{
            errors,
            name,
            email,
            password,
            password2
        })
    }else{

        User.findOne({email}).then((user)=>{
            if(user){
                errors.push({msg: "User is already register"});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            }else{
                const newUser = new User({
                    email,
                    name,
                    password
                })

                bcrypt.genSalt(10, (err, salt) =>bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    if(err) throw err;

                    newUser.password = hash;

                    newUser.save()
                    .then(user =>{
                        req.flash('success_msg', 'You are successfully registered, now login');
                        res.redirect('/users/login');
                    })
                }))
                
            }
        })
    }
})

router.post('/login', (req, res, next)=>{
   passport.authenticate('local', {
    successRedirect: '/dashBoard',
    failureRedirect: '/users/login',
    failureFlash: true,
   })(req, res, next)
})

router.get('/logout',(req,res)=>{
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        // Additional logic after logout
        req.flash('success_msg',"You are successfully logged out");
        res.redirect('/users/login') // Redirect to a different page after logout
    });
   
})

module.exports = router;