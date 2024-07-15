const multer = require("multer");
module.exports.fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        if (
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/png"
        ) {
            cb(null, "./src/static/images");

        } else if ( file.mimetype == "application/pdf" || 
                    file.mimetype == "application/msword" || 
                    file.mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                    file.mimetype == "application/vnd.ms-excel" ||
                    file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                    file.mimetype == "application/vnd.ms-powerpoint" ||
                    file.mimetype == "application/vnd.openxmlformats-officedocument.presentationml.presentation" 

                    ) {
            cb(null, "./src/uploads/projects");
        }
    },
    filename: (req, file, cb) => {
        const date = new Date();
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        cb(null, formattedDate + "--" + file.originalname);
    },

});
module.exports.ImageStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./src/static/images"),
    filename: (req, file, cb) => {
        const date = new Date();
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        cb(null, formattedDate + "--" + file.originalname);
    },

});
module.exports.DocumentStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./src/uploads/projects")
        
    },
    filename: (req, file, cb) => {
        const date = new Date();
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        cb(null, formattedDate + "--" + file.originalname);
    },

});
