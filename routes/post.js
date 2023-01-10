const express = require('express')
const api = require('../controllers/librarycontroller.js')

const router = express.Router();

router.post('/', api.getFile);
router.post('/download', api.downloadCSV)

module.exports = router