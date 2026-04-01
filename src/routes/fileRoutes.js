const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const upload = require('../config/multer');

// ⚠️ IMPORTANT: Route order matters!
// '/download/:id' and '/delete/:id' must be BEFORE '/:id',
// otherwise Express will treat 'download' as the :id parameter.
router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/list', fileController.listFiles);
router.get('/download/:id', fileController.downloadFile);
router.delete('/delete/:id', fileController.deleteFile);
router.put('/update/:id', upload.single('file'), fileController.updateFile);
router.get('/:id', fileController.getFile);

module.exports = router;