/* jshint strict: false */

require('should');
var Logger = require('./../../lib/logger'),
    log4js = require('log4js'),
    log4jsLogger = require('./../../node_modules/log4js/lib/logger').Logger,
    sinon = require('sinon');

function logMe(log, level, msg) {
    log[level](msg);
}

/* global describe, before, it, after */
describe('Default logger', function() {
    var logger = Logger.makeInst();

    describe('Logging a debug message', function() {
        var message = 'Life is like a box of chocolates';

        before(function() {
            sinon.spy(log4js, 'getLogger');
            sinon.spy(log4jsLogger.prototype, 'debug');

            logMe(logger, 'debug', message);
        });

        it ('should call debug on log4js logger with short prefix', function() {
            /* jshint expr: true */
            log4js.getLogger.calledOnce.should.be.true;
            log4js.getLogger.calledWithExactly('logMe');
            /* jshint expr: true */
            log4jsLogger.prototype.debug.calledOnce.should.be.true;
            log4jsLogger.prototype.debug.calledWithExactly(message);
        });

        after(function() {
            log4js.getLogger.restore();
            log4jsLogger.prototype.debug.restore();
        });

    });

    describe('Logging an info message', function() {
        var message = 'Chocolate is sweet';

        before(function() {
            sinon.spy(log4js, 'getLogger');
            sinon.spy(log4jsLogger.prototype, 'info');

            logMe(logger, 'info', message);
        });

        it ('should call info on log4js logger with short prefix', function() {
            /* jshint expr: true */
            log4js.getLogger.calledOnce.should.be.true;
            log4js.getLogger.calledWithExactly('logMe');
            /* jshint expr: true */
            log4jsLogger.prototype.info.calledOnce.should.be.true;
            log4jsLogger.prototype.info.calledWithExactly(message);
        });

        after(function() {
            log4js.getLogger.restore();
            log4jsLogger.prototype.info.restore();
        });

    });

    describe('Logging a warning message', function() {
        var message = 'Chocolate with >80% cocoa can be bitter';

        before(function() {
            sinon.spy(log4js, 'getLogger');
            sinon.spy(log4jsLogger.prototype, 'warn');

            logMe(logger, 'warn', message);
        });

        it ('should call warn on log4js logger with short prefix', function() {
            /* jshint expr: true */
            log4js.getLogger.calledOnce.should.be.true;
            log4js.getLogger.calledWithExactly('logMe');
            /* jshint expr: true */
            log4jsLogger.prototype.warn.calledOnce.should.be.true;
            log4jsLogger.prototype.warn.calledWithExactly(message);
        });

        after(function() {
            log4js.getLogger.restore();
            log4jsLogger.prototype.warn.restore();
        });

    });

    describe('Logging an error message', function() {
        var message = 'Chocolate may make you fat';

        before(function() {
            sinon.spy(log4js, 'getLogger');
            sinon.spy(log4jsLogger.prototype, 'error');

            logMe(logger, 'error', message);
        });

        it ('should call error on log4js logger with long prefix', function() {
            /* jshint expr: true */
            log4js.getLogger.calledOnce.should.be.true;
            log4js.getLogger.calledWithExactly('logMe at ' + __filename + ':10');
            /* jshint expr: true */
            log4jsLogger.prototype.error.calledOnce.should.be.true;
            log4jsLogger.prototype.error.calledWithExactly(message);
        });

        after(function() {
            log4js.getLogger.restore();
            log4jsLogger.prototype.error.restore();
        });

    });

    describe('Logging a fatal message', function() {
        var message = 'Chocolate can go rancid after a while';

        before(function() {
            sinon.spy(log4js, 'getLogger');
            sinon.spy(log4jsLogger.prototype, 'fatal');

            logMe(logger, 'fatal', message);
        });

        it ('should call fatal on log4js logger with long prefix', function() {
            /* jshint expr: true */
            log4js.getLogger.calledOnce.should.be.true;
            log4js.getLogger.calledWithExactly('logMe at ' + __filename + ':10');
            /* jshint expr: true */
            log4jsLogger.prototype.fatal.calledOnce.should.be.true;
            log4jsLogger.prototype.fatal.calledWithExactly(message);
        });

        after(function() {
            log4js.getLogger.restore();
            log4jsLogger.prototype.fatal.restore();
        });

    });
 
});