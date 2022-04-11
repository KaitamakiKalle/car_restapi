const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.DB_URL;
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    console.log('Connection to db succesfull');
    return response;
  })
  .catch((error) => {
    console.log('Error when connecting to db');
    console.error(error);
  });
