const pool = require('../config/db');

async function saveFile({ originalName, extension, mimeType, size, filePath }) {
    const [result] = await pool.execute(
        `INSERT INTO files (original_name, extension, mime_type, size, path)
         VALUES (?, ?, ?, ?, ?)`,
         [originalName, extension, mimeType, size, filePath]
    );

    return result.insertId; // return new record id
}

async function getFiles({ page, listSize }) {
  const offset = (page - 1) * listSize;
  // LIMIT ? OFFSET ? — this is pagination.
// listSize = number of entries per page.
// offset = number of entries to skip (for page 2, skip the first listSize entries).
  const [rows] = await pool.execute(
    'SELECT * FROM files LIMIT ? OFFSET ?',
    [listSize, offset]
  );
  return rows;
}

async function getFileById(id) {
  const [rows] = await pool.execute(
    'SELECT * FROM files WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function deleteFile(id) {
  await pool.execute('DELETE FROM files WHERE id = ?', [id]);
}

async function updateFile(id, { originalName, extension, mimeType, size, filePath }) {
  await pool.execute(
    `UPDATE files 
     SET original_name = ?, extension = ?, mime_type = ?, size = ?, path = ?
     WHERE id = ?`,
    [originalName, extension, mimeType, size, filePath, id]
  );
}

module.exports = { saveFile, getFiles, getFileById, deleteFile, updateFile };