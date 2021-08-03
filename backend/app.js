require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { celebrate, Joi, errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { createUser } = require('./controllers/createUser');
const { login } = require('./controllers/login');
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { errorHandler } = require('./controllers/errorHandler');
const NotFoundError = require('./errors/not-found-error');

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const limiter = rateLimit({
  windowMs: 60000,
  max: 100,
});

app.use(cors());
app.options('*', cors());

app.use(limiter);

app.use(helmet());

app.use(requestLogger);

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardsRouter);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.get('*', (req, res, next) => next(new NotFoundError('Requested resource not found')));

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
