const express = require('express');
const multer = require('multer');
const { generateUI } = require('../src/controllers/generateUIController');

const router = express.Router();
const upload = multer();

router.post('/', upload.single('file'), generateUI);

module.exports = router;