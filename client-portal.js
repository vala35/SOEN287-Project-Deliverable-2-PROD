const path = require('path');

const express = require('express')
const session = require('express-session');

const connection = require('./db');

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



clientPortalRouter.get(':filename(*)',(req,res) => {
    res.sendFile(path.join(__dirname + '/client-portal/' + req.params.filename));
});


module.exports = clientPortalRouter;