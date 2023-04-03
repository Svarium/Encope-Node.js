const multer = require('multer');
const path = require('path');

const storageIconImage = multer.diskStorage({
    destination : function (req,file,callback){
        callback(null, 'public/images/iconsProfile')
    },
    filename : function (req,file,callback) {
        callback(null, `${Date.now()}_icons_${path.extname(file.originalname)}`)
    }
})

const uploadIconImage = multer({
    storage : storageIconImage,

    fileFilter : (req, file, cb) => {
        if(!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)){
            req.fileValidationError = "Solo se permiten imágenes";
            return cb(null, false, req.fileValidationError)
        }
        cb(null,true)
    }

});
module.exports = {
    uploadIconImage
}