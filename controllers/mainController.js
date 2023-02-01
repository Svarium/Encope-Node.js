/* const unidades = require('../data/unidades.json') */

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
    licitaciones : (req,res)=>{
        return res.render('licitaciones', {
            title: 'Licitaciones'
        })
    },
    interno : (req,res)=>{
        return res.render('interno',{
            title : 'Uso interno'
        })
    },
    contacto : (req,res)=>{
        return res.render('contacto',{
            title: 'Contacto'
        })
    }
}