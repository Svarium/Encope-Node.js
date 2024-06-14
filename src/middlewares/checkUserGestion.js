module.exports = (req, res, next) => {
    if (req.session && req.session.userLogin && (req.session.userLogin.rol !== 7)) {
       return  next();
    } else {
        return res.redirect('/inicio')     
        }
}; 