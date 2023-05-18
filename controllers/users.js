const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorCode = require('../errors/error-code');
const ConflictCode = require('../errors/conflict-code');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports.getUserInfo = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ErrorCode('Переданы некорректные данные в методы создания пользователя');
        next(error);
      } else { next(err); }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (user) {
        const token = jwt.sign({ _id: user._id }, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
        res.send({ token });
      } else { throw new UnauthorizedError('Неверный логин или пароль'); }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name }))
    .then(() => res.send({ email, name }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ErrorCode('Переданы некорректные данные в методы создания пользователя');
        next(error);
      } else if (err.code === 11000) {
        const error = new ConflictCode('Пользователь с таким email уже существует');
        next(error);
      } else {
        next(err);
      }
    });
};
