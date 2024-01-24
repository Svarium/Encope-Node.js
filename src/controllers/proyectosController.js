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
        return res.render('stock/proyectos/addproyect',{
            title:'Nuevo Proyecto'
        })
    }

}