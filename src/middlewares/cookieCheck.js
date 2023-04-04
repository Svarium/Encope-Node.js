module.exports = (req, res, next) => {
    if(req.cookies.userGuaridaDelLector){
        req.session.userLogin = req.cookies.userGuaridaDelLector
    }

    next()
}