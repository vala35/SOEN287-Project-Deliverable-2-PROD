const express = require('express')
const session = require('express-session');
const connection = require('./db');
const nodemailer = require('nodemailer');


const authRouter = express.Router();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    auth: {
        user: 'oneLicenseDummy@gmail.com',
        pass: 'ulfw pcpl hiom hpkf'
    }
});

authRouter.post('/forgotpassword', (request, response) => {
    let email = request.body.email;
    let password = request.body.password;


    if(email){
      connection.query(
        'UPDATE users SET password_hash = ? WHERE email_address = ?',
        [password, email],
        function(error, result, fields){
            if(error) throw error;
            if (result.changedRows > 0){
                response.json("Your new password has been sent to your email address");
                const mailOptions = {
                    from: 'oneLicenseDummy@gmail.com',
                    to: email,
                    subject: "Your new OneLicense Password",
                    text: "This is your new password: " + password
                };
                transporter.sendMail(mailOptions, (emailError, info) => {
                    if (emailError) {
                        console.log('Error occurred in sending mail:', emailError);
                    } else {
                        console.log('Email sent:', info.response);
                    }
                });

                
            }
            else {
                response.json("This email does not exist. Please create an account.");
            }
            response.end;
        });
    }
});


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
                console.log(request.session.userInfo);
                // response.redirect(userType == "provider" ? '/provider-portal/provider-dashboard.html' : '/client-portal/ClientPage.html');
                response.json("success");
            }
            else {
                response.json("fail");
            }
            response.end;
        });
    }
});

authRouter.post('/signup', function(request, response){   //Signup form process
    let firstname = request.body.firstname
    let lastname = request.body.lastname
    let email = request.body.email;
    let password = request.body.password;
    let userType = request.body.userType;
    console.log(firstname, lastname, email, password, userType);
    if(email && password && firstname && lastname){
      connection.query(
        'INSERT INTO users (firstName, lastName, email_address, password_hash, user_type, status) VALUES (?, ?, ?, ?, ?, "active")',
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

authRouter.get('/logout', function(request, response){
    request.session.destroy();
    response.redirect('/');
});

module.exports = authRouter;