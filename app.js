const express = require('express')
const mysql = require('mysql');
const session = require('express-session');
const path = require('path');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const fifteenMins = 900000; //in milliseconds
const app = express();

const connection = mysql.createConnection({
	host     : 'soenproj-server.mysql.database.azure.com',
	user     : 'soenproj',
	password : 'Testing123$',
	database : 'soenproj-users',
    port     :  3306
});

// const connection = mysql.createConnection({
// 	host     : '127.0.0.1',
// 	user     : 'ol_root',
// 	password : 'tenwSoSVbq11y5fN*',
// 	database : 'openlicense',
//     port     :  3306
// });


connection.connect((err) => {
    if(err){
        console.error('Error connecting to database', err);
    } else {
        console.log('Connected to database @');
    }
} );

app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: true,
    cookie: {maxAge: fifteenMins}
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


const requireAuthClient = (request, response, next) => {
    if (request.session.userId && request.session.user_type == "client") {
        next(); 
    } else {
        response.redirect('/auth/LogIn.html');
    }
}

const requireAuthProvider = (request, response, next) => {
    if (request.session.userId && request.session.user_type == "provider") {
        next(); 
    } else {
        response.redirect('/auth/Provider-Login.html');
    }
}

app.get('/', function(request, response) {
    request.session.destroy();  //TEMPORARY
    response.sendFile(path.join(__dirname + '/html/index.html'));    
});

app.get('/index.html', function(request, response) {
    request.session.destroy();  //TEMPORARY
	response.sendFile(path.join(__dirname + '/html/index.html'));
});

app.get('/html/index.html', function(request, response) {
    request.session.destroy();  //TEMPORARY
	response.sendFile(path.join(__dirname + '/html/index.html'));
});



//Authentication paths - No login required
app.get('/auth/LogIn.html', function(request, response) {
	response.sendFile(path.join(__dirname + '/html/auth/LogIn.html'));
});
app.get('/auth/Signup.html', function(request, response) {
	response.sendFile(path.join(__dirname + '/html/auth/Signup.html'));
});
app.get('/auth/Provider-Login.html', function(request, response) {
	response.sendFile(path.join(__dirname + '/html/auth/Provider-Login.html'));
});
app.get('/auth/ForgotPassword.html', function(request, response) {
	response.sendFile(path.join(__dirname + '/html/auth/ForgotPassword.html'));
});
//
//Client Portal - Auth Required
app.get('/html/client-portal/ClientPage.html', requireAuthClient,function(request, response) {
        response.sendFile(path.join(__dirname + '/html/client-portal/ClientPage.html'));
});
app.get('/html/client-portal/AccountSettings.html',requireAuthClient, function(request, response) {
    response.sendFile(path.join(__dirname + '/html/client-portal/AccountSettings.html'));
});
app.get('/html/client-portal/AddLicense.html',requireAuthClient, function(request, response) {
    response.sendFile(path.join(__dirname + '/html/client-portal/AddLicense.html'));
});
app.get('/html/client-portal/EndLicense.html',requireAuthClient, function(request, response) {
    response.sendFile(path.join(__dirname + '/html/client-portal/EndLicense.html'));
});
app.get('/html/client-portal/RenewLicense.html',requireAuthClient, function(request, response) {
    response.sendFile(path.join(__dirname + '/html/client-portal/RenewLicense.html'));
});
//
//Provider Portal - Auth Required
app.get('/html/provider-portal/provider-dashboard.html', requireAuthProvider,function(request, response) {
    response.sendFile(path.join(__dirname + '/html/provider-portal/provider-dashboard.html'));
});
app.get('/html/provider-portal/account-settings.html', requireAuthProvider,function(request, response) {
    response.sendFile(path.join(__dirname + '/html/provider-portal/account-settings.html'));
});
app.get('/html/provider-portal/software.html', requireAuthProvider,function(request, response) {
    response.sendFile(path.join(__dirname + '/html/provider-portal/software.html'));
});
app.get('/html/provider-portal/users.html', requireAuthProvider,function(request, response) {
    response.sendFile(path.join(__dirname + '/html/provider-portal/users.html'));
});
//


