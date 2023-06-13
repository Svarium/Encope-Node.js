const createResponseError = require('../../helpers/createResponseError')
const {op} = require('sequelize');
const { verifyUserEmail } = require('../../services/usersServices');

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
            return createResponseError
        }
    }
}