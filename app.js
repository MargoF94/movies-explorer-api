require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const rateLimiter = require('./middlewares/rateLimiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');

const { NODE_ENV, PORT, MONGO_URL } = process.env;

const app = express();

app.use(helmet());
app.use(requestLogger);
app.use(rateLimiter);

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : 'mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

const corsOptions = {
  origin: [
    'https://localhost:3001',
    'http://localhost:3001',
    'http://yourlocalmovieexplorer.nomoredomains.xyz',
    'https://yourlocalmovieexplorer.nomoredomains.xyz',
  ],
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(NODE_ENV === 'production' ? PORT : 3000, () => {
  console.log("I'm working!");
});
