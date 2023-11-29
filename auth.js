const express = require('express')
const session = require('express-session');
const connection = require('./db');

const authRouter = express.Router();

authRouter.post('/login/:auth_type', (request, response) => {
    let email = request.body.email;
    let password = request.body.password;
    let userType = request.params.auth_type;

    if(email && password && (userType == "provider" || userType == "client")){
      connection.query(
        'SELECT user_id, email_address, password_hash, user_type, firstName, lastName FROM Users WHERE email_address = ? AND password_hash = ? AND user_type = ?',
        [email, password, userType],
        function(error, result, fields){
            if(error) throw error;
            if (result.length > 0){
                console.log(result[0]);
                request.session.userInfo = { userId: result[0].user_id, firstName: result[0].firstName, lastName: result[0].lastName };
                console.log(request.session.userInfo );
                response.redirect(userType == "provider" ? '/provider-portal/provider-dashboard.html' : '/client-portal/ClientPage.html');
            }
            else {
                response.send("Incorrect Credentials. Please try again");
            }
            response.end;
        });
    }
});

authRouter.post('/auth-form/signup', function(request, response){   //Signup form process
    let firstname = request.body.firstname
    let lastname = request.body.lastname
    let email = request.body.email;
    let password = request.body.password;
    let userType = request.body.userType;
    console.log(firstname, lastname, email, password, userType);
    if(email && password && firstname && lastname){
      connection.query(
        'INSERT INTO users (firstName, lastName, email_address, password_hash, user_type) VALUES (?, ?, ?, ?, ?)',
        [firstname, lastname, email, password, userType],
        function(error, result, fields){
            if(error) throw error;
            if (!error){
                if(userType == "Provider"){
                   response.redirect('/auth/Provider-Login.html'); 
                } else {
                    response.redirect('/auth/LogIn.html');
                }
            }
            else {
                response.send("An error has occurred. Please try again");
            }
            response.end;
        });
    }
});

module.exports = authRouter;