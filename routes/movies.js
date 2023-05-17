const movieRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { urlValidator } = require('../errors/url-validator');

const {
  getMovies, createMovie, deleteMovie } = require('../controllers/movies');

// возвращает все сохранённые текущим  пользователем фильмы
movieRouter.get('/', getMovies);

// создаёт фильм
movieRouter.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(2).max(30).required(),
    director: Joi.string().min(2).max(30).required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().custom(urlValidator).required(),
    trailerLink: Joi.string().custom(urlValidator).required(),
    thumbnail: Joi.string().custom(urlValidator).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

// удаляет сохранённый фильм по id
movieRouter.delete('/:_id', deleteMovie);

// movieRouter.delete('/:_id', celebrate({
//   params: Joi.object().keys({
//     movieId: Joi.string().hex().length(24),
//   }),
// }), deleteMovie);

module.exports = movieRouter;