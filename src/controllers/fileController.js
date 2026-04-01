const path = require('path');
const fs = require('fs');
const fileModel = require('../models/fileModel');

// POST /file/upload
async function uploadFile(req, res) {
  try {
    // req.file fills multer after processing the uploaded file
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }

    const { originalname, mimetype, size, filename } = req.file;
    const extension = path.extname(originalname).slice(1); // remove the dot: '.pdf' -> 'pdf'
    const filePath = req.file.path;

    const fileId = await fileModel.saveFile({
      originalName: originalname,
      extension,
      mimeType: mimetype,
      size,
      filePath
    });

    return res.status(201).json({ id: fileId, message: 'The file has been uploaded.' });
  } catch (error) {
    console.error('upload error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /file/list?page=1&list_size=10
async function listFiles(req, res) {
  try {
    // We take parameters from the query string and set default values
    const page = parseInt(req.query.page) || 1;
    const listSize = parseInt(req.query.list_size) || 10;

    if (page < 1 || listSize < 1) {
      return res.status(400).json({ error: 'page and list_size must be >= 1' });
    }

    const files = await fileModel.getFiles({ page, listSize });
    return res.json({ page, listSize, files });
  } catch (error) {
    console.error('listFiles error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /file/:id
async function getFile(req, res) {
  try {
    const file = await fileModel.getFileById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    return res.json(file);
  } catch (error) {
    console.error('Ошибка getFile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /file/download/:id
async function downloadFile(req, res) {
  try {
    const file = await fileModel.getFileById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check that the file exists on the disk
    if (!fs.existsSync(file.path)) {
      return res.status(404).json({ error: 'File not found on disc' });
    }

    // res.download sends the file to the client with the Content-Disposition: attachment header
    // This forces the browser to download the file instead of opening it
    return res.download(file.path, file.original_name);
  } catch (error) {
    console.error('downloadFile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// DELETE /file/delete/:id
async function deleteFile(req, res) {
  try {
    const file = await fileModel.getFileById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // First, delete from disk, then from the database.
    // If you delete from the database first and an error occurs while deleting the file,
    // the file will remain on the disk as garbage forever.
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    await fileModel.deleteFile(req.params.id);
    return res.json({ message: 'The file has been deleted.' });
  } catch (error) {
    console.error('deleteFile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// PUT /file/update/:id
async function updateFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'New file not uploaded' });
    }

    const existingFile = await fileModel.getFileById(req.params.id);
    if (!existingFile) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete the old file from disk before replacing it
    if (fs.existsSync(existingFile.path)) {
      fs.unlinkSync(existingFile.path);
    }

    const { originalname, mimetype, size } = req.file;
    const extension = path.extname(originalname).slice(1);

    await fileModel.updateFile(req.params.id, {
      originalName: originalname,
      extension,
      mimeType: mimetype,
      size,
      filePath: req.file.path
    });

    return res.json({ message: 'The file has been updated.' });
  } catch (error) {
    console.error('updateFile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { uploadFile, listFiles, getFile, downloadFile, deleteFile, updateFile };