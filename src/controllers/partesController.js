const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
require("dotenv").config();
const db = require('../database/models');
const transporter = require('../helpers/configNodemailer');

module.exports = {
  listPartes: async (req, res) => {

    try {
      const destinoId = req.session.userLogin.destinoId;

      const procedencia = await db.destinoUsuario.findOne({
        where: {
          id: destinoId
        }
      })

      const proyectos = await db.Proyecto.findAll({
        where: {
          procedencia: procedencia.nombreDestino
        }
      })

      return res.render('stock/partes/partes', {
        title: 'Proyectos Productivos',
        proyectos,
        procedencia
      })


    } catch (error) {
      console.log(error);
    }

  },

  editParte: async (req, res) => {

    try {

      const id = req.params.id;

      const insumos = await db.insumoProyecto.findAll({
        where: {proyectoId:id},
        attributes:["cantidadRequerida", "cantidadAdquirida", "cantidadAproducir", "decomiso"],     
        include:[
        {
            model: db.Insumo,
            as:'insumos',
            attributes:["nombre", "id", "unidadDeMedida","idProducto", "cantidad"]
        }    
    ]           
    })
    

    const insumosComparados = insumos.map(item => {
        const plainInsumo = item.insumos.get({ plain: true });
        const cantidadRequerida = item.get('cantidadRequerida');
        const cantidadAdquirida = item.get('cantidadAdquirida');
        const cantidadAproducir = item.get('cantidadAproducir');
        const decomiso = item.get('decomiso')
        return {
            ...plainInsumo,
            cantidadRequerida: cantidadAproducir * plainInsumo.cantidad,
            cantidadAdquirida,
            decomiso,
            remanentes: cantidadAdquirida != null ? cantidadAdquirida - cantidadRequerida : 'Falta informar cantidad Adquirida'
        };
    });           

      const parte = await db.Parte.findOne({
        where: {
          id: id
        },
        include: [{
          model: db.proyectoProducto,
          as: "productoParte",
          include: [
            {
              model: db.Producto,
              as: "producto"
            }
          ]
        }]
      })


      const productos = await db.proyectoProducto.findAll({ where: { proyectoId: id } });//busco todos los productos de un proyecto

      const cantidadTotalAProducir = productos.reduce((total, producto) => { // Sumo el total a producir de todos los productos
        return total + producto.cantidadAProducir;
      }, 0); // Se inicializa con 0 para evitar problemas si la lista está vacía

      const cantidadTotalProducida = productos.reduce((total, producto) => { // Sumo el total producido de todos los productos
        return total + producto.cantidadProducida;
      }, 0); // Se inicializa con 0 para evitar problemas si la lista está vacía


      const porcentajeAvance = (cantidadTotalProducida / cantidadTotalAProducir) * 100;

      const ideal = cantidadTotalAProducir / parte.duracion;

      const real = cantidadTotalProducida / parte.duracion


      return res.render('stock/partes/editParte', {
        title: 'Editar parte',
        parte,
        porcentajeAvance: porcentajeAvance.toFixed(2),
        ideal,
        real,
        insumosComparados
      })

    } catch (error) {
      console.log(error);
    }

  },

  printParte: async (req, res) => {
    try {
      const id = req.params.id;
      const parte = await db.Parte.findAll({
        where: { id: id },
        include: [{
          model: db.proyectoProducto,
          as: 'productoParte',
          attributes: ["cantidadAProducir", "cantidadProducida", "stockEnTaller", "egresos"],
          include: [{
            model: db.Producto,
            as: 'producto',
            attributes: ["nombre"]
          }]
        }, {
          model: db.Taller,
          as: 'parteTaller',
          attributes: ["nombre"]
        }],
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sheet 1');

      // Agregar títulos de columnas
      const titleRow = worksheet.addRow(["Nombre", "Taller", "Expediente", "Procedencia", "Detalle", "Duración", "Productos", "Cantidad a producir", "Cantidad Producida", "Stock en Taller", "egresos", "Remanentes", "Última Actualización"]);

      // Aplicar formato al título
      titleRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF00' }
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      parte.forEach(item => {
        item.productoParte.forEach(productoItem => {
          const row = worksheet.addRow([
            item.nombre,
            item.parteTaller.nombre,
            item.expediente,
            item.procedencia,
            item.detalle,
            `${item.duracion} ${item.unidadDuracion}`,
            productoItem.producto.nombre,
            productoItem.cantidadAProducir,
            productoItem.cantidadProducida,
            productoItem.stockEnTaller,
            productoItem.egresos,
            item.remanentes,
            item.updatedAt
          ]);

          row.eachCell((cell) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          });
        });
      });


      const fecha = new Date(Date.now());
      const fileName = `${fecha.toISOString().substring(0, 10)}-parteSemanal${parte[0].nombre}.xlsx`;

      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.log(error);
    }
  },

  printParteInsumos: async (req, res) => {

    try {
      const id = req.params.id;

      const parteInsumos = await db.Parte.findOne({
        where: { id: id },
        attributes: ["nombre", "procedencia", "updatedAt"],
        include: [{
          model: db.proyectoProducto,
          as: 'productoParte',
          attributes: ["cantidadAProducir", "cantidadProducida"],
          include: [{
            model: db.Producto,
            as: 'producto',
            attributes: ["nombre", "id"],
            include: [{
              model: db.Insumo,
              as: "productos",
              attributes: ["nombre", "cantidad"]
            }]
          }]
        }, {
          model: db.Taller,
          as: 'parteTaller',
          attributes: ["nombre"]
        }],
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sheet 1');

      // Agregar títulos de columnas
      const titleRow = worksheet.addRow(["Nombre del Proyecto", "Procedencia", "Taller", "Producto/s", "Cantidad de Insumos al Inicio", "Cantidad de Insumos Actual", "Última actualización"]);

      // Aplicar formato al título
      titleRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF00' }
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });



      if (parteInsumos) {
        parteInsumos.productoParte.forEach(productoItem => {
          productoItem.producto.productos.forEach(insumoItem => {
            const cantidadInicial = productoItem.cantidadAProducir * insumoItem.cantidad; // calculo la cantidad de insumos necesarios al inicio del proyecto (cantidad a producir * cantidad de insumo)
            const cantidadActual = productoItem.cantidadProducida * insumoItem.cantidad; // calculo la cantidad de insumo utilizado al momento (cantidad producida * cantidad de insumo) 
            const insumosActuales = cantidadInicial - cantidadActual; // calculo la existencia de insumos actuales (cantidad de insumos iniciales - insumos utlizados)

            worksheet.addRow([
              parteInsumos.nombre,
              parteInsumos.procedencia,
              parteInsumos.parteTaller.nombre,
              productoItem.producto.nombre,
              `${insumoItem.nombre}: ${cantidadInicial}`,
              `${insumoItem.nombre}: ${insumosActuales}`,
              parteInsumos.updatedAt
            ]).eachCell((cell) => {
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };
            });
          });
        });
      }

      const fecha = new Date(Date.now());
      const fileName = `${fecha.toISOString().substring(0, 10)}-parteInsumos${parteInsumos.nombre}.xlsx`;

      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.log(error);
    }

  },

  reporteViaEmail: async (req, res) => {

    try {
      const id = req.params.id;

      const parte = await db.Parte.findAll({
        where: { id: id },
        include: [{
          model: db.proyectoProducto,
          as: 'productoParte',
          attributes: ["cantidadAProducir", "cantidadProducida", "stockEnTaller", "egresos"],
          include: [{
            model: db.Producto,
            as: 'producto',
            attributes: ["nombre"]
          }]
        }, {
          model: db.Taller,
          as: 'parteTaller',
          attributes: ["nombre"]
        }],
      });

      const parteInsumos = await db.Parte.findOne({
        where: { id: id },
        attributes: ["nombre", "procedencia", "updatedAt"],
        include: [{
          model: db.proyectoProducto,
          as: 'productoParte',
          attributes: ["cantidadAProducir", "cantidadProducida"],
          include: [{
            model: db.Producto,
            as: 'producto',
            attributes: ["nombre", "id"],
            include: [{
              model: db.Insumo,
              as: "productos",
              attributes: ["nombre", "cantidad"]
            }]
          }]
        }, {
          model: db.Taller,
          as: 'parteTaller',
          attributes: ["nombre"]
        }],
      });

      // Generar el primer archivo Excel
      const fecha = new Date(Date.now());
      const fileName1 = `${fecha.toISOString().substring(0, 10)}-parteSemanal${parte[0].nombre}.xlsx`;
      const filePath1 = path.join(__dirname, '../../temp/', fileName1);

      const workbook1 = new ExcelJS.Workbook();
      const worksheet1 = workbook1.addWorksheet('Sheet 1');

      const titleRow1 = worksheet1.addRow(["Nombre", "Taller", "Expediente", "Procedencia", "Detalle", "Duración", "Productos", "Cantidad a producir", "Cantidad Producida", "Stock en Taller", "egresos", "Remanentes", "Última Actualización"]);
      titleRow1.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF00' }
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      parte.forEach(item => {
        item.productoParte.forEach(productoItem => {
          const row = worksheet1.addRow([
            item.nombre,
            item.parteTaller.nombre,
            item.expediente,
            item.procedencia,
            item.detalle,
            `${item.duracion} ${item.unidadDuracion}`,
            productoItem.producto.nombre,
            productoItem.cantidadAProducir,
            productoItem.cantidadProducida,
            productoItem.stockEnTaller,
            productoItem.egresos,
            item.remanentes,
            item.updatedAt
          ]);

          row.eachCell((cell) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          });
        });
      });

      await workbook1.xlsx.writeFile(filePath1);

      // Generar el segundo archivo Excel
      const fileName2 = `${fecha.toISOString().substring(0, 10)}-parteInsumos${parteInsumos.nombre}.xlsx`;
      const filePath2 = path.join(__dirname, '../../temp/', fileName2);

      const workbook2 = new ExcelJS.Workbook();
      const worksheet2 = workbook2.addWorksheet('Sheet 1');

      const titleRow2 = worksheet2.addRow(["Nombre del Proyecto", "Procedencia", "Taller", "Producto/s", "Cantidad de Insumos al Inicio", "Cantidad de Insumos Actual", "Última actualización"]);
      titleRow2.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF00' }
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      if (parteInsumos) {
        parteInsumos.productoParte.forEach(productoItem => {
          productoItem.producto.productos.forEach(insumoItem => {
            const cantidadInicial = productoItem.cantidadAProducir * insumoItem.cantidad;
            const cantidadActual = productoItem.cantidadProducida * insumoItem.cantidad;
            const insumosActuales = cantidadInicial - cantidadActual;

            worksheet2.addRow([
              parteInsumos.nombre,
              parteInsumos.procedencia,
              parteInsumos.parteTaller.nombre,
              productoItem.producto.nombre,
              `${insumoItem.nombre}: ${cantidadInicial}`,
              `${insumoItem.nombre}: ${insumosActuales}`,
              parteInsumos.updatedAt
            ]).eachCell((cell) => {
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };
            });
          });
        });
      }

      await workbook2.xlsx.writeFile(filePath2);

      // Una vez que ambos archivos se hayan generado y guardado en el servidor, puedes adjuntarlos al correo electrónico
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'informatica@encope.gob.ar',
        subject: 'Informe de Parte Semanal',
        text: 'Adjunto encontrará el informe del parte Semanal de stock y de insumos ambos en formato Excel.',
        attachments: [
          {
            filename: fileName1,
            path: filePath1
          },
          {
            filename: fileName2,
            path: filePath2
          }
        ]
      };

      await transporter.sendMail(mailOptions);
      console.log('Correo electrónico enviado correctamente');

      fs.unlink(filePath1, (err) => {
        if (err) {
          console.error('Error al borrar el archivo Excel 1:', err);
          return res.status(500).send('Error al borrar el archivo Excel 1');
        }
        console.log('Archivo Excel 1 borrado correctamente');
      });

      fs.unlink(filePath2, (err) => {
        if (err) {
          console.error('Error al borrar el archivo Excel 2:', err);
          return res.status(500).send('Error al borrar el archivo Excel 2');
        }
        console.log('Archivo Excel 2 borrado correctamente');
        return res.redirect('/stock/partes/');
      });


    } catch (error) {
      console.log(error);

    }

  },

  reporteAutomaticoViaEmail: async (req, res) => {
    try {
      const parte = await db.Parte.findAll({
        include: [{
          model: db.proyectoProducto,
          as: 'productoParte',
          attributes: ["cantidadAProducir", "cantidadProducida", "stockEnTaller", "egresos"],
          include: [{
            model: db.Producto,
            as: 'producto',
            attributes: ["nombre"]
          }]
        }, {
          model: db.Taller,
          as: 'parteTaller',
          attributes: ["nombre"]
        }],
      });

      const parteInsumos = await db.Parte.findAll({
        attributes: ["nombre", "procedencia", "updatedAt"],
        include: [{
          model: db.proyectoProducto,
          as: 'productoParte',
          attributes: ["cantidadAProducir", "cantidadProducida"],
          include: [{
            model: db.Producto,
            as: 'producto',
            attributes: ["nombre", "id"],
            include: [{
              model: db.Insumo,
              as: "productos",
              attributes: ["nombre", "cantidad"]
            }]
          }]
        }, {
          model: db.Taller,
          as: 'parteTaller',
          attributes: ["nombre"]
        }],
      });

      if (!parte.length) {
        console.error('No se encontraron partes');
        return res.status(404).send('No se encontraron partes');
      }

      if (!parteInsumos.length) {
        console.error('No se encontraron insumos de partes');
        return res.status(404).send('No se encontraron insumos de partes');
      }

      // Generar el primer archivo Excel
      const fecha = new Date(Date.now());
      const fileName1 = `${fecha.toISOString().substring(0, 10)}-parteSemanal${parte[0].nombre}.xlsx`;
      const filePath1 = path.join(__dirname, '../../temp/', fileName1);

      const workbook1 = new ExcelJS.Workbook();
      const worksheet1 = workbook1.addWorksheet('Sheet 1');

      const titleRow1 = worksheet1.addRow([
        "Nombre", "Taller", "Expediente", "Procedencia", "Detalle", "Duración",
        "Producto", "Cantidad a producir", "Cantidad Producida", "Stock en Taller", "Egresos",
        "Remanentes", "Última Actualización"
      ]);
      titleRow1.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF00' }
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      parte.forEach(item => {
        item.productoParte.forEach(productoItem => {
          const row = worksheet1.addRow([
            item.nombre,
            item.parteTaller ? item.parteTaller.nombre : 'N/A',
            item.expediente,
            item.procedencia,
            item.detalle,
            `${item.duracion} ${item.unidadDuracion}`,
            productoItem.producto ? productoItem.producto.nombre : 'N/A',
            productoItem.cantidadAProducir,
            productoItem.cantidadProducida,
            productoItem.stockEnTaller,
            productoItem.egresos,
            item.remanentes,
            item.updatedAt
          ]);

          row.eachCell((cell) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          });
        });
      });

      await workbook1.xlsx.writeFile(filePath1);

      // Generar el segundo archivo Excel
      const fileName2 = `${fecha.toISOString().substring(0, 10)}-parteInsumos${parteInsumos[0].nombre}.xlsx`;
      const filePath2 = path.join(__dirname, '../../temp/', fileName2);

      const workbook2 = new ExcelJS.Workbook();
      const worksheet2 = workbook2.addWorksheet('Sheet 1');

      const titleRow2 = worksheet2.addRow([
        "Nombre del Proyecto", "Procedencia", "Taller", "Producto/s",
        "Cantidad de Insumos al Inicio", "Cantidad de Insumos Actual", "Última actualización"
      ]);
      titleRow2.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF00' }
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      parteInsumos.forEach(parte => {
        parte.productoParte.forEach(productoItem => {
          productoItem.producto.productos.forEach(insumoItem => {
            const cantidadInicial = productoItem.cantidadAProducir * insumoItem.cantidad;
            const cantidadActual = productoItem.cantidadProducida * insumoItem.cantidad;
            const insumosActuales = cantidadInicial - cantidadActual;

            const row = worksheet2.addRow([
              parte.nombre,
              parte.procedencia,
              parte.parteTaller ? parte.parteTaller.nombre : 'N/A',
              productoItem.producto ? productoItem.producto.nombre : 'N/A',
              `${insumoItem.nombre}: ${cantidadInicial}`,
              `${insumoItem.nombre}: ${insumosActuales}`,
              parte.updatedAt
            ]);

            row.eachCell((cell) => {
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };
            });
          });
        });
      });

      await workbook2.xlsx.writeFile(filePath2);

      // Enviar correo electrónico con los archivos adjuntos
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'informatica@encope.gob.ar',
        subject: 'Informe de Parte Semanal',
        text: 'Adjunto encontrará el informe del parte Semanal de stock y de insumos ambos en formato Excel.',
        attachments: [
          {
            filename: fileName1,
            path: filePath1
          },
          {
            filename: fileName2,
            path: filePath2
          }
        ]
      };

      await transporter.sendMail(mailOptions);
      console.log('Correo electrónico enviado correctamente');

      fs.unlink(filePath1, (err) => {
        if (err) {
          console.error('Error al borrar el archivo Excel 1:', err);
          return res.status(500).send('Error al borrar el archivo Excel 1');
        }
        console.log('Archivo Excel 1 borrado correctamente');
      });

      fs.unlink(filePath2, (err) => {
        if (err) {
          console.error('Error al borrar el archivo Excel 2:', err);
          return res.status(500).send('Error al borrar el archivo Excel 2');
        }

        if (res) {
          return res.status(200).end();
        } else {
          console.log('No hay objeto de respuesta definido');
        }
      });

    } catch (error) {
      console.log(error);
      res.status(500).send('Error al generar el reporte');
    }

  }
}