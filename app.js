// require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const eventRoutes = require('./routes/eventRoutes');
const generalRoutes = require('./routes/generalRoutes');
const userRoutes = require('./routes/userRoutes');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

// create app
const app = express();

// configure app
let port = 3000;
let host = 'localhost';
let url = 'mongodb+srv://demo:demo123@cluster0.w0nbiti.mongodb.net/project3?retryWrites=true&w=majority&appName=Cluster0';
app.set('view engine', 'ejs');

//connect to MongoDB
mongoose.connect(url)
    .then(client => {
        // const db = client.db('demos');
        // getCollection(db);
        // start the server
        app.listen(port, host, () => {
            console.log('Server is running on port', port);
        })
    })
    .catch(err => console.log(err.message));

// mount midddleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

app.use(session({
    //set the secret attribute later in env vars
    secret: 'thisisthesecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60*60*1000},
    store: new MongoStore({mongoUrl: 'mongodb+srv://demo:demo123@cluster0.w0nbiti.mongodb.net/project3?retryWrites=true&w=majority&appName=Cluster0'})
}));

app.use(flash());

app.use((req, res, next)=>{
    console.log(req.session);
    res.locals.user = req.session.user || null;
    res.locals.userName = req.session.userName || null;
    console.log(res.locals);
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
})

// setup routes
app.use('/', generalRoutes);
app.use('/events', eventRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.log("error", err);
    if (!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }
    res.status(err.status);
    res.render('error', { error: err, session: req.session });
});
