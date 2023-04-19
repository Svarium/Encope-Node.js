

module.exports = {
    home : (req,res) =>{
        return res.render('index',{
            title: 'Encope'
        });
    },
    inicio : (req,res) =>{
        return res.render('inicio', {
            title: 'Encope'
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