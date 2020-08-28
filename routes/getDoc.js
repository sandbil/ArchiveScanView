const express = require('express');
const path = require('path');
const router = express.Router();
const cfg = require('../lib/config');

/* GET PDF document . */
router.get('/', function(req, res, next) {
    console.log('getDoc: ',req.query.filepdf);
    if (!req.session.user) {
        console.log('!req.session.user');
        next(err)
    }
    let file = req.query.filepdf
    let filePDF = path.join(cfg.rootDirForScanDocs, decodeURIComponent(file));
    let options = {
        //root:  rootDirForScanDocs,
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    res.sendFile(filePDF, options ,function (err) {
        if (err) {
            next(err)
        } else {
            //console.log('Sent:', fileName)
            //todo loging who viewed doc
        }
    })

});

module.exports = router;
