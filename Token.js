const jwt = require('jsonwebtoken');
require('dotenv').config();

// Funktio tokenin luomiseksi
exports.createToken = (user) => {
  // payloadissa talenttuu tokeniin haluttua tietoa.
  // Tieto voi periaatteessa olla mitä tahansa mutta yleensä siinä viedään
  // esimerkiksi käyttäjän nimi tai id
  const payload = {
    username: user.username,
    isadmin: user.isadmin,
  };
  // Token luodaan sign() metodilla onka argumenteiksi tulee payload sekä secret
  // Näistä encoodataan tokeni joka tallentuu client puolelle
  const token = jwt.sign(payload, process.env.SECRET, {
    expiresIn: '2h', // expiroituu 2 tunnissa
  });

  return token;
};
// Tokenin verifiointi
exports.verifyToken = (req, res, next) => {
  // Token saadaan joko pyynnön bodystä, headereista tai selaimen cookieista
  const token =
    req.body.token || req.headers['x-access-token'] || req.cookies.access_token;
  // Jos tokenia ei löydy heitetään virhe
  if (!token) {
    return res.status(403).send({
      success: false,
      message: 'No token',
    });
  } else {
    // Tokeni verifioidaan jsonwebtoken kirjaston verify() metodilla
    jwt.verify(token, process.env.SECRET, (error, decoded) => {
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Token is not valid or it is expired',
        });
      } else {
        // Tallennetaan purettu token pyynnön decoded muuttujaan myöhempää käyttöä varten
        req.decoded = decoded;
        next();
      }
    });
  }
};
