const Campground = require('../models/campgrounds')
const Comments = require('../models/comments')

var middlewareObj = {}

middlewareObj.IsLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else {
        // req.flash('error', 'Please login first!')
        return res.redirect('/login')
    }
}

middlewareObj.IsCampgroundOwner = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,body){
            if(err){
                res.redirect('back')
            } else {
                if(body.author.username === req.user.username){
                    return next();
                } else {
                    return res.redirect('back')
                }
            }
        })
    } else {
        return res.redirect('/login')
    }
}

module.exports = middlewareObj