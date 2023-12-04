const fs = require('fs');

var readLogFile = (provider_id, s) => {
    fs.readFile(`log_${provider_id}.txt`, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.log('File not found!');
                s("No logs yet :)");
            }
            else throw err;
        }
        else s(data);
    });
};

var log = (provider_id, text) => {

    fs.appendFile(`log_${provider_id}.txt`, `${Date(Date.now()).toString() } /  ${text}\r\n`, (err) => {
        if (err) throw err;
    });
};

module.exports = { readLogFile, log };