const createResponseError = require('../../helpers/createResponseError')
const {op} = require('sequelize');
const { getAllLicitaciones, destroyLicitacion } = require('../../services/licitacionServices');


module.exports = {

    allLicitacion : async (req,res) => {

        try {
            const {withPagination = "true", page=1, limit = 10} = req.query
            const {licitacion, count, pages} = await getAllLicitaciones(req,{
                withPagination,
                page,
                limit
            }) ;

            let data = {
                count,
                licitacion
            }


            if(withPagination === "true"){
                data = {
                    ...data,
                    pages,
                    currentPage: +page
                }
            }

            return res.status(200).json({
                ok:true,
                data,
                meta:{
                    status:200,
                    total:licitacion.count,
                    
                },
            });


        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }        
    },

    destroy : async(req,res) => {
        try {
            const licitacionDeleted = await destroyLicitacion(req.params.id)
            return res.status(200).json({
                ok:true,
                data:{
                    message:"Licitacion eliminada",
                    total:1,
                }
            })
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    }




}