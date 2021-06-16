const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const {
  createUser,
  login,
} = require('./controllers/users');

const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');
const { validateEmailAndPassword } = require('./middlewares/validators');

const NotFoundError = require('./errors/not-found-err');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', validateEmailAndPassword, login);
app.post('/signup', validateEmailAndPassword, createUser);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});

// Обработчик ошибок при валидации
app.use(errors());

// Централизованный обработчик ошибок
app.use(errorHandler);

const { PORT = 3000 } = process.env;

app.listen(PORT);
