const router = require('express').Router();
require('express-async-errors');
const dbLib = require('../lib/dbLib');



/* GET tree of documents . */
router.all('/', async function(req, res) {

    if (!req.session.user) {
        return res.status(401).send({
            success: false,
            message: "You are not authentificated"
        });
    }

    req.props = {};
    if(req.query)  for (let attrname in req.query)  { req.props[attrname] = req.query[attrname]; }
    if(req.params) for (let attrname in req.params) { req.props[attrname] = req.params[attrname]; }
    if(req.body)   for (let attrname in req.body)   { req.props[attrname] = req.body[attrname]; }

    let p_cadn = req.props.cadn;
    if (!p_cadn) {
            return res.json({_root: {nodes: []}});
    }
    let data;
    if ((process.env.NODE_ENV || '').trim() === 'production')
        data = await dbLib.getOracleDocsTree(p_cadn);
    else
        data = await dbLib.getDocsTree(p_cadn)


    return res.json(data);
});

module.exports = router;
