const createResponseError = require('../../helpers/createResponseError');
const { editProyectState, editParteSemanal, getAllProducts, getAllTallers, getProyectsDone } = require('../../services/stockServices');


module.exports = {

    editState : async (req,res) => {
            try {
                const id = req.params.id;
                const state = await editProyectState(id)
                return res.status(200).json({
                    ok:true,
                    data:{
                        message:"Estado actualizado"
                    }
                })
            } catch (error) {
                console.log(error);
                return createResponseError(res, error)
            }
    },

    addRemanentes : async (req,res) => {
        try {

            const id = req.params.id;
            const data = req.body.remanentes
            const parte = await editParteSemanal(id, data)

            return res.status(200).json({
                ok:true,
                data:{
                    message:"Campo remanentes actualizado"
                }
            })
            
        } catch (error) {
            console.log(error);
                return createResponseError(res, error)
        }
    },

    allProducts : async (req,res) => {
        try {

            const productsInDB = await getAllProducts()

            return res.status(200).json({
                ok:true,
                data:{
                    message:"Productos en base de datos",
                    productsInDB,

                }
            })
            
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    },

    allTallers : async (req,res) => {
        try {

            const tallersInDB = await getAllTallers()

            return res.status(200).json({
                ok:true,
                data:{
                    message:"Talleres en base de datos",
                    tallersInDB
                }
            })
            
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    },

    allProyectsDone : async (req,res) => {
        try { 

            const proyectsDone = await getProyectsDone()

            return res.status(200).json({
                ok:true,
                data:{
                    message:"Proyectos Finalizados",
                    proyectsDone
                }
            })
            
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    }

    
}