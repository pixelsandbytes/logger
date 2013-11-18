/* jshint strict: false */

require('should');
var utils = require('./../utils');

var assertDelay = 50;

function logMe(log, level, msg) {
    log[level](msg);
}

/* global describe, before, it */
describe('Default logger', function() {
    var Logger = require('./../../lib/logger');
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

    describe('Logging an info message', function() {
        var message = 'Chocolate is sweet';

        before(function() {
            logMe(logger, 'info', message);
        });

        it('should add info log message to log file', function(done) {
            setTimeout(function() {
                var logNames = utils.getLogNames();
                logNames.length.should.be.above(0);

                var lastLogLine = utils.readLastLogLine();
                lastLogLine.should.endWith('[INFO] [master] logMe - ' + message);

                done();
            }, assertDelay);
        });

    });

    describe('Logging a warning message', function() {
        var message = 'Chocolate with >80% cocoa can be bitter';

        before(function() {
            logMe(logger, 'warn', message);
        });

        it('should add warning log message to log file', function(done) {
            setTimeout(function() {
                var logNames = utils.getLogNames();
                logNames.length.should.be.above(0);

                var lastLogLine = utils.readLastLogLine();
                lastLogLine.should.endWith('[WARN] [master] logMe - ' + message);

                done();
            }, assertDelay);
        });

    });

    describe('Logging an error message', function() {
        var message = 'Chocolate may make you fat';

        before(function() {
            logMe(logger, 'error', message);
        });

        it('should add error log message to log file', function(done) {
            setTimeout(function() {
                var logNames = utils.getLogNames();
                logNames.length.should.be.above(0);

                var lastLogLine = utils.readLastLogLine();
                lastLogLine.should.endWith('[ERROR] [master] logMe at ' + __filename + ':9 - ' + message);

                done();
            }, assertDelay);
        });

    });

    describe('Logging a fatal message', function() {
        var message = 'Chocolate can go rancid after a while';

        before(function() {
            logMe(logger, 'fatal', message);
        });

        it('should add fatal log message to log file', function(done) {
            setTimeout(function() {
                var logNames = utils.getLogNames();
                logNames.length.should.be.above(0);

                var lastLogLine = utils.readLastLogLine();
                lastLogLine.should.endWith('[FATAL] [master] logMe at ' + __filename + ':9 - ' + message);

                done();
            }, assertDelay);
        });

    });
 
});

/* global describe, before, it */
describe('Custom logger', function() {
    var Logger = require('./../../lib/logger');
    var logsDir = 'logs-problems';
    var logger = Logger.makeInst();

    before(function() {
        var config = {
            level: 'WARN',
            fileName: logsDir + '/app'
        };
        Logger.configure(config);
    });

    describe('Logging a debug message', function() {
        /* jshint quotmark: false */
        var message = "I'm singing in the rain";

        before(function() {
            logMe(logger, 'debug', message);
        });

        it('should not add debug log message to log file', function() {
            var logNames = utils.getLogNames(logsDir);
            if (logNames.length > 0) {
                var lastLogLine = utils.readLastLogLine(logsDir);
                lastLogLine.should.not.endWith('[DEBUG] [master] logMe - ' + message);
            } else {
                logNames.length.should.equal(0);
            }
        });

    });

    describe('Logging an info message', function() {
        var message = 'The rain started at 3 PM';

        before(function() {
            logMe(logger, 'info', message);
        });

        it('should not add info log message to log file', function() {
            var logNames = utils.getLogNames(logsDir);
            if (logNames.length > 0) {
                var lastLogLine = utils.readLastLogLine(logsDir);
                lastLogLine.should.not.endWith('[INFO] [master] logMe - ' + message);
            } else {
                logNames.length.should.equal(0);
            }
        });

    });

    describe('Logging a warning message', function() {
        var message = 'Thunderstorms forecasted for 5 PM';

        before(function() {
            logMe(logger, 'warn', message);
        });

        it('should add warning log message to log file', function(done) {
            setTimeout(function() {
                var logNames = utils.getLogNames(logsDir);
                logNames.length.should.be.above(0);

                var lastLogLine = utils.readLastLogLine(logsDir);
                lastLogLine.should.endWith('[WARN] [master] logMe - ' + message);

                done();
            }, assertDelay);
        });

    });

    describe('Logging an error message', function() {
        var message = 'Severe thunderstorms in your area';

        before(function() {
            logMe(logger, 'error', message);
        });

        it('should add error log message to log file', function(done) {
            setTimeout(function() {
                var logNames = utils.getLogNames(logsDir);
                logNames.length.should.be.above(0);

                var lastLogLine = utils.readLastLogLine(logsDir);
                lastLogLine.should.endWith('[ERROR] [master] logMe at ' + __filename + ':9 - ' + message);

                done();
            }, assertDelay);
        });

    });

    describe('Logging a fatal message', function() {
        var message = 'ALERT: Tornado outbreak';

        before(function() {
            logMe(logger, 'fatal', message);
        });

        it('should add fatal log message to log file', function(done) {
            setTimeout(function() {
                var logNames = utils.getLogNames(logsDir);
                logNames.length.should.be.above(0);

                var lastLogLine = utils.readLastLogLine(logsDir);
                lastLogLine.should.endWith('[FATAL] [master] logMe at ' + __filename + ':9 - ' + message);

                done();
            }, assertDelay);
        });

    });

});