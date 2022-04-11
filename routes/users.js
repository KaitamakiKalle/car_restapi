const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const Token = require('../Token');

// Reitti käyttäjän kirjautumis sivulle
router.get('/login', (req, res) => {
  res.render('login');
});
// Reitti käyttäjän rekisteröinti sivulle
router.get('/register', (req, res) => {
  res.render('register');
});
// Käyttäjän rekisteröinti
router.post('/register', userController.registerUser);
// Käyttäjän sisäänkirjaus
router.post('/login', userController.authenticateUser);
// käyttäjän uloskirjaus
router.get('/logout', Token.verifyToken, userController.logout);

// Käyttäjän poisto käyttäjänimen perusteella
router.delete('/', Token.verifyToken, userController.delByName);

// Auton lisääminen suosikkeihin
router.put('/favorites', Token.verifyToken, userController.addToFavorites);

// Käyttäjän haku
// Tavallisille ei admin käyttäjille palautetaan vain haetun käyttäjän nimi ja suosikit
router.get('/find/:username', userController.find);
module.exports = router;
