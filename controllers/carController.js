const Car = require('../models/Car');
const User = require('../models/User');

// Kaikkien autojen haku
exports.findAll = (req, res) => {
  Car.find()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send({
        message: 'Error occured',
        error: error,
      });
    });
};

// Auton haku id:n perusteella
exports.findByID = (req, res) => {
  Car.find({ _id: req.params.id })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send({
        message: 'Error occured',
        error: error,
      });
    });
};

// Auton haku rekisterinumeron perusteella
exports.findByLicense = (req, res) => {
  Car.find({ license: req.params.license })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send({
        message: 'Error occured',
        error: error,
      });
    });
};

// Auton lisäys kantaan
exports.add = (req, res) => {
  // Sijoitetaan käyttäjänimi pyynnön bodyyn
  req.body.user = req.decoded.username;
  // lisättävän auton tiedot tulevat pyynnön bodyssä
  Car.create(req.body)
    .then((response) => {
      // kun käyttäjälle lisätään auto myös hänen autojen määrää on lisättävä yhdellä
      User.updateOne(
        { username: req.decoded.username },
        { $inc: { numOfCars: 1 } }
      ).then((response) => {
        console.log(response);
      });
      console.log('Document added succesfully');
      res.status(201).json(response);
    })
    .catch((error) => {
      res.status(error.status || 400).send({
        message: 'Error when posting data',
        error: error,
      });
    });
};

// Auton poisto kannasta id:n perusteella
exports.delByID = (req, res) => {
  Car.findOneAndDelete({ _id: req.params.id })
    .then((response) => {
      User.updateOne(
        { username: response.user },
        { $inc: { numOfCars: -1 } }
      ).then((response) => {
        console.log(response);
      });
      console.log(`Deleted car with license:${response.license} succesfully`);
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(error.status || 400).send({
        message: 'Error when deleting data',
        error: error,
      });
    });
};

// Auton poisto rekisterinumeron perusteella
exports.del = (req, res) => {
  Car.findOneAndDelete({ license: req.params.license })
    .then((response) => {
      User.updateOne(
        { username: response.user },
        { $inc: { numOfCars: -1 } }
      ).then((response) => {
        console.log(response);
      });
      console.log(`Deleted car with license:${response.license} succesfully`);
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(error.status || 400).send({
        message: 'Error when deleting data',
        error: error,
      });
    });
};

// Pyynnön ensimmäinen parametri kertoo päivitettävän auton rekisterinumeron
// Toinen parametri kertoo tiedon joka halutaan päivittää
// Kolmas parametri kertoo päivitetyn arvon valitulle tiedolle
exports.updateByIDParams = (req, res) => {
  Car.updateOne(
    { _id: req.params.id },
    { 'req.params.field': req.params.value }
  )
    .then((response) => {
      console.log('Update succesfull');
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send({
        message: 'Update failed',
        error: error,
      });
    });
};

// Autojen tietojen päivitys id:n perusteella
exports.updateByID = (req, res) => {
  Car.updateOne({ _id: req.params.id }, req.body)
    .then((response) => {
      // Tarkistetaan että käyttäjä joka yrittää muokata auton tietoja on auton omistaja tai admin

      console.log('Update succesfull');
      res.status(201).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(error.status || 400).send({
        message: 'Error when updating data',
        error: error,
      });
    });
};

// Autojen tietojen päivitys rekisterinumeron perusteella
exports.updateByLicense = (req, res) => {
  Car.updateOne({ license: req.params.license }, req.body)
    .then((response) => {
      // Tarkistetaan että käyttäjä joka yrittää muokata auton tietoja on auton omistaja tai admin

      console.log('Update succesfull');
      res.status(201).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(error.status || 400).send({
        message: 'Error when updating data',
        error: error,
      });
    });
};

// Auton haku käyttäjänimen perusteella
exports.findByOwner = (req, res) => {
  Car.find({ user: req.params.user })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(error.status || 400).send({
        message: 'Error when finding data',
        error: error,
      });
    });
};

// Autojen haku vuosimallin perusteella
exports.findByYear = (req, res) => {
  Car.find({ year: req.params.year })
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

// Autojen haku vuosimallin perusteella tietyltä vuosi väliltä
exports.findBetweenYear = (req, res) => {
  Car.find({ year: { $gte: req.params.min, $lte: req.params.max } })
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

// Haku moottorin koon perusteella
exports.findByDisplacement = (req, res) => {
  Car.find({
    'motor.displacement': req.params.displacement,
  })

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
