const path = require('path');

const express = require('express')
const session = require('express-session');

const connection = require('./db');
const { connect } = require('http2');


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
    connection.query('SELECT * FROM provider_users_view WHERE provider_id=?',[req.session.userInfo.userId] ,(error, result, fields) => {
        if(error) throw error;
    
        let userList = [];

        result.forEach(user => {
            userList.push({ user_id: user.user_id, firstName: user.firstName, lastName: user.lastName, email_address: user.email_address })
        });
        
        res.send(userList);
    });
});

providerPortalRouter.get('/action/getusers/keys/:user_id',(req, res) => {

    let user_id = req.params.user_id;

    connection.query('SELECT * FROM software_users_view WHERE provider_id=? AND user_id=?',[req.session.userInfo.userId, user_id] ,(error, result, fields) => {
        if(error) throw error;
    
        let keyList = [];

        result.forEach(key => {
            keyList.push({license_key: key.license_key })
        });
        
        res.send(keyList);
    });
});




providerPortalRouter.get('/action/getusers/:user_id',(req, res) => {

    let user_id = req.params.user_id;

    connection.query('SELECT * FROM users WHERE user_id=?',[user_id] ,(error, result, fields) => {
        if(error) throw error;
    
        if(result.length>0){
            res.send(result[0]);
        }
        else{
            res.send("Invalid userID");
        }

    });
});

providerPortalRouter.get('/action/getsoftwarelist', (req, res) => {
    connection.query('SELECT * FROM Software WHERE provider_id = ?',[req.session.userInfo.userId], (error, result, fields) => {
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

        res.send(softwareList);
    });
});

providerPortalRouter.get('/action/getsoftwareinfo/:softwareId', (req, res) => {

    let softwareId = req.params.softwareId;

    connection.query('SELECT * FROM Software WHERE software_id = ?',
        [softwareId],
        (error, result, fields) => {
            if (error) throw error;

            if (result.length > 0) {
                console.log(result[0]);

                res.send(result[0]);
            }
            else {
                console.log("Invalid softwareId: " + softwareId);
            }
    });
});

providerPortalRouter.get('/action/getsoftwareinfo/:softwareId/users', (req, res) => {

    let softwareId = req.params.softwareId;

    connection.query('SELECT * FROM software_users_view WHERE software_id = ?',
        [softwareId],
        (error, result, fields) => {
            if (error) throw error;

            if (result.length > 0) {
                console.log(result[0]);

                res.send(result);
            }
            else {
                console.log("Invalid softwareId: " + softwareId);
            }
        });
});

providerPortalRouter.get('/action/getsoftwareinfo/:softwareId/userinfo/:userId', (req, res) => {

    let softwareId = req.params.softwareId;
    let userId = req.params.userId;

    connection.query('SELECT * FROM software_users_view WHERE software_id = ? AND user_id = ?',
        [softwareId, userId],
        (error, result, fields) => {
            if (error) throw error;

            if (result.length > 0) {
                console.log(result[0]);

                res.send(result[0]);
            }
            else {
                console.log("Invalid softwareId: " + softwareId);
            }
        });
});

providerPortalRouter.get('/action/getsoftwareinfo/:softwareId/licensekeys', (req, res) => {

    let softwareId = req.params.softwareId;

    connection.query('SELECT * FROM licensekeys WHERE softwareId = ?',
        [softwareId],
        (error, result, fields) => {
            if (error) throw error;

            if (result.length > 0) {
                console.log(result[0]);

                res.send(result);
            }
            else {
                console.log("Invalid softwareId: " + softwareId);
            }
        });
});

providerPortalRouter.get('/action/getsoftwareinfo/:softwareId/licensekey/:licenseKey', (req, res) => {

    let softwareId = req.params.softwareId;
    let licenseKey = req.params.licenseKey;

    connection.query('SELECT * FROM licensekeys WHERE softwareId = ? AND license_key = ?',
        [softwareId, licenseKey],
        (error, result, fields) => {
            if (error) throw error;

            if (result.length > 0) {
                res.send(result[0]);
            }
            else {
                console.log("Invalid softwareId: " + softwareId);
            }
        });
});


