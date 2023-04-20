/* module.exports = (req, res, next) => {
    !req.session.userLogin || req.session.userLogin.rol !== 1 || req.session.userLogin.rol !== 2
? res.render("inicio",{
    title:"Encope"
})
: next();
}; */


module.exports = (req, res, next) => {
    if (req.session && req.session.userLogin && (req.session.userLogin.rol == 2 || req.session.userLogin.rol == 1 )) {
         next();
    } else {
        res.render("inicio",{
            title:"Encope"
    }
        )}


}; 