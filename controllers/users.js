const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictingRequestError = require('../errors/conflicting-request-err');

const getUsers = (req, res, next) => {
  User.find({}, { __v: 0 })
    .then((users) => res.send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId, { __v: 0 })
    .orFail(new NotFoundError('Пользователь с указанным id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
        if (err.message === 'NotValidId' || err.name === 'CastError') {
          next(new NotFoundError('Пользователь с указанным id не найден'));
        } else {
          next(err);
        }
      });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id, { __v: 0 })
    .orFail(new NotFoundError('Пользователь с указанным id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId' || err.name === 'CastError') {
        next(new NotFoundError('Пользователь с указанным id не найден'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Отсутствует электронная почта или пароль');
  }

  bcrypt.hash(password, 10)
    .then(hash => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else if (err.name === "MongoError" && err.code === 11000) {
        next(new ConflictingRequestError('Пользователь с указанной электронной почтой уже существует'));
      } else {
        next(err);
      }
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: true,
    select: { __v: 0 },
  })
    .orFail(new NotFoundError('Пользователь с указанным id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId' || err.name === 'CastError') {
        next(new NotFoundError('Пользователь с указанным id не найден'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: true,
    select: { __v: 0 },
  })
    .orFail(new NotFoundError('Пользователь с указанным id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId' || err.name === 'CastError') {
        next(new NotFoundError('Пользователь с указанным id не найден'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'secret-key',
        { expiresIn: '7d' }
        );
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  getCurrentUser,
  updateUserInfo,
  updateAvatar,
  login,
};
