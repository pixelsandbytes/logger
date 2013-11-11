/* jshint strict: false */

require('should');
var Logger = require('../lib/logger'),
    log4js = require('log4js'),
    log4jsLogger = require('./../node_modules/log4js/lib/logger').Logger,
    sinon = require('sinon');
    // utils = require('./utils');

function logMe(logger, level, msg) {
    logger[level](msg);
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
/*
    after(function() {
        utils.clearAllLogs();
    });
*/
 
});