const fs = require('fs');
const {validationResult} = require('express-validator');
const {hashSync} = require('bcryptjs');
const bcrypt = require('bcrypt')
const path = require('path');
const { Op } = require("sequelize");

const db = require('../database/models');
const { error } = require('console');

module.exports = {

    addNewProyect : (req,res) => {

        const talleres = db.Taller.findAll({
            attributes : ['id', 'nombre'],
            include:[{
                model: db.destinoUsuario,
                as:'destinoTaller',
                attributes:['id', 'nombreDestino']
            }],
        })
        const productos = db.Producto.findAll({
            attributes : ['id', 'nombre'],
        })

        Promise.all(([talleres,productos]))
        .then(([talleres,productos]) =>{        
      
            return res.render('stock/proyectos/addproyect',{
                title:'Nuevo Proyecto',
                talleres,
                productos
            })
        }).catch(error => console.log(error));     
    },

    storeProyect : async (req,res) => {    

   
        const errors = validationResult(req)

        if(errors.isEmpty()){

            const {nombre, expediente, destino, producto, cantidad, detalle, duracion, unidadDuracion, costoTotal, costoUnitario} = req.body

            const usuario = await db.Usuario.findOne({
                where: {destinoId : req.session.userLogin.destinoId},
                attributes:[],
                include:[{
                    model: db.destinoUsuario,
                    as:"destino",
                    attributes: ["nombreDestino"]
                }]
            })

            const procedencia = usuario.destino.nombreDestino

            db.Proyecto.create({
                nombre:nombre.trim(),
                expediente:expediente,
                idTaller: destino,
                cantidadAProducir: cantidad,
                detalle:detalle,
                procedencia: procedencia,
                duracion: duracion,
                unidadDuracion: unidadDuracion,
                costoTotal: costoTotal,
                costoUnitario:costoUnitario,
                idProducto: producto
            }).then(() => {
                return res.redirect('/stock')
            }).catch(error => console.log(error))         

        } else {
            const talleres = db.Taller.findAll({
                attributes : ['id', 'nombre'],
                include:[{
                    model: db.destinoUsuario,
                    as:'destinoTaller',
                    attributes:['id', 'nombreDestino']
                }],
            })
            const productos = db.Producto.findAll({
                attributes : ['id', 'nombre'],
            })
    
            Promise.all(([talleres,productos]))
            .then(([talleres,productos]) =>{        
          
                return res.render('stock/proyectos/addproyect',{
                    title:'Nuevo Proyecto',
                    talleres,
                    productos,
                    old:req.body,
                    errors: errors.mapped()
                })
            }).catch(error => console.log(error));    
        }      
    }


}