const express = require('express');
const path = require('path');
const router = express.Router();
const cfg = require('../lib/config');
const winston = require('../lib/winstonCfg');

/* GET tree of documents . */
router.get('/', function(req, res, next) {
    //console.log(req);
    let file = req.query.filepdf
        , filePDF = path.join(cfg.rootDirForScanDocs, decodeURIComponent(file));
    console.log(filePDF);
    let options = {
        //root:  rootDirForScanDocs,
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };
    //console.log(__dirname);
    //console.log(rootDirForScanDocs);
    res.sendFile(filePDF, options ,function (err) {
        if (err) {
            //winston.error(`${err.status || 500} - ${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            //res.status(404).send('scan image not found')
            next(err)
        } else {
            //console.log('Sent:', fileName)
            //todo loging who viewed doc
        }
    })

});

module.exports = router;