//Populates Account setting pages (in both portals)

app.get('/get-user-info', function(request, response){
    let userInfo = request.session.userInfo;
    response.json(userInfo);
});

app.get('/get-user-licenses', function(request, response){
    connection.query('SELECT * FROM clientlicenses WHERE userID = ?',
    [request.session.userInfo.user_id],
    function(error, result, fields){
        if(error) throw error;
        if (result.length>0){
            response.json(result);
        }
    });
});

app.get('/get-software-users', function(request, response){

});

app.post('/update-account-settings', function(request, response){ 
    let new_email_address = request.body.email;
    let new_password_hash = request.body.newPassword;
    let new_address = request.body.address;
    let new_firstName = request.body.firstName;
    let new_lastName = request.body.lastName;
    let status = "active";
    let user_id = request.session.userInfo.user_id;
    let user_type = request.session.userInfo.user_type;
    if(new_email_address && new_password_hash && new_address && new_firstName && new_lastName){
      connection.query(
        'UPDATE users SET email_address = ?, password_hash = ?, address = ?, firstName = ?, lastName = ? WHERE user_id = ?', //SQL Query
        [new_email_address, new_password_hash, new_address, new_firstName, new_lastName, user_id], // Fill in the ?
        function(error, result, fields){
            if(error) throw error;
            if (!error){
                request.session.destroy(); 
                if(user_type == "provider"){
                    response.redirect('/auth/Provider-Login.html');
                } else{
                    response.redirect('/auth/LogIn.html');
                }
            }
            else {
                response.send("Failed to update account settings. Please try again later.")
            }
            response.end;
        });
    }
});



app.post('/client-auth-form', function(request, response){  //Client login process
    let email_address = request.body.email;
    let password_hash = request.body.password;
    let user_type = "client";
    let status = "active";
    if(email_address && password_hash){
      connection.query(
        'SELECT user_id, email_address, password_hash, user_type, status, firstName, lastName, address FROM users WHERE email_address = ? AND password_hash = ? AND user_type = ? AND status = ?',
        [email_address, password_hash, user_type, status],
        function(error, result, fields){
            if(error) throw error;
            if (result.length > 0){
                request.session.user_type = user_type;
                request.session.userId = email_address; 
                request.session.userInfo = result[0];
                // userInfo = result[0];
                response.redirect('/html/client-portal/ClientPage.html');
            }
            else {
                response.send("Incorrect email and/or password. Please try again.");
            }
            response.end;
        });
    }
});

app.post('/provider-auth-form', function(request, response){  //Provider login process
    let email_address = request.body.email;
    let password_hash = request.body.password;
    let user_type = "provider";
    let status = "active";
    if(email_address && password_hash){
      connection.query(
        'SELECT user_id, email_address, password_hash, user_type, status, firstName, lastName, address FROM users WHERE email_address = ? AND password_hash = ? AND user_type = ? AND status = ?',
        [email_address, password_hash, user_type, status],
        function(error, result, fields){
            if(error) throw error;
            if (result.length > 0){
                request.session.user_type = user_type;
                request.session.userId = email_address; 
                request.session.userInfo = result[0];
                // userInfo = result[0];
                response.redirect('/html/provider-portal/provider-dashboard.html');
            }
            else {
                response.send("Incorrect Credentials. Please try again");
            }
            response.end;
        });
    }
});


app.post('/signup-form', function(request, response){   //Signup form process
    let email_address = request.body.email;
    let password_hash = request.body.password;
    let firstName = request.body.firstname
    let lastName = request.body.lastname
    let user_type = request.body.userType.toLowerCase();
    let status = "active";
    if(email_address && password_hash && firstName && lastName && user_type){
      connection.query(
        'INSERT INTO users (email_address, password_hash, firstName, lastName, user_type, status) VALUES (?, ?, ?, ?, ?, ?)',
        [email_address, password_hash, firstName, lastName, user_type, status],
        function(error, result, fields){
            if(error) throw error;
            if (!error){
                if(user_type == "provider"){
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

app.listen(8080);






