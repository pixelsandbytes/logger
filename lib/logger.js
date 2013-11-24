/* jshint strict: false */
var cluster = require('cluster'),
    callerId = require('caller-id'),
    h = require('hydrogen'),
    log4js = require('log4js');

function configure(config) {
    config = config || {};
    config = {
        level: config.level || 'INFO',
        fileName: config.fileName || 'logs/app'
    };

    log4js.configure({
        'appenders': [
            {
                'type': 'logLevelFilter',
                'level': config.level,
                'appender': {
                    'type': 'dateFile',
                    'filename': config.fileName,
                    'pattern': '.yyyy-MM-dd-hh',
                    'alwaysIncludePattern': true
                }
            }
        ]
    });
}
configure();

function DefaultLogger () {}
h.create(DefaultLogger, {
    debug: function debug(message, logFunc) {
        this.getLogger(logFunc).debug(message);
    },
    info: function info(message, logFunc) {
        this.getLogger(logFunc).info(message);
    },
    warn: function warn(message, logFunc) {
        this.getLogger(logFunc).warn(message);
    },
    error: function error(message, logFunc) {
        this.getDetailedLogger(logFunc).error(message);
    },
    fatal: function fatal(message, logFunc) {
        this.getDetailedLogger(logFunc).fatal(message);
    }
});
h.attach(DefaultLogger, function() {
    return {
        getLogger: function getLogger(logFunc) {
            return log4js.getLogger(callerId.getString(logFunc));
        },
        getDetailedLogger: function getDetailedLogger(logFunc) {
            return log4js.getLogger(callerId.getDetailedString(logFunc));
        }
    };
});

function MasterLogger () {}
h.create(MasterLogger, DefaultLogger, {});
h.attach(MasterLogger, function() {
    return {
        getLogger: function getLogger(logFunc) {
            return log4js.getLogger('[master] ' + callerId.getString(logFunc));
        },
        getDetailedLogger: function getDetailedLogger(logFunc) {
            return log4js.getLogger('[master] ' + callerId.getDetailedString(logFunc));
        }
    };
});

function WorkerLogger () {}
h.create(WorkerLogger, DefaultLogger, {});
h.attach(WorkerLogger, function() {
    return {
        getLogger: function getLogger(logFunc) {
            return log4js.getLogger('[' + process.pid + '] ' + callerId.getString(logFunc));
        },
        getDetailedLogger: function getDetailedLogger(logFunc) {
            return log4js.getLogger('[' + process.pid + '] ' + callerId.getDetailedString(logFunc));
        }
    };
});

function Logger () {}
h.create(Logger, {
    debug: function debug(message) {
        var mode = this.getMode();
        this.log(mode, 'debug', message);
    },
    info: function info(message) {
        var mode = this.getMode();
        this.log(mode, 'info', message);
    },
    warn: function warn(message) {
        var mode = this.getMode();
        this.log(mode, 'warn', message);
    },
    error: function error(message) {
        var mode = this.getMode();
        this.log(mode, 'error', message);
    },
    fatal: function fatal(message) {
        var mode = this.getMode();
        this.log(mode, 'fatal', message);
    }
}).attach(Logger, function () {
    var loggers = {
        master: MasterLogger.makeInst(),
        worker: WorkerLogger.makeInst()
    };

    return {

        // private
        getMode: function getMode() {
            if (cluster.isWorker) {
                return 'worker';
            } else {
                return 'master';
            }
        },

        // private
        log: function log(mode, level, message) {
            loggers[mode][level](message, log.caller);
        }

    };
});

module.exports = Logger;
module.exports.configure = configure;