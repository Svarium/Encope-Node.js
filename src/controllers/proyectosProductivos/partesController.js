const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
require("dotenv").config();
const db = require('../../database/models');
const transporter = require('../../helpers/configNodemailer');
const { Op } = require('sequelize');

// Función auxiliar para agregar títulos a la hoja
const agregarTitulos = (worksheet, titulos) => {
  const titleRow = worksheet.addRow(titulos);
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
};

// Función auxiliar para agregar filas de datos
const agregarFilasDatos = (worksheet, data, dataType) => {
  data.forEach(item => {
    if (dataType === 'parte') {
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
          item.updatedAt
        ]);
        agregarBordes(row);
      });
    } else if (dataType === 'insumos') {
      item.productoParte.forEach(productoItem => {
        productoItem.producto.productos.forEach(insumoItem => {
          const cantidadAdquirida = item.cantidadAdquiridaMap.get(insumoItem.id) || 0;
          const cantidadActual = productoItem.cantidadProducida * insumoItem.cantidad;
          const insumosActuales = cantidadAdquirida - cantidadActual;

          worksheet.addRow([
            item.nombre,
            item.procedencia,
            item.parteTaller.nombre,
            productoItem.producto.nombre,
            `${insumoItem.nombre}: ${cantidadAdquirida}`,
            `${insumoItem.nombre}: ${insumosActuales}`,
            item.updatedAt
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
  });
};

// Función auxiliar para agregar bordes a las celdas
const agregarBordes = (row) => {
  row.eachCell((cell) => {
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });
};

module.exports = {
  listPartes: async (req, res) => {
    try {
      const destinoId = req.session.userLogin.destinoId;
      const procedencia = await db.destinoUsuario.findByPk(destinoId);
      const limit = parseInt(req.query.limit, 10) || 10;
      const page = parseInt(req.query.page, 10) || 1;
      const offset = (page - 1) * limit;

      const { count, rows: proyectos } = await db.Proyecto.findAndCountAll({
        where: {
          [Op.or]: [
            { procedencia: procedencia.nombreDestino },
            { asignado: procedencia.nombreDestino }
          ]
        },
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });

      const totalPages = Math.ceil(count / limit);
      res.render('stock/partes/partes', {
        title: 'Proyectos Productivos',
        proyectos,
        procedencia,
        currentPage: page,
        totalPages,
        limit,
      });
    } catch (error) {
      console.error(error);
    }
  },

  editParte: async (req, res) => {
    try {
      const id = req.params.id;

      const insumos = await db.insumoProyecto.findAll({
        where: { proyectoId: id },
        attributes: ["cantidadRequerida", "cantidadAdquirida", "cantidadAproducir", "decomiso"],
        include: [{
          model: db.Insumo,
          as: 'insumos',
          attributes: ["nombre", "id", "unidadDeMedida", "idProducto", "cantidad"]
        }]
      });

      const insumosComparados = insumos.map(item => {
        const { nombre, id, unidadDeMedida, idProducto, cantidad } = item.insumos.get({ plain: true });
        const cantidadRequerida = item.cantidadAproducir * cantidad;
        const remanentes = item.cantidadAdquirida != null ? item.cantidadAdquirida - cantidadRequerida : 'Falta informar cantidad Adquirida';
        return {
          nombre,
          id,
          unidadDeMedida,
          idProducto,
          cantidad,
          cantidadRequerida,
          cantidadAdquirida: item.cantidadAdquirida,
          decomiso: item.decomiso,
          remanentes
        };
      });

      const parte = await db.Parte.findByPk(id, {
        include: [{
          model: db.proyectoProducto,
          as: "productoParte",
          include: [{ model: db.Producto, as: "producto" }]
        }]
      });

      const productos = await db.proyectoProducto.findAll({ where: { proyectoId: id } });

      const cantidadTotalAProducir = productos.reduce((acc, { cantidadAProducir }) => acc + cantidadAProducir, 0);
      const cantidadTotalProducida = productos.reduce((acc, { cantidadProducida }) => acc + cantidadProducida, 0);
      const porcentajeAvance = (cantidadTotalProducida / cantidadTotalAProducir) * 100;
      const ideal = cantidadTotalAProducir / parte.duracion;
      const real = cantidadTotalProducida / parte.duracion;

      res.render('stock/partes/editParte', {
        title: 'Editar parte',
        parte,
        porcentajeAvance: porcentajeAvance.toFixed(2),
        ideal,
        real,
        insumosComparados
      });
    } catch (error) {
      console.error(error);
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
      agregarTitulos(worksheet, ["Nombre", "Taller", "Expediente", "Procedencia", "Detalle", "Duración", "Productos", "Cantidad a producir", "Cantidad Producida", "Stock en Taller", "egresos", "Última Actualización"]);
      agregarFilasDatos(worksheet, parte, 'parte');
  
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
              attributes: ["nombre", "id", "cantidad"]
            }]
          }]
        }, {
          model: db.Taller,
          as: 'parteTaller',
          attributes: ["nombre"]
        }],
      });
  
      const cantidadAdquiridaData = await db.insumoProyecto.findAll({
        where: { proyectoId: id },
        attributes: ['insumoId', 'cantidadAdquirida']
      });
  
      const cantidadAdquiridaMap = new Map();
      cantidadAdquiridaData.forEach(entry => {
        cantidadAdquiridaMap.set(entry.insumoId, entry.cantidadAdquirida);
      });
  
      parteInsumos.cantidadAdquiridaMap = cantidadAdquiridaMap;
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sheet 1');
      agregarTitulos(worksheet, ["Nombre del Proyecto", "Procedencia", "Taller", "Producto/s", "Cantidad de Insumos Adquiridos", "Cantidad de Insumos Actual", "Última actualización"]);
      agregarFilasDatos(worksheet, [parteInsumos], 'insumos');
  
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
  
      // Obtener los datos de parte
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
  
      // Obtener los datos de parteInsumos
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
  
      // Generar el primer archivo Excel para parte
      const fecha = new Date(Date.now());
      const fileName1 = `${fecha.toISOString().substring(0, 10)}-parteSemanal${parte[0].nombre}.xlsx`;
      const filePath1 = path.join(__dirname, '../../temp/', fileName1);
  
      const workbook1 = new ExcelJS.Workbook();
      const worksheet1 = workbook1.addWorksheet('Sheet 1');
      agregarTitulos(worksheet1, ["Nombre", "Taller", "Expediente", "Procedencia", "Detalle", "Duración", "Productos", "Cantidad a producir", "Cantidad Producida", "Stock en Taller", "egresos", "Remanentes", "Última Actualización"]);
      agregarFilasDatos(worksheet1, parte, 'parte');
      await workbook1.xlsx.writeFile(filePath1);
  
      // Generar el segundo archivo Excel para parteInsumos
      const fileName2 = `${fecha.toISOString().substring(0, 10)}-parteInsumos${parteInsumos.nombre}.xlsx`;
      const filePath2 = path.join(__dirname, '../../temp/', fileName2);
  
      const workbook2 = new ExcelJS.Workbook();
      const worksheet2 = workbook2.addWorksheet('Sheet 1');
      agregarTitulos(worksheet2, ["Nombre del Proyecto", "Procedencia", "Taller", "Producto/s", "Cantidad de Insumos Adquiridos", "Cantidad de Insumos Actual", "Última actualización"]);
      agregarFilasDatos(worksheet2, [parteInsumos], 'insumos');
      await workbook2.xlsx.writeFile(filePath2);
  
      // Envía los archivos como respuesta
      res.status(200).send({
        message: 'Archivos generados exitosamente.',
        files: [filePath1, filePath2]
      });
  
    } catch (error) {
      console.log(error);
    }

  },

  reporteAutomaticoViaEmail: async (req, res) => {
    try {
      const id = req.params.id;
      
      // Obtener los datos de parte
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
  
      // Obtener los datos de parteInsumos
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
  
      // Generar el primer archivo Excel para parte
      const fecha = new Date(Date.now());
      const fileName1 = `${fecha.toISOString().substring(0, 10)}-parteSemanal${parte[0].nombre}.xlsx`;
      const filePath1 = path.join(__dirname, '../../temp/', fileName1);
  
      const workbook1 = new ExcelJS.Workbook();
      const worksheet1 = workbook1.addWorksheet('Sheet 1');
      agregarTitulos(worksheet1, ["Nombre", "Taller", "Expediente", "Procedencia", "Detalle", "Duración", "Productos", "Cantidad a producir", "Cantidad Producida", "Stock en Taller", "egresos", "Remanentes", "Última Actualización"]);
      agregarFilasDatos(worksheet1, parte, 'parte');
      await workbook1.xlsx.writeFile(filePath1);
  
      // Generar el segundo archivo Excel para parteInsumos
      const fileName2 = `${fecha.toISOString().substring(0, 10)}-parteInsumos${parteInsumos.nombre}.xlsx`;
      const filePath2 = path.join(__dirname, '../../temp/', fileName2);
  
      const workbook2 = new ExcelJS.Workbook();
      const worksheet2 = workbook2.addWorksheet('Sheet 1');
      agregarTitulos(worksheet2, ["Nombre del Proyecto", "Procedencia", "Taller", "Producto/s", "Cantidad de Insumos Adquiridos", "Cantidad de Insumos Actual", "Última actualización"]);
      agregarFilasDatos(worksheet2, [parteInsumos], 'insumos');
      await workbook2.xlsx.writeFile(filePath2);
  
      // Aquí deberías enviar los archivos por email
      // Por simplicidad, solo se envían los archivos como respuesta
      res.status(200).send({
        message: 'Archivos generados exitosamente.',
        files: [filePath1, filePath2]
      });
  
    } catch (error) {
      console.log(error);
    }

  }
}