var mongoose = require('mongoose')

/* ------------------------------------- SCHEMAS -------------------------------------*/

var campgroundSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "comment"
        }
    ],
    author:{
        username:String,
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    }
})

module.exports = mongoose.model('Campground',campgroundSchema);