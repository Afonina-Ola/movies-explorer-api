const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const ErrorCode = require('../errors/error-code');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      console.log(err, 'err');
      if (err.name === 'ValidationError') {
        const error = new ErrorCode('Переданы некорректные данные в методы создания фильма');
        next(error);
      } else { next(err); }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(() => { })
    .populate('owner')
    .then((film) => {
      if (film.owner && film.owner.id === req.user._id) {
        film.deleteOne()
          .then((data) => {
            res.send(data);
          })
          .catch(next);
      } else {
        throw new ForbiddenError('Недостаточно прав для этого действия');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new ErrorCode('Веденный _id не корректен');
        next(error);
      } else if (err.name === 'DocumentNotFoundError') {
        const error = new NotFoundError('Фильм с введенным _id не найден');
        next(error);
      } else { next(err); }
    });
};
