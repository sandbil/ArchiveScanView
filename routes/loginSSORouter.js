const express = require('express');
const {sso} = require('node-expose-sspi');
const router = express.Router();
const cfg = require('../lib/config');

/* GET for authentification . */
router.get('/', sso.auth({ groupFilterRegex:'R75.*'}), function(req, res) {

    if(req.sso && req.sso.user){
        console.log(req.sso.user.groups);
       // if (req.sso.user.groups.includes(cfg.authorizeGroup)) {
            req.session.user = req.sso.user;
            res.redirect(req.session.returnTo || '/');
            delete req.session.returnTo;
        //} else {
        //    return res.status(403).send(`${req.sso.user.displayName} - you are not authorized`);
        //}
    } else {
        console.log('req.sso not exist');
        return res.status(403).send({
            success: false,
            message: "No sso"
        });
    }
});

module.exports = router;
