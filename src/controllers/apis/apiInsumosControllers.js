const createResponseError = require('../../helpers/createResponseError');
const { addProyectoInsumos } = require('../../services/insumosService');


module.exports = {
    createRegister : async (req,res) => {

        try {

            const proyectoId = req.body.proyectoId
            const insumos = await addProyectoInsumos(proyectoId)

            return res.status(200).json({
                ok:true,
                data:{
                    message:'Registros creados correctamente'
                }
            })
            
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }

    }
}