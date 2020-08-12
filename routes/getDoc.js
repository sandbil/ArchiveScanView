const express = require('express');
const path = require('path');
const router = express.Router();

/* GET tree of documents . */
router.get('/', function(req, res, next) {
    //console.log(req);
    let rootDirForScanDocs ='';
    if (req.app.get('env') === 'development') {
        rootDirForScanDocs = path.join(__dirname, '../files')
    } else {
        rootDirForScanDocs = ''
    } ;


    let file = req.query.filepdf
        , filePDF = path.join(rootDirForScanDocs, decodeURIComponent(file));
    let options = {
        //root:  rootDirForScanDocs,
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    }
    //console.log(__dirname);
    //console.log(rootDirForScanDocs);
    res.sendFile(filePDF, options ,function (err) {
        if (err) {
            //next(err)
            res.send('error')
        } else {
            //console.log('Sent:', fileName)
            //todo loging who viewed doc
        }
    })

});

module.exports = router;
