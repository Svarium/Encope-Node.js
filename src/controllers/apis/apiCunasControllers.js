const createResponseError = require('../../helpers/createResponseError');
const { getAllKits, getAllStocks, getAllProducts, getAllEditors } = require('../../services/cunasServices');


module.exports = {

    allkits : async (req, res) => {
        try {

            const kits = await getAllKits();
            return res.status(200).json({
                ok:true,
                data:{
                    message:"Kits terminados",
                    total:kits[0].cantidad,
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

    allEditors : async(req,res) => {
        try {
            const editors = await getAllEditors()
            return res.status(200).json({
                ok:true,
                message:"Editores en base de datos",
                editors,
                total:editors.length
            })

        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    }



}