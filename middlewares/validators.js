const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;

const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2',
        'string.max': 'Максимальная длина поля "name" - 30',
      }),

    about: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "about" - 2',
        'string.max': 'Максимальная длина поля "about" - 30',
      }),

    avatar: Joi.string()
      .pattern(/^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\.(jpg|jpeg|png|gif)$/i)
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Невалидный URL');
      })
      .messages({
        'any.required': 'Поле "email" обязательно должно быть заполнено',
      }),

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
  })
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
  })
});

const validateUserHeaders = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  })
})
