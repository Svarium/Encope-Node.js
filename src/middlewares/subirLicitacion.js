const storageLicitacionFiles = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/licitaciones')
    },
    filename: function (req, file, callback) {
        callback(null, `${Date.now()}_archivo_${path.extname(file.originalname)}`)
    }
})

const uploadLicitacionesFiles = multer({
    storage: storageLicitacionFiles,
    fileFilter: (req, file, cb) =>  {
        if (!file.originalname.match(/\.(pdf)$/)) {
            req.fileValidationError = "Solo se permiten archivos PDF";
            return cb(null, false, req.fileValidationError);
        }
        cb(null, true);
    }
});

module.exports = {
    uploadLicitacionesFiles
};
