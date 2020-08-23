const path = require('path');
const fs = require('fs');
const config = {};

config.username = 'user/domain';
config.auth = "Basic " + 'dTc1L2RvbWFpbjpwYXNzd29yZA==';

config.session_secret = 'your secret';
if ((process.env.NODE_ENV || '').trim() === 'production')
    config.rootDirForScanDocs = path.join(__dirname + '/../filesprod')
else
    config.rootDirForScanDocs = path.join(__dirname + '/../files');

config.sqlite3db = {
    dir: 'db',
    filename:  (process.env.NODE_ENV || '').trim() === 'production' ? 'sessLog.db' : 'testData.db'
};
config.sqlite3db.dbPath =[config.sqlite3db.dir,'/',config.sqlite3db.filename].join('');

if (!fs.existsSync(config.sqlite3db.dir)) {
        fs.mkdirSync(config.sqlite3db.dir, {
            recursive: true
        });
};


config.connectionProperties = {
    user: process.env.DBAAS_USER_NAME || 'user',
    password: process.env.DBAAS_USER_PASSWORD || 'password',
    connectString: process.env.DBAAS_DEFAULT_CONNECT_DESCRIPTOR || 'xx.xx.xxx.xxx/DB'
};




/*config.twitter = {};
config.redis = {};
config.web = {};

config.default_stuff =  ['red','green','blue','apple','yellow','orange','politics'];
config.twitter.user_name = process.env.TWITTER_USER || 'username';
config.twitter.password=  process.env.TWITTER_PASSWORD || 'password';
config.redis.uri = process.env.DUOSTACK_DB_REDIS;
config.redis.host = 'hostname';
config.redis.port = 6379;
config.web.port = process.env.WEB_PORT || 9980;*/

module.exports = config;

