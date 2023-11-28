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


providerPortalRouter.get('/action/getsoftwarelist', (req, res) => {
    connection.query('SELECT * FROM Software WHERE 1', (error, result, fields) => {
        if (error) throw error;

        let softwareList = [];

        result.forEach(software => {
            softwareList.push({
                softwareId: software.software_id,
                softwareName: software.name,
                logoUrl: software.icon_url,
                versionNumber: software.version_number
            });
        });

        res.send(userList);
    });
});

providerPortalRouter.get('/action/getsoftwareinfo', (req, res) => {
    connection.query('SELECT * FROM Software WHERE software_id = ?', [req.body.softwareId], (error, result, fields) => {
        if (error) throw error;

        /* let softwareList = [];
 
         result.forEach(software => {
             softwareList.push({ 
                 softwareId: software.software_id,
                 softwareName: software.name,
                 logoUrl: software.icon_url,
                 versionNumber: software.version_number
              });
         });
         */
        res.send(userList);
    });
});




providerPortalRouter.get(':filename(*)',(req,res) => {
    res.sendFile(path.join(__dirname,'/provider-portal/',req.params.filename));
});

module.exports = providerPortalRouter;