providerPortalRouter.post('/action/setsoftwareinfo/price', (req, res) => {

    let softwareId = req.body.softwareId;
    let new_price = req.body.price;

    connection.query('UPDATE Software SET price = ? WHERE software_id = ?', [new_price, softwareId], (error, result, fields) => {
        if (error) throw error;

        console.log(result);

    });
});

providerPortalRouter.post('/action/setsoftwareinfo/updateuser', (req, res) => {
    let userId = req.body.userId;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let emailAddress = req.body.emailAddress;
    let telephoneNumber = req.body.telephoneNumber;

    connection.query('UPDATE Users SET firstName = ?, lastName = ?, email_address = ?, phone_number = ? WHERE user_id = ?',
        [firstName, lastName, emailAddress, telephoneNumber, userId],
        (error, result, fields) => {
            if (error) throw error;
            console.log(result);
    });
});

providerPortalRouter.post('/action/setuserinfo', (req, res) => {
    let userId = req.body.userId;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let emailAddress = req.body.emailAddress;
    let telephoneNumber = req.body.telephoneNumber;
    let customer_notes = req.body.customer_notes;

    connection.query('UPDATE Users SET firstName = ?, lastName = ?, email_address = ?, phone_number = ?, customer_notes = ? WHERE user_id = ?',
        [firstName, lastName, emailAddress, telephoneNumber, customer_notes, userId],
        (error, result, fields) => {
            if (error) throw error;
            console.log(result);
    });
});

providerPortalRouter.post('/action/unlinkkey/:key', (req, res) => {

    let license_key = req.params.key;

    connection.query('UPDATE licensekeys SET userID = NULL, status = "inactive" WHERE license_key = ?', [license_key], (error, result, fields) => {
        if (error) throw error;
        console.log(result);
    });
});


providerPortalRouter.post('/action/addnewkey', (req, res) => {
    let softwareId = req.body.softwareId;
    let license_key = req.body.license_key;
    let status = req.body.status;
    let creationDate = req.body.creationDate.substring(0,10);
    let expiryDate = req.body.expiryDate.substring(0,10);

    connection.query('INSERT INTO licensekeys (softwareId, license_key, status, creationDate, expiryDate) VALUES (?, ?, ?, ?, ?)',
        [softwareId, license_key, status, creationDate, expiryDate],
        (error, result, fields) => {
            if (error) throw error;
            console.log(result);
    });
});

providerPortalRouter.post('/action/update-provider-account-settings', function(request, response){ 
    console.log("this was called");
    let new_email_address = request.body.email;
    let new_password_hash = request.body.newPassword;
    let new_address = request.body.address;
    let new_firstName = request.body.firstName;
    let new_lastName = request.body.lastName;
    let user_id = request.session.userInfo.userId;
    if(new_email_address && new_password_hash && new_address && new_firstName && new_lastName){
      connection.query(
        'UPDATE users SET email_address = ?, password_hash = ?, address = ?, firstName = ?, lastName = ? WHERE user_id = ?',
        [new_email_address, new_password_hash, new_address, new_firstName, new_lastName, user_id], 
        function(error, result, fields){
            if(error) throw error;
            if (!error){
                request.session.destroy(); 
                response.redirect('/auth/Provider-Logn.html');
            }
            else {
                response.send("An error has ocurred")
            }
            response.end;
        });
    }
});


providerPortalRouter.get('/action/getaccountdetails', (req, res) => {
    connection.query(
        'SELECT * FROM Users WHERE user_id = ?',
        [req.session.userInfo.userId],
        (error, result, fields) => {
            if (result.length > 0)
                res.json(result[0]);
        }
    );
});

providerPortalRouter.get(':filename(*)',(req,res) => {
    res.sendFile(path.join(__dirname,'/provider-portal/',req.params.filename));
});

module.exports = providerPortalRouter;
