const { v4: uuidv4 } = require('uuid');


const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express')
const session = require('express-session');

const path = require('path');
const app = express();

const connection = require('./db');

app.use(session( {

    secret: '84uirjoyoifjm459093j9^*&Yjtu4jfipefrjt', //temporary (load from external file)
    resave: false,
    saveUninitialized: true,
    genid: function(req) {
        return uuidv4()
    },
    cookie: {
        maxAge: 60000 * 15 //15 minutes        
        //secure: true
    },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'html')));

const providerPortalRouter = require('./provider-portal');
const clientPortalRouter = require('./client-portal');

const authRouter = require('./auth');

app.use('/provider-portal', providerPortalRouter);
app.use('/client-portal', clientPortalRouter);
app.use('/auth-form', authRouter)

// app.listen(3000);
app.listen(8080);   //The site only listens on 8080, keep this!
/*
var privateKey = fs.readFileSync( 'cert/privkey.pem' );
var certificate = fs.readFileSync( 'cert/fullchain.pem' );

https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(3001);*/