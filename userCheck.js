// CustomError lisää Tavalliseen Error olioon ominaisuuden status johon syötetään haluttu http koodi
const CustomError = require('./CustomError');
const Auto = require('./models/Car');

/* checkUser tarkistaa että käyttäjä joka on kirjautuneena sisään on käyttäjä joka
on luonut kyseisen resurssin jota yritetään muokata. Eli toisen käyttäjän luomien resurssien muokkaaminen ei
ole sallittua.
*/
const checkUser = (req, res, next) => {
  // Etsitään ensin auto kannasta joka halutaan hakea
  Auto.find({ license: req.params.license })
    .then((response) => {
      // Katsotaan onko autoon merkitty käyttäjä sama kuin pyynnön tehnyt käyttäjä
      // Adminit voivat muokata vapaasti kaikkien käyttäjien autoja
      if (response.user != req.decoded.user && !req.decoded.isadmin) {
        throw new CustomError('Cannot modify other users data', 403);
      } else {
        next();
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(error.status || 500).send({
        message: error.message,
        error: error,
      });
    });
};
module.exports = checkUser;
