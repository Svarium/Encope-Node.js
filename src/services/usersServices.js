const db = require('../database/models');
const {hashSync} = require('bcryptjs');
const bcrypt = require('bcrypt');
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
    }


}