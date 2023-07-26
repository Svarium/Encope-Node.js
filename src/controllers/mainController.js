const db = require("../database/models")

module.exports = {
    home : (req,res) =>{

            return res.render('index',{
                title: 'Encope',
            });
    
    },
    inicio : (req,res) =>{
    const userLogin = req.session.userLogin
        db.Noticias.findAll({
            include:["images"],
            order: [["createdAt", "DESC"]],
            limit:4
        })
        .then(noticias => {
           /*  return res.send(noticias) */
            return res.render('inicio', {
                title: 'Encope',
                noticias,
                userLogin
            })
        })
      
    },
    nosotros : (req,res)=>{
      const userLogin = req.session.userLogin
        return res.render('nosotros',{
            title:'Nosotros',
            userLogin
        })
    },
   
    interno : (req,res)=>{
      const userLogin = req.session.userLogin
        return res.render('interno',{
            title : 'Uso interno',
            userLogin
        })
    },

  
}