const express = require('express');
const {sso} = require('node-expose-sspi');
const router = express.Router();
const cfg = require('../lib/config');

/* GET for authentification . */
router.get('/', sso.auth({ groupFilterRegex:'R75\\\\ArchiveScanView'}), function(req, res) {

    if(req.sso && req.sso.user){
        console.log(req.sso.user.groups);
        if (req.sso.user.groups.includes(cfg.authorizeGroup)) {
            req.session.sso_method= req.sso.method;
            req.session.user = req.sso.user;
            let redirectUrl = req.session.returnTo  || '/'
            delete req.session.returnTo;
            res.redirect(redirectUrl);
        } else {
            let userName = req.session.user.adUser ? req.session.user.adUser.displayName : req.session.user.displayName;
            return res.status(403).send(`${userName} - you are not authorized`);
        }
    } else {
        console.log('req.sso not exist');
        return res.status(403).send({
            success: false,
            message: "No sso"
        });
    }
});

module.exports = router;
