var config = {};

/**
 * Loading configuration
 */
switch(process.env.NODE_ENV) {
    case 'development':
        config = exports.config = require('./config-dev.json');
    break;
    case 'production':
        config = exports.config = require('./config-prod.json');
    break;
    default:
        if(typeof process.env.NODE_ENV == 'undefined') {
            config = exports.config = require('./config-dev.json');
            process.env.NODE_ENV = 'development';
        }
    break;
}

exports.config = config;
