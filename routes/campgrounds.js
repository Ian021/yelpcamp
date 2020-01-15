const express = require('express');
const Campground = require('../models/campgrounds')
const middleware = require('../middleware')
const Comments = require('../models/comments')

const router = express.Router();


// INDEX - Show all campgrounds
router.get('/',function(req,res){
    Campground.find({},function(err,body){

        if(err){
            console.log(err)
        } else {
            campgrounds = body.map(element => element._doc)
            res.render('campgrounds/index',{campgrounds: campgrounds})
        }
    })
})

// NEW - Show form to create a new campground
router.get('/new',middleware.IsLoggedIn,function(req,res){
    res.render('campgrounds/new')
})

// CREATE - Add new Campground to DB
router.post('/', middleware.IsLoggedIn,function(req,res){
    var name = req.body.campground
    var image = req.body.image
    var description = req.body.description

    Campground.create({
            name:name,
            image:image,
            description:description,
            author: req.user
        },function(err,body){
        if(err) {
            console.log(err)
        } else {
            // res.flash('info','New Campground created!')
            res.redirect('/campgrounds')
        }
    })
})

// SHOW - Shows information for a particular item of the index
router.get('/:id',function(req,res){
    Campground.findById(req.params.id).populate({path:'comments', model: Comments}).exec(function(err,body){
        if(err){
            console.log(err)
        } else {
            campground = body._doc
            campground.comments = campground.comments.map(element => element._doc)

            let hideButtons = true
            if (req.user && req.user.username === campground.author.username) {
                hideButtons = false
            }
            
            res.render('campgrounds/show',{campground:campground , hideButtons:hideButtons})
        }
    })
})

// EDIT
router.get('/:id/edit',middleware.IsCampgroundOwner,function(req,res){
    Campground.findById(req.params.id, function(err,body){
        if (err){
            res.redirect('/campgrounds')
        } else {
            campground = body._doc
            res.render('campgrounds/edit', {campground:campground})
        }
    })
})

// UPDATE
router.put('/:id',middleware.IsCampgroundOwner,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,{useFindAndModify:false},function(err,body){
        if(err){
            res.redirect('/campgrounds')
        } else {
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

// DELETE
router.delete('/:id',middleware.IsCampgroundOwner,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err,body){
        if(err){
            res.redirect('/campgrounds')
        } else {
            res.redirect('/campgrounds')
        }
    })
    
})

module.exports = router