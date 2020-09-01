const path = require('path');
const fs = require('fs');
const cfgProduction = require('./cfgProduction');

const config = {};

if ((process.env.NODE_ENV || '').trim() === 'production') {
    config.session_secret = cfgProduction.session_secret;
    config.rootDirForScanDocs = cfgProduction.rootDirForScanDocs;
    config.sqlite3db = cfgProduction.sqlite3db;
    config.numRowsOraFetch = cfgProduction.numRowsOraFetch;
    config.oracleConnectionProperties = cfgProduction.oracleConnectionProperties;
} else {
    config.session_secret = 'your secret';
    config.rootDirForScanDocs = path.join(__dirname + '/../files');
    config.sqlite3db = { dir: 'db', filename: 'testData.db'};
    config.numRowsOraFetch = 100;
    config.oracleConnectionProperties = {
        user: process.env.DBAAS_USER_NAME || 'user',
        password: process.env.DBAAS_USER_PASSWORD || 'passsword',
        connectString: process.env.DBAAS_DEFAULT_CONNECT_DESCRIPTOR || 'localhost/xe'
    };
}

config.sqlite3db.dbPath =[config.sqlite3db.dir,'/',config.sqlite3db.filename].join('');
config.sessionMaxAge  = 7 * 24 * 60 * 60 * 1000;

config.multiDocsInSidebar = false;
config.shortDocNameLenght = 45;



if (!fs.existsSync(config.sqlite3db.dir)) {
    fs.mkdirSync(config.sqlite3db.dir, {
        recursive: true
    });
}

module.exports = config;
