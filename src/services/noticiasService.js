const db = require('../database/models')


module.exports = {
    getAllNoticias: async (req, { withPagination = "false", page = 1, limit = 8 } = {}) => {
        try {
          let options = {
            order: [["createdAt", "DESC"]],
            include: [
              {
                association: "images",
                attributes:{exclude:['createdAt','updatedAt']},
              }
            ]
          };
      
          if (withPagination === "true") {
            options = {
              ...options,
              page,
              paginate: limit
            };
      
            const { docs, pages, total } = await db.Noticias.paginate(options);
      
            return {
              noticia: docs,
              pages,
              count: total
            };
          }
      
          const { count, rows: noticia } = await db.Noticias.findAndCountAll(options);
      
          return {
            count,
            noticia
          };
        } catch (error) {
          console.log(error);
          throw {
            status: 500,
            message: error.message
          };
        }
      }
      
}