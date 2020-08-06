var express = require('express');
var router = express.Router();
//var oraInvNum = require('../lib/oraInvNum');
var dbSqlite = require('../lib/dbSqlite');


/* GET tree of documents . */
router.all('/', function(req, res, next) {

    req.props = {};
    if(req.query)  for (var attrname in req.query)  { req.props[attrname] = req.query[attrname]; }
    if(req.params) for (var attrname in req.params) { req.props[attrname] = req.params[attrname]; }
    if(req.body)   for (var attrname in req.body)   { req.props[attrname] = req.body[attrname]; }

    var p_cadn = req.props.cadn;
    console.log('req.props: ',req.props);

    dbSqlite.getDocsTree(p_cadn)
        .then(data => {
                //console.log(data.length);
                return res.json(data);
                //console.log('XMLH ttpRequest ',req.headers["x-requested-with"] == 'XMLHttpRequest');
               /* if (req.headers["x-requested-with"] == 'XMLHttpRequest') {
                    //if ajax request, return only table
                    res.render('invNmbTable', { data: data, cadn: p_cadn, usr: p_usr});
                } else {
                    //return full page
                   return res.send(JSON.stringify(data));
                }*/
            },
            function(err) {
                console.log('Ошибка Запрос завершился неудачей ', err);
                res.status(406).send(err);
            })
        .catch(function(err) {
            console.error(err);
            res.status(500).send(err);
        });
});

module.exports = router;
