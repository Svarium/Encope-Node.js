const fs = require('fs');
const {validationResult} = require('express-validator');
const path = require('path');
const { Op } = require("sequelize");
const ExcelJS = require('exceljs');

const db = require('../database/models');
const { error } = require('console');
const { title } = require('process');

module.exports = {
    listPartes : async (req,res) => {

        try {
            const destinoId = req.session.userLogin.destinoId;

            const  procedencia = await db.destinoUsuario.findOne({
                where:{
                    id: destinoId
                }
            })

            const proyectos = await db.Proyecto.findAll({
                where:{
                    procedencia: procedencia.nombreDestino
                }
            })

            return res.render('stock/partes/partes',{
                title: 'Proyectos Productivos',
                proyectos,
                procedencia
            })

            
        } catch (error) {
            console.log(error);
        }  

    },

    editParte : (req,res) => {
       const id = req.params.id;

       db.Parte.findOne({
        where:{
            id:id
        }
       }).then(parte => {
        return res.render('stock/partes/editParte',{
            title: 'Editar parte',
            parte 
        })
       }).catch(error => console.log(error))
    },

    updateParte : (req,res) => {

    }
}