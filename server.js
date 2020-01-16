const PORT = process.env.PORT || 3000
const DB_CONNECTION_URL = process.env.DB_CONNECTION_URL

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
mongoose.connect(DB_CONNECTION_URL,{
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

app.listen(PORT, () => console.log(`YelpCamp Listening on ${ PORT }`))