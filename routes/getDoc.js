var express = require('express');
var router = express.Router();

/* GET tree of documents . */
router.get('/', function(req, res, next) {
    //console.log(req);
    let file = req.query.filepdf
        , path = 'd:/!work/nodeJs/ArchiveScanView/files/' + decodeURIComponent(file);
    let options = {
        root: __dirname,
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    }
    res.sendFile(path);

});

module.exports = router;
