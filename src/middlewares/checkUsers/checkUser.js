module.exports = (req, res, next) => {
    if(!req.session.userLogin){
     return  next()
    }

    return res.redirect('/inicio')
} 