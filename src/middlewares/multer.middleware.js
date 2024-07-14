import multer from 'multer';

// Create a disk storage configuration for multer
const storage = multer.diskStorage({
    // Specify the destination folder for uploaded files
    destination: function(req, file, cb){
        cb(null, './public/temp');
    },
    // Set the filename of the uploaded file to its original name
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

// Create a multer instance with the storage configuration
const upload = multer({storage: storage});

// Export the upload middleware for use in other files
export {upload};