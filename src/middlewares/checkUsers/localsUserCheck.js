// Middleware para establecer la variable res.locals.userLogin si existe req.session.userLogin
module.exports = (req, res, next) => {
    if (req.session.userLogin) {
        res.locals.userLogin = req.session.userLogin;
    }
    next();
};