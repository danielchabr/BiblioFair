'use strict';

module.exports = {
    db: 'mongodb://admin:Bl5vcDrcTPEJ@' + process.env.OPENSHIFT_MONGODB_DB_HOST + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/bibliofair'
};
