module.exports = (req, res, next) => {
    if(req.cookies.userEncopeWeb){
        req.session.userLogin = req.cookies.userEncopeWeb
    }

    next()
}