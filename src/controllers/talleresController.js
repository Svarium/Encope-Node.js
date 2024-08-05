const db = require('../database/models');
const {validationResult} = require('express-validator');
const ExcelJS = require('exceljs');
const fs = require('fs');



module.exports = {


    listTaller : (req,res) => {
        db.Taller.findAll({
            include: ['destinoTaller'],
            where: {estado:"En Proceso de Aprobación"}
        })
        .then(talleres => {           
            return res.render("stock/talleres/listTaller",{
                title: "Lista de Talleres",
                talleres
            })
        }).catch(error => console.log(error));
    },

    listApproved : (req,res) =>{
        db.Taller.findAll({
            include: ['destinoTaller'],
            where: {estado:"Aprobado"}
        })
        .then(talleres => {           
            return res.render("stock/talleres/talleresAprobados",{
                title: "Lista de Talleres",
                talleres
            })
        }).catch(error => console.log(error));
    },

    listClosed :(req,res) => {
        db.Taller.findAll({
            include: ['destinoTaller'],
            where: {estado:"De Baja"}
        })
        .then(talleres => {           
            return res.render("stock/talleres/talleresDeBaja",{
                title: "Lista de Talleres",
                talleres
            })
        }).catch(error => console.log(error));
    },

    newTaller : (req,res) => {
        db.destinoUsuario.findAll({
            attributes:{
                exclude:["ciudad", "createdAt", "updatedAt", "provincia"]
            }
        })
        .then(destinos => {
            return res.render('stock/talleres/addTaller',{
                title:'Nuevo taller',
                destinos
            })
        })
        .catch(errors => console.log(errors));    
    },


    storageTaller : (req,res) => {
        const errors = validationResult(req);


        if (errors.isEmpty()) {
            
            const {nombre, destino, detalle, expediente, observaciones} = req.body

            db.Taller.create({
                nombre:nombre.trim(),
                idDestino:destino,
                detalle:detalle.trim(),
                expediente:expediente,
                estado:"En Proceso de Aprobación",
                observaciones: observaciones.trim()
            })
            .then(() => {
               return res.redirect('/stock/talleresTable')
            }).catch(errors => console.log(errors))

        } else {
            db.destinoUsuario.findAll({
                attributes:{
                    exclude:["ciudad", "createdAt", "updatedAt", "provincia"]
                }
            })
            .then(destinos => {
                return res.render('stock/talleres/addTaller',{
                    title:'Nuevo taller',
                    destinos,
                    errors:errors.mapped(),
                    old:req.body
                })
            })
            .catch(errors => console.log(errors));          
        }
    },

    editTaller:(req,res) => {
        
         const id = req.params.id
         const taller = db.Taller.findByPk(id)
         const destinos =  db.destinoUsuario.findAll()
         
         Promise.all(([taller,destinos]))
         .then(([taller, destinos]) => {
            return res.render('stock/talleres/editTaller',{
                title:"Editar Taller",
                taller,
                destinos
            })
         }).catch(errors => console.log(errors));     
           
    },

    updateTaller: (req,res) => {

        const errors = validationResult(req);
        const id = req.params.id;
        const {nombre, destino, detalle, expediente, estado, observaciones } = req.body
        
        if(errors.isEmpty()) {

            db.Taller.update({
                nombre: nombre.trim(),
                idDestino: destino,
                detalle:detalle.trim(),
                expediente:expediente,
                estado: estado,
                observaciones: observaciones.trim()
            },{
                where:{id:id}
            }).then(() => {
                return res.redirect('/stock/talleresTable')
            }).catch(errors => console.log(errors))

        } else {
            const id = req.params.id
            const taller = db.Taller.findByPk(id)
            const destinos =  db.destinoUsuario.findAll()
            
            Promise.all(([taller,destinos]))
            .then(([taller, destinos]) => {
               return res.render('stock/talleres/editTaller',{
                   title:"Editar Taller",
                   taller,
                   destinos,
                   old:req.body,
                   errors:errors.mapped()
               })
            }).catch(errors => console.log(errors));    
        }
    },

    deleteTaller : (req,res) => {
        const id = req.params.id

        db.Taller.destroy({
            where:{id:id}
        }).then(() => {
            return res.redirect('/stock/talleresTable')
        }).catch(errors => console.log(errors))
    },



    ExcelTalleres : async (req,res) => {      

        try {
            const tablaTalleres = await db.Taller.findAll({
                include: ['destinoTaller']
            }); // Traigo mi consulta de stock
    
            const workbook = new ExcelJS.Workbook(); // Función constructora del Excel
            const worksheet = workbook.addWorksheet('Sheet 1'); // Crea una hoja de Excel 
    
            // Agregar títulos de columnas
            const titleRow = worksheet.addRow(["Nombre Taller", "Detalle", "Expediente", "Creado", "Destino", "estado"]);
    
            // Aplicar formato al título
            titleRow.eachCell((cell) => {
                cell.font = { bold: true }; // Establece el texto en negrita
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF00' } // Cambia el color de fondo a amarillo (puedes cambiar 'FFFF00' por el código del color que prefieras)
                };
    
                // Agregar bordes
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
    
            tablaTalleres.forEach(taller => {
                const row = worksheet.addRow([taller.nombre, taller.detalle, taller.expediente, taller.createdAt, taller.destinoTaller.nombreDestino, taller.estado]);
                
                // Aplicar bordes a las celdas de la fila de datos
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
            });
    
            const fecha = new Date(Date.now());
    
            // Define el nombre del archivo Excel
            res.setHeader('Content-Disposition', `attachment; filename="${fecha.toISOString().substring(0, 10)}-talleres.xlsx"`); // agregar al nombre la fecha con New Date()
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
            // Envia el archivo Excel como respuesta al cliente
            await workbook.xlsx.write(res);
    
            // Finaliza la respuesta
            res.end();
        } catch (error) {
            console.log(error);
        }

    },

    searchTaller: (req,res) => {
        const {nombre, destino} = req.body;

        db.Taller.findOne({
            where:{
                nombre:nombre,
                idDestino:destino
            },
            include: ['destinoTaller']        
        }).then(taller => {   
                
           return res.render('stock/talleres/searchTaller',{
            title:'Resultado de la busqueda',
            taller
           })           
        }).catch(errors => console.log(errors))
    }

}