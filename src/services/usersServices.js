const db = require('../database/models');
const {compareSync} = require('bcryptjs');


module.exports = {

    verifyUserEmail : async (email) => {
        try {

            let user = await db.Usuario.findOne({
                where : {
                    email : email
                }
            })
            return user ? true : false
            
        } catch (error) {
            console.log(error);
            throw{
                status:500,
                message:error.message
            }
        }
    },

    getAllUsers : async(req, {withPagination = "false", page=1, limit=10} = {}) => {
        try {  
            
            let options = {
                order: [["id", "DESC"]],
                include: [
                    {
                        association:"rol",
                        attributes:{exclude:['createdAt','updatedAt']},
                    },
                    {
                        association:"destino",
                        attributes:{exclude:['createdAt','updatedAt']},
                    }
                ],
            }

            if(withPagination === "true"){
                options={
                    ...options,
                    page,
                    paginate:limit
                }
                const {docs, pages, total} = await db.Usuario.paginate(options);
                return {
                    users:docs,
                    pages,
                    count:total, 
                }
            }

            const {count, rows:users} = await db.Usuario.findAndCountAll(options);
            return {
                count,
                users
            }
            
        } catch (error) {
            console.log(error);
            throw{
                status:500,
                message:error.message,
            }
        }
    },

    verifyUserPass: async (data) => {
        try {
            let user = await db.Usuario.findOne({
                where: {
                    email:data.email
                }
            })
            return !user || !compareSync(data.password, user.password) ? false : true
        } catch (error) {
            throw{
                status:500,
                message:error.message,
            }
        }
    }


}