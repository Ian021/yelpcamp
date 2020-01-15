
const express = require('express');
const passport= require('passport');

const User = require('../models/user')

const router = express.Router();

router.get('/',function(req,res){
    res.render('campgrounds/landing',{layout:'landing'})
})

/* ------------------------------------- AUTH ROUTES -------------------------------------*/

router.get('/register',function(req,res){
    res.render('authentication/register');
})

router.post('/register',function(req,res){
    newUser = new User({username: req.body.username})
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err)
            // res.flash('success',err)
            return res.render('authentication/register')            
        }
        passport.authenticate('local')(req,res,function(){
            // res.flash('success','Welcome to YelpCamp!')
            res.redirect('/campgrounds')
        })
    })
})

router.get('/login',function(req,res){
    res.render('authentication/login');
})

router.post('/login',passport.authenticate('local',{
    successRedirect:'/campgrounds',
    failureRedirect:'/login'
}),function(req,res){});

router.get('/logout',function(req,res){
    req.logout();
    // req.flash('success', 'Thank you for using YelpCamp!')
    res.redirect('/campgrounds')
})


module.exports = router