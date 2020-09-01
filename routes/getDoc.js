const express = require('express');
const path = require('path');
const router = express.Router();
const cfg = require('../lib/config');

/* GET PDF document . */
router.get('/', function(req, res, next) {

    if (!req.session.user) {
        return res.status(401).send({
            success: false,
            message: "You are not authentificated"
        });
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
