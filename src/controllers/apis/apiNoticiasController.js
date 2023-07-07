const createResponseError = require('../../helpers/createResponseError');
const {op} = require('sequelize');
const { getAllNoticias } = require('../../services/noticiasService');


module.exports = {

    allNoticias: async(req,res) => {
        try {
            const {withPagination = "true", page=1, limit=8} = req.query
            const {noticia, count, pages} = await getAllNoticias(req,{
                withPagination,
                page,
                limit
            });

            let data = {
                count,
                noticia
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
                    total: noticia.count,
                }
            })


        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    }

}