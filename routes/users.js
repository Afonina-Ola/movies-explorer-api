const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  updateUser, getUserInfo,
} = require('../controllers/users');

// обновляет информацию о пользователе (email и имя)
userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30),
  }),
}), updateUser);

// возвращает информацию о пользователе (email и имя)
userRouter.get('/me', getUserInfo);

module.exports = userRouter;
