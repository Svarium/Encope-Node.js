const createResponseError = require('../../helpers/createResponseError')
const {op} = require('sequelize');
const { verifyUserEmail, getAllUsers, verifyUserPass } = require('../../services/usersServices');

module.exports = {
    verifyEmail : async (req,res) => {
        try {
            const existUser = await verifyUserEmail(req.body.email)
            return res.status(200).json({
                ok:true,
                data:{
                    existUser
                }
            })
        } catch (error) {
            console.log(error);
            return createResponseError(res,error)
        }
    },

    allUsers : async (req,res) => {
        try {
            const {withPagination = "true", page=1, limit = 4} = req.query
            const {users, count, pages} = await getAllUsers(req,{
                withPagination,
                page,
                limit
            }) ;

            let data = {
                count,
                users
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
                    total:users.count,
                    url:"api/allUsers"
                },
            });
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    },

    verifyPass : async (req,res) => {
        try {
            let existPass = await verifyUserPass(req.body)
            return res.status(200).json({
                ok:true,
                data:{
                    existPass
                }
            })
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    }
}