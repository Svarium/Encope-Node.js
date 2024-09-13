const db = require("../../database/models")


module.exports = (req, res, next) => {
    if (req.session && req.session.userLogin && (req.session.userLogin.rol == 3 || req.session.userLogin.rol == 2 || req.session.userLogin.rol == 1 )) {
        return next();
    } else {
        return res.redirect('/inicio')
      }

}; 