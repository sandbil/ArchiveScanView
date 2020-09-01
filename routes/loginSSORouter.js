const express = require('express');
const {sso} = require('node-expose-sspi');
const router = express.Router();


/* GET for authentification . */
router.get('/', sso.auth(), function(req, res) {

    if(req.sso && req.sso.user){
        req.session.user = req.sso.user;
        res.redirect(req.session.returnTo || '/');
        delete req.session.returnTo;
    } else {
        console.log('req.sso not exist');
        return res.status(403).send({
            success: false,
            message: "No sso"
        });
    }
});

module.exports = router;
