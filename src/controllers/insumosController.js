const db = require("../database/models")
const {validationResult} = require('express-validator')
const { Op } = require('sequelize');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const { error } = require("console");


module.exports = {

    addInsumo : (req,res) => {

        idProducto = req.params.id;

        db.Producto.findByPk(idProducto)
        .then(producto => {
            return res.render('stock/insumos/addInsumo',{
                title: "Agregar Insumo",
                producto
            })
        })
        .catch(error => console.log(error))
    },

    storeInsumo:(req,res) => {

        const errors = validationResult(req);
        const idProducto = req.params.id;

        if (errors.isEmpty()) {

        const {nombre, cantidad, detalle} = req.body;

        db.Insumo.create({
            nombre:nombre.trim(),
            cantidad:cantidad,
            detalle: detalle ? detalle : "Sin detalle asociado",
            idProducto:idProducto
        })        
             .then(() => {
                return res.redirect('/stock/products')
             })
             .catch(error => console.log(error))      
        
        } else {

            db.Producto.findByPk(idProducto)
            .then(producto => {
                return res.render('stock/insumos/addInsumo',{
                    title: "Agregar Insumo",
                    producto,
                    old:req.body,
                    errors: errors.mapped()
                })
            })
            .catch(error => console.log(error))
        }
    }




}