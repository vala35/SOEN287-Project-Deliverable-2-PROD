const path = require('path');

const express = require('express')
const session = require('express-session');

const connection = require('./db');

const logger = require('./log')


const clientPortalRouter = express.Router();

const clientPortalAuthCheck = (req, res, next) => {
    if(typeof req.session.userInfo !== 'undefined') {
        //Add more checks

        console.log("this got called!\n");
    }
    else {
        return res.redirect('/auth/LogIn.html');
    }
    next();
}

clientPortalRouter.use(clientPortalAuthCheck);

clientPortalRouter.get('/action/get-user-info', function(request, response){
    let userId = request.session.userInfo.userId;

    connection.query(
        'SELECT * FROM Users WHERE user_id = ?',
        [userId],
        (error, result, fields) => {
            if(error) throw error;

            let userInfo = { firstName: result[0].firstName, lastName: result[0].lastName, email_address: result[0].email_address, address: result[0].address  };
           
            response.json(userInfo);
        }    
    );
});

clientPortalRouter.get('/action/get-user-licenses', function(request, response){
    connection.query('SELECT * FROM clientlicenses WHERE userID = ?',
    [request.session.userInfo.userId],
    function(error, result, fields){
        if(error) throw error;
        if (result.length>0){
            response.json(result);
        }
    });
});

clientPortalRouter.post('/action/end-license', function(request, response){
    let licenseKey = request.body.LicenseChoice;
    connection.query('UPDATE licensekeys SET status = "inactive" WHERE license_key = ?',
    [licenseKey]);
    response.redirect("/client-portal/ClientPage.html");
});

clientPortalRouter.post('/action/renew-license', function(request, response){
    let renewalTerm = request.body.renewalTime.substring(0,1);
    let licenseKey = request.body.LicenseChoice;
    connection.query('UPDATE licensekeys SET expiryDate = DATE_ADD(expiryDate, INTERVAL ? YEAR) WHERE license_key = ?',
    [renewalTerm, licenseKey]);
    response.redirect("/client-portal/ClientPage.html");
});

clientPortalRouter.post('/action/add-license', function(request, response) {
    // Retrieve license details from the request body
    const { SerialNumber, Software, PurchaseDate, ExpiryDate } = request.body;
    connection.query(
        'UPDATE licensekeys SET status = "active", userID = ?, activationDate = CURDATE()  WHERE license_key = ? AND expiryDate = DATE(?)',
        [request.session.userInfo.userId, SerialNumber, ExpiryDate],
        function(error, result, fields){

            if(error) throw error;
            if (result.changedRows>0){ 
                message = 'License activated!';
                response.json(message);

                connection.query(
                    'SELECT provider_id FROM software WHERE software_id = (SELECT softwareId FROM licensekeys WHERE license_key = ?)',
                    //SELECT provider_id FROM software WHERE software_id = (SELECT softwareId FROM licensekeys WHERE license_key = 'RGJ2O-UQ179-HA37Y-22FU2')
                    [SerialNumber],
                    (err1, res, fields) => {
                        if (err1) throw err1;
                        logger.log(res[0].provider_id, `${request.session.userInfo.lastName}, ${request.session.userInfo.firstName} : license activation <${SerialNumber}>`);
                    }
                );
            }
            else {
                message = "An error has ocurred. Please make sure all fields are correct. Contact the key provider for more information."
                response.json(message);
            }
            response.end;
        });

});

clientPortalRouter.post('/action/update-client-account-settings', function(request, response){ 
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
                response.redirect('/auth/LogIn.html');
            }
            else {
                response.send("An error has ocurred")
            }
            response.end;
        });
    }
});



clientPortalRouter.get(':filename(*)',(req,res) => {
    res.sendFile(path.join(__dirname + '/client-portal/' + req.params.filename));
});


module.exports = clientPortalRouter;