require('dotenv').config();

const express = require("express");
const session = require('express-session'); //For session management
const expressLayout = require('express-ejs-layouts'); //for managing and rendering layout
const methodOverride = require('method-override'); // This middleware allows you to use HTTP verbs such as PUT and DELETE in places where the client doesn't support them (like HTML forms). It adds support for overriding methods via query parameters or headers

const connectDb = require('./server/config/db'); 
const cookieParser = require('cookie-parser'); //for session management and user tracking
const MongoStore = require('connect-mongo'); //It allows session data to be stored in a MongoDB database rather than in memory
const { isActiveRoute } = require('./server/helpers/routeHelpers');

const app = express();

const PORT = 5000 || process.env.PORT;

//Connect to Db
connectDb();

app.use(express.urlencoded({ extended: true })); //This middleware parses incoming requests with URL-encoded payloads
app.use(express.json()); //This middleware parses incoming requests with JSON payloads
app.use(cookieParser()); //This middleware parses cookies attached to the client request object

app.use(methodOverride('_method'));


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
}));

app.use(express.static('public'));

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


app.locals.isActiveRoute = isActiveRoute;

app.use('/', require('./server/routes/main'));

app.use('/', require('./server/routes/admin'));


app.listen(PORT,()=>{
    console.log(`App listening on port ${PORT}`)
});


