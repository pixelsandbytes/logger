/* jshint strict: false */

require('should');
var Logger = require('./../../lib/logger'),
    utils = require('./../utils');

function logMe(logger, level, msg) {
    logger[level](msg);
}

/* global describe, before, it */
describe('Default logger', function() {
    var logger = Logger.makeInst();

    describe('Logging a debug message', function() {
        var message = 'Life is like a box of chocolates';

        before(function() {
            logMe(logger, 'debug', message);
        });

        it('should not add debug log message to log file', function() {
            var logNames = utils.getLogNames();
            if (logNames.length > 0) {
                var lastLogLine = utils.readLastLogLine();
                lastLogLine.should.not.endWith('[DEBUG] [master] logMe - ' + message);
            } else {
                logNames.length.should.equal(0);
            }
        });

    });
 
});