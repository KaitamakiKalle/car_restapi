const express = require('express');
const router = express.Router();
const autoController = require('../controllers/carController');
const userCheck = require('../userCheck');
const Token = require('../Token');

router.get('/', (req, res) => {
  res.render('cars');
});

// Kaikkien autojen haku
router.get('/all', autoController.findAll);
// Auton haku rekisterinumeron perusteella
router.get('/license/:license', autoController.findByLicense);
// Auton haku id:n perusteella
router.get('/id/:id', autoController.findByID);
// Tietyn käyttäjän autojen haku
router.get('/user/:user', autoController.findByOwner);
// Autojen haku vuosimallin perusteella
router.get('/year/:year', autoController.findByYear);
// Autojen haku tiettyjen vuosimallien väliltä
router.get('/between/:min/:max', autoController.findBetweenYear);
// Autojen haku moottorin koon perusteella
router.get('/displacement/:displacement', autoController.findByDisplacement);

// auton lisäys kantaan
router.post('/', Token.verifyToken, autoController.add);

// Auton poisto kannasta rekisterinumeron perusteella
router.delete(
  '/delete/:license',
  Token.verifyToken,
  /* userCheck tarkistaa että käyttäjä joka yrittää poistaa auton on auton omistaja */
  userCheck,
  autoController.del
);
// auton poisto kannasta id:n perusteella
router.delete(
  'deletebyid/:id',
  Token.verifyToken,
  /* userCheck tarkistaa että käyttäjä joka yrittää poistaa auton on auton omistaja */
  userCheck,
  autoController.delByID
);

// Auton tietojen päivittäminen rekisterinumeron perusteella
router.put(
  '/update/:license',
  Token.verifyToken,
  /* userCheck tarkistaa että käyttäjä joka yrittää poistaa auton on auton omistaja */
  userCheck,
  autoController.updateByLicense
);

// tietojen päivitys id:n perusteella
// tällä reitillä voidaan päivittää yhtä arvoa joka saadaan pyynnön parametreista
router.put(
  '/updatebyid/:id/:field/:value',
  Token.verifyToken,
  /* userCheck tarkistaa että käyttäjä joka yrittää päivittää auton on auton omistaja */
  userCheck,
  autoController.updateByIDParams
);

// tietojen päivitys id:n perusteella
router.put(
  '/updatebyid/:id',
  Token.verifyToken,
  /* userCheck tarkistaa että käyttäjä joka yrittää poistaa auton on auton omistaja */
  userCheck,
  autoController.updateByID
);

module.exports = router;
