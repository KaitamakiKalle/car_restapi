const User = require('../models/User');
const Auto = require('../models/Car');
const bcrypt = require('bcrypt');
const Token = require('../Token');
const CustomError = require('../CustomError');

// Auton lisääminen käyttäjän suosikit taulukkoon
exports.addToFavorites = (req, res) => {
  User.updateOne(
    { username: req.decoded.username },
    { favorites: { $push: req.body } }
  )
    .then((response) => {
      console.log('Update succesfull');
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send({
        message: error.message,
        error: error,
      });
    });
};

// Kaikkien käyttäjien haku
// Vaatii admin oikeudet
exports.findAll = (req, res) => {
  User.find({}, { password: 0 })
    .then((response) => {
      console.log('Find succesfull');
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send({
        message: error.message,
        error: error,
      });
    });
};

// käyttäjän haku id:n perusteella
exports.findByID = (req, res) => {
  User.findOne(
    { _id: req.params.id },
    // Tavalliselle käyttäjälle ei saa näyttää muita tietoja kuin käyttäjänimen ja suosikit
    { _id: 0, __v: 0, password: 0 }
  )
    .then((response) => {
      console.log('Find successfull');
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send({
        message: error.message,
        error: error,
      });
    });
};

// käyttäjän haku nimen perusteella
exports.find = (req, res) => {
  User.findOne(
    { username: req.params.username },
    // Tavalliselle käyttäjälle ei saa näyttää muita tietoja kuin käyttäjänimen ja suosikit
    { _id: 0, __v: 0, password: 0 }
  )
    .then((response) => {
      console.log('Find successfull');
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send({
        message: error.message,
        error: error,
      });
    });
};

//Käyttäjän rekisteröinti
exports.registerUser = (req, res, next) => {
  // Salasana pitää kryptata ennen kantaan laitamista
  /* hashSync metodi kryptaa salasanan ja lisää siihen "saltin" joka mahdollistaa
     sen ettei samanlaisia kryptattyja salasanoja synny vaikka kahdella käyttäjällä
    olisi sama salasana */
  const hashedPass = bcrypt.hashSync(req.body.password, 10);

  User.create({
    username: req.body.username,
    password: hashedPass,
    numOfCars: 0,
    favorites: req.body.favorites || [],
    isadmin: false,
  })
    .then((response) => {
      console.log('User added succesfully');

      res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send(error.message);
    });
};

// Käyttäjän autentikaatio
exports.authenticateUser = (req, res, next) => {
  // Etsitään käyttäjä kannasta
  User.findOne({ username: req.body.username })
    .then((response) => {
      console.log(response);
      // Jos käyttäjää ei löydy heitetään virhe clientille
      if (!response) {
        throw new CustomError('Käytäjää ei ole', 404);
      } else {
        // Jos käyttäjä löytyy Verrataan annettua salasanaa kannassa olevaan salasanaan
        // Koska kannassa oleva salasana on kryptatu vertailu hoidetaan bcryppt kirjaston comareSync() metodilla
        // Metodi vertaa annettua salasana kannassa olevaan
        if (!bcrypt.compareSync(req.body.password, response.password)) {
          res.json({
            success: false,
            message: 'Wrong password',
          });
        } else {
          // Jos kirjautuminen onnistuu luodaan käyttäjälle tokeni
          const token = Token.createToken(response);

          // Kun tokeni on luotu tallennetaan se selaimen cookieihin ja lähetetään käyttäjälle
          res.cookie('access_token', token).status(200).json({
            success: true,
            token: token,
          });
        }
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(error.status || 400).send(error.message);
    });
};

// Käyttäjän uloskirjaus
exports.logout = (req, res) => {
  // Käyttäjän uloskirjauksessa tokeni poistetaan cookieista ja käyttäjä ohjataan takaisin etusivulle
  try {
    res.clearCookie('access_token').status(200).send({
      user: req.decoded.username,
      message: 'User logged out succesfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: error.message,
      error: error,
    });
  }
};
// Käyttäjän poistamiseen olisi luultavasti järkevintä käyttää transaktiota
/* 
Koska mongodb transaktiot ovat vielä hiukan hankalasti toteutettavissa ja kyseessä
on harjoitustyö ei tässä ole transaktiota käytetty.

transaktio toteutettaisiin koodirungolla:
async function (req, res) => {
  const session = await Model.startSession();
  try {
    session.startTransaction();
    // koodi joka transaktiossa halutaan suorittaa

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
  }
  session.endSession();
}

*/
exports.delById = async (req, res) => {
  try {
    // Haetaan käyttäjän nimi id:n perusteella jotta käyttäjän autot saadaan poistettua
    const user = await User.findOne({ _id: req.params.id }).then((response) => {
      return response;
    });
    const autos = await Auto.find({ user: user.username }).then((response) => {
      return response;
    });
    // Poistetaan käyttäjä users kokoelmasta
    await User.deleteOne({ _id: req.params.id });
    // Poistetaan käyttäjän autot autos kokoelmasta
    await Auto.deleteMany({ user: user.username });

    console.log('Success');
    await res.status(200).json({
      success: true,
      message: 'User deleted succesfully',
      user: user,
      autos: autos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: error,
    });
  }
};
// Käyttäjän poistaminen käyttäjänimen perusteella
exports.delByName = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.decoded.username }).then(
      (response) => {
        return response;
      }
    );
    const autos = await Auto.find({ user: req.decoded.username }).then(
      (response) => {
        return response;
      }
    );
    // Poistetaan ensin käyttäjä users kokoelmasta
    await User.deleteOne({ username: req.decoded.username });
    // Poistetaan käyttäjän autot autos kokoelmasta
    await Auto.deleteMany({ user: req.decoded.username });

    console.log('User deleted succesfully');
    await res.clearCookie('access_token').status(200).json({
      success: true,
      message: 'User deleted succesfully',
      user: user,
      autos: autos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: error,
    });
  }
};
