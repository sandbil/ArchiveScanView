var express = require('express');
var router = express.Router();

/* GET tree of documents . */
router.get('/', function(req, res, next) {
    res.render('pdfView', { title: 'Просмотр элетронного архива' });
});

module.exports = router;
