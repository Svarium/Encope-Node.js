const multer = require('multer');
const path = require('path');

const storageInsumosFiles = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/images/insumos')
    },
    filename: function (req, file, callback) {
        callback(null, `${Date.now()}_fichas_${path.extname(file.originalname)}`)
    }
})

const uploadInsumosFiles = multer({
    storage: storageInsumosFiles,

    limits:{
        fileSize: 5 * 1024 * 1024 // 5mb 
    },

    fileFilter: (req, file, cb) =>  {
        if (!file.originalname.match(/\.(pdf)$/)) {
            req.fileValidationError = "Solo se permiten archivos PDF";
            return cb(null, false, req.fileValidationError);
        }
        cb(null, true);
    }
});

module.exports = {
    uploadInsumosFiles
};
