const createResponseError = require('../../helpers/createResponseError');
const { editProyectState, editParteSemanal } = require('../../services/stockServices');


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

    
}