const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const port = 3001
const allowList = ['http://localhost:3000'];
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

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if (allowList.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } 
  } else {
    corsOptions = { origin: false } 
  }
  callback(null, corsOptions) 
}

app.use(cors(corsOptionsDelegate));

app.use(express.json());

app.use('/signup', require('./routes/signup'));

app.use('/login', require('./routes/login'));

app.use('/refresh', require('./routes/refresh'));

app.use('/logout', require('./routes/logout'));

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
})

mongoose.connection.once('open', () => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  });

});


