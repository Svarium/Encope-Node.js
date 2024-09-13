module.exports = (req, res, next) => {
    !req.session.userLogin || req.session.userLogin.rol !== 1
?   res.redirect('/inicio')
: next();
};
