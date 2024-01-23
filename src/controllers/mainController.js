const db = require("../database/models");
const { update } = require("./noticiasController");
const fs = require('fs');
const path = require('path')

const unidadFilePath = path.join(__dirname, '../data/mapa.json');
const unidades = JSON.parse(fs.readFileSync(unidadFilePath, 'utf-8'));



module.exports = {
    home : (req,res) =>{

            return res.render('index',{
                title: 'Encope',
            });
    
    },
    inicio : (req,res) =>{
    const userLogin = req.session.userLogin
        db.Noticias.findAll({
            include:[{
                model:db.Image,
                as:'images',
                attributes:{
                    exclude:["id", "noticiaId", "createdAt", "updatedAt" ]
                }
            }],
            order: [["createdAt", "DESC"]],
            limit:4,
            attributes:{
                exclude:["updatedAt"]
            }
        })
        .then(noticias => {
     /*  if(req.session.userLogin){
        console.log(req.session.userLogin.destinoId);
      } */
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
   
    mapa: (req,res) => {
        const unidadFilePath = path.join(__dirname, '../data/mapa.json');
        const unidades = JSON.parse(fs.readFileSync(unidadFilePath, 'utf-8'));
        const userLogin = req.session.userLogin
        return res.render('mapa',{
            title:"Mapa",
            userLogin,
            unidades
        })
    },

    unidadDetail: (req,res) => {
        const unidadFilePath = path.join(__dirname, '../data/mapa.json');
        const unidades = JSON.parse(fs.readFileSync(unidadFilePath, 'utf-8'));
        let id = req.params.id

        let unidad = unidades.find(unidad => unidad.id == id)

        return res.render('detalleMapa', {
            unidad,
            title:'Detalle de la unidad'
        })
    },

    contacto: (req,res) => {
        const userLogin = req.session.userLogin
        return res.render('contacto',{
            userLogin,
            title:'Contacto'
        })
    }

  
}