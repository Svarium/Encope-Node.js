module.exports = (req, res, next) => {
    if(!req.session.userLogin){
      next()
    }

    return res.redirect('/inicio')
} 