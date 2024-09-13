const { validationResult } = require('express-validator');
const createResponseError = require('../../../helpers/createResponseError');
const { checkExpediente } = require('../../../services/stockServices/fichasTecnicasService');


module.exports = {

    expedienteFichaTecnicaExistente: async (req,res) => {
        try {
            const existExpedienteFicha = await checkExpediente(req.body.expedienteFicha)
            return res.status(200).json({
                ok:true,
                data:{
                    existExpedienteFicha
                }
            })
            
        } catch (error) {
            console.log(error);
            return createResponseError(res,error)
        }
    },

}