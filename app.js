const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');

const {
  createUser,
  login,
  logout,
} = require('./controllers/users');

const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');
const { validateEmailAndPassword } = require('./middlewares/validators');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-err');

const corsOptions = {
  origin: ['https://even-star.students.nomoredomains.monster'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Methods', 'Access-Control-Request-Headers'],
  credentials: true,
  enablePreflight: true,
};

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.post('/sign-in', validateEmailAndPassword, login);
app.post('/sign-up', validateEmailAndPassword, createUser);
app.get('/sign-out', logout);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});

app.use(errorLogger);

// Обработчик ошибок при валидации
app.use(errors());

// Централизованный обработчик ошибок
app.use(errorHandler);

const { PORT = 3000 } = process.env;

app.listen(PORT);
