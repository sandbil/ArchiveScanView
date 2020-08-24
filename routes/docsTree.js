const router = require('express').Router();
//var oraInvNum = require('../lib/oraInvNum');
const dbSqlite = require('../lib/dbSqlite');
const winston = require('../lib/winstonCfg');


/* GET tree of documents . */
router.all('/', function(req, res, next) {

    req.props = {};
    if(req.query)  for (let attrname in req.query)  { req.props[attrname] = req.query[attrname]; }
    if(req.params) for (let attrname in req.params) { req.props[attrname] = req.params[attrname]; }
    if(req.body)   for (let attrname in req.body)   { req.props[attrname] = req.body[attrname]; }

    let p_cadn = req.props.cadn;
    if (!p_cadn) {
            return res.json({_root: {nodes: []}});
    }

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
            })
        .catch(function(err) {
            //winston.error(`${err.status || 500} - ${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            //res.status(500).send(p_cadn);
            next(err);
        });
});

module.exports = router;
