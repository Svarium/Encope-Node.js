const { Association } = require('sequelize');
const db = require('../database/models');


module.exports = {

getAllLicitaciones : async(req, {withPagination = "false", page= 1, limit=10} = {}) => {

    try {  
            
        let options = {
            include: [
                {
                    association:"tipo",
                }
            ],
        }

        if(withPagination === "true"){
                
            options= {
                ...options,
                page,
                paginate: limit
            }


            const {docs, pages, total} = await db.Publicaciones.paginate(options);

             return {
                licitacion:docs,
                pages,
                count:total, 
            }
        }

        const {count, rows:licitacion} = await db.Publicaciones.findAndCountAll(options);

    return {
        count, 
        licitacion
    }
        
    } catch (error) {
        console.log(error);
        throw{
            status:500,
            message:error.message,
        }
    }
},

destroyLicitacion : async (id) => {
    try {
        const licitacionDestroy = await db.Publicaciones.destroy({
            where:{id:id},
            force:true
        })
        return licitacionDestroy
    } catch (error) {
        console.log(error);
        throw{
            status:500,
            message:error.message,
        }        
    }
}






}