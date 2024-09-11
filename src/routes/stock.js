var express = require('express');
const { list, newProduct, storageProduct, listProducts, editProduct, updateProduct, deleteProduct, searchProduct, productsTableExcel, addFicha } = require('../controllers/proyectosProductivos/productsController');
const { uploadProductosFiles } = require('../middlewares/subirProductos');
const addProductValidator = require('../validations/addProductValidator');
const checkUserEditorIntranetCentral = require('../middlewares/checkUserEditorIntranetCentral');
const { newTaller, storageTaller, listTaller, editTaller, updateTaller, deleteTaller, ExcelTalleres, searchTaller, listApproved, listClosed } = require('../controllers/proyectosProductivos/talleresController');
const addTallerValidator = require('../validations/addTallerValidator');
const { addNewProyect, storeProyect, listProyects, editProyect, updateProyect, deleteProyect, downloadExcelHistorial, downloadExcelProyects, searchProyect, editProducts, listDelayedProjects } = require('../controllers/proyectosProductivos/proyectosController');
const addProyectValidator = require('../validations/addProyectValidator');
const { listPartes, editParte, updateParte, avanceDeProyecto, printParte, reporteViaEmail, printParteInsumos } = require('../controllers/proyectosProductivos/partesController');
const editParteValidator = require('../validations/editParteValidator');
const checkUserEditorIntranetUnidad = require('../middlewares/checkUserEditorIntranetUnidad');
const checkUserAddProyect = require('../middlewares/checkUserAddProyect');
const { estadisticas } = require('../controllers/mainController');
const { uploadInsumosFiles } = require('../middlewares/subirInsumos');
const editProyectValidator = require('../validations/editProyectValidator');
const { uploadFichasFiles } = require('../middlewares/subirFicha');
const addFichaValidator = require('../validations/addFichaValidator');
const { addInsumo, storeInsumo, reportInsumos } = require('../controllers/proyectosProductivos/insumosController');
const addInsumoValidator = require('../validations/addInsumoValidator');
const { uploadAnexosFiles } = require('../middlewares/subirAnexo');


var router = express.Router();

// llego con /stock

//accedo a la vista para ver estadisticas de los módulos
router.get('/estadistica', estadisticas)

//accedo a la vista para la carga de productos, talleres y proyectos
router.get('/', checkUserEditorIntranetCentral, list);


/* PRODUCTOS */

//crud productos
router.get('/newProduct', checkUserEditorIntranetCentral, newProduct)
router.post('/newProduct', uploadProductosFiles.single('producto'), addProductValidator, checkUserEditorIntranetCentral, storageProduct)
router.get('/products', checkUserEditorIntranetCentral, listProducts)
router.get('/editProduct/:id', checkUserEditorIntranetCentral, editProduct)
router.put('/editProduct/:id', uploadProductosFiles.single('producto'), addProductValidator, checkUserEditorIntranetCentral, updateProduct)
router.put('/addFicha/:id',  uploadFichasFiles.single('ficha'),addFichaValidator, addFicha)
router.delete('/delete/:id', checkUserEditorIntranetCentral, deleteProduct)
router.get('/searchProduct', checkUserEditorIntranetCentral, searchProduct)
router.get('/ProductsTable', checkUserEditorIntranetCentral, productsTableExcel)

/* INSUMOS */

//crud insumos

router.get('/addInsumo/:id', addInsumo);
router.post('/addInsumo/:id', addInsumoValidator, storeInsumo);


/* TALLERES */

//crud talleres
router.get('/newTaller', checkUserEditorIntranetCentral, newTaller)
router.post('/newTaller', addTallerValidator, checkUserEditorIntranetCentral, storageTaller)
router.get('/talleresTable', checkUserEditorIntranetCentral, listTaller)
router.get('/talleresAprobados',checkUserEditorIntranetCentral, listApproved)
router.get('/talleresDeBaja', checkUserEditorIntranetCentral, listClosed)
router.get('/editTaller/:id', checkUserEditorIntranetCentral, editTaller)
router.put('/editTaller/:id', addTallerValidator, checkUserEditorIntranetCentral, updateTaller)
router.delete('/deleteTaller/:id', checkUserEditorIntranetCentral, deleteTaller)
router.get('/excelTalleres', checkUserEditorIntranetCentral, ExcelTalleres)
router.post('/searchTaller', checkUserEditorIntranetCentral, searchTaller)


/* PROYECTOS PRODUCTIVOS */

//crud proyectos
router.get('/newProyect', checkUserAddProyect, addNewProyect) //ruta accedida por ambos roles: editores intranet central y de unidades
router.post('/newProyect', uploadAnexosFiles.single('anexo'), addProyectValidator, storeProyect) //ruta accedida por ambos roles: editores intranet central y de unidades
router.get('/listProyects', checkUserEditorIntranetCentral, listProyects)
router.get('/listDelayedProyects',checkUserEditorIntranetCentral ,listDelayedProjects)
router.get('/editProducts/:id', editProducts)
router.get('/editProyect/:id', checkUserEditorIntranetCentral, editProyect)
router.put('/editProyect/:id', uploadAnexosFiles.single('anexo'), checkUserEditorIntranetCentral, editProyectValidator, updateProyect)
router.delete('/deleteProyect/:id', checkUserEditorIntranetCentral, deleteProyect)
router.get('/reformulaciones/:id', checkUserEditorIntranetCentral, downloadExcelHistorial)
router.get('/proyectsTable', checkUserEditorIntranetCentral, downloadExcelProyects)
router.post('/searchProyect', checkUserEditorIntranetCentral, searchProyect)





/* PARTE SEMANAL DE PROYECTOS */

router.get('/partes', checkUserEditorIntranetUnidad, listPartes) // lista los proyectos para poder acceder a editar los partes semanales de los mismos
router.get('/partes/:id', checkUserEditorIntranetUnidad, editParte) // edita el parte seleccionado
router.get('/parte/:id', checkUserEditorIntranetUnidad, printParte) // reporte en excel del parte de stock
router.get('/parteInsumos/:id',checkUserEditorIntranetUnidad ,printParteInsumos) // reporte en excel del parte de insumos
router.get('/reporte/:id', checkUserEditorIntranetUnidad, reporteViaEmail)
router.get('/informeInsumos/:id', reportInsumos)




module.exports = router;