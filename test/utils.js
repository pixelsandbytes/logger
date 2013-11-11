/* jshint strict: false */

var fs = require('fs'),
    path = require('path');

function clearAllLogs(dir) {
    dir = dir || 'logs';
    var logFiles = fs.readdirSync(dir);
    for (var i = 0; i < logFiles.length; i++) {
        fs.unlinkSync(path.join(dir, logFiles[i]));
    }
}

module.exports = {
    clearAllLogs: clearAllLogs
};