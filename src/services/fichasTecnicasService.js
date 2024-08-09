const db = require('../database/models');


module.exports = {

    checkExpediente: async (expedienteFicha) => {

        try {

            let productosConFichaTecnica = await db.Producto.findOne({
                where:{expedienteFicha:expedienteFicha}
            })
    
        return  productosConFichaTecnica ? true : false
            
        } catch (error) {
            console.log(error);
            throw{
                status:500,
                message:error.message
            } 
        }      

    }

}