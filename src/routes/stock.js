var express = require('express');
var router = express.Router();

/** Controllers */
const {
  list, newProduct, storageProduct, listProducts, editProduct, updateProduct,
  deleteProduct, searchProduct, productsTableExcel, addFicha
} = require('../controllers/proyectosProductivos/productsController');
const {
  newTaller, storageTaller, listTaller, editTaller, updateTaller, deleteTaller,
  ExcelTalleres, searchTaller, listApproved, listClosed
} = require('../controllers/proyectosProductivos/talleresController');
const {
  addNewProyect, storeProyect, listProyects, editProyect, updateProyect, 
  deleteProyect, downloadExcelHistorial, downloadExcelProyects, 
  searchProyect, editProducts, listDelayedProjects
} = require('../controllers/proyectosProductivos/proyectosController');
const {
  listPartes, editParte, printParte, reporteViaEmail, printParteInsumos
} = require('../controllers/proyectosProductivos/partesController');
const { addInsumo, storeInsumo, reportInsumos } = require('../controllers/proyectosProductivos/insumosController');
const { estadisticas } = require('../controllers/mainController');

/** Middlewares */
const { uploadProductosFiles } = require('../middlewares/upload/subirProductos');
const { uploadFichasFiles } = require('../middlewares/upload/subirFicha');
const { uploadAnexosFiles } = require('../middlewares/upload/subirAnexo');
const checkUserEditorIntranetCentral = require('../middlewares/checkUsers/checkUserEditorIntranetCentral');
const checkUserEditorIntranetUnidad = require('../middlewares/checkUsers/checkUserEditorIntranetUnidad');
const checkUserAddProyect = require('../middlewares/checkUsers/checkUserAddProyect');

/** Validators */
const addProductValidator = require('../validations/stockValidators/addProductValidator');
const addTallerValidator = require('../validations/stockValidators/addTallerValidator');
const addProyectValidator = require('../validations/stockValidators/addProyectValidator');
const addInsumoValidator = require('../validations/stockValidators/addInsumoValidator');
const editProyectValidator = require('../validations/stockValidators/editProyectValidator');
const addFichaValidator = require('../validations/stockValidators/addFichaValidator');

/** Routes */
// Estadísticas
router.get('/estadistica', checkUserEditorIntranetCentral, estadisticas);

// Productos
router.get('/', checkUserEditorIntranetCentral, list);
router.get('/newProduct', checkUserEditorIntranetCentral, newProduct);
router.post('/newProduct', uploadProductosFiles.single('producto'), addProductValidator, checkUserEditorIntranetCentral, storageProduct);
router.get('/products', checkUserEditorIntranetCentral, listProducts);
router.get('/editProduct/:id', checkUserEditorIntranetCentral, editProduct);
router.put('/editProduct/:id', uploadProductosFiles.single('producto'), addProductValidator, checkUserEditorIntranetCentral, updateProduct);
router.put('/addFicha/:id', uploadFichasFiles.single('ficha'), addFichaValidator, addFicha);
router.delete('/delete/:id', checkUserEditorIntranetCentral, deleteProduct);
router.get('/searchProduct', checkUserEditorIntranetCentral, searchProduct);
router.get('/ProductsTable', checkUserEditorIntranetCentral, productsTableExcel);

// Insumos
router.get('/addInsumo/:id', addInsumo);
router.post('/addInsumo/:id', addInsumoValidator, storeInsumo);

// Talleres
router.get('/newTaller', checkUserEditorIntranetCentral, newTaller);
router.post('/newTaller', addTallerValidator, checkUserEditorIntranetCentral, storageTaller);
router.get('/talleresTable', checkUserEditorIntranetCentral, listTaller);
router.get('/talleresAprobados', checkUserEditorIntranetCentral, listApproved);
router.get('/talleresDeBaja', checkUserEditorIntranetCentral, listClosed);
router.get('/editTaller/:id', checkUserEditorIntranetCentral, editTaller);
router.put('/editTaller/:id', addTallerValidator, checkUserEditorIntranetCentral, updateTaller);
router.delete('/deleteTaller/:id', checkUserEditorIntranetCentral, deleteTaller);
router.get('/excelTalleres', checkUserEditorIntranetCentral, ExcelTalleres);
router.post('/searchTaller', checkUserEditorIntranetCentral, searchTaller);

// Proyectos Productivos
router.get('/newProyect', checkUserAddProyect, addNewProyect);
router.post('/newProyect', uploadAnexosFiles.single('anexo'), addProyectValidator, storeProyect);
router.get('/listProyects', checkUserEditorIntranetCentral, listProyects);
router.get('/listDelayedProyects', checkUserEditorIntranetCentral, listDelayedProjects);
router.get('/editProducts/:id', editProducts);
router.get('/editProyect/:id', checkUserEditorIntranetCentral, editProyect);
router.put('/editProyect/:id', uploadAnexosFiles.single('anexo'), checkUserEditorIntranetCentral, editProyectValidator, updateProyect);
router.delete('/deleteProyect/:id', checkUserEditorIntranetCentral, deleteProyect);
router.get('/reformulaciones/:id', checkUserEditorIntranetCentral, downloadExcelHistorial);
router.get('/proyectsTable', checkUserEditorIntranetCentral, downloadExcelProyects);
router.post('/searchProyect', checkUserEditorIntranetCentral, searchProyect);

// Parte Semanal de Proyectos
router.get('/partes', checkUserEditorIntranetUnidad, listPartes);
router.get('/partes/:id', checkUserEditorIntranetUnidad, editParte);
router.get('/parte/:id', checkUserEditorIntranetUnidad, printParte);
router.get('/parteInsumos/:id', checkUserEditorIntranetUnidad, printParteInsumos);
router.get('/reporte/:id', checkUserEditorIntranetUnidad, reporteViaEmail);
router.get('/informeInsumos/:id', reportInsumos);

module.exports = router;
