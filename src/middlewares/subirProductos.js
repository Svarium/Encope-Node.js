const multer = require('multer');
const path = require('path');

const storageProductosFiles = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/images/productos')
    },
    filename: function (req, file, callback) {
        callback(null, `${Date.now()}_producto_${path.extname(file.originalname)}`)
    }
})

const uploadProductosFiles = multer({
    storage: storageProductosFiles,

    fileFilter: (req, file, cb) =>  {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
            req.fileValidationError = "Solo se permiten imagenes";
            return cb(null, false, req.fileValidationError);
        }
        cb(null, true);
    }
});

module.exports = {
    uploadProductosFiles
};
