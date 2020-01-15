

const express = require('express');
const Campground = require('../models/campgrounds')
const Comments = require('../models/comments')
const middleware = require('../middleware')


const router = express.Router({mergeParams: true});

router.get('/new', middleware.IsLoggedIn, function(req,res){
    // Find Campground
    Campground.findById(req.params.id,function(err,body){
        if(err){
            console.log(err)
        } else {
            campground = body._doc
            res.render('comments/new', {body:campground})
        }
    })
})

router.post('/', middleware.IsLoggedIn, function(req,res){
    // Create a new comment
    Campground.findById(req.params.id,function(err,campground){
        if (err) {
            console.log(err)
        } else {
            Comments.create(req.body.comment,function(err,comment){
                if (err) {
                    console.log(err)
                } else {
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    // Add created comment to the campground
                    comment.save()
                    campground.comments.push(comment)
                    campground.save()
                    // res.flash('info','Comment added to campground')
                    res.redirect('/campgrounds/'+req.params.id)
                }
            })
        }
    })  
})

module.exports = router