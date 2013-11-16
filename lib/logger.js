/* jshint strict: false */
var cluster = require('cluster'),
    callerId = require('caller-id'),
    h = require('hydrogen'),
    log4js = require('log4js');

function configure(config) {
    config = config || {
        level: 'INFO',
        fileName: 'logs/app'
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
        this.initMode();
        this.log(message, 'debug');
    },
    info: function info(message) {
        this.initMode();
        this.log(message, 'info');
    },
    warn: function warn(message) {
        this.initMode();
        this.log(message, 'warn');
    },
    error: function error(message) {
        this.initMode();
        this.log(message, 'error');
    },
    fatal: function fatal(message) {
        this.initMode();
        this.log(message, 'fatal');
    }
}).attach(Logger, function () {
    var loggers = {
        master: MasterLogger.makeInst(),
        worker: WorkerLogger.makeInst()
    };
    var mode;

    return {

        // private
        initMode: function initMode() {
            if (!mode) {
                if (cluster.isWorker) {
                    mode = 'worker';
                } else {
                    mode = 'master';
                }
            }
        },

        // private
        log: function log(message, level) {
            loggers[mode][level](message, log.caller);
        }

    };
});

module.exports = Logger;
module.exports.configure = configure;