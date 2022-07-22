const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3000
require('dotenv').config();

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {useNewUrlParser: true,
    useUnifiedTopology: true});

  } catch (err) {
    console.log(err);
  }

}

dbConnect()

app.use(express.json());
app.use('/signup', require('./routes/signup'));

mongoose.connection.once('open', app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
}) )


