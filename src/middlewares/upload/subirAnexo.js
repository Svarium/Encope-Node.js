const multer = require('multer');
const path = require('path');

const storageAnexosFiles = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/images/anexos')
    },
    filename: function (req, file, callback) {
        callback(null, `${Date.now()}_anexos_${path.extname(file.originalname)}`)
    }
})

const uploadAnexosFiles = multer({
    storage: storageAnexosFiles,

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
    uploadAnexosFiles
};
