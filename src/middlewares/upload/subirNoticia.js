const multer = require("multer");
const path = require("path");

const storageNoticiaImages = multer.diskStorage({
    destination: function(req,file,callback) {
        callback(null, "public/images/imagesNoticias");
    },
    filename: function (req,file,callback){
        callback(null, `${Date.now()}_noticias_${path.extname(file.originalname)}`);
    },
});

const configUploadNoticiasImages = multer({
    storage: storageNoticiaImages,
    limits:{
        files:4,
    },
    fileFilter:(req, file, cb) => {
        if(!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)){
            req.fileValidationError = "Solo se permite imagenes";
            return cb(null, false, req.fileValidationError)
        }

        cb(null, true)
    },
});

const uploadNoticiasImages = (req,res,next) => {
    const upload = configUploadNoticiasImages.array("images");

    upload(req,res,function(error){
        if(error){
            req.fileValidationError = "No más de 4 imágenes - 2mb máximo c/u";
        }
        next()
    });
};

module.exports = {
    uploadNoticiasImages
}