const path = require('path');

const express = require('express')
const session = require('express-session');

const connection = require('./db');


const providerPortalRouter = express.Router();

const providerPortalAuthCheck = (req, res, next) => {
    if(typeof req.session.userInfo !== 'undefined') {
        //Add more checks

        console.log("this got called!\n");
    }
    else {
        return res.redirect('/auth/Provider-Login.html');
    }
    next();
}

providerPortalRouter.use(providerPortalAuthCheck);

providerPortalRouter.get('/action/getusers',(req, res) => {
    connection.query('SELECT * FROM Users WHERE 1', (error, result, fields) => {
        if(error) throw error;
    
        let userList = [];

        result.forEach(user => {
            userList.push({ user_id: user.user_id, firstName: user.firstName, lastName: user.lastName, email_address: user.email_address })
        });

        res.send(userList);
    });
});

providerPortalRouter.get(':filename(*)',(req,res) => {
    res.sendFile(path.join(__dirname,'/provider-portal/',req.params.filename));
});

module.exports = providerPortalRouter;
