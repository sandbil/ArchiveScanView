const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/',
  function(req, res, next) {
    if (!req.session.user) {
        req.session.returnTo = req.originalUrl;
        return res.redirect('/loginsso');
    } else {
        next();
    }
  },
  function(req, res) {
    req.props = {};
    if(req.query)  for (let attrname in req.query)  { req.props[attrname] = req.query[attrname]; }
    if(req.params) for (let attrname in req.params) { req.props[attrname] = req.params[attrname]; }
    if(req.body)   for (let attrname in req.body)   { req.props[attrname] = req.body[attrname]; }
    let p_cadn = req.props.cadn;
    res.render('index', { title: 'ArchiveScanView', cadn: p_cadn, user: req.session.user.displayName });
  }
);

module.exports = router;
