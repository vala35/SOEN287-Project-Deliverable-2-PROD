const mysql = require('mysql');

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'ol_root',
	password : 'tenwSoSVbq11y5fN*',
	database : 'openlicense',
    port     :  3306
});

connection.connect((err) => {
    if(err){
        console.error('Error connecting to database', err);
    } else {
        console.log('Connected to database');
    }
} );

module.exports = connection;