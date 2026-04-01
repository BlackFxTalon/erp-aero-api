const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/uploads/');
    },

    // Use uuid to avoid name collisions —
    // two files with the same name won't overwrite each other.
    filename: function (req, file, cb) {
        const uniqueName = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({storage});

module.exports = upload;