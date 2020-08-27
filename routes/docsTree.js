const router = require('express').Router();
require('express-async-errors');
//var oraInvNum = require('../lib/oraInvNum');
const dbSqlite = require('../lib/dbSqlite');
const winston = require('../lib/winstonCfg');


/* GET tree of documents . */
router.all('/', async function(req, res, next) {

    req.props = {};
    if(req.query)  for (let attrname in req.query)  { req.props[attrname] = req.query[attrname]; }
    if(req.params) for (let attrname in req.params) { req.props[attrname] = req.params[attrname]; }
    if(req.body)   for (let attrname in req.body)   { req.props[attrname] = req.body[attrname]; }

    let p_cadn = req.props.cadn;
    if (!p_cadn) {
            return res.json({_root: {nodes: []}});
    }
    let data = await dbSqlite.getDocsTree(p_cadn);
    //let data = await dbSqlite.getOracleDocsTree(p_cadn);
    return res.json(data);
});

module.exports = router;
