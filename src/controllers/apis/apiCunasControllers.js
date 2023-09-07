const createResponseError = require('../../helpers/createResponseError');
const { getAllKits, getAllStocks, getAllProducts, getAllEditors, getGeneralStock, validarCantidad, chequearCantidadRetirada, getAllKitsOuts } = require('../../services/cunasServices');


module.exports = {

    allkits : async (req, res) => {
        try {

            const kits = await getAllKits();
            return res.status(200).json({
                ok:true,
                data:{
                    message:"Kits terminados",
                    total:kits.cantidad,
                    data:kits
                }
            })
            
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    },

    allStock : async (req,res) => {
        try {
            const stocks = await getAllStocks();

            return res.status(200).json({
                ok:true,
               
                data:{
                    message:"Stocks de productos en CPFII",
                    stocks
                }
            })
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    },

    allProducts : async(req,res) => {
        try {
            const products = await getAllProducts()

            return res.status(200).json({
                ok:true,
                message:"Productos en base de datos",
                products,
                total:products.length
            })

        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    },

    kitsEntregados : async(req,res) => {
        try {
            const kits = await getAllKitsOuts()

            let total = 0;

            for (const kit of kits){
                total += kit.cantidadRetirada;
            }

            return res.status(200).json({
                ok:true,
                message:"Kits entregados",
                kits,
                total,             
            })

        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    },

    generalStock : async(req,res) => {
        try {

            const stock = await getGeneralStock()
            return res.status(200).json({
                ok:true,
                message:"Stock general de productos",
                stock,
                total:stock.length
            })

            
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    },

    cantidadValidaKit : async(req,res) => {
        try {

            const kitCantidad = req.body.cantidad;

            if(req.session.userLogin.destinoId == 31){
                const validateCantidad = await validarCantidad(kitCantidad)
                return res.status(200).json({
                    ok:true,
                    data:{
                        validateCantidad
                    }
                })
            }   
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    },

    validarRetiroDeStock : async (req,res) => {
        try {

            const idDestino = req.body.destino;
            const idProducto = req.body.producto;
            const data = req.body.cantidad;

            const cantidadValida = await chequearCantidadRetirada(data, idProducto, idDestino)


            return res.status(200).json({
                ok:true,
                data:{
                    cantidadValida
                }
            })

            
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    }
}