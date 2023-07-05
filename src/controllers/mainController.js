const db = require("../database/models")

module.exports = {
    home : (req,res) =>{

            return res.render('index',{
                title: 'Encope',
            });
    
    },
    inicio : (req,res) =>{
        db.Noticias.findAll({
            include:["images"],
            order: [["createdAt", "DESC"]],
            limit:4
        })
        .then(noticias => {
           /*  return res.send(noticias) */
            return res.render('inicio', {
                title: 'Encope',
                noticias
            })
        })
      
    },
    nosotros : (req,res)=>{
        return res.render('nosotros',{
            title:'Nosotros'
        })
    },
   
    interno : (req,res)=>{
        return res.render('interno',{
            title : 'Uso interno'
        })
    },

  
}