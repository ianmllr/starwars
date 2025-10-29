const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');

// GET /characters - Hent alle karakterer
router.get('/', characterController.getAllCharacters);

// POST /characters - Tilføj en karakter
router.post('/', characterController.createCharacter);

// DELETE
router.delete('/delete/:id', characterController.deleteCharacter);

module.exports = router;
