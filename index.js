const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');
const cors = require('cors')
require('dotenv').config();
const bodyParser = require('body-parser');

// TODO this file when we are ready to ship db to heroku
const PORT = process.env.PORT || 8080;
const app = express();

// const corsOptions = {
//   origin: ['https://boardgamebutler.netlify.app','https://main--boardgamebutler.netlify.app'],// Replace with your frontend's URL
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true, // Allow cookies and credentials to be sent
// };
const allowedOrigins = [
  'https://boardgamebutler.netlify.app',
  'http://localhost:3000/',
]

app.use(cors({
  // origin: allowedOrigins,
  // origin: 'http://localhost:3000',
  origin: 'https://boardgamebutler.netlify.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, 
}));

// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(cors(corsOptions));
app.use(routes);




db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});