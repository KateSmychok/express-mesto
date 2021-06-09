const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const {
  createUser,
  login,
} = require('./controllers/users');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '609e83f92751cf43f01588b2',
  };
  next();
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

const { PORT = 3000 } = process.env;

app.listen(PORT);
