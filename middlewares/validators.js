const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;
const validator = require('validator');

const validateEmailAndPassword = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .custom((value, helpers) => {
        if (validator.isEmail(value)) {
          return value;
        }
        return helpers.message('Невалидный email');
      })
      .messages({
        'any.required': 'Поле "email" обязательно должно быть заполнено',
      }),

    password: Joi.string().required()
      .messages({
        'any.required': 'Поле "password" обязательно должно быть заполнено',
      }),
  }).unknown(true),
});

const validateNameAndAbout = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2',
        'string.max': 'Максимальная длина поля "name" - 30',
        'any.required': 'Поле "name" обязательно должно быть заполнено',
      }),

    about: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимальная длина поля "about" - 2',
        'string.max': 'Максимальная длина поля "about" - 30',
        'any.required': 'Поле "about" обязательно должно быть заполнено',
      }),
  }).unknown(true),
});

const validateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Невалидный URL');
      }),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required()
      .custom((value, helpers) => {
        if (ObjectId.isValid(value)) {
          return value;
        }
        return helpers.message('Невалидный id');
      }),
  }).unknown(true),
});

const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2',
        'string.max': 'Максимальная длина поля "name" - 30',
        'any.required': 'Поле "name" обязательно должно быть заполнено',
      }),

    link: Joi.string().required()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Невалидный URL');
      })
      .messages({
        'any.required': 'Поле "link" обязательно должно быть заполнено',
      }),
  }).unknown(true),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required()
      .custom((value, helpers) => {
        if (ObjectId.isValid(value)) {
          return value;
        }
        return helpers.message('Невалидный id');
      }),
  }).unknown(true),
});

const validateToken = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
});

module.exports = {
  validateEmailAndPassword,
  validateNameAndAbout,
  validateAvatar,
  validateUserId,
  validateCardBody,
  validateCardId,
  validateToken,
};
