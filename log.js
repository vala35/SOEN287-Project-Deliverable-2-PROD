const fs = require('fs');

var readLogFile = () => {
    fs.readFile("log.txt", (err, data) => {
        if (err) throw err;
        return data;
    });
};

var log = (text) => {

    fs.appendFile("log.txt", text, (err) => {
        if (err) throw err;
    });
};

module.exports = { readLogFile, log };//test