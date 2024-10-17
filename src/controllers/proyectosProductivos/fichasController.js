const fs = require('fs');
const { validationResult } = require('express-validator');
const path = require('path');
require("dotenv").config();
const db = require('../../database/models');

const removeFileIfExists = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

const handleFileErrors = (req, errors) => {
    if (req.fileValidationError) {
        errors.errors.push({
            value: "",
            msg: req.fileValidationError,
            param: "ficha",
            location: "file"
        });
    }
    if (!req.file) {
        errors.errors.push({
            value: "",
            msg: "Debe subir el archivo",
            param: "ficha",
            location: "file"
        });
    }
    if (req.fileSizeError) {
        errors.errors.push({
            value: "",
            msg: req.fileSizeError,
            param: "ficha",
            location: "file"
        });
    }
};

module.exports = {

    listFichas: async (req, res) => {
        try {
            const fichas = await db.Ficha.findAll();
            return res.render('stock/fichas/fichas', {
                title: "Fichas Técnicas",
                fichas
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send('Error interno del servidor');
        }
    },

    addFicha: (req, res) => {
        return res.render('stock/fichas/addFicha', {
            title: "Agregar Ficha Técnica"
        });
    },

    storeFicha: async (req, res) => {
        const errors = validationResult(req);
        handleFileErrors(req, errors);

        if (errors.isEmpty()) {
            const { nombre, expediente } = req.body;

            try {
                await db.Ficha.create({
                    expediente: expediente.trim(),
                    nombre: nombre.trim(),
                    archivo: req.file ? req.file.filename : null
                });
                return res.redirect('/stock/listFichas');
            } catch (error) {
                console.log(error);
                return res.status(500).send('Error interno del servidor');
            }

        } else {
            if (req.file) {
                removeFileIfExists(path.join(__dirname, `../../public/images/fichasTecnicas/${req.file.filename}`));
            }
            return res.render('stock/fichas/addFicha', {
                title: "Agregar Ficha Técnica",
                old: req.body,
                errors: errors.mapped()
            });
        }
    },

    editFicha: async (req, res) => {
        const id = req.params.id;

        try {
            const ficha = await db.Ficha.findOne({ where: { id } });
            return res.render('stock/fichas/editFicha', {
                title: "Editar Ficha",
                ficha
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send('Error interno del servidor');
        }
    },

    updateFicha: async (req, res) => {
        const errors = validationResult(req);
        handleFileErrors(req, errors);

        const id = req.params.id;
        if (errors.isEmpty()) {
            const { nombre, expediente } = req.body;
            let oldFile;

            try {
                const ficha = await db.Ficha.findByPk(id);
                oldFile = ficha.archivo;

                await ficha.update({
                    nombre: nombre.trim(),
                    expediente: expediente.trim(),
                    archivo: req.file ? req.file.filename : ficha.archivo
                });

                if (req.file) {
                    removeFileIfExists(path.join(__dirname, `../../public/images/fichasTecnicas/${oldFile}`));
                }

                return res.redirect('/stock/listFichas');
            } catch (error) {
                console.log(error);
                return res.status(500).send('Error interno del servidor');
            }

        } else {
            if (req.file) {
                removeFileIfExists(path.join(__dirname, `../../public/images/fichasTecnicas/${req.file.filename}`));
            }

            try {
                const ficha = await db.Ficha.findOne({ where: { id } });
                return res.render('stock/fichas/editFicha', {
                    title: "Editar Ficha",
                    ficha,
                    old: req.body,
                    errors: errors.mapped()
                });
            } catch (error) {
                console.log(error);
                return res.status(500).send('Error interno del servidor');
            }
        }
    },

    deleteFicha: async (req, res) => {
        const id = req.params.id;

        try {
            await db.Ficha.destroy({ where: { id } });
            return res.redirect('/stock/listFichas');
        } catch (error) {
            console.log(error);
            return res.status(500).send('Error interno del servidor');
        }
    }
};
