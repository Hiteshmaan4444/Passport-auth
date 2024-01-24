const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { mongoose } = require('mongoose');
const dotenv = require('dotenv').config();
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')

const app = express();

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("mongoDb connected successfully...");
}).catch(err=>{console.log(err)});

require('./config/passport')(passport);

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.json());

app.use(express.urlencoded({extended: false}))

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})


//Routes
app.use(require('./routes/index'));
app.use('/users',require('./routes/users'));


app.listen(5000, ()=>{
    console.log(`server started on ${5000}`);
})