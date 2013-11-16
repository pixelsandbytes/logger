/* jshint strict: false */

var fs = require('fs'),
    path = require('path');

var defaultDir = 'logs';

function getLogNames(dir) {
    dir = dir || defaultDir;
    var logNames = fs.readdirSync(dir);
    return logNames;
}

function readLastLogLine(dir) {
    dir = dir || defaultDir;
    var logNames = getLogNames(dir);
    logNames.sort();
    var lastLogName = logNames[logNames.length - 1];
    var lastLogPath = path.join(dir, lastLogName);
    var log = fs.readFileSync(lastLogPath, {
        encoding: 'utf8',
        flag: 'r'
    });
    var logLines = log.trim().split('\n');
    return logLines[logLines.length - 1];
}

module.exports = {
    getLogNames: getLogNames,
    readLastLogLine: readLastLogLine
};