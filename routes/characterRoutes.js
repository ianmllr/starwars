const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');

// GET /characters - Hent alle karakterer
router.get('/', characterController.getAllCharacters);

// downloader all karaktere
router.get('/download/all', characterController.downloadAllCharacters);

// GET download en karakter
router.get('/download/:id', characterController.downloadCharacter);

// POST /characters - Tilføj en karakter
router.post('/', characterController.createCharacter);

// DELETE
router.delete('/delete/:id', characterController.deleteCharacter);

module.exports = router;
