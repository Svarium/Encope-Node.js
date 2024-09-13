const express = require('express');
const {
    editState,
    addRemanentes,
    allProducts,
    allTallers,
    allProyectsDone,
    lastProyects,
    updateCantidadAProducir,
    updateCostoUnitario,
    eliminarProducto,
    agregarProducto,
    cantidadProducida,
    egresos,
    observaciones,
    estadistica,
    deleteInsumo,
    allProyectsInProgress,
    allProyectsDelayed,
    getAllProducts,
    asignarProyectoProductivo
} = require('../../controllers/apis/apiStockControllers/apiStockControllers');
const { expedienteFichaTecnicaExistente } = require('../../controllers/apis/apiStockControllers/apiFichaTecnicaControllers');

const router = express.Router();

// Rutas relacionadas con el estado y remanentes de proyectos
router.put('/editState/:id', editState);                 // Edita el estado del proyecto
router.put('/remanentes/:id', addRemanentes);            // Edita el remanente de un parte semanal

// Rutas para obtener datos sobre productos, talleres y proyectos
router.get('/getProducts', allProducts);                 // Trae la cantidad de productos en la base de datos
router.get('/getAllProducts', getAllProducts);           // Trae todos los productos
router.get('/getTalleres', allTallers);                  // Trae la cantidad de talleres en la base de datos
router.get('/getProyectsDone', allProyectsDone);         // Trae la cantidad de proyectos terminados
router.get('/getProyectsInProgress', allProyectsInProgress);  // Trae la cantidad de proyectos pendientes
router.get('/getProyectsDelayed', allProyectsDelayed);   // Trae la cantidad de proyectos retrasados
router.get('/getLastProyects', lastProyects);            // Trae los últimos 9 proyectos agregados

// Rutas relacionadas con la gestión de productos
router.put('/editCantidad/:id', updateCantidadAProducir);   // Edita la cantidad a producir y sus tablas relacionadas
router.put('/editCosto/:id', updateCostoUnitario);          // Edita el costo unitario y sus tablas relacionadas
router.delete('/deleteProduct/:id', eliminarProducto);      // Elimina un producto y actualiza tablas relacionadas
router.post('/newProduct', agregarProducto);                // Agrega un nuevo producto a un proyecto

// Rutas relacionadas con producción, egresos y observaciones
router.put('/cantidadProducida/:id', cantidadProducida);    // Edita la cantidad producida
router.put('/egresos/:id', egresos);                        // Actualiza los egresos
router.put('/observaciones/:id', observaciones);            // Actualiza las observaciones

// Rutas relacionadas con insumos
router.delete('/deleteInsumo/:id', deleteInsumo);           // Elimina un insumo de un producto

// Rutas para asignar proyectos y fichas técnicas
router.post('/expedienteFicha/', expedienteFichaTecnicaExistente); // Verifica si el expediente de una ficha ya existe
router.post('/asignarProyecto', asignarProyectoProductivo);        // Asigna un proyecto productivo a una unidad o complejo

module.exports = router;
