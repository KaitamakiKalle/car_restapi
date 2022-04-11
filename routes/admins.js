// admins reitissä sijaitsevat toiminnot joita ainoastaan adminit voivat suorittaa
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const adminCheck = require('../isAdmin');

const Token = require('../Token');

router.get('/', Token.verifyToken, adminCheck, (req, res) => {
  res.render('admin');
});
// kaikkien käyttäjien haku
router.get('/find', Token.verifyToken, adminCheck, userController.findAll);

// käyttäjän haku id:n perusteella
router.get('/find/:id', Token.verifyToken, adminCheck, userController.findByID);

// Käyttäjän poisto kannasta. Poistaa myös kaiken käyttäjän datan
router.delete(
  '/delete/:id',
  Token.verifyToken,
  adminCheck,
  userController.delById
);

module.exports = router;
