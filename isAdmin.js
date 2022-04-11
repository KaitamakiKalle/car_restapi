// CustomError lisää Tavalliseen Error olioon ominaisuuden status johon syötetään haluttu http koodi
const CustomError = require('./CustomError');

// isAdmin tarkistaa onko käyttäjällä admin oikeudet
// Onnistuessa siirrytään seuraavan middlewaren suorittamiseen
// Epäonnistuessa suoritus lopetetaan ja välitetään errori clientille
const isAdmin = (req, res, next) => {
  console.log(req.decoded);
  try {
    // Tieto onko käyttäjällä admin oikeudet löytyy pyynnön decoded muuttujasta
    if (!req.decoded.isadmin) {
      throw new CustomError('Admin priviledges required', 403);
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).send({
      message: 'Current user does not have admin priviledges',
      error: error,
    });
  }
};
module.exports = isAdmin;
