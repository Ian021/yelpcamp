/* ------------------------------------- LIBS -------------------------------------*/
const mongoose        = require('mongoose');
const express         = require('express'),
      hbs             = require('express-handlebars'),  
      bodyParser      = require('body-parser'),    
      passport        = require('passport'),
      localStrategy   = require('passport-local'),
      methodOverride  = require('method-override'),
      flash           = require('connect-flash')
    
/* ------------------------------------- LOCAL FILES -------------------------------------*/
const commentRoutes    = require('./routes/comments'),
      campgroundRoutes = require('./routes/campgrounds'),
      mainRoutes       = require('./routes/main'),
      credentials      = require('./credentials'),
      User             = require('./models/user');
    
/* ------------------------------------- EXPRESS -------------------------------------*/
app = express()

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use(flash());

/* ------------------------------------- HANDLEBARS -------------------------------------*/
app.engine('hbs',hbs({extname: 'hbs'}));
app.set('view engine', 'hbs')

/* ------------------------------------- MONGOOSE -------------------------------------*/
connectionUrl = 'mongodb+srv://'+credentials.username+':'+credentials.password+'@experiment-fr8tc.gcp.mongodb.net/yelpcamp?retryWrites=true&w=majority'

mongoose.connect(connectionUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

/* ------------------------------------- SESSIONS -------------------------------------*/
app.use(require('express-session')({
    secret:'truta',
    resave: false,
    saveUninitialized: false
}))

/* ------------------------------------- PASSPORT CONFIG -------------------------------------*/
app.use(passport.initialize());
app.use(passport.session());
app.use(loggedInDOM);


passport.use(new localStrategy(
    // {passReqToCallback:true},
    User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* ------------------------------------- MIDDLEWARE -------------------------------------*/

// app.use(flashMessages);
function loggedInDOM(req,res,next) {
    res.locals.notLoggedIn = !Boolean(req.user)
    if (Boolean(req.user)){
        res.locals.username = req.user.username
    }
    next();
}

// function flashMessages(req,res,next) {
//     res.locals.error = req.flash('error')
//     res.locals.success = req.flash('success')
//     next();
// }

/* ------------------------------------- ROUTES -------------------------------------*/
app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/comments',commentRoutes)
app.use(mainRoutes)

/* ------------------------------------- LISTEN -------------------------------------*/

app.listen(3000, function(){
    console.log('Yelpcamp listening on port 3000!')
})