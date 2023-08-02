module.exports = (req, res, next) => {
    if(!req.session.userLogin){
        return res.redirect('/users/login')
    }

  next()
}


//ESTE MIDDLEWARE VA EN TODAS LAS RUTAS EN DONDE NO QUIERO QUE ACCEDAN USUARIOS QUE NO ESTEN LOGUEADOS!!

